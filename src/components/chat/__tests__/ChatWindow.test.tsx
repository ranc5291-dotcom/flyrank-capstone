// src/components/chat/__tests__/ChatWindow.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatWindow } from "../ChatWindow";
import type { ChatMessage } from "../../../types/chat";

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: `msg-${Math.random()}`,
    role: "user",
    content: "Hi",
    status: "complete",
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("ChatWindow", () => {
  it("shows the 'Nothing here yet' empty state when there are no messages", () => {
    render(<ChatWindow messages={[]} />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("does not show the empty state once messages exist", () => {
    render(<ChatWindow messages={[makeMessage({ content: "Hello" })]} />);
    expect(screen.queryByText(/nothing here yet/i)).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders messages in order", () => {
    const messages = [
      makeMessage({ id: "1", role: "user", content: "First" }),
      makeMessage({ id: "2", role: "assistant", content: "Second" }),
    ];
    render(<ChatWindow messages={messages} />);

    const log = screen.getByRole("log", { name: /chat messages/i });
    const text = log.textContent ?? "";
    expect(text.indexOf("First")).toBeLessThan(text.indexOf("Second"));
  });

  it("shows a loading skeleton instead of messages when isLoading is true", () => {
    render(<ChatWindow messages={[]} isLoading />);
    expect(screen.queryByText(/nothing here yet/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("log")).not.toBeInTheDocument();
  });
});