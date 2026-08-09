// src/components/chat/ChatInput.tsx
import { useState, useRef, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  isSending: boolean;
  onStop?: () => void;
}

export function ChatInput({ onSend, isSending, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false); // NEW — empty-input validation
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    setTouched(true); // NEW
    if (!value.trim() || isSending) return;
    onSend(value);
    setValue("");
    setTouched(false); // NEW
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="border-t border-gray-200 p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (touched) setTouched(false); // NEW — clear message once they start typing
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40"
        />
        {isSending ? (
          <button
            onClick={onStop}
            className="rounded-xl bg-red-600 px-4 py-2 min-h-[44px] text-sm font-medium text-white hover:bg-red-700 active:scale-95 transition-all touch-manipulation"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2 min-h-[44px] text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all touch-manipulation"
          >
            Send
          </button>
        )}
      </div>
      {/* NEW — visible empty-input validation message */}
      {touched && !value.trim() && (
        <p className="mt-1.5 text-xs text-red-600">Please enter a message.</p>
      )}
    </div>
  );
}