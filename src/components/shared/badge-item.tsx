"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BadgeDefinition } from "@/types";
import { BECBadgeIcon } from "./bec-badge-icon";
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
  return (
    <AnimatePresence>
      <motion.div
        key={badge.id}
        className={cn("flex flex-col items-center gap-1.5 text-center group cursor-pointer", className)}
        initial={showUnlockAnimation ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <div className="relative">
          <BECBadgeIcon
            id={badge.id}
            rarity={badge.rarity}
            unlocked={unlocked}
            size={size}
          />
          {unlocked && showUnlockAnimation && (
            <motion.div
              className="absolute -inset-1.5 rounded-full border-2 border-amber-500 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.05] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </div>

        <div className="max-w-[90px]">
          <p className={cn("text-[10px] font-bold leading-tight line-clamp-1 font-heading", unlocked ? "text-foreground" : "text-muted/60")}>
            {badge.name}
          </p>
          <span className="mt-0.5 text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-wide">
            +{badge.xpReward} XP
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
