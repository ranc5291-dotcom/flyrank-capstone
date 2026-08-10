// api/__tests__/tool.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import handler from "../tool";

function toGroqSSEStream(fullText: string): ReadableStream<Uint8Array> {
  const chunkSize = 30;
  const encoder = new TextEncoder();
  const parts: string[] = [];
  for (let i = 0; i < fullText.length; i += chunkSize) {
    const content = fullText.slice(i, i + chunkSize);
    const chunk = {
      id: "chatcmpl-test",
      object: "chat.completion.chunk",
      created: 0,
      model: "llama-3.3-70b-versatile",
      choices: [{ index: 0, delta: { content }, finish_reason: null }],
    };
    parts.push(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  parts.push("data: [DONE]\n\n");
  const sse = parts.join("");

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(sse));
      controller.close();
    },
  });
}

function mockGroqResponse(fullText: string) {
  return {
    ok: true,
    status: 200,
    body: toGroqSSEStream(fullText),
    text: async () => "",
  } as unknown as Response;
}

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/tool", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("api/tool handler", () => {
  it("returns validated analyzer output for valid analyzer JSON", async () => {
    const validAnalysis = JSON.stringify({
      qualityScore: 80,
      strengths: ["Clear goal"],
      weaknesses: ["Missing audience"],
      suggestions: ["Add audience"],
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockGroqResponse(validAnalysis)));

    const res = await handler(makeRequest({ toolId: "prompt-analyzer", input: "Write a blog post" }));
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("qualityScore");
    expect(text).toContain("80");
  });

  it("returns a structured 502 error for invalid analyzer JSON", async () => {
    const invalidAnalysis = JSON.stringify({ qualityScore: "not-a-number" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockGroqResponse(invalidAnalysis)));

    const res = await handler(makeRequest({ toolId: "prompt-analyzer", input: "Write a blog post" }));
    expect(res.status).toBe(502);

    const json = await res.json();
    expect(json.error).toBe("invalid_ai_output");
  });

  it("returns validated optimizer output for valid optimizer JSON", async () => {
    const validOptimization = JSON.stringify({ optimizedPrompt: "A clearer version of the prompt." });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockGroqResponse(validOptimization)));

    const res = await handler(makeRequest({ toolId: "prompt-optimizer", input: "Write a blog post" }));
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("optimizedPrompt");
  });

  it("returns a structured 502 error for invalid optimizer JSON", async () => {
    const invalidOptimization = JSON.stringify({ optimizedPrompt: 123 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockGroqResponse(invalidOptimization)));

    const res = await handler(makeRequest({ toolId: "prompt-optimizer", input: "Write a blog post" }));
    expect(res.status).toBe(502);

    const json = await res.json();
    expect(json.error).toBe("invalid_ai_output");
  });

  it("returns a structured 400 error for an invalid tool request", async () => {
    const res = await handler(makeRequest({ toolId: "not-a-real-tool", input: "hi" }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("invalid_request");
  });
});