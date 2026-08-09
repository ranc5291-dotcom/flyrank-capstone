// e2e/prompt-analyzer.spec.ts
import { test, expect, type Page } from "@playwright/test";

// Mocks the SSE format your dev tools capture confirmed api/tool.ts
// actually streams back (Groq chat-completion chunks), so the real
// client-side parsing code runs against realistic data with zero
// network dependency on Groq in CI.
function toGroqSSE(fullText: string): string {
  const chunkSize = 6;
  const parts: string[] = [];
  for (let i = 0; i < fullText.length; i += chunkSize) {
    const content = fullText.slice(i, i + chunkSize);
    const chunk = {
      id: "chatcmpl-e2e-test",
      object: "chat.completion.chunk",
      created: 0,
      model: "llama-3.3-70b-versatile",
      choices: [{ index: 0, delta: { content }, finish_reason: null }],
    };
    parts.push(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  parts.push("data: [DONE]\n\n");
  return parts.join("");
}

const ANALYSIS_JSON = JSON.stringify({
  qualityScore: 88,
  strengths: ["Clear goal", "Specific audience"],
  weaknesses: ["Missing tone guidance"],
  suggestions: ["Specify desired tone"],
});

const OPTIMIZED_JSON = JSON.stringify({
  optimizedPrompt: "Write a 500-word blog post about productivity for remote workers, in a friendly, conversational tone.",
});

async function mockToolApi(page: Page) {
  await page.route("**/api/tool", async (route) => {
    const body = route.request().postDataJSON() as { toolId?: string };
    const payload = body.toolId === "prompt-optimizer" ? OPTIMIZED_JSON : ANALYSIS_JSON;
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: toGroqSSE(payload),
    });
  });
}

test.describe("Prompt Analyzer", () => {
  test.beforeEach(async ({ page }) => {
    await mockToolApi(page);
  });

  test("analyzes a prompt end to end and saves the optimized version to the library", async ({ page }) => {
    await page.goto("/");

    // On mobile viewports the sidebar starts off-screen (translated out via
    // CSS) and is only revealed by this toggle. On desktop it's hidden via
    // lg:hidden, so isVisible() is false there and this is a no-op.
    const menuToggle = page.getByRole("button", { name: /toggle sidebar/i });
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }

    await page.getByRole("link", { name: /ai workspace/i }).click();
    await page.getByText(/^analyze prompt$/i).first().click();

    const textarea = page.getByPlaceholder(/write a blog post about productivity/i);
    await textarea.fill("Write a blog post about productivity");

    await page.getByRole("button", { name: /^analyze prompt$/i }).last().click();

    // Lifecycle reaches Completed
    await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 10_000 });

    // Score + lists render
    await expect(page.getByText("88")).toBeVisible();
    await expect(page.getByText("Clear goal")).toBeVisible();
    await expect(page.getByText("Missing tone guidance")).toBeVisible();
    await expect(page.getByText("Specify desired tone")).toBeVisible();

    // Optimized prompt section auto-runs and renders
    await expect(
      page.getByText(/write a 500-word blog post about productivity for remote workers/i)
    ).toBeVisible();

    // Save to library — toast confirms
    await page.getByRole("button", { name: /save to prompt library/i }).click();
    await expect(page.getByText(/prompt saved successfully/i)).toBeVisible();

    // On mobile, navigating away closes the sidebar again, so reopen it
    // before clicking "Prompt Library".
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }

    // Confirms it actually persisted, not just a UI toast
    await page.getByRole("link", { name: /prompt library/i }).click();
    await expect(
      page.getByText(/write a blog post about productivity/i).first()
    ).toBeVisible();
  });

  test("shows a friendly error and a working retry button on API failure", async ({ page }) => {
    await page.unroute("**/api/tool");
    await page.route("**/api/tool", (route) => route.fulfill({ status: 500, body: "Internal Server Error" }));

    await page.goto("/");

    const menuToggle = page.getByRole("button", { name: /toggle sidebar/i });
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }

    await page.getByRole("link", { name: /ai workspace/i }).click();
    await page.getByText(/^analyze prompt$/i).first().click();

    await page.getByPlaceholder(/write a blog post about productivity/i).fill("Test prompt");
    await page.getByRole("button", { name: /^analyze prompt$/i }).last().click();

    await expect(page.getByText(/^something went wrong$/i)).toBeVisible({ timeout: 10_000 });

    // Fix the route, then retry should succeed
    await mockToolApi(page);
    await page.getByRole("button", { name: /retry/i }).click();
    await expect(page.getByText("88")).toBeVisible({ timeout: 10_000 });
  });
});