// src/pages/Login.tsx
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { AIOrb } from "../components/ui/AIOrb";

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
      return {
        color: "#ef4444",
        label: "Poor prompt",
      };
    }

    if (score <= 40) {
      return {
        color: "#f97316",
        label: "Needs improvement",
      };
    }

    if (score <= 60) {
      return {
        color: "#eab308",
        label: "Fair prompt",
      };
    }

    if (score <= 75) {
      return {
        color: "#22c55e",
        label: "Good prompt",
      };
    }

    return {
      color: "#6366f1",
      label: "Excellent prompt",
    };
  };

  const { color, label } = getScoreStyle();

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[5px] text-xl font-bold transition-all duration-300"
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
        <p
          className="font-semibold transition-colors duration-300"
          style={{ color }}
        >
          {label}
        </p>

        <p className="text-sm text-indigo-100">
          Clear goal, minor gaps
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    login();
    navigate("/");
  };

  const handleGuestLogin = () => {
    login();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f7f6fa] dark:bg-gray-900 px-4 py-5 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-8">
      <div className="w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#e7e1ef] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_20px_60px_rgba(35,20,60,0.10)]">

        {/* ================= HERO ================= */}
        <section className="relative min-h-[330px] overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#111827] px-7 py-8 sm:px-10">

          {/* Decorative waves */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 top-[-100px] h-[500px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/20" />

            <div className="absolute left-[8%] top-[-120px] h-[540px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />

            <div className="absolute left-[22%] top-[-100px] h-[520px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />

            <div className="absolute right-[20%] top-[-100px] h-[520px] w-[180px] rotate-[12deg] rounded-[50%] border border-indigo-300/15" />
          </div>

          {/* Glow */}
          <div className="absolute right-[18%] top-[12%] h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />

          {/* AI Orb — real component, not a static lookalike */}
          <div
            className="absolute right-[8%] top-[12%] hidden sm:block"
            aria-hidden="true"
          >
            <AIOrb size={200} />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-[430px]">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-200">
              PROMPT QUALITY SCORE
            </p>

            <p className="mt-4 text-lg font-semibold leading-7 text-white sm:text-xl">
              "Write a blog post about productivity for remote workers"
            </p>

            {/* Animated score */}
            <div className="mt-5">
              <AnimatedScore />
            </div>

            <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
              ✓ Clear goal
            </div>
          </div>

          {/* Hero message */}
          <div className="absolute bottom-7 right-8 z-10 max-w-[390px] text-right sm:right-10">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Every prompt, scored and sharpened
            </h2>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Analyze, optimize, and create better prompts with AI Prompt
              Studio.
            </p>
          </div>
        </section>

        {/* ================= LOGIN ================= */}
        <section className="px-6 py-9 sm:px-10 lg:px-16 lg:py-12">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500"
              aria-hidden="true"
            />

            <span className="text-lg font-semibold text-[#171327] dark:text-gray-100">
              AI Prompt Studio
            </span>
          </div>

          {/* Heading */}
          <div className="mt-9">
            <h1 className="text-3xl font-bold tracking-tight text-[#11101b] dark:text-gray-100 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#746a82] dark:text-gray-400 sm:text-base">
              Sign in to access your prompt library, or continue as a guest.
            </p>
          </div>

          {/* Guest */}
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

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e5dfeb] dark:bg-gray-700" />

            <span className="text-xs text-[#8a8096] dark:text-gray-500">
              or sign in with email
            </span>

            <div className="h-px flex-1 bg-[#e5dfeb] dark:bg-gray-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#22202b] dark:text-gray-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="
                  w-full rounded-xl border border-[#ddd8e7] dark:border-gray-600
                  bg-white dark:bg-gray-900 px-4 py-3 text-sm text-[#171327] dark:text-gray-100
                  outline-none transition
                  placeholder:text-[#aaa1b3] dark:placeholder:text-gray-500
                  focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500/20
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#22202b] dark:text-gray-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="
                    w-full rounded-xl border border-[#ddd8e7] dark:border-gray-600
                    bg-white dark:bg-gray-900 px-4 py-3 pr-12 text-sm text-[#171327] dark:text-gray-100
                    outline-none transition
                    placeholder:text-[#aaa1b3] dark:placeholder:text-gray-500
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    rounded-md p-1 text-[#8d8497] dark:text-gray-500
                    hover:text-indigo-600 dark:hover:text-indigo-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                  "
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#625a6b] dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="
                    h-4 w-4 rounded border-gray-300 dark:border-gray-600
                    text-indigo-600 focus:ring-indigo-500
                  "
                />

                Keep me signed in
              </label>

              <button
                type="button"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-pink-600 dark:hover:text-pink-400"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              className="
                w-full rounded-xl
                bg-gradient-to-r from-indigo-500 to-pink-500
                px-5 py-3.5 text-sm font-bold text-white
                shadow-lg shadow-indigo-500/20
                transition hover:-translate-y-0.5
                hover:shadow-xl hover:shadow-indigo-500/25
                focus:outline-none focus:ring-2
                focus:ring-indigo-500 focus:ring-offset-2
              "
            >
              Sign in
            </button>
          </form>

          {/* Create account */}
          <p className="mt-7 text-center text-sm text-[#746a82] dark:text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-pink-600 dark:hover:text-pink-400"
            >
              Create one
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}