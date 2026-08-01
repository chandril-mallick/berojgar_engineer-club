"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/shared/marquee";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { MARQUEE_STATS, SOCIAL_PROOF_DATA, LEADERBOARD_DATA } from "@/lib/mock-data";
import { WHY_REJECTED, FAQ_ITEMS } from "@/lib/constants";
import { useState } from "react";
import { getBadgeById } from "@/lib/achievements";

const heroWords = ["How", "Employable", "Are", "You?"];

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-0">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border-b border-border last:border-0">
          <button
            className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            {open === i ? (
              <ChevronUp size={15} className="shrink-0 text-muted" />
            ) : (
              <ChevronDown size={15} className="shrink-0 text-muted" />
            )}
          </button>
          {open === i && (
            <p className="pb-4 text-sm text-muted leading-6">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="muted" className="mb-6">
            India&apos;s Most Brutally Honest Career Platform
          </Badge>
        </motion.div>

        <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl flex flex-wrap items-center">
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="mr-3.5 inline-block"
          >
            How
          </motion.span>

          <motion.span
            custom={1}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="mr-3.5 inline-block"
          >
            <span className="relative">
              Employable
              <motion.span
                className="absolute -bottom-1 left-0 h-[4px] w-full rounded-full bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.span>

          {/* Logo embedded in the middle of the header text with premium floating & aura animation */}
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.35,
            }}
            className="mr-3.5 inline-flex items-center my-1 relative group cursor-pointer"
          >
            {/* Pulsing Outer Aura Ring */}
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-amber-400/40 blur-sm pointer-events-none"
            />

            {/* Floating Main Circle Container */}
            <motion.span
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.15, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-brand bg-white p-1 shadow-lg shadow-amber-500/20 transition-shadow duration-300"
            >
              <img
                src="/berojgar-logo.png"
                alt="Berojgar Engineer Club Logo"
                className="h-full w-full object-contain"
              />
              
              {/* Rotating Sparkle Badge */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 text-amber-500 bg-white rounded-full p-0.5 shadow-xs border border-amber-200"
              >
                <Sparkles size={11} />
              </motion.span>
            </motion.span>
          </motion.span>

          <motion.span
            custom={3}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="mr-3.5 inline-block"
          >
            Are
          </motion.span>

          <motion.span
            custom={4}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="inline-block"
          >
            You?
          </motion.span>
        </h1>

        <motion.p
          className="mt-6 max-w-lg text-base text-muted leading-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Stop guessing.{" "}
          <span className="text-foreground font-medium">
            Let AI tell you why companies aren&apos;t calling.
          </span>{" "}
          Take the 60-second reality check and get a roadmap that actually makes sense.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.3 }}
        >
          <Link href="/assessment">
            <Button variant="dark" size="lg" className="gap-2">
              Check My Berojgar Score <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/community">
            <Button variant="ghost" size="lg">
              Join The Club
            </Button>
          </Link>
        </motion.div>

        <motion.p
          className="mt-5 text-xs text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          Free forever. No credit card. No coaching vibes.
        </motion.p>
      </section>

      {/* ── Stats Marquee ── */}
      <div className="border-y border-border -mx-4 px-0">
        <Marquee items={MARQUEE_STATS} />
      </div>

      {/* ── Recently Escaped Berojgar ── */}
      <section className="py-16">
        <div className="flex items-end justify-between mb-8">
          <div>

            <h2 className="font-heading text-2xl font-bold text-foreground">
              Recently Escaped Berojgar
            </h2>
            <p className="text-xs text-muted font-medium mt-1">
              Lower Berojgar Score = lower risk index &amp; closer to job-ready
            </p>
          </div>
          <Link href="/leaderboard" className="text-xs text-muted hover:text-foreground transition-colors hidden sm:block">
            View Hall of Engineers →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SOCIAL_PROOF_DATA.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="rounded-[12px] border border-border p-4 space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted-bg font-heading text-sm font-bold text-foreground">
                  {entry.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">{entry.name}</p>
                  {entry.college && (
                    <p className="text-[11px] text-muted truncate">{entry.college} · {entry.branch}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="font-mono text-sm text-danger line-through opacity-60">{entry.beforeScore}%</span>
                <span className="text-muted text-xs">→</span>
                <span className="font-mono text-sm font-bold text-success">{entry.afterScore}%</span>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-widest">Offer Secured</p>
                <p className="text-xs font-semibold text-foreground">{entry.company} ({entry.role})</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Leaderboard Preview ── */}
      <section className="py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
              Live Rankings
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Hall of Engineers
            </h2>
            <p className="text-xs text-muted font-medium mt-1">
              Top-performing student engineers on the platform (based on problem-solving &amp; ATS score)
            </p>
          </div>
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              Full Leaderboard <ArrowRight size={13} />
            </Button>
          </Link>
        </div>

        <div className="space-y-0">
          {LEADERBOARD_DATA.slice(0, 3).map((entry, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-center gap-4 py-4 border-b border-border last:border-0"
              >
                <span className="text-xl w-8 text-center shrink-0">{medals[i]}</span>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: entry.avatarColor }}
                >
                  {entry.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
                  <p className="text-xs text-muted truncate">{entry.college} · {entry.branch}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-bold text-foreground">{entry.score}/100 Risk</p>
                  <p className="text-[10px] text-muted">{entry.offer ?? "Hunting"}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-mono text-xs text-muted">{entry.xp.toLocaleString()} XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Why Companies Reject ── */}
      <section className="py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
          The Uncomfortable Truth
        </p>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
          Why Companies Aren&apos;t Calling
        </h2>
        <div className="space-y-0">
          {WHY_REJECTED.map((item, i) => (
            <motion.div
              key={item.no}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-5 py-4 border-b border-border last:border-0"
            >
              <span className="font-mono text-xs text-muted/40 mt-0.5 shrink-0 w-6">{item.no}</span>
              <p className="text-sm text-foreground">{item.reason}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/assessment">
            <Button variant="dark" size="md" className="gap-2">
              Check My Berojgar Score <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── FAQ ── */}
      <section className="py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
          Questions
        </p>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
          Frequently Asked
        </h2>
        <div className="max-w-2xl">
          <FAQAccordion />
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-16 text-center border-t border-border">
        <p className="font-heading text-3xl font-bold text-foreground md:text-4xl max-w-xl mx-auto leading-tight">
          Stop wondering. Start knowing.
        </p>
        <p className="mt-3 text-sm text-muted max-w-md mx-auto">
          Your score is waiting. It won&apos;t be pretty. But it will be honest.
        </p>
        <Link href="/assessment" className="inline-block mt-6">
          <Button variant="dark" size="lg" className="gap-2">
            Check My Berojgar Score <ArrowRight size={15} />
          </Button>
        </Link>
      </section>
    </div>
  );
}
