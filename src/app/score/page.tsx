"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SharePanel } from "@/components/shared/share-panel";
import { BerojgariCertificate } from "@/components/shared/berojgari-certificate";
import { ScoreResult, UserXP } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { checkNewAchievements, getBadgeById } from "@/lib/achievements";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowRight, Check, AlertCircle, HelpCircle, X, ExternalLink } from "lucide-react";

const defaultResult: ScoreResult = {
  score: 38,
  riskLevel: "HIGH",
  roast: "You are currently more prepared for watching placement reels than cracking interviews.",
  strengths: ["Hands-on project exposure", "Willingness to improve communication", "Early DSA effort"],
  weaknesses: ["Internship credibility gap", "GitHub quality can be improved", "LinkedIn profile optimization pending"],
  careerType: "Potential Underused",
  breakdown: {
    dsa: 32,
    projects: 58,
    resume: 41,
    interview: 27,
  },
  biggestGap: "Interview readiness",
  strongestArea: "Hands-on project exposure",
  summaryExplanation: "You have some hands-on exposure, but your preparation isn't consistent enough yet. Your biggest opportunity is converting what you've learned into visible proof.",
};

function ScoreTicker({ score }: { score: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    motionValue.set(score);
  }, [motionValue, score]);

  return (
    <motion.span className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-foreground">
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
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

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

  const dsaVal = result.breakdown?.dsa ?? Math.min(100, (inputData?.dsa ?? 4) * 10);
  const projectsVal = result.breakdown?.projects ?? Math.min(100, (inputData?.projects ?? 1) * 25);
  const resumeVal = result.breakdown?.resume ?? Math.min(100, Math.round((inputData?.cgpa ?? 7) * 7));
  const interviewVal = result.breakdown?.interview ?? Math.min(100, (inputData?.communication ?? 5) * 10);

  const biggestGapText = result.biggestGap || "Interview readiness";
  const strongestAreaText = result.strongestArea || "Hands-on project exposure";
  const summaryText = result.summaryExplanation || "You have some hands-on exposure, but your preparation isn't consistent enough yet. Your biggest opportunity is converting what you've learned into visible proof.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto max-w-2xl space-y-10 select-none pb-12"
    >
      {/* ── 1. Reality Check Complete Header ── */}
      <div>
        <div className="flex items-center justify-between">
          <Badge variant="dark" className="mb-2">
            REALITY CHECK COMPLETE
          </Badge>
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors font-mono font-medium underline"
          >
            <HelpCircle size={13} />
            <span>How is my score calculated?</span>
          </button>
        </div>

        {/* ── 2. Career Readiness Title & Main Score ── */}
        <div className="mt-2 space-y-1">
          <h1 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
            YOUR CAREER READINESS
          </h1>
          <div className="flex items-baseline gap-2 pt-1">
            <ScoreTicker score={result.score} />
            <span className="font-mono text-2xl text-muted font-bold">/ 100</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted italic border-l-2 border-brand pl-3 py-1">
            &gt; A brutally honest snapshot of where you stand today.
          </p>
          <p className="text-[11px] text-muted/70 font-mono">
            &gt; This is a diagnostic, not a hiring prediction.
          </p>
        </div>
      </div>

      {/* ── 2. Certificate of Berojgar (2nd Section) ── */}
      <section className="space-y-3 pt-2 border-t border-border">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-muted font-mono">
          CERTIFICATE OF BEROJGAR
        </h2>
        <BerojgariCertificate
          userName={user?.displayName || "Engineering Student"}
          college={inputData?.college || "Tier-3 Engineering College"}
          branch={inputData?.branch || "CSE / IT"}
          score={result.score}
          riskLevel={result.riskLevel}
          roast={result.roast}
          topProject={inputData?.topProject}
          keyAchievement={inputData?.keyAchievement}
        />
      </section>

      {/* ── 3. Result Summary (Biggest Gap & Strongest Area) ── */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
        <div className="p-4 rounded-[12px] border border-border bg-surface">
          <p className="text-[10px] font-bold uppercase tracking-widest text-danger font-mono">
            YOUR BIGGEST GAP
          </p>
          <p className="text-base font-bold text-foreground mt-1">{biggestGapText}</p>
        </div>

        <div className="p-4 rounded-[12px] border border-border bg-surface">
          <p className="text-[10px] font-bold uppercase tracking-widest text-success font-mono">
            YOUR STRONGEST AREA
          </p>
          <p className="text-base font-bold text-foreground mt-1">{strongestAreaText}</p>
        </div>

        <div className="sm:col-span-2 p-4 rounded-[12px] border border-border bg-white italic text-xs sm:text-sm leading-relaxed text-foreground">
          &ldquo;{summaryText}&rdquo;
        </div>
      </div>

      {/* ── 4. Primary CTAs ── */}
      <div className="space-y-3 pt-2">
        <Link href="/resume">
          <Button
            variant="dark"
            size="lg"
            className="w-full justify-center gap-2 text-sm font-bold uppercase tracking-wider h-12 shadow-sm"
          >
            <span>ROAST MY RESUME</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
        <Link href="/roadmap">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-center gap-2 text-sm font-bold uppercase tracking-wider h-11 border-foreground"
          >
            <span>START MY ROADMAP</span>
            <ArrowRight size={14} />
          </Button>
        </Link>
        <p className="text-center text-xs text-muted italic font-mono">
          &gt; Fix your gaps. Build proof. Come back and check again.
        </p>
      </div>

      <div className="border-t border-border" />

      {/* ── 5. Breakdown Progress Bars ── */}
      <section className="space-y-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-muted font-mono">
          CAREER READINESS BREAKDOWN
        </h2>
        <div className="space-y-4 font-mono">
          <div>
            <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
              <span>DSA</span>
              <span>{dsaVal} / 100</span>
            </div>
            <Progress value={dsaVal} />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
              <span>Projects</span>
              <span>{projectsVal} / 100</span>
            </div>
            <Progress value={projectsVal} />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
              <span>Resume</span>
              <span>{resumeVal} / 100</span>
            </div>
            <Progress value={resumeVal} />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
              <span>Interview</span>
              <span>{interviewVal} / 100</span>
            </div>
            <Progress value={interviewVal} />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── 6. Top 3 Gaps: FIX THESE FIRST ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground font-mono">
            FIX THESE FIRST
          </h2>
          <span className="text-[10px] font-bold text-danger uppercase tracking-wider font-mono">
            TOP 3 GAPS
          </span>
        </div>

        <div className="space-y-3">
          {/* Gap 1 */}
          <div className="p-4 rounded-[12px] border border-border bg-white space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-bold text-danger">01 — Interview readiness</p>
                <p className="text-xs text-muted mt-0.5">Your confidence score is low.</p>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground pt-1">
              Do this: Practice 5 technical questions every day for 7 days.
            </p>
            <div className="pt-2">
              <Link href="/challenges">
                <Button variant="dark" size="sm" className="gap-1.5 text-xs font-bold h-9 px-4">
                  <span>START</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Gap 2 */}
          <div className="p-4 rounded-[12px] border border-border bg-white space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-bold text-foreground">02 — GitHub proof</p>
                <p className="text-xs text-muted mt-0.5">Your profile exists, but your project evidence needs work.</p>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground pt-1">
              Do this: Polish and deploy your strongest project with a clear README.
            </p>
            <div className="pt-2">
              <Link href="/task-vault">
                <Button variant="dark" size="sm" className="gap-1.5 text-xs font-bold h-9 px-4">
                  <span>FIX GITHUB</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Gap 3 */}
          <div className="p-4 rounded-[12px] border border-border bg-white space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-bold text-foreground">03 — Internship credibility</p>
                <p className="text-xs text-muted mt-0.5">You have limited professional experience.</p>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground pt-1">
              Do this: Build one production-style project and document it properly.
            </p>
            <div className="pt-2">
              <Link href="/roadmap">
                <Button variant="dark" size="sm" className="gap-1.5 text-xs font-bold h-9 px-4">
                  <span>BUILD PROJECT</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── 7. Strengths & Fix First Lists ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground font-mono">
            WHAT YOU&apos;RE DOING RIGHT
          </h2>
          <ul className="space-y-2">
            {result.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs font-medium text-foreground">
                <Check size={14} className="mt-0.5 text-success shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground font-mono">
            FIX FIRST
          </h2>
          <ul className="space-y-2.5">
            {result.weaknesses.map((item, idx) => (
              <li key={item} className="flex items-center justify-between text-xs font-medium border-b border-border pb-2 last:border-0">
                <span className="text-foreground">0{idx + 1} {item}</span>
                <Link href="/roadmap" className="text-[11px] font-bold text-link hover:underline shrink-0">
                  FIX THIS →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-border" />

      {/* ── 8. Editorial Roadmap Section ── */}
      <section className="space-y-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground font-mono">
          YOUR ROADMAP
        </h2>

        <div className="divide-y divide-border border-y border-border">
          {/* Step 1 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-muted/60">01</span>
              <div>
                <p className="text-sm font-bold text-foreground">DSA Sprint</p>
                <p className="text-xs text-muted font-mono mt-0.5">45 min/day · Arrays, strings, trees</p>
              </div>
            </div>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="border border-border text-xs font-bold w-full sm:w-auto h-9">
                START →
              </Button>
            </Link>
          </div>

          {/* Step 2 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-muted/60">02</span>
              <div>
                <p className="text-sm font-bold text-foreground">Project Polish</p>
                <p className="text-xs text-muted font-mono mt-0.5">Ship one end-to-end project in 21 days</p>
              </div>
            </div>
            <Link href="/roadmap">
              <Button variant="ghost" size="sm" className="border border-border text-xs font-bold w-full sm:w-auto h-9">
                START →
              </Button>
            </Link>
          </div>

          {/* Step 3 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-muted/60">03</span>
              <div>
                <p className="text-sm font-bold text-foreground">Interview Practice</p>
                <p className="text-xs text-muted font-mono mt-0.5">Record one mock introduction every day for 7 days</p>
              </div>
            </div>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="border border-border text-xs font-bold w-full sm:w-auto h-9">
                START →
              </Button>
            </Link>
          </div>

          {/* Step 4 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-muted/60">04</span>
              <div>
                <p className="text-sm font-bold text-foreground">LinkedIn Hygiene</p>
                <p className="text-xs text-muted font-mono mt-0.5">Rewrite headline + feature strongest project</p>
              </div>
            </div>
            <Link href="/task-vault">
              <Button variant="ghost" size="sm" className="border border-border text-xs font-bold w-full sm:w-auto h-9">
                START →
              </Button>
            </Link>
          </div>
        </div>
      </section>


      <div className="border-t border-border" />

      {/* ── 10. Social Sharing Card ── */}
      <section className="space-y-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground font-mono">
          SHARE YOUR REALITY CHECK
        </h2>
        <div className="max-w-md">
          <SharePanel score={result.score} roast={result.roast} />
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── 11. Final Call To Action ── */}
      <section className="border-2 border-foreground bg-brand/10 p-6 sm:p-8 rounded-[16px] text-center space-y-4">
        <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
          READY TO LOWER YOUR BEROJGAR SCORE?
        </h2>
        <p className="text-xs sm:text-sm text-foreground/80 font-mono">
          &gt; Don&apos;t just know your gaps. Fix them.
        </p>
        <div className="pt-2">
          <Link href="/challenges">
            <Button variant="dark" size="lg" className="w-full sm:w-auto px-8 font-bold uppercase tracking-wider h-12 gap-2">
              <span>START TODAY&apos;S GRIND</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Methodology Modal ── */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md border-2 border-foreground bg-white p-6 rounded-[16px] space-y-4 shadow-xl select-none"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-base font-bold text-foreground">
                How is my score calculated?
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-foreground/90 font-mono leading-relaxed">
              <p>
                The <strong>Career Readiness Score</strong> is an objective diagnostic rating (0–100) calculated from your submitted answers across 4 core engineering pillars:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>DSA & Foundations:</strong> Problem-solving consistency.</li>
                <li><strong>Projects & Shipping:</strong> Production deployments & GitHub activity.</li>
                <li><strong>Resume & Profile:</strong> Academics, internships & profile visibility.</li>
                <li><strong>Interview Readiness:</strong> Communication & live interview confidence.</li>
              </ul>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] text-amber-950">
                <strong>Important Note:</strong> This score is a self-assessment diagnostic tool to help you identify career gaps. It is not a guaranteed placement probability, salary prediction, or hiring promise.
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="dark"
                size="md"
                className="w-full text-xs font-bold"
                onClick={() => setShowMethodologyModal(false)}
              >
                Got it
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
