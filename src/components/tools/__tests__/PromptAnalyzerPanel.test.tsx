// src/components/tools/__tests__/PromptAnalyzerPanel.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptAnalyzerPanel } from "../PromptAnalyzerPanel";

// Mock the network layer runTool sits on top of, so useToolRun's real
// logic (streaming/parsing/lifecycle) runs, but nothing hits the network.
const { runToolMock } = vi.hoisted(() => ({ runToolMock: vi.fn() }));
vi.mock("../../../lib/tools/runTool", () => ({
  runTool: runToolMock,
  ToolRequestError: class ToolRequestError extends Error {
    status?: number;
  },
}));

// PromptAnalyzerPanel calls addPrompt() on save — stub it out, that
// integration is covered separately.
const addPromptMock = vi.fn();
vi.mock("../../../hooks/usePrompts", () => ({
  default: () => ({ addPrompt: addPromptMock }),
}));

const ANALYSIS_JSON = JSON.stringify({
  qualityScore: 82,
  strengths: ["Clear goal", "Good topic"],
  weaknesses: ["Missing audience"],
  suggestions: ["Mention target audience"],
});

const OPTIMIZED_JSON = JSON.stringify({
  optimizedPrompt: "A much better version of the prompt.",
});

function mockSuccessfulRun() {
  runToolMock.mockImplementation(async (toolId: string, _input: string, onToken: (t: string) => void) => {
    const payload = toolId === "prompt-analyzer" ? ANALYSIS_JSON : OPTIMIZED_JSON;
    onToken(payload);
  });
}

beforeEach(() => {
  runToolMock.mockReset();
  addPromptMock.mockReset();
});

describe("PromptAnalyzerPanel", () => {
  it("shows the Analysis Preview card and example prompts in the idle state", () => {
    render(<PromptAnalyzerPanel />);
    expect(screen.getByText(/analysis preview/i)).toBeInTheDocument();
    expect(screen.getByText(/try one of these examples/i)).toBeInTheDocument();
  });

  it("shows a validation message and does not call run when submitted empty", async () => {
    const user = userEvent.setup();
    render(<PromptAnalyzerPanel />);

    await user.click(screen.getByRole("button", { name: /analyze prompt/i }));

    expect(screen.getByText(/please enter a prompt to analyze/i)).toBeInTheDocument();
    expect(runToolMock).not.toHaveBeenCalled();
  });

  it("filling the textarea from an example chip enables Analyze", async () => {
    const user = userEvent.setup();
    render(<PromptAnalyzerPanel />);

    const chip = screen.getByRole("button", { name: /write a blog post about productivity/i });
    await user.click(chip);

    const textarea = screen.getByPlaceholderText(/e\.g\. write a blog post/i);
    expect(textarea.value).toContain("blog post about productivity");
    expect(screen.getByRole("button", { name: /analyze prompt/i })).toBeEnabled();
  });

  it("runs analysis and renders score, strengths, weaknesses, and suggestions", async () => {
    mockSuccessfulRun();
    const user = userEvent.setup();
    render(<PromptAnalyzerPanel />);

    await user.type(
      screen.getByPlaceholderText(/e\.g\. write a blog post/i),
      "Write a blog post about productivity"
    );
    await user.click(screen.getByRole("button", { name: /analyze prompt/i }));

    await waitFor(() => expect(screen.getByText("82")).toBeInTheDocument());
    expect(screen.getByText("Clear goal")).toBeInTheDocument();
    expect(screen.getByText("Missing audience")).toBeInTheDocument();
    expect(screen.getByText("Mention target audience")).toBeInTheDocument();
    expect(screen.getByText(/good prompt/i)).toBeInTheDocument();
  });

  it("shows an error state with a working Retry button on failure", async () => {
    runToolMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();
    render(<PromptAnalyzerPanel />);

    await user.type(screen.getByPlaceholderText(/e\.g\. write a blog post/i), "Test prompt");
    await user.click(screen.getByRole("button", { name: /analyze prompt/i }));

    const retryButton = await screen.findByRole("button", { name: /retry/i });
    expect(screen.getByText(/^something went wrong$/i)).toBeInTheDocument();

    mockSuccessfulRun();
    await user.click(retryButton);

    await waitFor(() => expect(screen.getByText("82")).toBeInTheDocument());
  });
});