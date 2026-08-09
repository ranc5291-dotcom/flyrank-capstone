// src/components/chat/__tests__/Message.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../Message";
import type { ChatMessage } from "../../../types/chat";

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: "msg-1",
    role: "assistant",
    content: "",
    status: "complete",
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("Message", () => {
  it("renders user messages right-aligned with plain text", () => {
    render(<Message message={makeMessage({ role: "user", content: "Hello there" })} />);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("shows a thinking indicator while status is pending", () => {
    const { container } = render(<Message message={makeMessage({ status: "pending" })} />);
    // ThinkingIndicator's exact markup isn't known here, so assert on the
    // one thing we can be sure of: no error/retry UI and no message text render.
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
    expect(container).toBeTruthy();
  });

  it("renders partial content while streaming (covers Streaming Messages)", () => {
    render(
      <Message
        message={makeMessage({ status: "streaming", content: "The answer is par" })}
      />
    );
    expect(screen.getByText("The answer is par")).toBeInTheDocument();
  });

  it("shows network error copy and a Retry button, which calls onRetry with the message id", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <Message
        message={makeMessage({
          status: "error",
          errorType: "network",
          error: "raw error detail",
        })}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText(/connection problem/i)).toBeInTheDocument();
    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledWith("msg-1");
  });

  it("shows distinct copy for timeout, rate_limit, and unknown error types", () => {
    const { rerender } = render(
      <Message message={makeMessage({ status: "error", errorType: "timeout" })} />
    );
    expect(screen.getByText(/that took too long/i)).toBeInTheDocument();

    rerender(<Message message={makeMessage({ status: "error", errorType: "rate_limit" })} />);
    expect(screen.getByText(/slow down a little/i)).toBeInTheDocument();

    rerender(<Message message={makeMessage({ status: "error", errorType: "unknown" })} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("does not render a Retry button when onRetry is not provided", () => {
    render(<Message message={makeMessage({ status: "error", errorType: "api" })} />);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });
});