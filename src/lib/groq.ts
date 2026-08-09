// src/lib/groq.ts
import type { ChatMessage } from "../types/chat";

interface GroqStreamChunk {
  choices: { delta: { content?: string }; finish_reason: string | null }[];
}

const REQUEST_TIMEOUT_MS = 15000;

export class ChatRequestError extends Error {
  type: "network" | "timeout" | "api" | "rate_limit" | "unknown"; // CHANGED — added rate_limit
  constructor(message: string, type: "network" | "timeout" | "api" | "rate_limit" | "unknown") {
    super(message);
    this.name = "ChatRequestError";
    this.type = type;
  }
}

export async function sendToGroq(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal: AbortSignal
): Promise<void> {
  const timeoutController = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    timeoutController.abort();
  }, REQUEST_TIMEOUT_MS);

  const onCallerAbort = () => timeoutController.abort();
  signal.addEventListener("abort", onCallerAbort);

  try {
    let response: Response;
    try {
      response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: timeoutController.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (timedOut) {
          throw new ChatRequestError(
            "The request took too long to respond.",
            "timeout"
          );
        }
        throw err;
      }
      throw new ChatRequestError(
        "Couldn't reach the server. Check your connection.",
        "network"
      );
    }

    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => "");
      // NEW — distinguish rate limiting from other API errors
      if (response.status === 429) {
        throw new ChatRequestError(
          text || "You're sending messages too quickly.",
          "rate_limit"
        );
      }
      throw new ChatRequestError(
        text || `Request failed (${response.status})`,
        "api"
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        if (timeoutController.signal.aborted) {
          await reader.cancel();
          if (timedOut) {
            throw new ChatRequestError(
              "The response took too long to finish.",
              "timeout"
            );
          }
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") return;

          try {
            const parsed: GroqStreamChunk = JSON.parse(data);
            const token = parsed.choices[0]?.delta?.content;
            if (token) onToken(token);
          } catch {
            // Incomplete chunk — next read() will complete it
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } finally {
    clearTimeout(timeoutId);
    signal.removeEventListener("abort", onCallerAbort);
  }
}