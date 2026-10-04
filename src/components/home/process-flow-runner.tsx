"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  desc: string;
}

const STEPS: Step[] = [
  { id: "check", label: "CHECK", desc: "Calculate Berojgar Score" },
  { id: "find", label: "FIND", desc: "Identify Skill Gaps" },
  { id: "fix", label: "FIX", desc: "Solve Real-World DSA" },
  { id: "build", label: "BUILD", desc: "Roast & Upgrade Resume" },
  { id: "prove", label: "PROVE", desc: "Unlock Campus Referrals" },
];

export function ProcessFlowRunner() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 1600);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="flex flex-col gap-3 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Running Progress Bar */}
      <div className="relative w-full h-1 bg-border/40 overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-brand"
          initial={{ width: "0%" }}
          animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>

      {/* Process Flow Pills */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-foreground">
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isFinal = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "relative px-3 py-1.5 border transition-all duration-200 uppercase select-none flex items-center gap-1.5",
                  isActive
                    ? "bg-brand text-black border-black shadow-xs font-black scale-105"
                    : isFinal
                    ? "bg-black text-white border-black"
                    : "bg-surface border-border text-foreground/80 hover:border-black/50"
                )}
              >
                {/* Active Running Motion Dot */}
                {isActive && (
                  <motion.span
                    layoutId="activeDot"
                    className="h-2 w-2 rounded-full bg-black inline-block animate-ping"
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
                <span>{step.label}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <span
                  className={cn(
                    "font-mono transition-colors duration-200 select-none",
                    isActive ? "text-black font-black" : "text-muted/60"
                  )}
                >
                  &rarr;
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Step Subtitle Description */}
      <div className="h-5">
        <motion.p
          key={activeStep}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2 }}
          className="text-[11px] font-mono font-bold text-muted/80 tracking-wide"
        >
          Step {activeStep + 1}: <span className="text-foreground uppercase">{STEPS[activeStep].desc}</span>
        </motion.p>
      </div>
    </div>
  );
}
