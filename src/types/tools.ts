// src/types/tool.ts
// Generic lifecycle types reused by every AI tool in the app
// (Prompt Analyzer today, Workflow Builder / Model Recommender later).

// src/types/tools.ts
// Shared types for every AI tool in the app (Prompt Analyzer today,
// Workflow Builder / Model Recommender later), used by useToolRun and
// the components/UI that render its state.

export type ToolStatus = "idle" | "streaming" | "complete" | "error";

export interface PromptAnalysisResult {
  qualityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface PromptOptimizationResult {
  optimizedPrompt: string;
}// ADD to src/types/tools.ts, next to PromptAnalysisResult

export interface PromptOptimizationResult {
  optimizedPrompt: string;
}