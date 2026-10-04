"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EngineerCard } from "@/components/shared/engineer-card";
import { XpBar } from "@/components/shared/xp-bar";
import { StreakDisplay } from "@/components/shared/streak-display";
import { ActivityHeatmap } from "@/components/shared/activity-heatmap";
import { BadgeItem } from "@/components/shared/badge-item";
import { BECBadgeIcon } from "@/components/shared/bec-badge-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, awardXP, getLevelInfo, getLevelProgress } from "@/lib/xp";
import { getStats, getProgress, getLocalDateString, ProgressStats, ProgressEntry } from "@/lib/progress";
import { ALL_BADGES, getBadgeById, RARITY_COLORS } from "@/lib/achievements";
import { UserXP, BadgeDefinition, ScoreResult } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { getUserAvatarUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  Share2,
  Code2,
  Zap,
  Award,
  Clock,
  X,
  Building2,
  GraduationCap,
  ShieldCheck,
  Check,
  ArrowRight,
  BarChart3,
  CalendarDays,
  BookOpen
} from "lucide-react";

const OFFER_OPTIONS = ["Actively Hunting", "Placed! 🎉", "Open to Work", "Not looking yet"];

// ── 7-day strip helper ──────────────────────────────────────────────────────
function buildWeekStrip(grindDates: Set<string>): { date: string; label: string; done: boolean }[] {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const label = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
    result.push({ date: dateStr, label, done: grindDates.has(dateStr) });
  }
  return result;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [scoreResult] = useLocalStorage<ScoreResult>("bec-score-result", {
    score: 42,
    riskLevel: "HIGH",
    careerType: "Tier-3 Engineering Student",
    roast: "",
    strengths: [],
    weaknesses: []
  });
  const [inputResult] = useLocalStorage<{ college: string; branch: string; github: string }>(
    "bec-assessment-input",
    { college: "", branch: "", github: "no" }
  );

  const [completedSlugs] = useLocalStorage<string[]>("bec-rwdsa-completed", []);
  const [offerStatus, setOfferStatus] = useState("Actively Hunting");

  // ── Unified Progress Stats (loaded on client only) ──
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    dsaSolved: 0,
    dsaByDifficulty: { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 },
    recentSolves: [],
    dailyCompletions: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXPEarned: 0,
    recent: [],
    // Legacy aliases
    totalXP: 0,
    streak: 0,
    dsaStats: { total: 0, Easy: 0, Medium: 0, Hard: 0 },
    dailyGrindCount: 0,
  });

  const [grindDaySet, setGrindDaySet] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load stats client-side (localStorage)
    const stats = getStats();
    setProgressStats(stats);

    // Build set of dates where daily-grind was completed (for 7-day strip)
    const log = getProgress();
    const dates = new Set(
      log
        .filter((e) => e.type === "daily-grind")
        .map((e) => {
          const d = new Date(e.completedAt);
          return getLocalDateString(d);
        })
    );
    setGrindDaySet(dates);
  }, []);

  // Badge Filter State & Selected Badge Modal
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [activeBadgeModal, setActiveBadgeModal] = useState<BadgeDefinition | null>(null);

  const unlockedBadgeIds = new Set(userXP.earnedBadgeIds);
  const levelInfo = getLevelInfo(userXP.total);
  const levelProgressPercent = getLevelProgress(userXP.total);

  const earnedBadges = ALL_BADGES.filter((b) => unlockedBadgeIds.has(b.id));
  const badgeEmojis = earnedBadges.map((b) => b.emoji);

  const filteredBadges = ALL_BADGES.filter((badge) => {
    if (selectedRarity === "all") return true;
    return badge.rarity === selectedRarity;
  });

  const weekStrip = buildWeekStrip(grindDaySet);

  const difficultyConfig = [
    { key: "Easy",   color: "bg-emerald-500", textColor: "text-emerald-600", label: "Easy" },
    { key: "Medium", color: "bg-amber-500",   textColor: "text-amber-600",   label: "Medium" },
    { key: "Hard",   color: "bg-rose-500",    textColor: "text-rose-600",    label: "Hard" },
    { key: "Unknown",color: "bg-slate-400",   textColor: "text-slate-500",   label: "Migrated" },
  ] as const;

  const totalDsaSolved = progressStats.dsaSolved;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none text-foreground">

      {/* ── 1. Unified Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldCheck size={13} className="text-amber-600" />
              <span>BEC Verified Passport</span>
            </span>
            <span className="text-xs text-muted font-mono">ID: {user?.uid?.slice(0, 8) || "BEC-ENG-2026"}</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            Engineer Profile &amp; Achievements
          </h1>
          <p className="text-xs text-muted max-w-xl leading-relaxed">
            Verified engineering identity, level progression, 365-day contribution record, and custom BEC crest badges.
          </p>
        </div>

        {/* Clean Rank Badge Pill */}
        <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2.5 rounded-xl shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center p-1 shrink-0">
            <img src="/berojgar-logo.png" alt="BEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-heading">{levelInfo.title}</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                Lvl {levelInfo.level}
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted">{userXP.total.toLocaleString()} Total XP</p>
          </div>
        </div>
      </div>

      {/* ── 2. Upper Primary Section: Card & Controls (Unified 2-Column Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Shareable Engineer Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-500" />
              <span>Verified Developer Identity</span>
            </h2>
            <span className="text-[11px] font-mono text-muted">Shareable Card</span>
          </div>

          <EngineerCard
            name={user?.displayName || "Anonymous Engineer"}
            photoUrl={getUserAvatarUrl(user)}
            college={inputResult.college || "Your College"}
            branch={inputResult.branch || "CSE"}
            xp={userXP.total}
            score={scoreResult.score || 0}
            streak={userXP.streak}
            badgeEmojis={badgeEmojis}
            offer={offerStatus !== "Actively Hunting" ? offerStatus : undefined}
          />
        </div>

        {/* Right Column: Unified Career Controls & XP Level Stats Panel */}
        <div className="lg:col-span-7 space-y-5 bg-white border border-border rounded-2xl p-6 shadow-xs">

          {/* Placement Status Selector */}
          <div className="space-y-2.5 pb-4 border-b border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted font-mono flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span>Current Placement Status</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {OFFER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setOfferStatus(opt)}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold font-mono transition-all ${
                    offerStatus === opt
                      ? "border-foreground bg-foreground text-white shadow-xs"
                      : "border-border bg-surface text-muted hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Level Progress Indicator */}
          <div className="space-y-2 pb-4 border-b border-border">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                <span>Level {levelInfo.level} Progression</span>
              </span>
              <span className="text-emerald-600">{levelProgressPercent}% to next rank</span>
            </div>
            <Progress value={levelProgressPercent} className="h-2.5" />
          </div>

          {/* Key Performance Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <p className="text-muted text-[10px] uppercase font-bold">Daily Streak</p>
              <p className="text-base font-bold text-foreground mt-0.5">{progressStats.currentStreak} Days 🔥</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <p className="text-muted text-[10px] uppercase font-bold">Solved Labs</p>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{progressStats.dsaSolved} Solved</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <p className="text-muted text-[10px] uppercase font-bold">Badges</p>
              <p className="text-base font-bold text-amber-600 mt-0.5">{unlockedBadgeIds.size} / {ALL_BADGES.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <p className="text-muted text-[10px] uppercase font-bold">BEC Score</p>
              <p className="text-base font-bold text-foreground mt-0.5">{scoreResult.score} / 100</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── 2.5 Coding Activity — DSA Lab Stats ── */}
      <section className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Code2 size={18} className="text-emerald-500" />
            <span>DSA Lab Progress</span>
          </h2>
          {totalDsaSolved > 0 && (
            <Link
              href="/real-world-dsa"
              className="flex items-center gap-1 text-xs font-bold font-mono text-muted hover:text-foreground transition-colors"
            >
              <span>View All Problems</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {totalDsaSolved === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center text-center py-10 space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-border text-emerald-500">
              <BookOpen size={32} />
            </div>
            <div>
              <p className="font-bold text-foreground font-heading">No DSA solves yet</p>
              <p className="text-xs text-muted mt-1 max-w-xs">
                Start solving real-world engineering problems to track your progress here.
              </p>
            </div>
            <Link href="/real-world-dsa">
              <Button variant="dark" size="sm" className="gap-1.5 text-xs font-bold">
                <span>Start your first lab</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total + Difficulty breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <p className="text-xs text-muted font-mono uppercase font-bold mb-1">Total Solved</p>
                <p className="text-2xl font-bold text-foreground">{totalDsaSolved}</p>
              </div>
              {difficultyConfig.map(({ key, textColor, label }) => (
                <div key={key} className="p-4 rounded-xl bg-surface border border-border text-center">
                  <p className="text-xs text-muted font-mono uppercase font-bold mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    {progressStats.dsaByDifficulty[key as keyof typeof progressStats.dsaByDifficulty]}
                  </p>
                </div>
              ))}
            </div>

            {/* Difficulty bars */}
            <div className="space-y-2">
              {difficultyConfig.map(({ key, color, label }) => {
                const count = progressStats.dsaByDifficulty[key as keyof typeof progressStats.dsaByDifficulty];
                const pct = totalDsaSolved > 0 ? Math.round((count / totalDsaSolved) * 100) : 0;
                if (count === 0) return null;
                return (
                  <div key={key} className="flex items-center gap-3 font-mono text-xs">
                    <span className="w-16 text-right text-muted">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-surface border border-border overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 font-bold text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* 5 most recent solves */}
            {progressStats.recentSolves.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  5 Most Recent Solves
                </h3>
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {progressStats.recentSolves.map((entry) => {
                    const dateStr = entry.completedAt === new Date(0).toISOString()
                      ? "Migrated"
                      : new Date(entry.completedAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        });
                    const diffColor =
                      entry.difficulty === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                      entry.difficulty === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
                      entry.difficulty === "Hard" ? "text-rose-600 bg-rose-50 border-rose-200" :
                      "text-slate-500 bg-slate-50 border-slate-200";
                    return (
                      <div key={entry.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-surface transition-colors">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <span className="text-xs font-semibold text-foreground">{entry.title}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          {entry.difficulty && (
                            <span className={`px-2 py-0.5 rounded border font-bold ${diffColor}`}>
                              {entry.difficulty}
                            </span>
                          )}
                          <span className="text-muted">{dateStr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 3. Daily Grind Streak Section ── */}
      <section className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Flame size={18} className="text-amber-500" />
            <span>Daily Grind Streak</span>
          </h2>
          <Link
            href="/daily-challenge"
            className="flex items-center gap-1 text-xs font-bold font-mono text-muted hover:text-foreground transition-colors"
          >
            <span>Go to Today&apos;s Grind</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {progressStats.dailyCompletions === 0 ? (
          <div className="flex flex-col items-center text-center py-10 space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-border text-amber-500">
              <Flame size={32} />
            </div>
            <div>
              <p className="font-bold text-foreground font-heading">No daily grinds completed yet</p>
              <p className="text-xs text-muted mt-1 max-w-xs">
                Complete the 5-part daily challenge to build your streak and earn +150 XP per day.
              </p>
            </div>
            <Link href="/daily-challenge">
              <Button variant="dark" size="sm" className="gap-1.5 text-xs font-bold">
                <span>Start today&apos;s challenge</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Streak metrics */}
            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-amber-700 text-[10px] uppercase font-bold mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-amber-700 flex items-center justify-center gap-1">
                  <Flame size={20} className="fill-amber-400 text-amber-500" />
                  {progressStats.currentStreak}
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">consecutive days</p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <p className="text-muted text-[10px] uppercase font-bold mb-1">Longest Streak</p>
                <p className="text-2xl font-bold text-foreground">{progressStats.longestStreak}</p>
                <p className="text-[10px] text-muted mt-0.5">days all-time</p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <p className="text-muted text-[10px] uppercase font-bold mb-1">Total Days</p>
                <p className="text-2xl font-bold text-foreground">{progressStats.dailyCompletions}</p>
                <p className="text-[10px] text-muted mt-0.5">grinds completed</p>
              </div>
            </div>

            {/* 7-day strip */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono flex items-center gap-1.5">
                <CalendarDays size={13} />
                <span>Last 7 Days</span>
              </h3>
              <div className="flex items-center gap-2">
                {weekStrip.map(({ date, label, done }) => (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                        done
                          ? "bg-amber-400 border-amber-500 text-white shadow-xs"
                          : "bg-surface border-border text-muted"
                      }`}
                    >
                      {done ? <Flame size={14} className="fill-white text-white" /> : <span className="text-[10px]">—</span>}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 4. Daily Grind & Contribution Heatmap ── */}
      <section>
        <ActivityHeatmap
          streak={progressStats.currentStreak || userXP.streak}
          totalXP={userXP.total}
          completedCount={progressStats.dsaSolved || completedSlugs.length}
          userXP={userXP}
        />
      </section>

      {/* ── 5. Achievements & Badges Showcase Grid ── */}
      <section className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span>Achievements &amp; BEC Crest Badges</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              {unlockedBadgeIds.size} of {ALL_BADGES.length} Badges Unlocked • Click any badge to view details &amp; perks
            </p>
          </div>

          {/* Rarity Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs bg-surface p-1 rounded-xl border border-border">
            {["all", "common", "rare", "epic", "legendary"].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  selectedRarity === rarity
                    ? "bg-foreground text-white shadow-xs"
                    : "text-muted hover:text-foreground hover:bg-white"
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.has(badge.id);

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveBadgeModal(badge)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center space-y-3 ${
                  isUnlocked
                    ? "bg-white border-border hover:border-foreground/40 shadow-2xs"
                    : "bg-surface/60 border-border/60 opacity-60 grayscale hover:opacity-100"
                }`}
              >
                {/* Badge Icon */}
                <div className="relative">
                  <BECBadgeIcon
                    id={badge.id}
                    rarity={badge.rarity}
                    unlocked={isUnlocked}
                    size="md"
                  />

                  {!isUnlocked && (
                    <div className="absolute -top-1 -right-1 p-1 rounded-full bg-foreground text-white text-[9px]">
                      <Lock size={10} />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div className="space-y-1">
                  <h3 className="font-heading text-xs font-bold text-foreground line-clamp-1">
                    {badge.name}
                  </h3>
                  <span
                    className={`inline-block text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      badge.rarity === "legendary"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : badge.rarity === "epic"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : badge.rarity === "rare"
                        ? "bg-sky-100 text-sky-900 border border-sky-300"
                        : "bg-slate-100 text-slate-800 border border-slate-300"
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-emerald-600 font-bold">
                  +{badge.xpReward} XP
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Badge Detail Preview Modal ── */}
      <AnimatePresence>
        {activeBadgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-border rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveBadgeModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-surface text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <BECBadgeIcon
                  id={activeBadgeModal.id}
                  rarity={activeBadgeModal.rarity}
                  unlocked={unlockedBadgeIds.has(activeBadgeModal.id)}
                  size="xl"
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {activeBadgeModal.name}
                  </h3>
                  <span
                    className={`inline-block text-xs font-mono font-bold uppercase px-3 py-0.5 rounded-full mt-1 ${
                      activeBadgeModal.rarity === "legendary"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : activeBadgeModal.rarity === "epic"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : activeBadgeModal.rarity === "rare"
                        ? "bg-sky-100 text-sky-900 border border-sky-300"
                        : "bg-slate-100 text-slate-800 border border-slate-300"
                    }`}
                  >
                    {activeBadgeModal.rarity} Badge
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {activeBadgeModal.description}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Status:</span>
                  <span className="font-bold text-foreground">
                    {unlockedBadgeIds.has(activeBadgeModal.id) ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Unlocked
                      </span>
                    ) : (
                      <span className="text-muted flex items-center gap-1">
                        <Lock size={13} /> Locked
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-muted">XP Reward:</span>
                  <span className="font-bold text-emerald-600">+{activeBadgeModal.xpReward} XP</span>
                </div>
                {activeBadgeModal.perk && (
                  <div className="flex justify-between items-start pt-2 border-t border-border">
                    <span className="text-muted shrink-0 mr-2">Exclusive BEC Perk:</span>
                    <span className="font-bold text-amber-600 text-right">{activeBadgeModal.perk}</span>
                  </div>
                )}
              </div>

              <Button
                variant="dark"
                className="w-full justify-center text-xs font-bold font-mono"
                onClick={() => setActiveBadgeModal(null)}
              >
                Close Preview
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. Recent Verified Activity Stream ── */}
      <section className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2 pb-3 border-b border-border">
          <Clock size={18} className="text-amber-500" />
          <span>Recent Verified Activity Stream</span>
        </h2>

        <div className="divide-y divide-border font-mono text-xs">
          {!(userXP.history && userXP.history.length > 0) ? (
            <div className="py-6 text-center text-muted">
              No activity recorded yet. Start solving problems or complete the assessment!
            </div>
          ) : (
            userXP.history.slice(0, 6).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-mono text-xs font-bold border border-emerald-200">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  +{item.xp} XP
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
