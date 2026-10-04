"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XpBar } from "@/components/shared/xp-bar";
import { StreakDisplay } from "@/components/shared/streak-display";
import { BadgeItem } from "@/components/shared/badge-item";
import { SharePanel } from "@/components/shared/share-panel";
import { PLACEMENT_TRENDS } from "@/lib/constants";
import { DAILY_CHALLENGE_POOL } from "@/lib/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, processLogin, awardXP } from "@/lib/xp";
import { ALL_BADGES } from "@/lib/achievements";
import { UserXP } from "@/types";
import { Target, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

// Today's challenge — deterministic based on day of year
const todayChallenge =
  DAILY_CHALLENGE_POOL[new Date().getDate() % DAILY_CHALLENGE_POOL.length];

const CATEGORY_EMOJI: Record<string, string> = {
  dsa: "🧠",
  project: "🛠️",
  interview: "🎤",
  networking: "🤝",
  resume: "📄",
};

export default function DashboardPage() {
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [challengeDone, setChallengeDown] = useState(false);

  const [scoreResult] = useLocalStorage<{ score: number }>("bec-score-result", { score: 38 });
  const [resumeResult] = useLocalStorage<{ atsScore: number }>("bec-resume-score", { atsScore: 52 });
  const score = scoreResult?.score ?? 38;
  const resume = resumeResult?.atsScore ?? 52;


  // Process login streak on mount
  useEffect(() => {
    const { xp } = processLogin(userXP);
    setUserXP(xp);

    // Check if today's challenge was already completed
    const today = new Date().toISOString().slice(0, 10);
    const doneKey = `bec-challenge-${today}`;
    if (window.localStorage.getItem(doneKey) === todayChallenge.id) {
      queueMicrotask(() => setChallengeDown(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeChallenge = () => {
    if (challengeDone) return;
    const today = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem(`bec-challenge-${today}`, todayChallenge.id);
    const updated = awardXP("challenge_complete", userXP);
    setUserXP(updated);
    setChallengeDown(true);
  };

  const unlockedBadgeIds = new Set(userXP.earnedBadgeIds);

  return (
    <div className="space-y-12">
      {/* ── Page header + XP ── */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Mission Control</p>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-1">
              Your Career Dashboard
            </h1>
          </div>
          <StreakDisplay streak={userXP.streak} compact />
        </div>
        <div className="mt-4 max-w-sm">
          <XpBar xp={userXP.total} />
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Berojgar Score™
          </p>
          <p className="mt-2 font-mono text-4xl font-bold text-foreground">{score}</p>
          <p className="mt-0.5 text-xs text-muted">out of 100</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Resume ATS
          </p>
          <p className="mt-2 font-mono text-4xl font-bold text-foreground">{resume}</p>
          <p className="mt-0.5 text-xs text-muted">out of 100</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Momentum
          </p>
          <div className="mt-2 flex items-end gap-1.5">
            <p className="font-mono text-4xl font-bold text-foreground">+18%</p>
            <TrendingUp size={14} className="text-success mb-1.5" />
          </div>
          <p className="mt-0.5 text-xs text-muted">this week</p>
        </Card>
      </section>

      {/* ── Progress Chart ── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Progress This Week</h2>
          <span className="text-xs text-muted">Employability score</span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PLACEMENT_TRENDS} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="becTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="score" stroke="#0a0a0a" strokeWidth={1.5} fill="url(#becTrend)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Today's Challenge ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Target size={14} className="text-muted" />
          <h2 className="text-sm font-semibold text-foreground">Today&apos;s Challenge</h2>
          <span className="ml-auto text-xs text-muted font-mono">+{todayChallenge.xpReward} XP</span>
        </div>
        <div className="flex items-start gap-4 rounded-[10px] border border-border p-4">
          <span className="text-2xl mt-0.5 shrink-0">
            {CATEGORY_EMOJI[todayChallenge.category]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{todayChallenge.title}</p>
            <p className="mt-1 text-xs text-muted leading-5">{todayChallenge.description}</p>
          </div>
          <Button
            size="sm"
            variant={challengeDone ? "ghost" : "dark"}
            className="shrink-0"
            onClick={completeChallenge}
            disabled={challengeDone}
          >
            {challengeDone ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                ✓ Done
              </motion.span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Zap size={13} /> Complete
              </span>
            )}
          </Button>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Badges ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-foreground">Achievements</h2>
          <a href="/achievements" className="text-xs text-muted hover:text-foreground transition-colors">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12">
          {ALL_BADGES.slice(0, 12).map((badge) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              unlocked={unlockedBadgeIds.has(badge.id)}
              size="sm"
            />
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Share ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Share Your Score</h2>
        <div className="max-w-sm">
          <SharePanel score={score} />
        </div>
      </section>
    </div>
  );
}
