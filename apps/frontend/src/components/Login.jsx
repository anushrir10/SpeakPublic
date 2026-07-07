import { useState } from "react";
import { useLearning } from "../context/LearningContext";
import { BookOpen, Key, User, Question } from "@phosphor-icons/react";
import { SmoothInput } from "./SmoothInput";
import ThemeToggle from "./ThemeToggle";

// Conditionally import Clerk's SignIn component
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkAvailable = Boolean(clerkKey) && !clerkKey.includes("REPLACE_WITH");

let ClerkSignIn = null;
if (isClerkAvailable) {
  try {
    const clerk = await import("@clerk/clerk-react");
    ClerkSignIn = clerk.SignIn;
  } catch {
    // Clerk not available
  }
}

export default function Login() {
  const { login, isClerkMode } = useLearning();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hint, setHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }
    login(username, password);
  };

  return (
    <div className="min-h-screen w-full flex relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle start="top-right" />
      </div>
      {/* LEFT: illustration hero panel */}
      <div
        className="hidden lg:flex relative w-1/2 flex-col justify-between overflow-hidden"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 0%, rgba(217,119,87,0.18) 0%, rgba(217,119,87,0) 55%), linear-gradient(160deg, #1E3E39 0%, #142A2C 50%, #0F1B24 100%)"
        }}
      >
        <div className="grain-dark"></div>

        {/* Brand + headline */}
        <div className="relative z-10 p-10 xl:p-14 animate-fade-up">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 rounded-2xl bg-clay flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" weight="duotone" />
            </div>
            <span className="text-2xl font-heading text-white tracking-tight">FixIt</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-heading text-white leading-[1.1] tracking-tight max-w-md">
            Your study desk,{" "}
            <span className="text-clay">reimagined.</span>
          </h2>
          <p className="text-[15px] text-white/70 font-body mt-5 max-w-sm leading-relaxed">
            Read your textbooks, turn any line into a flashcard, and check yourself with quick quizzes — all in one calm space.
          </p>
        </div>

        {/* Illustration anchored to the bottom */}
        <img
          src="/login-hero.png"
          alt="Two students studying together at a desk"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="relative z-10 w-[92%] max-w-xl mx-auto mt-auto object-contain select-none pointer-events-none drop-shadow-2xl animate-fade-up"
          draggable="false"
        />
      </div>

      {/* RIGHT: form panel */}
      <div className="flex-1 flex items-center justify-center p-6 desk-wood relative overflow-hidden select-none">
        <div className="grain-overlay"></div>

        <div className="w-full max-w-md relative z-10 animate-fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="w-14 h-14 rounded-2xl bg-clay-tint border border-[#F0D8CC] flex items-center justify-center shadow-sm animate-float">
                <BookOpen className="w-7 h-7 text-clay" weight="duotone" />
              </div>
            </div>
            <h1 className="text-3xl font-heading text-[#1F1E1D] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-ink-soft font-body mt-2">
              {isClerkMode
                ? "Sign in with your account to access your study desk."
                : "Sign in to assemble your study desk and curriculum shelf."}
            </p>
          </div>

          {/* Clerk mode → render Clerk's <SignIn /> */}
          {isClerkMode && ClerkSignIn ? (
            <div className="flex justify-center">
              <ClerkSignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border border-[#E6E2D6] rounded-2xl bg-white",
                    headerTitle: "font-heading text-[#1F1E1D]",
                    headerSubtitle: "font-body text-ink-soft",
                    formButtonPrimary: "bg-clay hover:bg-clay-dark text-white font-body font-semibold",
                    formFieldInput: "border-[#E6E2D6] font-body",
                    footerActionLink: "text-clay hover:text-clay-dark",
                  },
                }}
              />
            </div>
          ) : (
            /* Fallback mode → original manual form */
            <>
              {error && (
                <div className="mb-4 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center font-medium animate-fade-in">
                  {error}
                </div>
              )}
              {hint && (
                <div className="mb-4 p-2.5 text-xs text-clay-dark bg-clay-tint border border-[#F0D8CC] rounded-lg text-center font-medium animate-fade-in">
                  Authentication is simulated — any username and password will work.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-1.5 font-body">
                    Student Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
                    <SmoothInput
                      id="login-username"
                      type="text"
                      placeholder="Enter your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-1.5 font-body">
                    Access Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
                    <SmoothInput
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  className="w-full py-3 mt-2 font-body font-semibold tracking-wide text-sm tactile-btn-primary"
                >
                  Enter Study Desk
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#E6E2D6] flex justify-between items-center text-xs text-ink-soft font-body">
                <button
                  type="button"
                  onClick={() => setHint((v) => !v)}
                  className="hover:text-clay transition flex items-center gap-1 cursor-pointer"
                >
                  <Question className="w-3.5 h-3.5" />
                  Forgotten login?
                </button>
                <span className="text-stone-400">Classrooms 2026</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
