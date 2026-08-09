// src/lib/ai/promptTools.ts
//
// Swap `callModel` for whatever client you already use for the AI Workspace
// chat (Groq, OpenAI, etc). Keeping it isolated here means every AI tool
// (Analyzer today, Workflow Builder / Model Recommender later) shares one
// place to change providers.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// --- REPLACE THIS with your real API call -----------------------------
async function callModel(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error("The AI service did not respond. Please try again.");
  }

  const data = await res.json();
  return data.content as string;
}
// ------------------------------------------------------------------------

/**
 * Generates an improved version of the user's prompt.
 * Does NOT touch your existing score/strengths/weaknesses logic —
 * this is only used for the new "Optimized Prompt" section.
 */
export async function generateOptimizedPrompt(originalPrompt: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You rewrite AI prompts to be clearer and more effective. " +
        "Preserve the user's original intent exactly. Improve clarity, " +
        "add missing context, and specify the intended audience and " +
        "expected output format where it's appropriate. " +
        "Return ONLY the rewritten prompt text — no preamble, no explanation, no markdown fences.",
    },
    {
      role: "user",
      content: originalPrompt,
    },
  ];

  const result = await callModel(messages);
  return result.trim();
}