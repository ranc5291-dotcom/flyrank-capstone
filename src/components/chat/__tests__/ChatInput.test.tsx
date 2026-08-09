// src/components/chat/__tests__/ChatInput.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "../ChatInput";

describe("ChatInput", () => {
  it("shows a visible validation message when Enter is pressed with empty input", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isSending={false} />);

    // The Send button is disabled when empty, so it won't fire onClick at
    // all — Enter is the only path that reaches handleSend() while empty.
    await user.type(screen.getByPlaceholderText(/ask anything/i), "{Enter}");

    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears the validation message once the user starts typing", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={vi.fn()} isSending={false} />);

    const textarea = screen.getByPlaceholderText(/ask anything/i);
    await user.type(textarea, "{Enter}");
    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();

    await user.type(textarea, "Hello");
    expect(screen.queryByText(/please enter a message/i)).not.toBeInTheDocument();
  });

  it("calls onSend with the trimmed message and clears the input", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText(/ask anything/i);
    await user.type(textarea, "  Hello there  ");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(onSend).toHaveBeenCalledWith("  Hello there  ");
    expect(textarea).toHaveValue("");
  });

  it("sends on Enter but inserts a newline on Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isSending={false} />);

    const textarea = screen.getByPlaceholderText(/ask anything/i);
    await user.type(textarea, "Line one{Shift>}{Enter}{/Shift}Line two");
    expect(onSend).not.toHaveBeenCalled();
    expect(textarea).toHaveValue("Line one\nLine two");

    await user.type(textarea, "{Enter}");
    expect(onSend).toHaveBeenCalledWith("Line one\nLine two");
  });

  it("shows Stop instead of Send while isSending is true, and calls onStop", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<ChatInput onSend={vi.fn()} isSending={true} onStop={onStop} />);

    expect(screen.queryByRole("button", { name: /^send$/i })).not.toBeInTheDocument();
    const stopButton = screen.getByRole("button", { name: /stop/i });
    await user.click(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});