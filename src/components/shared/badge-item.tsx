"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BadgeDefinition } from "@/types";
import { RARITY_COLORS } from "@/lib/achievements";
import { cn } from "@/lib/utils";

interface BadgeItemProps {
  badge: BadgeDefinition;
  unlocked?: boolean;
  showUnlockAnimation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BadgeItem({
  badge,
  unlocked = false,
  showUnlockAnimation = false,
  size = "md",
  className,
}: BadgeItemProps) {
  const sizeClasses = {
    sm: "h-10 w-10 text-lg",
    md: "h-14 w-14 text-2xl",
    lg: "h-18 w-18 text-3xl",
  };

  const rarityClass = RARITY_COLORS[badge.rarity];

  return (
    <AnimatePresence>
      <motion.div
        key={badge.id}
        className={cn("flex flex-col items-center gap-1.5 text-center", className)}
        initial={showUnlockAnimation ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-[12px] border transition-all duration-200",
            sizeClasses[size],
            unlocked
              ? `${rarityClass} border-current/20`
              : "bg-muted-bg border-border text-muted/30 grayscale opacity-50",
          )}
          title={unlocked ? badge.description : "Locked — keep going"}
        >
          <span className={unlocked ? "" : "blur-[1px]"}>{badge.emoji}</span>
          {!unlocked && (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted/60 font-bold">
              🔒
            </span>
          )}
          {unlocked && showUnlockAnimation && (
            <motion.div
              className="absolute -inset-1 rounded-[14px] border-2 border-brand"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.15, 1.05] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </div>
        <div className="max-w-[80px]">
          <p className={cn("text-[10px] font-semibold leading-tight", unlocked ? "text-foreground" : "text-muted/50")}>
            {badge.name}
          </p>
          {unlocked && (
            <p className="mt-0.5 text-[9px] text-muted uppercase tracking-wide">
              +{badge.xpReward} XP
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
