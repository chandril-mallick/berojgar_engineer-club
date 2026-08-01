"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XpBar } from "@/components/shared/xp-bar";
import { StreakDisplay } from "@/components/shared/streak-display";
import { BadgeItem } from "@/components/shared/badge-item";
import { ALL_BADGES } from "@/lib/achievements";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  DEFAULT_USER_XP,
  XP_REWARDS,
  getLevelInfo,
  processLogin,
  LEVEL_PERKS,
  claimPerk,
  awardXP,
} from "@/lib/xp";
import { UserXP, BadgeDefinition } from "@/types";
import {
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Unlock,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RARITY_ORDER = ["legendary", "epic", "rare", "common"] as const;

const QUEST_LINKS: Record<string, { href: string; label: string }> = {
  assessment_complete: { href: "/assessment", label: "Take Assessment" },
  resume_upload: { href: "/resume", label: "Roast Resume" },
  daily_login: { href: "#daily-claim", label: "Check-in Daily" },
  challenge_complete: { href: "/daily-challenge", label: "Solve Challenge" },
  github_connect: { href: "/profile", label: "Connect GitHub" },
  linkedin_connect: { href: "/profile", label: "Connect LinkedIn" },
  mock_interview: { href: "/ai-coach", label: "Start Mock SDE Drill" },
  referral: { href: "/referrals", label: "Refer Friends" },
  resume_improved: { href: "/resume", label: "Re-Score ATS Resume" },
};

export default function AchievementsPage() {
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [claimedPerkToast, setClaimedPerkToast] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [claimAnimation, setClaimAnimation] = useState(false);

  const level = getLevelInfo(userXP.total);
  const unlockedIds = new Set(userXP.earnedBadgeIds);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isClaimedToday = userXP.lastLoginDate === todayStr;

  // Sort badges: unlocked first, then rarity
  const sortedBadges = [...ALL_BADGES].sort((a, b) => {
    const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
    const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
    if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
    return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
  });

  const unlockedCount = sortedBadges.filter((b) => unlockedIds.has(b.id)).length;

  // Handle 1-click Daily Check-In
  const handleDailyCheckIn = () => {
    if (isClaimedToday) return;
    const res = processLogin(userXP);
    setUserXP(res.xp);
    setClaimAnimation(true);
    setTimeout(() => setClaimAnimation(false), 2000);
  };

  // Handle claiming Level Perk
  const handleClaimPerk = (perkId: string, code?: string) => {
    const updated = claimPerk(perkId, userXP);
    setUserXP(updated);
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(perkId);
      setTimeout(() => setCopiedCode(null), 3000);
    }
    setClaimedPerkToast(perkId);
    setTimeout(() => setClaimedPerkToast(null), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-12">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award size={15} className="text-amber-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Gamification Hub</p>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Badges, XP & Level Rewards
        </h1>
        <p className="mt-1 text-sm text-muted">
          Earn XP by leveling up your engineering portfolio, maintaining daily login streaks, and unlocking exclusive perks.
        </p>
      </div>

      {/* ── Level + XP Hero Banner ── */}
      <section className="relative overflow-hidden rounded-[20px] border border-border bg-linear-to-br from-neutral-900 via-neutral-950 to-black p-6 text-white shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-brand font-heading text-3xl font-black text-black shadow-md border border-amber-300">
              {level.level}
              <Sparkles size={14} className="absolute -top-1 -right-1 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-[10px] uppercase font-mono tracking-wider text-amber-950 bg-amber-300">
                  Level {level.level}
                </Badge>
                <span className="text-xs font-medium text-white/60">• {userXP.total.toLocaleString()} XP Total</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-white tracking-tight mt-0.5">
                {level.title}
              </h2>
            </div>
          </div>

          {/* Daily Check-In Button */}
          <div id="daily-claim" className="shrink-0">
            <Button
              onClick={handleDailyCheckIn}
              disabled={isClaimedToday}
              className={`w-full sm:w-auto h-11 px-5 rounded-[12px] text-xs font-bold gap-2 transition-all ${
                isClaimedToday
                  ? "bg-neutral-800 text-emerald-400 border border-emerald-500/30"
                  : "bg-brand text-black hover:bg-amber-400 shadow-md animate-pulse"
              }`}
            >
              {isClaimedToday ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Check-In Claimed (+20 XP)</span>
                </>
              ) : (
                <>
                  <Flame size={16} className="fill-black" />
                  <span>Claim Daily Check-In (+20 XP)</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* XP Bar & Streak Tracker */}
        <div className="space-y-4 pt-2 border-t border-white/10">
          <XpBar xp={userXP.total} />
          <div className="flex items-center justify-between">
            <StreakDisplay streak={userXP.streak} />
            <p className="text-[11px] font-mono text-white/50">
              {isClaimedToday ? "Streak Active 🔥" : "Log in daily to keep streak alive"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Level Perks & Rewards ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand" />
            <h3 className="font-heading text-base font-bold text-foreground">Level Milestone Perks</h3>
          </div>
          <span className="text-xs text-muted font-mono font-medium">Unlocked at higher levels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LEVEL_PERKS.map((perk) => {
            const isUnlocked = level.level >= perk.levelRequired;
            const isClaimed = (userXP.claimedPerkIds || []).includes(perk.id);

            return (
              <div
                key={perk.id}
                className={`relative rounded-[14px] border p-4 transition-all ${
                  isUnlocked
                    ? "border-amber-300/80 bg-linear-to-b from-amber-50/50 to-white shadow-2xs"
                    : "border-border bg-surface opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{perk.emoji}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xs font-bold text-foreground">{perk.title}</span>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{perk.description}</p>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold ${
                    isUnlocked ? "bg-amber-200 text-amber-950" : "bg-neutral-200 text-neutral-600"
                  }`}>
                    Lvl {perk.levelRequired}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                  {isUnlocked ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClaimPerk(perk.id, perk.code)}
                      className="h-8 text-xs font-bold gap-1.5 bg-foreground text-white hover:bg-neutral-800 w-full"
                    >
                      {copiedCode === perk.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span>Code Copied: {perk.code}</span>
                        </>
                      ) : (
                        <>
                          <Unlock size={13} className="text-amber-400" />
                          <span>{isClaimed ? `View Code: ${perk.code}` : "Claim Access Code"}</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted font-medium italic w-full justify-center">
                      <Lock size={12} />
                      <span>Reach Level {perk.levelRequired} to unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Badges & Trophies Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Badges & Trophies</h3>
            <p className="text-xs text-muted">
              {unlockedCount} of {ALL_BADGES.length} unlocked • Click any badge to view requirements
            </p>
          </div>
          <Badge variant="default" className="font-mono text-xs">
            {Math.round((unlockedCount / ALL_BADGES.length) * 100)}% Complete
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sortedBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              onClick={() => setSelectedBadge(badge)}
              className="cursor-pointer"
            >
              <BadgeItem
                badge={badge}
                unlocked={unlockedIds.has(badge.id)}
                size="md"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal / Card for Selected Badge Details */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-[16px] border border-amber-300 bg-amber-50/80 p-5 shadow-sm space-y-3 relative"
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 text-muted hover:text-foreground text-xs font-bold font-mono px-2 py-0.5 rounded-full border border-border bg-white"
            >
              ✕ Close
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedBadge.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-base font-bold text-foreground">{selectedBadge.name}</h4>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                    {selectedBadge.rarity}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{selectedBadge.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-xs">
              <span className="font-semibold text-foreground">
                Status: {unlockedIds.has(selectedBadge.id) ? " unlocked ⚡" : "🔒 Locked"}
              </span>
              <span className="font-mono font-bold text-amber-900">+{selectedBadge.xpReward} XP Reward</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-border" />

      {/* ── Quests & How to Earn XP ── */}
      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">Active Quests & XP Actions</h3>
          <p className="text-xs text-muted">Complete tasks around the app to accumulate XP and climb the leaderboard.</p>
        </div>

        <div className="space-y-2.5">
          {(Object.entries(XP_REWARDS) as [string, number][]).map(([action, xp]) => {
            const linkInfo = QUEST_LINKS[action] || { href: "/dashboard", label: "Start Task" };

            return (
              <div
                key={action}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-[12px] border border-border bg-white p-3.5 shadow-2xs hover:border-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface border border-border">
                    <Zap size={16} className="text-amber-500 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground capitalize">
                      {action.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-muted font-mono">Earn +{xp} XP on completion</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    +{xp} XP
                  </span>
                  <Link href={linkInfo.href}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold gap-1 border border-border">
                      <span>{linkInfo.label}</span>
                      <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Real XP Activity Feed ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-foreground">Live XP Activity Log</h3>
          <span className="text-xs text-muted font-mono">{userXP.history?.length || 0} events recorded</span>
        </div>

        <div className="rounded-[14px] border border-border bg-white p-4 space-y-0 divide-y divide-border/60">
          {(userXP.history && userXP.history.length > 0 ? userXP.history : [
            { id: "h1", title: "Assessment Complete", xp: 75, timestamp: "Today" },
            { id: "h2", title: "Daily Check-In", xp: 20, timestamp: "Today" },
          ]).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-mono text-xs font-bold border border-emerald-200">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.title}</p>
                  <p className="text-[10px] text-muted font-mono">{item.timestamp}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                +{item.xp} XP
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
