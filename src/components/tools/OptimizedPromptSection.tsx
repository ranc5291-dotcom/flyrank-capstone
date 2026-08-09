// src/components/tools/OptimizedPromptSection.tsx
import { useEffect, useRef, useState } from "react";
import { useToolRun } from "../../hooks/useToolRun";
import type { PromptOptimizationResult, ToolStatus } from "../../types/tools";

interface OptimizedPromptSectionProps {
  originalPrompt: string;
  analyzerStatus: ToolStatus;
  onSaveToLibrary: (prompt: string) => void | Promise<void>;
}

export function OptimizedPromptSection({
  originalPrompt,
  analyzerStatus,
  onSaveToLibrary,
}: OptimizedPromptSectionProps) {
  const { status, result, error, run } = useToolRun<PromptOptimizationResult>("prompt-optimizer");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastRunFor = useRef<string | null>(null);

  useEffect(() => {
    if (analyzerStatus === "complete" && lastRunFor.current !== originalPrompt) {
      lastRunFor.current = originalPrompt;
      run(originalPrompt);
    }
  }, [analyzerStatus, originalPrompt, run]);

  if (analyzerStatus !== "complete" && status === "idle") return null;

  const handleCopy = async () => {
    if (!result?.optimizedPrompt) return;
    try {
      await navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard failures
    }
  };

  const handleSave = async () => {
    if (!result?.optimizedPrompt) return;
    await onSaveToLibrary(result.optimizedPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">Optimized Prompt</h3>

      {status === "error" && (
        <p className="text-xs text-red-600">Couldn't generate an optimized version: {error}</p>
      )}

      {status === "streaming" && !result?.optimizedPrompt && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-11/12" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      )}

      {result?.optimizedPrompt && (
        <>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result.optimizedPrompt}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-medium px-3 py-1.5 min-h-[36px] rounded-lg border border-gray-300
                         text-gray-700 hover:bg-gray-50 active:scale-95 transition-all touch-manipulation"
            >
              {copied ? "Copied ✓" : "Copy Optimized Prompt"}
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-medium px-3 py-1.5 min-h-[36px] rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 active:scale-95 transition-all touch-manipulation"
            >
              {saved ? "Saved ✓" : "Save to Prompt Library"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}