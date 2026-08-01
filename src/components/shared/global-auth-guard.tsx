"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Lock, ShieldAlert, Sparkles, LogIn, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Public routes accessible without login (only home page)
const PUBLIC_ROUTES = ["/"];

export function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, openAuthModal } = useAuth();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      openAuthModal(`Strict Access Guard: You must be logged in to access ${getSectionTitle(pathname)}.`);
    }
  }, [pathname, user, loading, isPublic, openAuthModal]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
        <p className="text-xs font-semibold text-muted">Checking authentication status...</p>
      </div>
    );
  }

  // If user is not logged in and route is protected, show Lock Screen
  if (!user && !isPublic) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-lg my-12 text-center p-8 rounded-2xl border border-amber-300 bg-amber-50/60 shadow-lg space-y-5"
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
          <Lock size={28} />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/70 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            <ShieldAlert size={13} /> Strict Access Lock
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Login Required for {getSectionTitle(pathname)}
          </h2>
          <p className="text-xs text-muted leading-relaxed px-4">
            You cannot enter or view this section without logging in. Please sign in to unlock Berojgar Engineer Club features and sync your progress to Firebase.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="dark"
            size="md"
            onClick={() =>
              openAuthModal(`Sign in required to access ${getSectionTitle(pathname)}.`)
            }
            className="w-full sm:w-auto gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black border-none h-10 px-6 shadow-md"
          >
            <LogIn size={15} />
            <span>Sign In to Unlock Section</span>
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto gap-1.5 text-xs text-muted hover:text-foreground h-10"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Button>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

function getSectionTitle(path: string): string {
  switch (path) {
    case "/tasks":
      return "Task Manager";
    case "/assessment":
      return "Reality Check Assessment";
    case "/colleges":
      return "College Rankings";
    case "/companies":
      return "Company Prep Hub";
    case "/hackathons":
      return "Hackathons & Contests";
    case "/referrals":
      return "Referral Marketplace";
    case "/projects":
      return "Project Showcase";
    case "/daily-challenge":
      return "Daily Coding Challenge";
    case "/study-groups":
      return "Study Groups & Audio Rooms";
    case "/memes":
      return "Memes & Stories";
    case "/leaderboard":
      return "Leaderboard & Rankings";
    case "/ai-coach":
      return "AI Career Coach";
    case "/dashboard":
      return "Career Dashboard";
    case "/score":
      return "Berojgar Score";
    case "/profile":
      return "User Profile";
    default:
      return "this section";
  }
}
