// src/hooks/useToolRun.ts
import { useCallback, useRef, useState } from "react";
import { runTool, ToolRequestError } from "../lib/tools/runTool";
import { tryParsePartialJson } from "../lib/partialJson";
import type { ToolStatus } from "../types/tools";

// Generic — works for any tool that returns a JSON object streamed
// as text. Pass the toolId and get back typed partial results as
// they arrive. Future tools reuse this hook as-is.

const DEFAULT_TIMEOUT_MS = 45_000; // LLM streaming can legitimately take a while

// Maps whatever runTool/fetch throws into copy a user can actually act on.
// Keeps the raw message available for debugging via console, but never
// shows it directly in the UI.
function getFriendlyErrorMessage(err: unknown, timedOut: boolean): string {
  if (timedOut) {
    return "This is taking longer than expected. Please try again.";
  }

  if (err instanceof ToolRequestError) {
    const status = (err as ToolRequestError & { status?: number }).status;
    if (status === 429) {
      return "You're sending requests a bit too fast. Please wait a moment and try again.";
    }
    if (status && status >= 500) {
      return "The AI service is having trouble right now. Please try again shortly.";
    }
    if (status === 401 || status === 403) {
      return "There's a configuration issue with the AI service. Please contact support.";
    }
    return "Something went wrong while analyzing your prompt. Please try again.";
  }

  if (err instanceof TypeError && /fetch|network/i.test(err.message)) {
    return "Network error — check your connection and try again.";
  }

  if (err instanceof Error && /network|offline/i.test(err.message)) {
    return "Network error — check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}

export function useToolRun<T>(toolId: string, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [result, setResult] = useState<Partial<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timedOutRef = useRef(false);

  const run = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      setStatus("streaming");
      setError(null);
      setResult(null);
      timedOutRef.current = false;

      const controller = new AbortController();
      abortRef.current = controller;
      let raw = "";

      const timeoutId = setTimeout(() => {
        timedOutRef.current = true;
        controller.abort();
      }, timeoutMs);

      try {
        await runTool(
          toolId,
          trimmed,
          (token) => {
            raw += token;
            const parsed = tryParsePartialJson<T>(raw);
            if (parsed) setResult(parsed);
          },
          controller.signal
        );
        setStatus("complete");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (timedOutRef.current) {
            setStatus("error");
            setError(getFriendlyErrorMessage(err, true));
          } else {
            // user-initiated stop — not an error
            setStatus("idle");
          }
          return;
        }
        setStatus("error");
        setError(getFriendlyErrorMessage(err, false));
        // eslint-disable-next-line no-console
        console.error(`[useToolRun:${toolId}]`, err);
      } finally {
        clearTimeout(timeoutId);
        abortRef.current = null;
      }
    },
    [toolId, timeoutMs]
  );

  const stop = useCallback(() => {
    timedOutRef.current = false; // explicit stop, not a timeout
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, run, stop, reset };
}