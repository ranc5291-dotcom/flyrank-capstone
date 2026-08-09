// src/types/chat.ts

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "pending" | "streaming" | "complete" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
  error?: string;
  errorType?: "network" | "timeout" | "api" | "rate_limit" | "unknown";
  // Placeholder for later — tool calls attached to an assistant message
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: "pending" | "success" | "error";
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// What the input box needs to know about send-ability
export interface ChatInputState {
  value: string;
  isSending: boolean;
}