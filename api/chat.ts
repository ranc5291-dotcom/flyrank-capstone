// api/chat.ts
export const config = {
  runtime: "edge",
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("Server misconfigured: missing GROQ_API_KEY", { status: 500 });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response("messages array is required", { status: 400 });
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
      messages: body.messages,
    }),
  });

  if (!groqResponse.ok || !groqResponse.body) {
    const text = await groqResponse.text().catch(() => "");
    return new Response(`Groq error: ${text}`, { status: groqResponse.status });
  }

  // Pipe Groq's SSE stream straight through — no re-buffering needed
  return new Response(groqResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}