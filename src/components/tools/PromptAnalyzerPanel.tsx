// src/components/tools/PromptAnalyzerPanel.tsx
import { useState } from "react";
import { useToolRun } from "../../hooks/useToolRun";
import type { PromptAnalysisResult } from "../../types/tools";
import { QualityScoreCard } from "./QualityScoreCard";
import { OptimizedPromptSection } from "./OptimizedPromptSection";
import { ToolLifecycleIndicator } from "../ui/ToolLifecycleIndicator";
import { ExamplePrompts } from "./ExamplePrompts";
import { AnalysisPreviewCard } from "./AnalysisPreviewCard";
import { useToast, Toast } from "../ui/Toast";
import usePrompts from "../../hooks/usePrompts";
import type { Prompt } from "../../types/dashboard";
import { v4 as uuid } from "uuid";

function ResultList({
  title,
  items,
  emptyHint,
  icon,
  iconColor,
}: {
  title: string;
  items?: string[];
  emptyHint: string;
  icon: string;
  iconColor: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-1.5">{title}</h4>
      {items && items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className={`flex-shrink-0 font-semibold ${iconColor}`}>{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 italic">{emptyHint}</p>
      )}
    </div>
  );
}

export function PromptAnalyzerPanel() {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false); // NEW — for empty-input validation message
  const { status, result, error, run, stop, reset } =
    useToolRun<PromptAnalysisResult>("prompt-analyzer");
  const { toast, showToast } = useToast();

  const { addPrompt } = usePrompts();

  const isStreaming = status === "streaming";
  const isIdle = status === "idle";

  const handleAnalyze = (value?: string) => {
    const toRun = value ?? input;
    setTouched(true); // NEW
    if (!toRun.trim() || isStreaming) return;
    run(toRun);
  };

  const handlePickExample = (example: string) => {
    setInput(example);
  };

  const handleSaveToLibrary = async (optimizedPrompt: string) => {
    try {
      const newPrompt: Prompt = {
        id: uuid(),
        title: input.slice(0, 60) || "Optimized Prompt",
        body: optimizedPrompt,
        tags: ["ai-optimized"],
        favorite: false,
        createdAt: new Date().toISOString(),
      };
      addPrompt(newPrompt);
      showToast("Prompt saved successfully", "success");
    } catch {
      showToast("Couldn't save prompt", "error");
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Paste a prompt to analyze
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Analyze any AI prompt to receive a quality score, identify strengths and weaknesses,
            and get an optimized version.
          </p>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (touched) setTouched(false); // NEW — clear validation message once they start typing
            }}
            placeholder="e.g. Write a blog post about productivity"
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* NEW — visible empty-input validation message */}
          {touched && !input.trim() && (
            <p className="mt-1.5 text-xs text-red-600">Please enter a prompt to analyze.</p>
          )}
        </div>

        {isIdle && <ExamplePrompts onPick={handlePickExample} />}

        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={stop}
              className="rounded-xl bg-red-600 px-4 py-2 min-h-[44px] text-sm font-medium text-white
                         hover:bg-red-700 active:scale-95 transition-all touch-manipulation"
            >
              Stop
            </button>
          ) : (
            <button
  onClick={() => handleAnalyze()}
  className="rounded-xl bg-blue-600 px-4 py-2 min-h-[44px] text-sm font-medium text-white
             hover:bg-blue-700 active:scale-95 transition-all touch-manipulation"
>
  Analyze Prompt
</button>
          )}
          {(result || error) && !isStreaming && (
            <button
              onClick={() => {
                reset();
                setInput("");
              }}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>

        <ToolLifecycleIndicator status={status} result={result} error={error} />

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">Something went wrong</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
            <button
              onClick={() => run(input)}
              className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 min-h-[36px]
                         text-xs font-medium text-white hover:bg-red-700 active:scale-95
                         transition-all touch-manipulation"
            >
              ↻ Retry
            </button>
          </div>
        )}

        {isIdle && !result && !error && <AnalysisPreviewCard />}

        {(isStreaming || result) && !error && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4 shadow-sm">
            {result?.qualityScore !== undefined ? (
              <QualityScoreCard score={result.qualityScore} />
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Prompt Quality Score</h3>
                <div className="h-7 w-16 rounded-full bg-gray-100 animate-pulse" />
              </div>
            )}

            <ResultList
              title="Strengths"
              items={result?.strengths}
              emptyHint={isStreaming ? "Analyzing..." : "None found."}
              icon="✓"
              iconColor="text-green-600"
            />
            <ResultList
              title="Weaknesses"
              items={result?.weaknesses}
              emptyHint={isStreaming ? "Analyzing..." : "None found."}
              icon="✗"
              iconColor="text-red-500"
            />
            <ResultList
              title="Suggestions"
              items={result?.suggestions}
              emptyHint={isStreaming ? "Analyzing..." : "None found."}
              icon="•"
              iconColor="text-blue-600"
            />
          </div>
        )}

        {status === "complete" && (
          <OptimizedPromptSection
            originalPrompt={input}
            analyzerStatus={status}
            onSaveToLibrary={handleSaveToLibrary}
          />
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
}