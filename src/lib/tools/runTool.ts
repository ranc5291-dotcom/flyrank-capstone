// src/lib/tools/runTool.ts

interface GroqStreamChunk {
  choices: { delta: { content?: string }; finish_reason: string | null }[];
}

const REQUEST_TIMEOUT_MS = 30000; // tool analysis can run a bit longer than chat

export class ToolRequestError extends Error {
  type: "network" | "timeout" | "api" | "unknown";
  constructor(message: string, type: "network" | "timeout" | "api" | "unknown") {
    super(message);
    this.name = "ToolRequestError";
    this.type = type;
  }
}

export async function runTool(
  toolId: string,
  input: string,
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
      response = await fetch("/api/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, input }),
        signal: timeoutController.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (timedOut) {
          throw new ToolRequestError("The analysis took too long.", "timeout");
        }
        throw err;
      }
      throw new ToolRequestError(
        "Couldn't reach the server. Check your connection.",
        "network"
      );
    }

    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => "");
      throw new ToolRequestError(text || `Request failed (${response.status})`, "api");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        if (timeoutController.signal.aborted) {
          await reader.cancel();
          if (timedOut) {
            throw new ToolRequestError("The analysis took too long.", "timeout");
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
            // incomplete chunk — next read() completes it
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