// src/components/chat/ThinkingIndicator.tsx

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="sr-only">Assistant is thinking</span>
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
    </div>
  );
}