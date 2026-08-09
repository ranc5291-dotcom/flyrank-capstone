// src/hooks/useChat.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../types/chat";
import { ChatRequestError } from "../lib/groq";
import {
  type Conversation,
  clearConversation,
  loadLastConversation,
  saveConversation,
} from "../lib/storage";

interface UseChatOptions {
  sendToModel?: (
    messages: ChatMessage[],
    onToken: (token: string) => void,
    signal: AbortSignal
  ) => Promise<void>;
  timeoutMs?: number; // NEW
}

const DEFAULT_TIMEOUT_MS = 45_000; // NEW — matches the analyzer's tool timeout

function getInitialConversation(): Conversation {
  const restored = loadLastConversation();
  if (restored) return restored;
  return { id: uuidv4(), messages: [], updatedAt: Date.now() };
}

export function useChat(options: UseChatOptions = {}) {
  const [conversationId, setConversationId] = useState(
    () => getInitialConversation().id
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => getInitialConversation().messages
  );
  const [isSending, setIsSending] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserContentRef = useRef<string>("");
  const timedOutRef = useRef(false); // NEW

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingConversation(false), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      if (messages.length === 0) return;
      saveConversation({ id: conversationId, messages, updatedAt: Date.now() });
    }, 300);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [conversationId, messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback(
    (id: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
      );
    },
    []
  );

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const stop = useCallback(() => {
    timedOutRef.current = false; // NEW — explicit stop, not a timeout
    abortRef.current?.abort();
    setIsSending(false);
  }, []);

  const runAssistantTurn = useCallback(
    async (historyForModel: ChatMessage[]) => {
      const assistantId = uuidv4();
      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        status: "pending",
        createdAt: Date.now(),
      });

      setIsSending(true);
      timedOutRef.current = false; // NEW
      const controller = new AbortController();
      abortRef.current = controller;

      // NEW — timeout guard so a hung stream doesn't leave the UI stuck forever
      const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const timeoutId = setTimeout(() => {
        timedOutRef.current = true;
        controller.abort();
      }, timeoutMs);

      try {
        if (options.sendToModel) {
          let acc = "";
          await options.sendToModel(
            historyForModel,
            (token) => {
              acc += token;
              updateMessage(assistantId, { content: acc, status: "streaming" });
            },
            controller.signal
          );
          updateMessage(assistantId, { status: "complete" });
        } else {
          await new Promise((r) => setTimeout(r, 700));
          updateMessage(assistantId, {
            content: "This is a placeholder response — no model connected yet.",
            status: "complete",
          });
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (timedOutRef.current) {
            // NEW — distinct timeout outcome instead of silently completing
            updateMessage(assistantId, {
              status: "error",
              error: "This is taking longer than expected. Please try again.",
              errorType: "timeout",
            });
          } else {
            updateMessage(assistantId, { status: "complete" });
          }
        } else if (err instanceof ChatRequestError) {
          updateMessage(assistantId, {
            status: "error",
            error: err.message,
            errorType: err.type,
          });
        } else {
          updateMessage(assistantId, {
            status: "error",
            error: err instanceof Error ? err.message : "Something went wrong",
            errorType: "unknown",
          });
        }
      } finally {
        clearTimeout(timeoutId); // NEW
        setIsSending(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateMessage, options]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: trimmed,
        status: "complete",
        createdAt: Date.now(),
      };
      addMessage(userMessage);
      lastUserContentRef.current = trimmed;

      await runAssistantTurn([...messages, userMessage]);
    },
    [messages, isSending, addMessage, runAssistantTurn]
  );

  const retryMessage = useCallback(
    async (failedAssistantId: string) => {
      if (isSending) return;
      removeMessage(failedAssistantId);

      setMessages((current) => {
        const historyForModel = current.filter((m) => m.id !== failedAssistantId);
        runAssistantTurn(historyForModel);
        return current.filter((m) => m.id !== failedAssistantId);
      });
    },
    [isSending, removeMessage, runAssistantTurn]
  );

  const clearChat = useCallback(() => {
    clearConversation(conversationId);
    const fresh = uuidv4();
    setConversationId(fresh);
    setMessages([]);
  }, [conversationId]);

  return {
    messages,
    isSending,
    isLoadingConversation,
    sendMessage,
    retryMessage,
    stop,
    clearChat,
  };
}