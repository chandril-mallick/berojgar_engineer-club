"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2, Check, Copy, Sparkles } from "lucide-react";

interface SocialShareModalProps {
  score?: number;
  rank?: number;
  college?: string;
  placedCompany?: string;
}

export function SocialShareModal({
  score = 38,
  rank = 3,
  college = "Brainware University",
  placedCompany = "TCS Digital",
}: SocialShareModalProps) {
  const [template, setTemplate] = useState<"score" | "rank" | "placed" | "streak">("score");
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    if (template === "score") {
      return `🔥 I reduced my Berojgar Score to ${score}/100 on BEROJGAR ENGINEER CLUB! Can you beat me?\n\nCheck yours free at berojgarengineer.club`;
    }
    if (template === "rank") {
      return `🏆 Ranked #${rank} in Computer Science at ${college} on BEROJGAR ENGINEER CLUB!\n\nJoin the board at berojgarengineer.club`;
    }
    if (template === "placed") {
      return `🚀 Got placed at ${placedCompany}! Huge thanks to the BEROJGAR ENGINEER CLUB community for the daily DSA sprints and resume roast.`;
    }
    return `⭐ Completed 100 Day Coding Streak on BEROJGAR ENGINEER CLUB! Consistency > Luck.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[16px] border border-border bg-white p-6 shadow-xs space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <Share2 size={16} className="text-brand" /> Generate Viral Share Card
        </h3>
      </div>

      {/* Template Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setTemplate("score")}
          className={`p-2 rounded-[8px] border text-xs font-semibold transition-colors ${
            template === "score" ? "bg-foreground text-white border-foreground" : "bg-surface text-muted"
          }`}
        >
          Berojgar Score Card
        </button>
        <button
          onClick={() => setTemplate("rank")}
          className={`p-2 rounded-[8px] border text-xs font-semibold transition-colors ${
            template === "rank" ? "bg-foreground text-white border-foreground" : "bg-surface text-muted"
          }`}
        >
          College Rank Card
        </button>
        <button
          onClick={() => setTemplate("placed")}
          className={`p-2 rounded-[8px] border text-xs font-semibold transition-colors ${
            template === "placed" ? "bg-foreground text-white border-foreground" : "bg-surface text-muted"
          }`}
        >
          Offer Celebration
        </button>
        <button
          onClick={() => setTemplate("streak")}
          className={`p-2 rounded-[8px] border text-xs font-semibold transition-colors ${
            template === "streak" ? "bg-foreground text-white border-foreground" : "bg-surface text-muted"
          }`}
        >
          100 Day Streak
        </button>
      </div>

      {/* Visual Preview Card */}
      <div className="rounded-[14px] border border-border bg-slate-950 p-6 text-white space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-brand">BEROJGAR ENGINEER CLUB</span>
          <span className="text-xs text-white/50 font-mono">berojgarengineer.club</span>
        </div>

        {template === "score" && (
          <div>
            <p className="text-xs text-white/70">My Berojgar Score</p>
            <p className="font-mono text-4xl font-bold text-emerald-400 mt-1">{score}<span className="text-xl text-white/40">/100</span></p>
            <p className="text-xs text-white/60 mt-2">Passed reality check. Recruiters, my DMs are open!</p>
          </div>
        )}

        {template === "rank" && (
          <div>
            <p className="text-xs text-white/70">College Leaderboard Rank</p>
            <p className="font-mono text-3xl font-bold text-amber-400 mt-1">Rank #{rank}</p>
            <p className="text-xs text-white/60 mt-1">{college} &middot; Computer Science</p>
          </div>
        )}

        {template === "placed" && (
          <div>
            <p className="text-xs text-white/70">Status Update</p>
            <p className="font-heading text-2xl font-bold text-emerald-400 mt-1">OFFER ACCEPTED 🎉</p>
            <p className="text-xs text-white/80 mt-1">Software Engineer @ {placedCompany}</p>
          </div>
        )}

        {template === "streak" && (
          <div>
            <p className="text-xs text-white/70">Streak Achievement</p>
            <p className="font-mono text-3xl font-bold text-amber-400 mt-1">⚡ 100 DAY STREAK</p>
            <p className="text-xs text-white/60 mt-1">100 consecutive days of DSA & Aptitude practice.</p>
          </div>
        )}
      </div>

      {/* Social Platforms */}
      <div className="flex gap-2">
        <Button variant="dark" size="sm" onClick={handleCopy} className="flex-1 gap-2 text-xs">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied to Clipboard!" : "Copy Share Text"}
        </Button>
      </div>
    </div>
  );
}
