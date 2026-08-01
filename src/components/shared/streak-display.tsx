"use client";

import { XP_REWARDS } from "@/lib/xp";

interface StreakDisplayProps {
  streak: number;
  className?: string;
  compact?: boolean;
}

export function StreakDisplay({ streak, className = "", compact = false }: StreakDisplayProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="animate-flame text-sm">🔥</span>
        <span className="font-mono text-sm font-bold text-foreground">{streak}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="animate-flame text-3xl leading-none">🔥</span>
      <div>
        <p className="font-mono text-2xl font-bold text-foreground leading-none">
          {streak} <span className="text-base font-normal text-muted">day streak</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          {streak === 0
            ? "Start your streak today — log in daily."
            : `Keep it up! Tomorrow = +${XP_REWARDS.daily_login} XP`}
        </p>
      </div>
    </div>
  );
}
