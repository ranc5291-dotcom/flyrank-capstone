// src/components/chat/Message.tsx
import type { ChatMessage } from "../../types/chat";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MessageProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}

const ERROR_COPY: Record<string, { title: string; hint: string }> = {
  network: {
    title: "Connection problem",
    hint: "Check your internet connection and try again.",
  },
  timeout: {
    title: "That took too long",
    hint: "The response didn't arrive in time.",
  },
  api: {
    title: "Something went wrong",
    hint: "The server had trouble handling that request.",
  },
  rate_limit: { // NEW
    title: "Slow down a little",
    hint: "You're sending messages too quickly. Please wait a moment and try again.",
  },
  unknown: {
    title: "Something went wrong",
    hint: "Please try again.",
  },
};

export function Message({ message, onRetry }: MessageProps) {
  const isUser = message.role === "user";
  const isPending = message.status === "pending";
  const isError = message.status === "error";

  const errorCopy = ERROR_COPY[message.errorType ?? "unknown"];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-2`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        } ${isError ? "border border-red-300 bg-red-50 text-red-800" : ""}`}
      >
        {isPending ? (
          <ThinkingIndicator />
        ) : isError ? (
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-medium">{errorCopy.title}</p>
              <p className="text-xs text-red-600 mt-0.5">{errorCopy.hint}</p>
            </div>
            {onRetry && (
              <button
                onClick={() => onRetry(message.id)}
                className="self-start flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 min-h-[36px]
                           text-xs font-medium text-white hover:bg-red-700 active:scale-95
                           transition-all touch-manipulation"
              >
                ↻ Retry
              </button>
            )}
          </div>
        ) : (
          <>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </>
        )}
      </div>
    </div>
  );
}