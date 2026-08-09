// src/hooks/useToolLifecycle.ts
// Reusable across every AI tool. You give it an ordered list of stages
// and a runner function; it takes care of status + current-stage state
// so each tool's component only has to render UI, not manage transitions.

import { useCallback, useRef, useState } from "react";
import type { ToolStage, ToolStatus } from "../types/tool";

interface UseToolLifecycleOptions<TStageId extends string, TResult> {
  stages: ToolStage[];
  // run receives a `setStage` callback so it can report progress
  // as it moves through your stages (e.g. "reading" -> "evaluating" -> "generating").
  run: (setStage: (stageId: TStageId) => void) => Promise<TResult>;
}

interface UseToolLifecycleReturn<TStageId extends string, TResult> {
  status: ToolStatus;
  currentStageId: TStageId | null;
  error: string | null;
  result: TResult | null;
  stages: ToolStage[];
  start: () => Promise<void>;
  reset: () => void;
}

export function useToolLifecycle<TStageId extends string, TResult>(
  options: UseToolLifecycleOptions<TStageId, TResult>
): UseToolLifecycleReturn<TStageId, TResult> {
  const { stages, run } = options;

  const [status, setStatus] = useState<ToolStatus>("idle");
  const [currentStageId, setCurrentStageId] = useState<TStageId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  // guards against setting state after the component unmounts
  // or after a newer run has already started
  const runIdRef = useRef(0);

  const start = useCallback(async () => {
    const thisRunId = ++runIdRef.current;
    setStatus("running");
    setError(null);
    setResult(null);
    setCurrentStageId((stages[0]?.id as TStageId) ?? null);

    try {
      const setStage = (stageId: TStageId) => {
        if (runIdRef.current === thisRunId) {
          setCurrentStageId(stageId);
        }
      };

      const runResult = await run(setStage);

      if (runIdRef.current === thisRunId) {
        setResult(runResult);
        setStatus("completed");
      }
    } catch (err) {
      if (runIdRef.current === thisRunId) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setStatus("error");
      }
    }
  }, [run, stages]);

  const reset = useCallback(() => {
    runIdRef.current++; // invalidate any in-flight run
    setStatus("idle");
    setCurrentStageId(null);
    setError(null);
    setResult(null);
  }, []);

  return { status, currentStageId, error, result, stages, start, reset };
}