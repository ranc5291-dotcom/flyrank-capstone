// src/components/ui/AIOrb.tsx
//
// A small, self-contained ambient orb — matches the app's existing
// indigo→pink brand gradient at rest, shifts to a warm amber→coral
// gradient while `thinking` is true. Tilts gently toward the pointer;
// falls back to a static glow with no tilt on touch devices and for
// prefers-reduced-motion, since neither can sustain hover.
//
// Usage: <AIOrb thinking={isSending} size={72} />
// Wire `thinking` to whatever your loading/sending state already is —
// e.g. `isSending` from useChat(), or `status === "streaming"` from
// useToolRun().

import { useEffect, useRef, useState } from "react";

interface AIOrbProps {
  thinking?: boolean;
  size?: number; // px, defaults to 64
  className?: string;
}

const STYLE_ID = "ai-orb-styles";

function ensureStylesInjected() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes ai-orb-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes ai-orb-pulse {
      0%, 100% { opacity: 0.85; }
      50% { opacity: 1; }
    }
    .ai-orb-core {
      animation: ai-orb-rotate 22s linear infinite;
    }
    .ai-orb-core--thinking {
      animation-duration: 7s;
    }
    .ai-orb-glow--thinking {
      animation: ai-orb-pulse 1.6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .ai-orb-core {
        animation: none;
      }
      .ai-orb-glow--thinking {
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);
}

export function AIOrb({ thinking = false, size = 64, className = "" }: AIOrbProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    ensureStylesInjected();
    setSupportsHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!supportsHover) return;

    const el = wrapperRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Distance from the orb's own center, normalized and clamped —
      // reacts to mouse movement anywhere on screen, not just on hover,
      // for an ambient "aware" feel rather than a hover-only trick.
      const maxDistance = 400;
      const dx = Math.max(-maxDistance, Math.min(maxDistance, e.clientX - cx));
      const dy = Math.max(-maxDistance, Math.min(maxDistance, e.clientY - cy));

      const maxTiltDeg = 14;
      setTilt({
        x: (dy / maxDistance) * -maxTiltDeg,
        y: (dx / maxDistance) * maxTiltDeg,
      });
    };

    const handlePointerLeaveWindow = () => setTilt({ x: 0, y: 0 });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeaveWindow);
    };
  }, [supportsHover]);

  const idleGradient =
    "conic-gradient(from 180deg, #4f46e5, #7c3aed, #db2777, #7c3aed, #4f46e5)";
  const thinkingGradient =
    "conic-gradient(from 180deg, #f59e0b, #f97316, #ec4899, #f97316, #f59e0b)";

  return (
    <div
      ref={wrapperRef}
      role="img"
      aria-label={thinking ? "AI is thinking" : "AI orb"}
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 400,
      }}
    >
      <div
        className={`relative w-full h-full rounded-full transition-transform duration-300 ease-out ${
          thinking ? "ai-orb-glow--thinking" : ""
        }`}
        style={{
          transform: supportsHover
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : undefined,
          boxShadow: thinking
            ? "0 0 24px 4px rgba(249, 115, 22, 0.45)"
            : "0 0 18px 2px rgba(99, 102, 241, 0.35)",
        }}
      >
        {/* Rotating gradient core */}
        <div
          className={`ai-orb-core ${thinking ? "ai-orb-core--thinking" : ""} absolute inset-0 rounded-full transition-[background] duration-700`}
          style={{ background: thinking ? thinkingGradient : idleGradient }}
        />

        {/* Glassy highlight — fixed position, gives the sphere its "material" feel */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "12%",
            left: "18%",
            width: "35%",
            height: "35%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        {/* Inner shadow ring for depth */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.18)" }}
        />
      </div>
    </div>
  );
}