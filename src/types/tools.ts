// src/types/tool.ts
// Generic lifecycle types reused by every AI tool in the app
// (Prompt Analyzer today, Workflow Builder / Model Recommender later).

export type ToolStatus =
  | "idle"
  | "running"
  | "completed"
  | "error";

// A "stage" is a named step inside the running phase.
// Each tool defines its own ordered stage list; the lifecycle hook
// just walks through whatever list you give it.
export interface ToolStage {
  id: string;
  label: string;
}

export interface ToolLifecycleState<TStageId extends string = string> {
  status: ToolStatus;
  currentStageId: TStageId | null;
  error: string | null;
}
// ADD to src/types/tools.ts, next to PromptAnalysisResult

export interface PromptOptimizationResult {
  optimizedPrompt: string;
}