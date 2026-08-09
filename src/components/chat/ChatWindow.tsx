// src/components/chat/ChatWindow.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import type { ChatMessage } from "../../types/chat";
import { Message } from "./Message";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
}

const BOTTOM_THRESHOLD = 80;
const KEYBOARD_SCROLL_AMOUNT = 120;

function MessageSkeleton() {
  return (
    <div className="animate-pulse px-4 py-2 space-y-3">
      <div className="flex justify-end">
        <div className="h-9 w-40 rounded-2xl bg-gray-200" />
      </div>
      <div className="flex justify-start">
        <div className="h-14 w-64 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isLoading, onRetry }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const prevMessageCountRef = useRef(messages.length);

  const checkIfAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= BOTTOM_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setHasNewMessages(false);
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    containerRef.current?.scrollTo({ top: 0, behavior });
  }, []);

  const scrollBy = useCallback((amount: number) => {
    containerRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => setIsAtBottom(checkIfAtBottom());
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [checkIfAtBottom]);

  useEffect(() => {
    const messageCountChanged = messages.length !== prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (isAtBottom) {
      scrollToBottom(messageCountChanged ? "smooth" : "auto");
    } else if (messageCountChanged) {
      setHasNewMessages(true);
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // On first mount, jump straight to the bottom (instant, not smooth) —
  // this handles the case where a restored conversation loads with
  // many messages already present, so the user lands on the latest
  // message instead of the top of a long scrollback.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          scrollBy(KEYBOARD_SCROLL_AMOUNT);
          break;
        case "ArrowUp":
          e.preventDefault();
          scrollBy(-KEYBOARD_SCROLL_AMOUNT);
          break;
        case "PageDown":
          e.preventDefault();
          scrollBy(containerRef.current?.clientHeight ?? 400);
          break;
        case "PageUp":
          e.preventDefault();
          scrollBy(-(containerRef.current?.clientHeight ?? 400));
          break;
        case "Home":
          e.preventDefault();
          scrollToTop();
          break;
        case "End":
          e.preventDefault();
          scrollToBottom();
          break;
      }
    },
    [scrollBy, scrollToTop, scrollToBottom]
  );

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageSkeleton />
        <MessageSkeleton />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400 px-4 text-center">
        <div className="text-3xl">💬</div>
        <p className="text-sm font-medium text-gray-500">Nothing here yet</p>
        <p className="text-xs text-gray-400">
          Ask a question or paste something to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0 flex">
      <div
        ref={containerRef}
        tabIndex={0}
        role="log"
        aria-label="Chat messages"
        onKeyDown={handleKeyDown}
        className="flex-1 h-full overflow-y-auto py-2 overscroll-contain
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
      >
        {messages.map((m) => (
          <Message key={m.id} message={m} onRetry={onRetry} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="hidden sm:flex flex-col justify-end gap-2 pb-4 pl-2">
        <button
          onClick={() => scrollBy(-KEYBOARD_SCROLL_AMOUNT * 2)}
          aria-label="Scroll up"
          className="w-8 h-8 flex items-center justify-center rounded-full
                     bg-white border border-gray-200 shadow-sm text-gray-500
                     hover:bg-gray-50 hover:text-gray-700 active:scale-95
                     transition-all touch-manipulation"
        >
          ↑
        </button>
        <button
          onClick={() => scrollBy(KEYBOARD_SCROLL_AMOUNT * 2)}
          aria-label="Scroll down"
          className="w-8 h-8 flex items-center justify-center rounded-full
                     bg-white border border-gray-200 shadow-sm text-gray-500
                     hover:bg-gray-50 hover:text-gray-700 active:scale-95
                     transition-all touch-manipulation"
        >
          ↓
        </button>
      </div>

      {hasNewMessages && !isAtBottom && (
        <button
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5
                     rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-lg
                     hover:bg-gray-800 active:scale-95 transition-all
                     touch-manipulation"
        >
          <span>↓ Jump to latest</span>
        </button>
      )}
    </div>
  );
}