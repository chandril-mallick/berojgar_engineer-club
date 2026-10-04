"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Zap, 
  BookOpen, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Filter, 
  Calendar, 
  Briefcase, 
  Code2, 
  ShieldCheck, 
  Layers, 
  Flame, 
  RotateCcw, 
  Check, 
  Target, 
  Cpu,
  Clock,
  Terminal,
  ExternalLink,
  ChevronDown,
  Building2,
  Rocket,
  FileCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP, ScoreResult } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";

interface RoadmapStep {
  id: string;
  title: string;
  duration: string;
  tag: string;
  description: string;
  tasks: { id: string; text: string; link?: string; linkText?: string }[];
  proTip: string;
}

interface RoadmapTrack {
  id: string;
  name: string;
  badge: string;
  icon: LucideIcon;
  description: string;
  targetRole: string;
  estimatedDuration: string;
  steps: RoadmapStep[];
}

const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: "90-day-sde",
    name: "90-Day Placement Masterplan",
    badge: "Most Popular",
    icon: Target,
    description: "Brutal, zero-fluff 3-month action plan engineered for Tier-3 students to crack product SDE roles.",
    targetRole: "SDE-1 / Frontend / Backend Engineer",
    estimatedDuration: "12 Weeks (15-20 hrs/week)",
    steps: [
      {
        id: "step-1-dsa",
        title: "Phase 1: Core Problem Solving & DSA Sprints",
        duration: "Weeks 1 - 4",
        tag: "Foundation",
        description: "Master high-yield DSA patterns asked in 80%+ technical screening tests.",
        tasks: [
          { id: "task-dsa-1", text: "Master Arrays & HashMaps (Two Pointers, Sliding Window, Prefix Sum)", link: "/real-world-dsa", linkText: "Practice in Lab" },
          { id: "task-dsa-2", text: "Solve 25 High-Frequency Medium DSA problems independently" },
          { id: "task-dsa-3", text: "Master Trees & Graphs (BFS/DFS traversal patterns)", link: "/daily-challenge", linkText: "Daily Grind" },
          { id: "task-dsa-4", text: "Time & Space complexity analysis for every solution (Big-O)" },
        ],
        proTip: "Do not watch 3-hour video tutorials without coding. Write code on paper or IDE within 20 mins."
      },
      {
        id: "step-2-project",
        title: "Phase 2: Production-Grade Project & GitHub Proof",
        duration: "Weeks 5 - 8",
        tag: "Proof of Work",
        description: "Build 1 non-generic, full-stack application that recruiters can actually test live.",
        tasks: [
          { id: "task-proj-1", text: "Ship a full-stack project with Auth, DB, and live API endpoints", link: "/real-world-dsa", linkText: "System Architecture" },
          { id: "task-proj-2", text: "Deploy live demo on Vercel/Render with custom domain or HTTPS" },
          { id: "task-proj-3", text: "Write impressive GitHub README with Architecture Diagram & Setup Guide" },
          { id: "task-proj-4", text: "Record 90-second video demo walk-through for LinkedIn" },
        ],
        proTip: "Avoid generic Todo Apps or Weather Apps. Build tools that solve real problems (e.g. queue managers, analytics dashboards)."
      },
      {
        id: "step-3-resume",
        title: "Phase 3: Resume Roast & ATS System Optimization",
        duration: "Weeks 9 - 10",
        tag: "Packaging",
        description: "Transform your resume into a recruiter magnet scoring 85+ on ATS metrics.",
        tasks: [
          { id: "task-res-1", text: "Run BEC AI Resume Roast & fix all flagged high-risk issues", link: "/resume", linkText: "Roast Resume" },
          { id: "task-res-2", text: "Format bullets using X-Y-Z formula: Accomplished [X] measured by [Y] using [Z]" },
          { id: "task-res-3", text: "Ensure single-page clean Single-Column layout (no double columns)" },
          { id: "task-res-4", text: "Hyperlink live GitHub repos and live project URLs directly" },
        ],
        proTip: "Recruiters spend only 6 seconds on initial scanning. Keep metrics bold and quantifiable."
      },
      {
        id: "step-4-interviews",
        title: "Phase 4: Cold Outreach & Mock Interview Velocity",
        duration: "Weeks 11 - 12",
        tag: "Conversion",
        description: "Convert preparation into interview calls via targeted reachouts & STAR storytelling.",
        tasks: [
          { id: "task-int-1", text: "Prepare 5 STAR stories for behavioral & leadership rounds" },
          { id: "task-int-2", text: "Send 10 targeted referral requests daily to SDE-1 alumni on LinkedIn", link: "/referrals", linkText: "Referral Queue" },
          { id: "task-int-3", text: "Conduct 3 mock technical interviews with peer feedback" },
          { id: "task-int-4", text: "Maintain daily application tracking sheet (Applied, Follow-up, Interview)" },
        ],
        proTip: "Never send generic 'Hi sir give referral' messages. Send a 3-line pitch + live link + job ID."
      }
    ]
  },
  {
    id: "fullstack-web",
    name: "Full-Stack Web Architecture Track",
    badge: "High Demand",
    icon: Code2,
    description: "Complete blueprint to become a production-ready Full Stack Engineer building modern web apps.",
    targetRole: "Frontend / Full-Stack Engineer (React, Node, Next.js)",
    estimatedDuration: "14 Weeks",
    steps: [
      {
        id: "fs-1",
        title: "Level 1: Modern Web Core & TypeScript Mastery",
        duration: "Weeks 1 - 3",
        tag: "Frontend Core",
        description: "Master modern HTML5, CSS layout engines, JavaScript ES6+ & strict TypeScript types.",
        tasks: [
          { id: "fs-task-1", text: "Deep dive into JS Async/Await, Event Loop, Closures, and Promises" },
          { id: "fs-task-2", text: "Convert JS codebase to strict TypeScript with interfaces & generics" },
          { id: "fs-task-3", text: "Master TailwindCSS responsive layouts & modern CSS grid/flexbox" },
        ],
        proTip: "TypeScript is standard in product teams. Avoid `any` types at all costs."
      },
      {
        id: "fs-2",
        title: "Level 2: Next.js App Router & Full Stack Data Layer",
        duration: "Weeks 4 - 8",
        tag: "Framework & DB",
        description: "Build high-performance web apps with Server Components, Server Actions, & Relational DBs.",
        tasks: [
          { id: "fs-task-4", text: "Master Next.js App Router, Server Components, and API Routes" },
          { id: "fs-task-5", text: "Design Relational Schema in PostgreSQL using Prisma/Drizzle ORM" },
          { id: "fs-task-6", text: "Implement OAuth2 & JWT Session Authentication securely" },
        ],
        proTip: "Understand client vs server component boundaries in Next.js to avoid bundle size bloat."
      },
      {
        id: "fs-3",
        title: "Level 3: Scalability, Caching & DevOps",
        duration: "Weeks 9 - 14",
        tag: "Production Ready",
        description: "Scale applications with Redis caching, WebSockets, Docker, and CI/CD pipelines.",
        tasks: [
          { id: "fs-task-7", text: "Add Redis layer for rate-limiting and query result caching" },
          { id: "fs-task-8", text: "Containerize application using Docker multi-stage builds" },
          { id: "fs-task-9", text: "Set up automated GitHub Actions workflow for linting, testing & deployment" },
        ],
        proTip: "Deploying a containerized app demonstrates mid-level engineering maturity to hiring managers."
      }
    ]
  },
  {
    id: "company-speedrun",
    name: "Target Company Playbooks",
    badge: "Company Specific",
    icon: Building2,
    description: "Tailored preparation strategies for Tier-1 Product Tech, High-Growth Startups & IT Services.",
    targetRole: "Amazon, Swiggy, Razorpay, Infosys SP, TCS Digital",
    estimatedDuration: "4 - 8 Weeks",
    steps: [
      {
        id: "comp-1",
        title: "Tier-1 Product Giants (Amazon, Swiggy, Flipkart)",
        duration: "4 - 6 Weeks",
        tag: "Product Tech",
        description: "Focused strategy for heavy DSA screenings, System Design basics, & STAR interviews.",
        tasks: [
          { id: "comp-task-1", text: "Solve Top 50 Amazon/Swiggy tagged DSA questions (PriorityQueue, Trees, BFS)" },
          { id: "comp-task-2", text: "Draft 2 STAR stories for each Leadership Principle (Customer Obsession, Ownership)" },
          { id: "comp-task-3", text: "Study High Level Design basics: Load Balancers, Database Sharding, Caching" },
        ],
        proTip: "At Amazon, behavioral questions carry equal weight as coding. Prepare structured STAR responses."
      },
      {
        id: "comp-2",
        title: "High-Growth Startups (Razorpay, Zerodha, CRED)",
        duration: "3 - 4 Weeks",
        tag: "Speed & Execution",
        description: "Cracking fast-paced startups where live execution & GitHub proof matter most.",
        tasks: [
          { id: "comp-task-4", text: "Build a mini project demonstrating clean architecture & unit tests" },
          { id: "comp-task-5", text: "Practice machine coding rounds (build a feature live in 90 minutes)" },
          { id: "comp-task-6", text: "Direct message CTOs / Tech Leads on X/LinkedIn with specific code feedback" },
        ],
        proTip: "Startups care about how fast you ship high-quality code. Show live links and clean code repos."
      },
      {
        id: "comp-3",
        title: "Service Giants Premium Track (Infosys SP, TCS Digital, Wipro Turbo)",
        duration: "2 - 3 Weeks",
        tag: "Mass Recruiter Premium",
        description: "Target 7-10 LPA premium roles in service companies via special coding contests.",
        tasks: [
          { id: "comp-task-7", text: "Master SQL queries (Joins, Aggregations, Group By, Subqueries)" },
          { id: "comp-task-8", text: "Solve HackWithInfy / TCS CodeVita previous year advanced coding problems" },
          { id: "comp-task-9", text: "Brush up Core CS fundamentals (OOPs, DBMS, Operating Systems, Computer Networks)" },
        ],
        proTip: "InfyTQ / HackWithInfy top performers skip standard rounds directly to 9.5 LPA SP interviews."
      }
    ]
  }
];

