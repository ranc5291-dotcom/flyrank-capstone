// src/components/ui/Toast.tsx
//
// Minimal, dependency-free toast. No app-wide provider needed — any
// component calls useToast() and renders <Toast .../> once. If you
// later want toasts triggerable from anywhere (not just the component
// that owns the state), this is the piece to lift into a context.

import { useCallback, useEffect, useState } from "react";

interface ToastState {
  message: string;
  tone: "success" | "error";
}

export function useToast(durationMs = 2500) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(t);
  }, [toast, durationMs]);

  const showToast = useCallback((message: string, tone: ToastState["tone"] = "success") => {
    setToast({ message, tone });
  }, []);

  return { toast, showToast };
}

export function Toast({ toast }: { toast: { message: string; tone: "success" | "error" } | null }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2">
      <div
        className={[
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg",
          toast.tone === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white",
        ].join(" ")}
      >
        <span>{toast.tone === "success" ? "✅" : "⚠️"}</span>
        {toast.message}
      </div>
    </div>
  );
}