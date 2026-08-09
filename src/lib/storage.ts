// src/lib/storage.ts
import type { ChatMessage } from "../types/chat";

// A conversation, not just a flat message list — this is what makes
// multi-conversation history a small addition later instead of a rewrite.
export interface Conversation {
  id: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const STORAGE_PREFIX = "ai-prompt-studio:chat:";
const LAST_CONVERSATION_KEY = `${STORAGE_PREFIX}last-id`;

function conversationKey(id: string): string {
  return `${STORAGE_PREFIX}conversation:${id}`;
}

export function saveConversation(conversation: Conversation): void {
  try {
    localStorage.setItem(
      conversationKey(conversation.id),
      JSON.stringify(conversation)
    );
    localStorage.setItem(LAST_CONVERSATION_KEY, conversation.id);
  } catch {
    // localStorage can fail (quota exceeded, private browsing) —
    // chat should keep working in-memory even if persistence fails
  }
}

export function loadLastConversation(): Conversation | null {
  try {
    const lastId = localStorage.getItem(LAST_CONVERSATION_KEY);
    if (!lastId) return null;

    const raw = localStorage.getItem(conversationKey(lastId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Conversation;
    if (!parsed.id || !Array.isArray(parsed.messages)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function clearConversation(id: string): void {
  try {
    localStorage.removeItem(conversationKey(id));
    const lastId = localStorage.getItem(LAST_CONVERSATION_KEY);
    if (lastId === id) {
      localStorage.removeItem(LAST_CONVERSATION_KEY);
    }
  } catch {
    // no-op — nothing to clean up if storage isn't available
  }
}

// Future: listConversations(), deleteConversation(id), renameConversation(id, title)
// all slot in here without touching useChat.ts