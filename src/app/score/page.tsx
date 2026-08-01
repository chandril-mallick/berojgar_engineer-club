"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SharePanel } from "@/components/shared/share-panel";
import { ROADMAP_ITEMS } from "@/lib/constants";
import { ScoreResult } from "@/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { checkNewAchievements, getBadgeById } from "@/lib/achievements";
import { BerojgariCertificate } from "@/components/shared/berojgari-certificate";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { UserXP } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const defaultResult: ScoreResult = {
  score: 38,
  riskLevel: "HIGH",
  roast: "You are currently more prepared for watching placement reels than cracking interviews.",
  strengths: ["Curious learner", "Starting technical profile", "Strong intent to improve"],
  weaknesses: ["Inconsistent DSA prep", "No internship proof", "Weak project depth"],
  placementProbability: 42,
  salaryPredictionLpa: 5.1,
  careerType: "Potential Underused",
};

function ScoreTicker({ score }: { score: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => { motionValue.set(score); }, [motionValue, score]);

  return (
    <motion.span className="font-mono text-7xl font-bold tracking-tight text-foreground">
      {rounded}
    </motion.span>
  );
}

export default function ScorePage() {
  const { user } = useAuth();
  const [result] = useLocalStorage<ScoreResult>("bec-score-result", defaultResult);
  const [inputData] = useLocalStorage<any>("bec-assessment-input", null);

  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  // Award XP + check achievements on first score view
  useEffect(() => {
    const alreadyAwarded = window.localStorage.getItem("bec-assessment-xp-awarded");
    if (!alreadyAwarded) {
      const updated = awardXP("assessment_complete", userXP);
      const unlocked = checkNewAchievements(updated, {
        score: result.score,
        dsa: inputData?.dsa,
        hasGithub: inputData?.github === "yes",
      });
      const finalXP: UserXP = {
        ...updated,
        earnedBadgeIds: [...new Set([...updated.earnedBadgeIds, ...unlocked])],
      };
      setUserXP(finalXP);
      setNewBadges(unlocked);
      window.localStorage.setItem("bec-assessment-xp-awarded", "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riskVariant = result.riskLevel === "HIGH" ? "danger" : result.riskLevel === "MEDIUM" ? "default" : "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto max-w-2xl space-y-12"
    >
      {/* ── Header ── */}
      <div>
        <Badge variant="dark" className="mb-4">Reality Check Complete 😅</Badge>
        <h1 className="font-heading text-2xl font-bold text-foreground">Your Berojgar Score</h1>
        <p className="mt-1 text-sm text-muted">Based on 10 questions. Brutally honest. No sugarcoating.</p>
      </div>

      {/* ── Score Card ── */}
      <Card className="p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Employability Score</p>
            <div className="flex items-end gap-1">
              <ScoreTicker score={result.score} />
              <span className="mb-2.5 font-mono text-2xl text-muted/50">/100</span>
            </div>
            <Progress className="mt-4" value={result.score} />
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted">Risk Level</span>
              <Badge variant={riskVariant as "danger" | "default" | "success"}>{result.riskLevel}</Badge>
            </div>
            <p className="mt-4 text-sm text-muted leading-6 italic">&ldquo;{result.roast}&rdquo;</p>
          </div>
          <div className="space-y-4 sm:border-l sm:border-border sm:pl-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Placement Insights</p>
            <div className="space-y-2.5">
              {[
                { label: "Career Type", value: result.careerType },
                { label: "Placement Probability", value: `${result.placementProbability}%` },
                { label: "Predicted CTC", value: `₹${result.salaryPredictionLpa} LPA` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-foreground font-mono">{value}</span>
                </div>
              ))}
            </div>
            <Link href="/resume">
              <Button variant="dark" size="md" className="w-full gap-2 mt-4">
                Next: Roast My Resume <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6 sm:hidden">
          <Link href="/resume">
            <Button variant="dark" size="md" className="w-full">Next: Roast My Resume</Button>
          </Link>
        </div>
      </Card>

      {/* ── Official Funny Berojgari Certificate & Viral Social Share ── */}
      <BerojgariCertificate
        userName={user?.displayName || "Anonymous Engineer"}
        college={inputData?.college || "Local Engineering College"}
        branch={inputData?.branch || "CSE"}
        score={result.score}
        riskLevel={result.riskLevel}
        roast={result.roast}
        predictedCtc={result.salaryPredictionLpa}
        topProject={inputData?.topProject}
        keyAchievement={inputData?.keyAchievement}
      />

      {/* ── New Badges Unlocked ── */}
      {newBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="rounded-[12px] border border-brand/30 bg-brand/10 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            🏅 Badges Unlocked
          </p>
          <div className="flex flex-wrap gap-4">
            {newBadges.map((id) => {
              const badge = getBadgeById(id);
              if (!badge) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <span className="text-2xl animate-badge-pop">{badge.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted">+{badge.xpReward} XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Strengths / Weaknesses ── */}
      <div className="grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Strengths</h2>
          <ul className="space-y-2.5">
            {result.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Needs Work</h2>
          <ul className="space-y-2.5">
            {result.weaknesses.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-border" />

      {/* ── Roadmap ── */}
      <section>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted">Your Roadmap</h2>
        <div className="space-y-0">
          {ROADMAP_ITEMS.map((item, idx) => (
            <div key={item.title} className="flex items-start gap-5 py-4 border-b border-border last:border-0">
              <span className="font-mono text-xs text-muted/40 mt-0.5 w-4 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Share ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Share Your Score</h2>
        <div className="max-w-md">
          <SharePanel score={result.score} roast={result.roast} />
        </div>
      </section>
    </motion.div>
  );
}
