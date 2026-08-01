"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SharePanel } from "@/components/shared/share-panel";
import { generateResumeRoast } from "@/services/scoring";
import { ResumeRoastResult } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { checkNewAchievements, getBadgeById } from "@/lib/achievements";
import { UserXP } from "@/types";
import { CloudUpload, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const UPLOAD_MICROCOPY = [
  "Sending your resume to HR 😬",
  "Checking if HR will cringe...",
  "Talking to AI Recruiter...",
  "Preparing the roast...",
];

export default function ResumePage() {
  const [result, setResult] = useState<ResumeRoastResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(UPLOAD_MICROCOPY[0]);
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);

  const onUpload = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);

    // Cycle through microcopy for fun
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % UPLOAD_MICROCOPY.length;
      setLoadingText(UPLOAD_MICROCOPY[step]);
    }, 600);

    await new Promise((r) => setTimeout(r, 2400));
    clearInterval(interval);

    const roast = generateResumeRoast(file.name);
    setResult(roast);
    window.localStorage.setItem("bec-resume-score", JSON.stringify(roast));
    setLoading(false);

    // Award XP + badges
    const alreadyAwarded = window.localStorage.getItem("bec-resume-xp-awarded");
    if (!alreadyAwarded) {
      const updated = awardXP("resume_upload", userXP);
      const unlocked = checkNewAchievements(updated, { atsScore: roast.atsScore });
      setUserXP({
        ...updated,
        earnedBadgeIds: [...new Set([...updated.earnedBadgeIds, ...unlocked])],
      });
      window.localStorage.setItem("bec-resume-xp-awarded", "1");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">AI Resume Roast</h1>
        <p className="mt-1.5 text-sm text-muted">
          Let&apos;s see what HR thinks... then fix every weak line.
        </p>
      </div>

      {/* ── Upload zone ── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-border py-12 px-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-muted-bg"
            >
              <span className="text-lg">⚙️</span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-foreground"
              >
                {loadingText}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : result ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-border py-5 px-6 text-center hover:bg-surface transition-colors"
            onClick={() => document.getElementById("resume-file-input")?.click()}
          >
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted">Click to replace</p>
            <input id="resume-file-input" type="file" accept=".pdf" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-border py-12 px-6 text-center transition-colors hover:border-foreground/30 hover:bg-surface"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-muted-bg transition-colors group-hover:bg-foreground/8">
              <CloudUpload size={18} className="text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Upload Resume</p>
              <p className="mt-0.5 text-xs text-muted">PDF, up to 5MB</p>
            </div>
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          </motion.label>
        )}
      </AnimatePresence>

      {/* ── Result Card ── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="space-y-5 p-6">
              {/* ATS Score */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">ATS Score</p>
                  <p className="mt-1 font-mono text-5xl font-bold text-foreground">
                    {result.atsScore}<span className="text-xl text-muted/50">/100</span>
                  </p>
                </div>
                <div className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1">
                  <p className="text-xs font-semibold text-foreground">+100 XP Earned</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <p className="text-sm text-foreground italic leading-6">&ldquo;{result.roastLine}&rdquo;</p>

              <div className="border-t border-border" />

              {/* Improvements */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Fix These First</p>
                <ul className="space-y-2.5">
                  {result.improvements.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/dashboard">
                <Button variant="dark" size="md" className="w-full gap-2 mt-2">
                  Open Mission Control <ArrowRight size={14} />
                </Button>
              </Link>
            </Card>

            {/* Share */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground mb-4">Share Your ATS Score</p>
              <div className="max-w-sm">
                <SharePanel score={result.atsScore} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
