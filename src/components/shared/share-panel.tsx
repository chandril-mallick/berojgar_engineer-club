"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SharePanelProps {
  score: number;
  roast?: string;
  className?: string;
}

export function SharePanel({ score, roast, className = "" }: SharePanelProps) {
  const [copied, setCopied] = useState(false);

  const defaultRoast = roast || "One focused sprint away from becoming HR's favorite candidate.";

  const shareText = `🎓 Berojgar Score: ${score}/100 💀\n\nAI Roast: "${defaultRoast}"\n\nAre you employable or cooked? Check your score now at https://berojgarengineer.club #BerojgarEngineerClub`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (typeof window !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Berojgar Engineer Club - Reality Check",
          text: shareText,
          url: "https://berojgarengineer.club",
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Score card preview */}
      <div className="relative overflow-hidden rounded-[14px] border border-border bg-foreground p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
            MY BEROJGAR SCORE
          </p>
          <Sparkles size={14} className="text-amber-400" />
        </div>
        <p className="font-mono text-4xl font-black text-brand mt-1">
          {score}<span className="text-xl text-white/40">/100</span>
        </p>
        <p className="mt-1.5 text-xs text-white/70 italic leading-relaxed">&ldquo;{defaultRoast}&rdquo;</p>
        <p className="mt-2 text-[10px] text-brand/90 font-medium">Can you beat me? berojgarengineer.club</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 border border-border text-xs font-bold h-10 hover:bg-slate-50"
          onClick={copyLink}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 text-emerald-600"
              >
                <Check size={14} /> Copied to Clipboard!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy size={14} /> Copy Score Badge Text
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 border border-border text-xs font-bold h-10 hover:bg-slate-50"
          onClick={nativeShare}
        >
          <Share2 size={14} /> Share
        </Button>
      </div>
    </div>
  );
}
