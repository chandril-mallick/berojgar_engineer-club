"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { REAL_WORLD_DSA_CHALLENGES } from "@/lib/real-world-dsa-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Code2, 
  Layers, 
  Zap, 
  Flame, 
  BookOpen 
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function RealWorldDSAPage() {
  const [completedSlugs, setCompletedSlugs] = useLocalStorage<string[]>(
    "bec-rwdsa-completed",
    []
  );

  const totalChallenges = REAL_WORLD_DSA_CHALLENGES.length;
  const completedCount = completedSlugs.length;
  const remainingCount = totalChallenges - completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Top Header & Hero ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="flex items-center gap-1">
              <Cpu size={12} className="text-amber-600" />
              <span>Real-World Engineering Lab</span>
            </Badge>
            <span className="text-xs text-muted font-mono font-semibold">MVP Edition</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Real-World DSA Lab
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            Stop solving isolated array problems. Learn Data Structures &amp; Algorithms by building real engineering systems used at Swiggy, Google Maps, 1mg, and Amazon.
          </p>
        </div>

        {/* ── Progress Counter Badge Box ── */}
        <div className="shrink-0 bg-surface border border-border rounded-2xl p-4 flex items-center gap-6 shadow-xs">
          <div className="text-center">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-foreground font-mono">{totalChallenges}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 font-mono">{completedCount}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-amber-600 font-mono">{remainingCount}</p>
          </div>
        </div>
      </div>

      {/* ── Core Learning Loop Infographic Banner ── */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">The Real-World Learning Loop</h3>
            <p className="text-xs text-muted">Real Scenario → Understand Problem → Identify DSA → Code &amp; Test → Learn Real Utility</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-200">
          <Flame size={14} className="text-amber-500 fill-amber-500" />
          <span>+100 XP per solved scenario</span>
        </div>
      </div>

      {/* ── Scenario Cards Grid ── */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <Layers size={18} className="text-brand" />
          <span>Engineering Scenarios ({totalChallenges})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REAL_WORLD_DSA_CHALLENGES.map((challenge, idx) => {
            const isCompleted = completedSlugs.includes(challenge.slug);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-foreground/30"
              >
                <div className="space-y-4">
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-surface border border-border text-muted">
                      {challenge.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          challenge.difficulty === "Easy"
                            ? "success"
                            : challenge.difficulty === "Medium"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {challenge.difficulty}
                      </Badge>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} />
                          <span>Solved</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
                      {challenge.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Footer Meta & Action */}
                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-surface px-2.5 py-1 rounded-lg border border-border">
                    <Code2 size={13} className="text-brand" />
                    <span>{challenge.dsaConcept}</span>
                  </div>

                  <Link href={`/real-world-dsa/${challenge.slug}`}>
                    <Button size="sm" variant={isCompleted ? "ghost" : "primary"} className="gap-1.5 text-xs">
                      <span>{isCompleted ? "Review" : "Solve Lab"}</span>
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
