// src/components/tools/__tests__/OptimizedPromptSection.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OptimizedPromptSection } from "../OptimizedPromptSection";

const { runToolMock } = vi.hoisted(() => ({ runToolMock: vi.fn() }));
vi.mock("../../../lib/tools/runTool", () => ({
  runTool: runToolMock,
  ToolRequestError: class ToolRequestError extends Error {},
}));

const OPTIMIZED_PROMPT = "A clearer, more specific version of your prompt.";

function mockSuccessfulOptimize() {
  runToolMock.mockImplementation(async (_toolId: string, _input: string, onToken: (t: string) => void) => {
    onToken(JSON.stringify({ optimizedPrompt: OPTIMIZED_PROMPT }));
  });
}

beforeEach(() => {
  runToolMock.mockReset();
});

describe("OptimizedPromptSection", () => {
  it("renders nothing while the analyzer hasn't completed", () => {
    const { container } = render(
      <OptimizedPromptSection
        originalPrompt="Write something"
        analyzerStatus="idle"
        onSaveToLibrary={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("automatically runs the optimizer once analyzerStatus becomes complete", async () => {
    mockSuccessfulOptimize();
    render(
      <OptimizedPromptSection
        originalPrompt="Write a blog post"
        analyzerStatus="complete"
        onSaveToLibrary={vi.fn()}
      />
    );

    await waitFor(() => expect(runToolMock).toHaveBeenCalledWith(
      "prompt-optimizer",
      "Write a blog post",
      expect.any(Function),
      expect.anything()
    ));
    expect(await screen.findByText(OPTIMIZED_PROMPT)).toBeInTheDocument();
  });

  it("Copy Optimized Prompt shows a confirmation after clicking", async () => {
    // NOTE: jsdom's real navigator.clipboard.writeText resolves successfully
    // in this environment and can't reliably be intercepted/spied on here —
    // so this test verifies the observable UI outcome (the confirmation
    // label change) rather than asserting on the clipboard call itself.
    mockSuccessfulOptimize();
    const user = userEvent.setup();
    render(
      <OptimizedPromptSection
        originalPrompt="Write a blog post"
        analyzerStatus="complete"
        onSaveToLibrary={vi.fn()}
      />
    );

    await screen.findByText(OPTIMIZED_PROMPT);
    await user.click(screen.getByRole("button", { name: /copy optimized prompt/i }));

    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it("Save to Prompt Library calls onSaveToLibrary with the optimized prompt and shows confirmation", async () => {
    mockSuccessfulOptimize();
    const onSaveToLibrary = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <OptimizedPromptSection
        originalPrompt="Write a blog post"
        analyzerStatus="complete"
        onSaveToLibrary={onSaveToLibrary}
      />
    );

    await screen.findByText(OPTIMIZED_PROMPT);
    await user.click(screen.getByRole("button", { name: /save to prompt library/i }));

    expect(onSaveToLibrary).toHaveBeenCalledWith(OPTIMIZED_PROMPT);
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });

  it("shows an error message if the optimizer call fails", async () => {
    runToolMock.mockRejectedValueOnce(new Error("network down"));
    render(
      <OptimizedPromptSection
        originalPrompt="Write a blog post"
        analyzerStatus="complete"
        onSaveToLibrary={vi.fn()}
      />
    );

    expect(await screen.findByText(/couldn't generate an optimized version/i)).toBeInTheDocument();
  });
});