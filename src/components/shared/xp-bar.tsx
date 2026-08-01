"use client";

import { motion } from "framer-motion";
import { getLevelInfo, getLevelProgress } from "@/lib/xp";

interface XpBarProps {
  xp: number;
  className?: string;
  showLabel?: boolean;
}

export function XpBar({ xp, className = "", showLabel = true }: XpBarProps) {
  const level = getLevelInfo(xp);
  const progress = getLevelProgress(xp);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Lv.{level.level} &mdash; {level.title}
          </span>
          <span className="font-mono text-xs text-muted">
            {xp.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted-bg">
        <motion.div
          className="h-full rounded-full xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <p className="text-[10px] text-muted">
          {level.max === Infinity
            ? "Max level reached 🎉"
            : `${(level.max - xp).toLocaleString()} XP to Level ${level.level + 1}`}
        </p>
      )}
    </div>
  );
}
