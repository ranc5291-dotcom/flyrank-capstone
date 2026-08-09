// src/components/ui/ToolLifecycleIndicator.tsx
//
// Reusable for any tool built on useToolRun. Derives "Reading /
// Evaluating / Generating" purely from status + partial result —
// no changes to useToolRun or api/tool.ts needed.

import type { PromptAnalysisResult } from "../../types/tools";
import type { ToolStatus } from "../../types/tools";

type Stage = "reading" | "evaluating" | "generating" | "done";

const STAGE_LABELS: Record<Stage, string> = {
  reading: "Reading Prompt",
  evaluating: "Evaluating Quality",
  generating: "Generating Suggestions",
  done: "Completed",
};

const STAGE_ORDER: Stage[] = ["reading", "evaluating", "generating", "done"];

function deriveStage(status: ToolStatus, result?: Partial<PromptAnalysisResult>): Stage {
  if (status === "complete") return "done";
  if (!result || result.qualityScore === undefined) return "reading";
  if (!result.suggestions || result.suggestions.length === 0) return "evaluating";
  return "generating";
}

interface ToolLifecycleIndicatorProps {
  status: ToolStatus;
  result?: Partial<PromptAnalysisResult>;
  error?: string | null;
}

export function ToolLifecycleIndicator({ status, result, error }: ToolLifecycleIndicatorProps) {
  if (status === "idle") return null;

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Error{error ? `: ${error}` : ""}
      </div>
    );
  }

  const currentStage = deriveStage(status, result);
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
      {STAGE_ORDER.map((stage, i) => {
        const isDone = i < currentIndex || status === "complete";
        const isActive = status === "streaming" && i === currentIndex;
        return (
          <div key={stage} className="flex items-center gap-1.5">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isDone ? "bg-green-500" : isActive ? "bg-blue-600 animate-pulse" : "bg-gray-300",
              ].join(" ")}
            />
            <span
              className={
                isDone ? "text-gray-400" : isActive ? "text-gray-800 font-medium" : "text-gray-300"
              }
            >
              {STAGE_LABELS[stage]}
            </span>
          </div>
        );
      })}
    </div>
  );
}