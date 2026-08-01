"use client";

import { EngineerCard } from "@/components/shared/engineer-card";
import { XpBar } from "@/components/shared/xp-bar";
import { StreakDisplay } from "@/components/shared/streak-display";
import { BadgeItem } from "@/components/shared/badge-item";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { ALL_BADGES, getBadgeById } from "@/lib/achievements";
import { UserXP } from "@/types";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { getUserAvatarUrl } from "@/lib/utils";

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76 0-1.5-.5-2.8-1.5-3.78.15-.38.15-1.8-.15-3.72 0 0-1.2-.38-3.9 1.44a13.3 13.3 0 0 0-7 0C4.7 3.96 3.5 4.34 3.5 4.34c-.3 1.92-.3 3.34-.15 3.72A5.9 5.9 0 0 0 2 12c0 5.26 3 6.46 6 6.76-.8.7-1 2-1 3.24v4"></path>
    <path d="M4 19c-2 1-3 0-3 0"></path>
  </svg>
);

const LinkedinIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const OFFER_OPTIONS = ["Actively Hunting", "Placed! 🎉", "Open to Work", "Not looking yet"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [scoreResult] = useLocalStorage<{ score: number }>("bec-score-result", { score: 0 });
  const [inputResult] = useLocalStorage<{ college: string; branch: string; github: string }>(
    "bec-assessment-input",
    { college: "", branch: "", github: "no" },
  );

  const [githubConnected, setGithubConnected] = useState(
    inputResult.github === "yes" || userXP.earnedBadgeIds.includes("github-beast"),
  );
  const [offerStatus, setOfferStatus] = useState("Actively Hunting");

  const unlockedBadgeIds = new Set(userXP.earnedBadgeIds);

  const earnedBadges = ALL_BADGES.filter((b) => unlockedBadgeIds.has(b.id));
  const badgeEmojis = earnedBadges.map((b) => b.emoji);

  const connectGitHub = () => {
    if (githubConnected) return;
    setGithubConnected(true);
    const updated = awardXP("github_connect", userXP);
    setUserXP({
      ...updated,
      earnedBadgeIds: [...updated.earnedBadgeIds, "github-beast"],
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Engineer Profile</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">Your Engineer Card</h1>
        <p className="mt-1 text-sm text-muted">Your shareable career identity. Screenshot & flex.</p>
      </div>

      {/* ── Engineer Card ── */}
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

      {/* ── XP + Streak ── */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Progress</h2>
        <StreakDisplay streak={userXP.streak} />
        <XpBar xp={userXP.total} />
      </section>

      <div className="border-t border-border" />

      {/* ── Connections ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">Connections</h2>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <GithubIcon className="text-muted" />
              <div>
                <p className="text-sm font-medium text-foreground">GitHub</p>
                <p className="text-xs text-muted">Show your actual work. +100 XP</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={githubConnected ? "ghost" : "dark"}
              onClick={connectGitHub}
              className="gap-1.5"
            >
              {githubConnected ? (
                <><ExternalLink size={12} /> Connected</>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <LinkedinIcon className="text-muted" />
              <div>
                <p className="text-sm font-medium text-foreground">LinkedIn</p>
                <p className="text-xs text-muted">Sync profile for better job matching. +75 XP</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="gap-1.5">
              Connect
            </Button>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Offer Status ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Offer Status</h2>
        <div className="flex flex-wrap gap-2">
          {OFFER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setOfferStatus(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                offerStatus === opt
                  ? "border-foreground bg-foreground text-white"
                  : "border-border bg-white text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Achievements ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Achievements</h2>
          <a href="/achievements" className="text-xs text-muted hover:text-foreground transition-colors">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
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
    </div>
  );
}
