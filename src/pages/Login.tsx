// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function AnimatedScore() {
  const [score, setScore] = useState(5);

  useEffect(() => {
    let current = 5;

    const interval = window.setInterval(() => {
      current += 1;

      if (current >= 90) {
        current = 90;
        window.clearInterval(interval);
      }

      setScore(current);
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  const getScoreStyle = () => {
    if (score <= 20) {
      return { color: "#ef4444", label: "Poor prompt" };
    }
    if (score <= 40) {
      return { color: "#f97316", label: "Needs improvement" };
    }
    if (score <= 60) {
      return { color: "#eab308", label: "Fair prompt" };
    }
    if (score <= 75) {
      return { color: "#22c55e", label: "Good prompt" };
    }
    return { color: "#6366f1", label: "Excellent prompt" };
  };

  const { color, label } = getScoreStyle();

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[5px] bg-white/5 text-xl font-bold backdrop-blur-sm transition-all duration-300"
        style={{
          borderColor: color,
          color,
          boxShadow: `0 0 18px ${color}55`,
        }}
        aria-label={`Prompt quality score ${score} out of 90`}
      >
        {score}
      </div>

      <div>
        <p className="font-semibold transition-colors duration-300" style={{ color }}>
          {label}
        </p>
        <p className="text-sm text-indigo-100">Clear goal, minor gaps</p>
      </div>
    </div>
  );
}

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle } = useAuth();

  const handleGuestLogin = async () => {
    try {
      setError(null);
      await loginAsGuest();
      navigate("/");
    } catch {
      setError("Couldn't start a guest session. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate("/");
    } catch {
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ece9f7] dark:bg-gray-950 px-4 py-8">
      <div className="grid w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-[28px] bg-white dark:bg-gray-900 shadow-[0_20px_60px_rgba(35,20,60,0.12)] md:grid-cols-2">

        {/* ================= LEFT: FORM ================= */}
        <section className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 text-2xl text-white"
            aria-hidden="true"
          >
            ✦
          </div>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-[#11101b] dark:text-gray-100 sm:text-4xl">
            Welcome to AI Prompt Studio
          </h1>

          <p className="mt-2 text-sm text-[#746a82] dark:text-gray-400">
            Sign in to access your prompt library, or continue as a guest.
          </p>

          {error && (
            <p className="mt-5 rounded-lg bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl border border-[#ddd8e7] dark:border-gray-700 bg-white dark:bg-gray-800
                px-5 py-3 text-sm font-semibold text-[#292331] dark:text-gray-100
                transition hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              "
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl border border-[#ddd8e7] dark:border-gray-700 bg-white dark:bg-gray-800
                px-5 py-3 text-sm font-semibold text-[#292331] dark:text-gray-100
                transition hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              "
            >
              <span aria-hidden="true">♙</span>
              Continue as guest
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-[#81768e] dark:text-gray-500">
            No account needed for guest mode. Your prompts stay on this device.
          </p>
        </section>

     {/* ================= RIGHT: HERO ================= */}
        <section className="relative hidden min-h-[480px] flex-col justify-between overflow-hidden rounded-r-[28px] bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#1e1b4b] px-8 py-10 md:flex sm:px-10">

          {/* Translucent vertical glass lines — subtler */}
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 3px, transparent 3px, transparent 18px)",
            }}
          />

          {/* Frosted glass overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0.15) 100%)",
              backdropFilter: "blur(0.5px)",
            }}
          />

          {/* Purple glow behind orb */}
          <div className="absolute left-1/2 top-[46%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 blur-[80px]" />

          {/* Fuchsia accent glow */}
          <div className="absolute right-[15%] top-[30%] h-40 w-40 rounded-full bg-fuchsia-500/25 blur-[60px]" />
          <div className="absolute left-[12%] bottom-[24%] h-32 w-32 rounded-full bg-indigo-400/20 blur-[50px]" />

          {/* Score card */}
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-200">
              PROMPT QUALITY SCORE
            </p>
            <p className="mt-4 text-lg font-semibold leading-7 text-white sm:text-xl">
              "Write a blog post about productivity for remote workers"
            </p>
            <div className="mt-5">
              <AnimatedScore />
            </div>
            <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
              ✓ Clear goal
            </div>
          </div>

          {/* AI Orb — shifted up ~24px */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div
              className="-mt-6 h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, rgba(196,181,253,0.7) 8%, rgba(139,92,246,0.85) 25%, rgba(109,40,217,0.9) 55%, rgba(46,16,101,0.95) 85%)",
                boxShadow:
                  "inset -14px -14px 40px rgba(0,0,0,0.5), inset 8px 8px 24px rgba(255,255,255,0.15), 0 0 70px rgba(139,92,246,0.55)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10 text-center">
            <p className="text-sm leading-6 text-violet-100">
              Analyze, optimize, and create better prompts with AI Prompt Studio.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.2-5.6l-6.6-5.4C29.6 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.7 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.4C41.7 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}