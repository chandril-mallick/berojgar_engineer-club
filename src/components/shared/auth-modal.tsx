"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, KeyRound, User as UserIcon, ShieldAlert, Sparkles, LogIn } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) throw new Error("Please enter your display name.");
        await signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      const msg = err?.message || "Authentication failed. Check credentials and try again.";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        setError("Invalid email or password.");
      } else if (msg.includes("auth/email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("auth/weak-password")) {
        setError("Password should be at least 6 characters long.");
      } else {
        setError(msg.replace("Firebase: ", ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in window was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Domain unauthorized in Firebase Console. Add 'localhost' under Authentication -> Settings -> Authorized Domains.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Google Sign-In is not enabled in Firebase Console (Authentication -> Sign-in method -> Google).");
      } else if (code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using another sign-in method (e.g. GitHub or Email). Please sign in using your original method.");
      } else {
        setError(err?.message?.replace("Firebase: ", "") || "Google Sign-In failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGithub();
    } catch (err: any) {
      console.error("GitHub login error:", err);
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in window was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Domain unauthorized in Firebase Console. Add 'localhost' under Authentication -> Settings -> Authorized Domains.");
      } else if (code === "auth/operation-not-allowed") {
        setError("GitHub Sign-In is not enabled in Firebase Console (Authentication -> Sign-in method -> GitHub).");
      } else if (code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using another sign-in method (e.g. Google or Email). Please sign in using your original method.");
      } else {
        setError(err?.message?.replace("Firebase: ", "") || "GitHub Sign-In failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAsGuest();
    } catch (err: any) {
      setError("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 rounded-full p-1 text-muted hover:bg-slate-100 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header Banner */}
          <div className="text-center space-y-1">
            <div className="relative inline-flex h-14 w-14 overflow-hidden rounded-full border-2 border-brand bg-white p-1 shadow-md mb-2">
              <img
                src="/berojgar-logo.png"
                alt="Berojgar Engineer Club Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground">Welcome to Berojgar Engineer Club</h3>
            <p className="text-xs text-muted leading-relaxed px-2">
              {authModalReason || "Authentication is required to enter tasks, submit code, or record work on Berojgar Engineer Club."}
            </p>
          </div>

          {/* Google & GitHub OAuth Options */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full justify-center gap-2 border-border text-foreground hover:bg-slate-50 font-semibold text-xs h-10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleGithub}
                disabled={loading}
                className="w-full justify-center gap-2 border-border text-foreground hover:bg-slate-50 font-semibold text-xs h-10"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-muted uppercase tracking-wider">
              Or with Email
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">Full Name</label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3 top-2.5 text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="email"
                  required
                  placeholder="engineer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">Password</label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="dark"
              size="md"
              disabled={loading}
              className="w-full justify-center gap-2 mt-2 h-10 text-xs font-bold"
            >
              <LogIn size={15} />
              {loading
                ? "Authenticating..."
                : mode === "signin"
                ? "Sign In & Unlock Work Entry"
                : "Create Account & Start"}
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center pt-1 border-t border-border">
            {mode === "signin" ? (
              <p className="text-xs text-muted">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="font-bold text-foreground hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-muted">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="font-bold text-foreground hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
