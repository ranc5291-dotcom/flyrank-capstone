// src/pages/AIWorkspace.tsx
import { useState } from "react";
import { ChatWindow } from "../components/chat/ChatWindow";
import { ChatInput } from "../components/chat/ChatInput";
import { PromptAnalyzerPanel } from "../components/tools/PromptAnalyzerPanel";
import { useChat } from "../hooks/useChat";
import { sendToGroq } from "../lib/groq";
import { AIOrb } from "../components/ui/AIOrb";

type WorkspaceTab = "chat" | "analyzer";

export default function AIWorkspace() {
  const [tab, setTab] = useState<WorkspaceTab>("chat");

  const {
    messages,
    isSending,
    isLoadingConversation,
    sendMessage,
    retryMessage,
    stop,
    clearChat,
  } = useChat({ sendToModel: sendToGroq });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <AIOrb thinking={isSending} size={40} />
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setTab("chat")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "chat" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setTab("analyzer")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "analyzer" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Analyze Prompt
            </button>
          </div>
        </div>

        {tab === "chat" && (
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear chat
          </button>
        )}
      </div>

      {tab === "chat" ? (
        <>
          <ChatWindow
            messages={messages}
            isLoading={isLoadingConversation}
            onRetry={retryMessage}
          />
          <ChatInput onSend={sendMessage} isSending={isSending} onStop={stop} />
        </>
      ) : (
        <PromptAnalyzerPanel />
      )}
    </div>
  );
}