const DEFAULT_SCORE_RESULT: ScoreResult = {
  score: 42,
  riskLevel: "HIGH",
  careerType: "Tier-3 Engineering Student",
  roast: "Solid start, but your portfolio lacks live proof and your resume ATS score needs optimization.",
  strengths: ["Basic DSA logic", "Good enthusiasm"],
  weaknesses: ["No live project URL", "Low ATS resume score", "Zero mock interview practice"],
  biggestGap: "Interview readiness",
  strongestArea: "DSA Fundamentals"
};

export default function RoadmapPage() {
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [scoreResult] = useLocalStorage<ScoreResult>("bec-score-result", DEFAULT_SCORE_RESULT);
  const [completedTasks, setCompletedTasks] = useLocalStorage<string[]>("bec-roadmap-completed-tasks", []);
  
  const [activeTrackId, setActiveTrackId] = useState<string>("90-day-sde");
  const [academicYear, setAcademicYear] = useState<"1-2" | "3" | "4">("4");
  const [dailyHours, setDailyHours] = useState<"1-2" | "3-4" | "6+">("3-4");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTrack = useMemo(() => {
    return ROADMAP_TRACKS.find(t => t.id === activeTrackId) || ROADMAP_TRACKS[0];
  }, [activeTrackId]);

  // Calculate progress for current track
  const trackTaskIds = useMemo(() => {
    return activeTrack.steps.flatMap(s => s.tasks.map(t => t.id));
  }, [activeTrack]);

  const completedInTrack = useMemo(() => {
    return trackTaskIds.filter(id => completedTasks.includes(id)).length;
  }, [trackTaskIds, completedTasks]);

  const trackProgressPercent = trackTaskIds.length > 0 
    ? Math.round((completedInTrack / trackTaskIds.length) * 100)
    : 0;

  const handleToggleTask = (taskId: string, taskText: string) => {
    const isAlreadyCompleted = completedTasks.includes(taskId);
    let updatedTasks: string[];

    if (isAlreadyCompleted) {
      updatedTasks = completedTasks.filter(id => id !== taskId);
      setCompletedTasks(updatedTasks);
    } else {
      updatedTasks = [...completedTasks, taskId];
      setCompletedTasks(updatedTasks);
      
      // Award XP for completing roadmap milestone
      const updatedXP = awardXP("challenge_complete", userXP, `Milestone: ${taskText.slice(0, 30)}...`);
      setUserXP(updatedXP);
      
      showToast(`🎉 Milestone Completed! +50 XP Earned.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Schedule recommendation calculation
  const scheduleRecommendation = useMemo(() => {
    let focus = "";
    let breakdown = "";

    if (academicYear === "1-2") {
      focus = "DSA Foundations & Web Fundamentals";
      breakdown = "Spend 60% time on C++/Java DSA basics, 40% building small frontend projects.";
    } else if (academicYear === "3") {
      focus = "Full-Stack Project & LeetCode Mediums";
      breakdown = "Spend 50% time on LeetCode Mediums, 30% on 1 major full-stack project, 20% on Core CS subjects.";
    } else {
      focus = "Placement Speedrun & High-Velocity Applying";
      breakdown = "Spend 40% solving high-yield DSA questions, 30% cold outreach/referrals, 30% resume & mock interviews.";
    }

    let dailyPlan = "";
    if (dailyHours === "1-2") {
      dailyPlan = "Focus purely on 1 high-yield problem + 1 small documentation task daily. Consistency over volume.";
    } else if (dailyHours === "3-4") {
      dailyPlan = "Standard Grind: 90 mins DSA + 90 mins Project/Resume Work + 30 mins revision daily.";
    } else {
      dailyPlan = "Hardcore Mode: 2.5 hrs DSA + 2.5 hrs Full-Stack Project + 1 hr Interview/Networking daily.";
    }

    return { focus, breakdown, dailyPlan };
  }, [academicYear, dailyHours]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* ── Toast Feedback Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-foreground text-white px-5 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-3 font-mono text-xs"
          >
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header & Hero ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand" className="flex items-center gap-1">
              <Compass size={12} className="text-amber-600" />
              <span>Career Roadmap</span>
            </Badge>
            <span className="text-xs text-muted font-mono font-semibold">2026 Edition</span>
            {scoreResult && (
              <Badge variant="dark" className="font-mono">
                Berojgar Score: {scoreResult.score}/100
              </Badge>
            )}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            No-Fluff Engineering Placement Roadmap
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            Stop watching 100-hour tutorial videos without writing code. Follow structured, actionable milestones engineered to get you hired.
          </p>
        </div>

        {/* ── Diagnostic Status Box ── */}
        <div className="shrink-0 bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <p className="text-[11px] text-muted font-mono uppercase tracking-wider">Your Readiness Tier</p>
            <p className="text-base font-bold text-foreground font-heading mt-0.5">
              {scoreResult?.careerType || "Assessment Pending"}
            </p>
            <p className="text-xs text-muted font-mono mt-0.5 max-w-[200px] truncate">
              Gap: {scoreResult?.weaknesses?.[0] || "Take assessment to diagnose"}
            </p>
          </div>
          <div className="h-full w-px bg-border hidden sm:block" />
          <Link href="/assessment">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-bold font-mono">
              <RotateCcw size={13} />
              <span>{scoreResult ? "Retake Assessment" : "Take Reality Check"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Personalized Study Schedule Filter ── */}
      <Card className="p-6 bg-gradient-to-r from-surface via-white to-surface border-border space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-amber-500" />
            <h2 className="font-heading text-base font-bold text-foreground">
              Customize Your Action Plan
            </h2>
          </div>
          <span className="text-xs text-muted font-mono">Instant Pace Calculator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Calendar size={14} className="text-muted" />
              <span>Current Academic Status</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAcademicYear("1-2")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  academicYear === "1-2"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                1st / 2nd Year
              </button>
              <button
                onClick={() => setAcademicYear("3")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  academicYear === "3"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                3rd Year
              </button>
              <button
                onClick={() => setAcademicYear("4")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  academicYear === "4"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                4th Year / Grad
              </button>
            </div>
          </div>

          {/* Time Commitment Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock size={14} className="text-muted" />
              <span>Daily Study Time</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDailyHours("1-2")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  dailyHours === "1-2"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                1 - 2 Hours/day
              </button>
              <button
                onClick={() => setDailyHours("3-4")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  dailyHours === "3-4"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                3 - 4 Hours/day
              </button>
              <button
                onClick={() => setDailyHours("6+")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  dailyHours === "6+"
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-muted hover:border-foreground/50"
                }`}
              >
                6+ Hrs Grind
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Advice Card */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold">
            <Zap size={14} />
            <span>Target Priority: {scheduleRecommendation.focus}</span>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            {scheduleRecommendation.breakdown}
          </p>
          <p className="text-muted italic pt-1 border-t border-amber-500/20">
            &gt; {scheduleRecommendation.dailyPlan}
          </p>
        </div>
      </Card>

      {/* ── Track Switcher Tabs ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Layers size={20} className="text-amber-500" />
              <span>Select Roadmap Track</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">Switch between specialized preparation blueprints</p>
          </div>

          <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border overflow-x-auto">
            {ROADMAP_TRACKS.map((track) => {
              const Icon = track.icon;
              const isActive = activeTrackId === track.id;

              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrackId(track.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-foreground text-white shadow-xs"
                      : "text-muted hover:text-foreground hover:bg-white"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-amber-400" : ""} />
                  <span>{track.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Track Overview Banner */}
        <Card className="p-6 bg-surface border-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="warning">{activeTrack.badge}</Badge>
                <span className="text-xs font-mono text-muted">{activeTrack.estimatedDuration}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                {activeTrack.name}
              </h3>
              <p className="text-xs text-muted max-w-2xl leading-relaxed">
                {activeTrack.description}
              </p>
            </div>

            {/* Track Progress Indicator */}
            <div className="shrink-0 bg-white border border-border rounded-xl p-4 space-y-2 min-w-[200px]">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-muted">Track Progress</span>
                <span className="text-foreground">{trackProgressPercent}%</span>
              </div>
              <Progress value={trackProgressPercent} />
              <p className="text-[11px] text-muted font-mono text-right">
                {completedInTrack} of {trackTaskIds.length} tasks done
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
            <span className="flex items-center gap-1">
              <Target size={14} className="text-amber-500" />
              <strong>Target Roles:</strong> {activeTrack.targetRole}
            </span>
          </div>
        </Card>

        {/* ── Interactive Steps Timeline ── */}
        <div className="space-y-6 relative before:absolute before:left-4 sm:before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
          {activeTrack.steps.map((step, stepIndex) => {
            const stepTaskIds = step.tasks.map(t => t.id);
            const stepCompletedCount = stepTaskIds.filter(id => completedTasks.includes(id)).length;
            const isStepComplete = stepCompletedCount === stepTaskIds.length && stepTaskIds.length > 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: stepIndex * 0.05 }}
                className="relative pl-10 sm:pl-14 space-y-4"
              >
                {/* Timeline Circle Marker */}
                <div 
                  className={`absolute left-1 sm:left-3 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isStepComplete
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-foreground text-foreground"
                  }`}
                >
                  {isStepComplete ? <Check size={14} /> : stepIndex + 1}
                </div>

                {/* Step Card */}
                <Card className="p-6 bg-white border-border space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={isStepComplete ? "success" : "default"}>
                          {step.tag}
                        </Badge>
                        <span className="text-xs font-mono text-muted">{step.duration}</span>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-foreground">
                        {step.title}
                      </h4>
                    </div>

                    <div className="text-xs font-mono text-muted">
                      {stepCompletedCount} / {step.tasks.length} Done
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Tasks List */}
                  <div className="space-y-2.5 pt-1">
                    {step.tasks.map((task) => {
                      const isDone = completedTasks.includes(task.id);

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id, task.text)}
                          className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isDone
                              ? "bg-emerald-500/5 border-emerald-500/20 text-muted line-through"
                              : "bg-surface/50 border-border hover:border-foreground/40 text-foreground"
                          }`}
                        >
                          <div className="mt-0.5 text-foreground shrink-0">
                            {isDone ? (
                              <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle size={16} className="text-muted group-hover:text-foreground transition-colors" />
                            )}
                          </div>

                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-medium leading-normal">
                              {task.text}
                            </span>

                            {task.link && (
                              <Link
                                href={task.link}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline shrink-0 font-mono"
                              >
                                <span>{task.linkText || "Action"}</span>
                                <ArrowRight size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pro-Tip Callout */}
                  <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-start gap-2.5 font-mono text-xs">
                    <Sparkles size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Pro Tip: </strong>
                      <span className="text-muted">{step.proTip}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* ── Quick Action Hub Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            <span>Integrate With Practice Labs</span>
          </h2>
          <span className="text-xs font-mono text-muted">Execute Roadmap Directly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-border space-y-3 hover:border-foreground/40 transition-all group">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 w-fit">
              <Code2 size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                Real-World DSA Lab
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Solve real engineering scenarios (Swiggy routes, Google Maps trees).
              </p>
            </div>
            <Link href="/real-world-dsa">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs font-bold mt-2">
                <span>Enter Lab</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </Card>

          <Card className="p-5 bg-white border-border space-y-3 hover:border-foreground/40 transition-all group">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
              <Flame size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                Daily Grind Challenge
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Solve 1 handpicked daily problem to maintain your streak & XP.
              </p>
            </div>
            <Link href="/daily-challenge">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs font-bold mt-2">
                <span>Daily Grind</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </Card>

          <Card className="p-5 bg-white border-border space-y-3 hover:border-foreground/40 transition-all group">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 w-fit">
              <FileCheck size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-rose-600 transition-colors">
                AI Resume Roast
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Get brutal ATS feedback and fix top 5 resume reject triggers.
              </p>
            </div>
            <Link href="/resume">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs font-bold mt-2">
                <span>Roast Resume</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </Card>

          <Card className="p-5 bg-white border-border space-y-3 hover:border-foreground/40 transition-all group">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 w-fit">
              <Rocket size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-purple-600 transition-colors">
                Referral Queue
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Join verified candidate queue to get referred by SDE alumni.
              </p>
            </div>
            <Link href="/referrals">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs font-bold mt-2">
                <span>View Queue</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* ── Frequently Asked Questions ── */}
      <section className="space-y-4 pt-4">
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen size={20} className="text-amber-500" />
          <span>Roadmap FAQ &amp; Reality Checks</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {[
            {
              q: "How many DSA problems do I REALLY need to solve to get placed?",
              a: "Quality over quantity. Solving 60-80 high-yield Medium DSA problems across key patterns (Two Pointers, Sliding Window, Trees, Graphs, BFS/DFS, Heaps) is far more effective than blindly solving 500 Easy problems without understanding underlying patterns."
            },
            {
              q: "What if my CGPA is low (below 7.5 or 7.0)?",
              a: "Off-campus applications, open-source proof, and live GitHub project demos bypass CGPA filters. Focus heavily on Phase 2 (Production Project) and Phase 4 (LinkedIn cold reachouts to tech leads rather than HRs)."
            },
            {
              q: "Is 90 days enough if I start from scratch?",
              a: "Yes, provided you follow the 3-4 hours daily grind discipline. Month 1 builds problem-solving logic, Month 2 builds project proof, and Month 3 converts applications into interview offers."
            },
            {
              q: "Should I focus on Java, Python, or JavaScript?",
              a: "For pure DSA technical rounds, C++ or Java are standard. For full-stack development and shipping fast projects, JavaScript/TypeScript + Node.js/Next.js is the most versatile stack in 2026."
            }
          ].map((item, idx) => {
            const isOpen = expandedFaqIndex === idx;

            return (
              <Card
                key={idx}
                onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                className="p-4 bg-white border-border cursor-pointer hover:border-foreground/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-4 font-bold text-foreground">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : "text-muted"}`}
                  />
                </div>

                {isOpen && (
                  <p className="mt-3 text-muted leading-relaxed pt-3 border-t border-border font-sans text-xs">
                    {item.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
}
