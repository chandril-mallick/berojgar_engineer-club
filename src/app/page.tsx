"use client";

import Link from "next/link";
import { ArrowRight, Code, Cpu, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/shared/marquee";
import { ProcessFlowRunner } from "@/components/home/process-flow-runner";
import { FAQAccordion } from "@/components/home/faq-accordion";
import { SectionDivider } from "@/components/shared/section-divider";
import { MARQUEE_STATS, LEADERBOARD_DATA, SOCIAL_PROOF_DATA } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function Home() {
  // Semantic Colors: Green for high readiness, Amber for medium, Red for low/risk
  const realityCheckMetrics = [
    { label: "Readiness", score: 62, color: "bg-amber-500" },
    { label: "DSA", score: 48, color: "bg-rose-500" },
    { label: "Projects", score: 71, color: "bg-emerald-500" },
    { label: "Resume", score: 54, color: "bg-amber-500" },
    { label: "Interview", score: 39, color: "bg-rose-500" },
  ];

  const top3Gaps = [
    { no: "01", gap: "DSA consistency", detail: "Watching videos without solving LeetCode daily" },
    { no: "02", gap: "Project proof", detail: "No deployed GitHub URLs or production proof" },
    { no: "03", gap: "Interview practice", detail: "Stuttering under 2-minute live phone screening" },
  ];

  const whyTheyRejectQuotes = [
    {
      no: "01",
      quote: '"Your resume says AI Engineer. Your GitHub says last commit 8 months ago."',
      tag: "Proof Gap",
    },
    {
      no: "02",
      quote: '"12 certificates. 0 deployed projects."',
      tag: "Vibes vs Proof",
    },
    {
      no: "03",
      quote: '"Learned DSA. Never practiced under timed pressure."',
      tag: "Execution Gap",
    },
  ];

  const todaysGrindTasks = [
    { count: "01", title: "DSA Problem", desc: "Arrays or Binary Search", icon: Code },
    { count: "02", title: "CS Concept", desc: "OS Memory or DB Indexing", icon: Cpu },
    { count: "03", title: "Build Task", desc: "GitHub commit or live fix", icon: Rocket },
    { count: "04", title: "Career Action", desc: "Referral request or ATS roast", icon: Target },
  ];

  return (
    <div className="space-y-10">

      {/* ── SECTION 1: HERO GRID PANEL ── */}
      <div className="border border-[#c8c8d0] rounded-none bg-white/60 backdrop-blur-md shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#c8c8d0]">
          
          {/* Main Hero Copy (Left 2/3) */}
          <div className="p-8 lg:col-span-2 flex flex-col justify-between min-h-[320px] space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted/80 block">
                Berojgar Engineer Club · Career Reality Check
              </span>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left leading-none">
                STOP GUESSING.<br />KNOW YOUR GAP.
              </h1>
              
              <p className="text-xs sm:text-sm font-semibold text-muted max-w-lg leading-relaxed pt-2">
                Take a brutally honest reality check and find what&apos;s actually holding your career back.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/assessment">
                <Button variant="dark" size="lg" className="gap-2 font-black uppercase tracking-wider text-xs px-6 py-6 rounded-none shadow-xs">
                  Take Reality Check <ArrowRight size={16} />
                </Button>
              </Link>
              
              <span className="text-xs font-extrabold text-foreground tracking-wider uppercase font-mono">
                From Berojgar &rarr; Employable.
              </span>
            </div>
          </div>

          {/* Integrated Graphic Unit (Right 1/3): Anchored Badge + Frameless Logo + Seal */}
          <div className="p-6 flex flex-col justify-between items-center text-center min-h-[380px] relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-amber-50/20">
            {/* Top Integrated Badge Header */}
            <div className="w-full flex items-center justify-between border-b border-[#c8c8d0]/60 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black text-white px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                2026 Batch Ready
              </span>
              <span className="text-[9px] font-mono font-black text-muted tracking-wider uppercase">
                VERIFIED ECOSYSTEM
              </span>
            </div>

            {/* Central Graphic Composition: Frameless Logo + Anchored Rotating Seal */}
            <div className="relative my-4 flex flex-col items-center justify-center">
              {/* Glowing Aura Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-300 via-rose-300 to-indigo-300 blur-xl animate-pulse" />
              </div>

              {/* Frameless Logo */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                className="relative z-10 p-4 bg-white/90 rounded-2xl border border-[#c8c8d0]/70 shadow-sm"
              >
                <img
                  src="/berojgar-logo.png"
                  alt="Berojgar Engineer Club Logo"
                  className="h-20 w-auto object-contain"
                />
              </motion.div>

              {/* Anchored Circular Rotating Seal */}
              <div className="-mt-4 relative w-20 h-20 flex items-center justify-center select-none shrink-0 z-20">
                <svg className="absolute w-full h-full animate-[spin_14s_linear_infinite]" viewBox="0 0 100 100">
                  <path id="circlePathHero" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text className="text-[8.5px] font-mono font-black tracking-widest fill-black uppercase">
                    <textPath href="#circlePathHero">
                      BEAT THE PLACEMENT DRY RUN &bull;&nbsp;
                    </textPath>
                  </text>
                </svg>
                <div className="w-8 h-8 rounded-full bg-black shadow-md flex items-center justify-center text-white border border-amber-400/50">
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M9 3h6l-1 3.5h-4L9 3zm1 4h4l1.8 8.5L12 21l-3.8-5.5L10 7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Subtitle Anchor */}
            <div className="w-full text-center border-t border-[#c8c8d0]/60 pt-3">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">
                AI Career Coach &bull; Placement Reality Check
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 2: MANIFESTO STRIP & PROCESS (VIBRANT BEC GOLD WAVY BLOCK) ── */}
      <div className="-mx-6 overflow-hidden">
        <SectionDivider position="top" variant="wave" fillColor="fill-[#ffc700]" />
        <div className="bg-[#ffc700] text-black py-8 px-6 md:px-12 shadow-sm">
          <div className="mx-auto max-w-[1360px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-black/80 block mb-1">
                Uncomfortable Truth
              </span>
              <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase scale-y-110 origin-left">
                ENGINEERING GAVE YOU A DEGREE. NOBODY GAVE YOU A ROADMAP.
              </h2>
            </div>

            {/* Animated Process Flow Runner */}
            <div className="w-full md:w-auto min-w-[320px] max-w-lg">
              <ProcessFlowRunner />
            </div>
          </div>
        </div>
        <SectionDivider position="bottom" variant="wave" fillColor="fill-[#ffc700]" />
      </div>

      {/* ── STATS MARQUEE ── */}
      <div className="border-y border-[#c8c8d0] -mx-6 px-0 bg-white/40 my-4">
        <Marquee items={MARQUEE_STATS} />
      </div>

      {/* ── SECTION 3: YOUR REALITY CHECK (SCORE BREAKDOWN & TOP 3 GAPS) ── */}
      <div className="border border-[#c8c8d0] rounded-none bg-white shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#c8c8d0]">
          
          {/* Metrics breakdown (Left) */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted/80 block mb-1">
                Sample Assessment Breakdown
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left">
                YOUR REALITY CHECK
              </h2>
            </div>

            {/* Score Sliders */}
            <div className="space-y-4">
              {realityCheckMetrics.map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span className="uppercase tracking-wider">{m.label}</span>
                    <span className="font-mono">{m.score}/100</span>
                  </div>
                  <div className="h-2 w-full bg-surface border border-[#c8c8d0] overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted font-medium">
              *Calculated using real-world recruiter ATS keyword checks, GitHub commit velocity, and DSA confidence.
            </p>
          </div>

          {/* Top 3 Gaps & CTA (Right) */}
          <div className="p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#e9e9f0]/10 to-transparent">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block mb-1">
                Diagnostic Output
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left mb-6">
                TOP 3 GAPS
              </h2>

              <div className="space-y-4">
                {top3Gaps.map((g) => (
                  <div key={g.no} className="p-4 border border-[#c8c8d0] bg-white flex items-start gap-4 shadow-2xs">
                    <span className="font-mono text-xl font-black text-rose-500 shrink-0">{g.no}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">{g.gap}</p>
                      <p className="text-[11px] text-muted font-medium mt-0.5">{g.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/assessment">
                <Button variant="dark" size="md" className="gap-2 font-black uppercase tracking-wider text-xs px-6 rounded-none">
                  Fix My Gaps <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 4: WHY THEY REJECT (MID-PAGE DEEP CHARCOAL BAND BREAK) ── */}
      <div className="-mx-6 overflow-hidden my-8">
        <SectionDivider position="top" variant="wave" fillColor="fill-[#18181b]" />
        <div className="bg-[#18181b] text-white py-10 px-6 md:px-12 shadow-xl">
          <div className="mx-auto max-w-[1360px] space-y-8">
            <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 block mb-1">
                  Recruiter Insights
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase scale-y-110 origin-left">
                  WHY THEY REJECT
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 border border-zinc-700 px-3 py-1 bg-zinc-900">
                REAL FEEDBACK FROM 140+ RECRUITERS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyTheyRejectQuotes.map((q) => (
                <div key={q.no} className="p-6 border border-zinc-800 bg-zinc-900/90 rounded-none flex flex-col justify-between space-y-6 min-h-[200px] shadow-sm hover:border-rose-500/50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zinc-500">{q.no}</span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-300 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
                        {q.tag}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-zinc-100 leading-relaxed italic">
                      {q.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-center">
              <Link href="/assessment">
                <Button variant="ghost" size="md" className="gap-2 font-black uppercase tracking-wider text-xs px-8 rounded-none border border-rose-500/40 text-white bg-rose-950/40 hover:bg-rose-900/60">
                  Find My Gaps <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <SectionDivider position="bottom" variant="wave" fillColor="fill-[#18181b]" />
      </div>

      {/* ── SECTION 5: TODAY'S GRIND (RE-BALANCED COMPACT SPACING) ── */}
      <div className="border border-[#c8c8d0] rounded-none bg-white shadow-2xs my-8">
        <div className="p-8 border-b border-[#c8c8d0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted/80 block mb-1">
              Daily Placement Routine
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left">
              TODAY&apos;S GRIND
            </h2>
          </div>

          <Link href="/daily-challenge">
            <Button variant="dark" size="sm" className="gap-2 font-black uppercase tracking-wider text-xs rounded-none">
              Start Today&apos;s Grind <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Tightened, balanced card layout with count + title + description + icon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#c8c8d0]">
          {todaysGrindTasks.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="p-6 flex flex-col justify-between space-y-4 bg-white hover:bg-surface/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black bg-black text-[#ffc700] px-2 py-0.5 rounded-none">
                      {t.count}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">{t.title}</p>
                      <p className="text-[10px] text-muted font-medium mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                  <div className="p-2 border border-[#c8c8d0] bg-white text-foreground shrink-0">
                    <Icon size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 6: HALL OF ENGINEERS (DARK NIGHT WITH REAL AVATARS & STANDARDIZED TAGS) ── */}
      <div className="-mx-6 overflow-hidden my-8">
        <SectionDivider position="top" variant="wave" fillColor="fill-[#0f172a]" />
        <div className="bg-[#0f172a] text-white py-10 px-6 md:px-12 shadow-xl">
          <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Hall of Engineers Rankings */}
            <div className="flex flex-col justify-between space-y-6 pb-6 lg:pb-0 lg:pr-8">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Live Leaderboard
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase scale-y-110 origin-left mb-6">
                  HALL OF ENGINEERS
                </h2>

                <div className="space-y-3">
                  {LEADERBOARD_DATA.slice(0, 3).map((entry, i) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    const isLowRisk = entry.score >= 80;
                    return (
                      <div
                        key={entry.rank}
                        className="flex items-center gap-3 p-3 border border-slate-700 bg-slate-900/80 rounded-lg"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-slate-800 border border-slate-700 text-sm font-bold select-none rounded">
                          {medals[i]}
                        </div>

                        {/* Real Student Profile Photo */}
                        <img
                          src={entry.avatarUrl ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={entry.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-600 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate uppercase">{entry.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{entry.college} · {entry.branch}</p>
                        </div>
                        <div className="text-right shrink-0 space-y-0.5">
                          {/* Standardized Bordered Green Pill for Company Tag */}
                          <span className="inline-block text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-2 py-0.5 rounded uppercase">
                            {entry.offer ?? "Hunting"}
                          </span>
                          <p className={`font-mono text-[10px] font-bold ${isLowRisk ? "text-emerald-400" : "text-amber-400"}`}>
                            {entry.score}/100 Risk
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm" className="gap-2 font-black uppercase tracking-wider text-xs rounded-none border border-slate-700 text-white bg-slate-800 hover:bg-slate-700">
                    View Leaderboard <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Social Proof (Recently Escaped Students) */}
            <div className="flex flex-col justify-between space-y-6 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Verified Outcomes
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase scale-y-110 origin-left mb-6">
                  RECENTLY ESCAPED
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOCIAL_PROOF_DATA.slice(0, 4).map((s) => (
                    <div key={s.name} className="p-3 border border-slate-700 bg-slate-900/80 rounded-lg space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.avatarUrl ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                          alt={s.name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{s.name}</p>
                          {/* Standardized Bordered Green Pill matching Hall of Engineers */}
                          <span className="inline-block text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-1.5 py-0.5 rounded truncate max-w-full">
                            {s.company}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Risk Reduction</span>
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-rose-400">{s.beforeScore}%</span>
                          <span>&rarr;</span>
                          <span className="font-bold text-emerald-400">{s.afterScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link href="/offer-wall">
                  <Button variant="ghost" size="sm" className="gap-2 font-black uppercase tracking-wider text-xs rounded-none border border-slate-700 text-white bg-slate-800 hover:bg-slate-700">
                    View Offer Wall <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
        <SectionDivider position="bottom" variant="wave" fillColor="fill-[#0f172a]" />
      </div>

      {/* ── SECTION 7: BALANCED HEIGHT CLOSING PANEL (FAQ + FINAL CTA) ── */}
      <div className="border border-[#c8c8d0] rounded-none bg-white/80 backdrop-blur-md shadow-2xs my-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#c8c8d0]">
          
          {/* FAQ Accordion (Left 2/3) */}
          <div className="p-8 lg:col-span-2 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted/80 block mb-1">
                Help &amp; Support
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left">
                FREQUENTLY ASKED
              </h2>
            </div>
            <FAQAccordion />
          </div>

          {/* Final Call To Action (Right 1/3) - Height Balanced with FAQ */}
          <div className="p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#ffc700]/20 via-transparent to-transparent">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block">
                Final Call
              </span>
              
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase scale-y-110 origin-left leading-tight">
                STOP WONDERING.<br />START BUILDING.
              </h2>
              
              <p className="text-xs font-semibold text-muted leading-relaxed">
                Your score is waiting. It won&apos;t be pretty. But it will be honest.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#c8c8d0]">
              <Link href="/assessment" className="block">
                <Button variant="dark" size="lg" className="w-full gap-2 font-black uppercase tracking-wider text-xs py-5 rounded-none shadow-xs">
                  Take Reality Check <ArrowRight size={16} />
                </Button>
              </Link>

              <p className="text-center text-[11px] font-extrabold text-foreground tracking-wider uppercase font-mono">
                From Berojgar &rarr; Employable.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
