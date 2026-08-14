import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { AIOrb } from "../components/ui/AIOrb";

function AnimatedScore() {
  // unchanged — keep your existing AnimatedScore component as-is
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
    <main className="min-h-screen bg-[#f7f6fa] dark:bg-gray-900 px-4 py-5 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-8">
      <div className="w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#e7e1ef] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_20px_60px_rgba(35,20,60,0.10)]">

        <section className="relative min-h-[330px] overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#111827] px-7 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 top-[-100px] h-[500px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/20" />
            <div className="absolute left-[8%] top-[-120px] h-[540px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />
            <div className="absolute left-[22%] top-[-100px] h-[520px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />
            <div className="absolute right-[20%] top-[-100px] h-[520px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />
          </div>

          <div className="absolute right-[18%] top-[12%] h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="absolute right-[8%] top-[12%] hidden sm:block" aria-hidden="true">
            <AIOrb size={200} />
          </div>

          <div className="relative z-10 max-w-[430px]">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-200">
              PROMPT QUALITY SCORE
            </p>
            <p className="mt-4 text-lg font-semibold leading-7 text-white sm:text-xl">
              "Write a blog post about productivity for remote workers"
            </p>
            <div className="mt-5">
              <AnimatedScore />
            </div>
            <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
              ✓ Clear goal
            </div>
          </div>

          <div className="absolute bottom-7 right-8 z-10 max-w-[390px] text-right sm:right-10">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Every prompt, scored and sharpened
            </h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Analyze, optimize, and create better prompts with AI Prompt Studio.
            </p>
          </div>
        </section>

        <section className="px-6 py-9 sm:px-10 lg:px-16 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500" aria-hidden="true" />
            <span className="text-lg font-semibold text-[#171327] dark:text-gray-100">
              AI Prompt Studio
            </span>
          </div>

          <div className="mt-9">
            <h1 className="text-3xl font-bold tracking-tight text-[#11101b] dark:text-gray-100 sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#746a82] dark:text-gray-400 sm:text-base">
              Sign in to access your prompt library, or continue as a guest.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGuestLogin}
            className="
              mt-7 flex w-full items-center justify-center gap-2
              rounded-xl border border-[#ddd8e7] dark:border-gray-600 bg-white dark:bg-gray-900
              px-5 py-3 text-sm font-semibold text-[#292331] dark:text-gray-100
              transition hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              focus:ring-offset-2
            "
          >
            <span aria-hidden="true">♙</span>
            Continue as guest
          </button>

          <p className="mt-2 text-center text-xs text-[#81768e] dark:text-gray-500">
            No account needed. Your prompts stay on this device.
          </p>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e5dfeb] dark:bg-gray-700" />
            <span className="text-xs text-[#8a8096] dark:text-gray-500">or</span>
            <div className="h-px flex-1 bg-[#e5dfeb] dark:bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500
              px-5 py-3.5 text-sm font-bold text-white
              shadow-lg shadow-indigo-500/20
              transition hover:-translate-y-0.5
              hover:shadow-xl hover:shadow-indigo-500/25
              focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:ring-offset-2
            "
          >
            Sign in with Google
          </button>
        </section>
      </div>
    </main>
  );
}