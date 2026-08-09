// api/chat.ts
import { z } from "zod";

export const config = {
  runtime: "edge",
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
});

function jsonError(status: number, error: string, details?: unknown) {
  return new Response(JSON.stringify({ error, details }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(500, "server_misconfigured", "Missing GROQ_API_KEY");
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be valid JSON");
  }

  const parsedBody = chatRequestSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return jsonError(400, "invalid_request", parsedBody.error.flatten());
  }

  const groqResponse = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: parsedBody.data.messages,
    }),
  });

  if (!groqResponse.ok || !groqResponse.body) {
    const text = await groqResponse.text().catch(() => "");
    return jsonError(groqResponse.status, "groq_error", text);
  }

  return new Response(groqResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}