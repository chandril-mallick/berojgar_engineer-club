"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DAILY_CHALLENGE_DATA } from "@/lib/community-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  CheckCircle2,
  XCircle,
  Zap,
  Flame,
  Trophy,
  ChevronRight,
  Play,
  Loader2,
  Lock,
  RotateCcw,
  FileCode,
  Sparkles,
  Terminal,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Send,
  GripVertical,
  Edit3,
  HelpCircle,
  Layers,
  Award,
  ExternalLink
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { JUDGE0_LANGUAGES, runCodeOnJudge0, ExecutionResult } from "@/lib/judge0";
import { getDSAChallenges } from "@/app/actions/dsa";

import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";
import { logProgress } from "@/lib/progress";

export function DailyChallengeWidget() {
  const { user } = useAuth();
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [activeStep, setActiveStep] = useState<"dsa" | "aptitude" | "sql" | "cs" | "ai">("dsa");

  // Challenge data
  const [challenge, setChallenge] = useState(DAILY_CHALLENGE_DATA);

  // Judge0 Online Code Execution states
  const [selectedLangId, setSelectedLangId] = useState<number>(71); // Python 3 default
  const [sourceCode, setSourceCode] = useState<string>("");
  const [customStdin, setCustomStdin] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  // Console fold state
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const [activeLeftTab, setActiveLeftTab] = useState<"statement" | "solution">("statement");

  // Quiz states
  const [aptitudeAns, setAptitudeAns] = useState<number | null>(null);
  const [sqlAns, setSqlAns] = useState<number | null>(null);
  const [csAns, setCsAns] = useState<number | null>(null);
  const [aiAns, setAiAns] = useState<number | null>(null);
  const [dsaSubmitted, setDsaSubmitted] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // Scratchpad state for quizzes
  const [scratchNotes, setScratchNotes] = useState<string>("");

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState<number>(45);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to resolve matching starter code for challenge & language
  const getStarterCodeForLang = useCallback((dsaObj: typeof challenge.dsa, langId: number) => {
    if (dsaObj.starterCode && dsaObj.starterCode[langId]) {
      return dsaObj.starterCode[langId];
    }
    if (dsaObj.codeTemplate) {
      return dsaObj.codeTemplate;
    }
    const langObj = JUDGE0_LANGUAGES.find((l) => l.id === langId);
    return langObj ? langObj.defaultCode : "";
  }, []);

  // Fetch Codeforces challenge if available
  useEffect(() => {
    getDSAChallenges()
      .then((data) => {
        const cf = data.find((c) => c.source === "codeforces");
        if (cf) {
          setChallenge((prev) => {
            const updatedDsa = {
              title: cf.title,
              difficulty: cf.difficulty,
              description: cf.shortDescription,
              codeTemplate: cf.starterCode?.[71] || cf.starterCode?.[63] || "",
              starterCode: cf.starterCode || {},
              testCases: [],
              solutionExplanation: "Refer to the official Codeforces problem page for solution analysis.",
              source: "codeforces",
              url: cf.url,
            };
            return { ...prev, dsa: updatedDsa as any };
          });
        }
      })
      .catch(console.error);
  }, []);

  // Sync starter code whenever challenge or language changes
  useEffect(() => {
    const starter = getStarterCodeForLang(challenge.dsa, selectedLangId);
    setSourceCode(starter);
  }, [challenge.dsa, selectedLangId, getStarterCodeForLang]);

  // Handle panel resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newWidth = (offsetX / rect.width) * 100;
      if (newWidth >= 25 && newWidth <= 75) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleResetCode = () => {
    setSourceCode(getStarterCodeForLang(challenge.dsa, selectedLangId));
  };

  const handleRunJudge0 = async () => {
    if (executing) return;
    setExecuting(true);
    setExecResult(null);
    setIsConsoleOpen(true);

    try {
      const res = await runCodeOnJudge0(sourceCode, selectedLangId, customStdin);
      setExecResult(res);
      if (res.status?.id === 3 && !dsaSubmitted) {
        setDsaSubmitted(true);
        const updated = awardXP("challenge_complete", userXP, "Passed Judge0 DSA Execution (+50 XP)");
        setUserXP(updated);
      }
    } catch (err) {
      console.error("Execution error:", err);
      setExecResult({ error: "Code execution error. Check connection." });
    } finally {
      setExecuting(false);
    }
  };

  const handleFinishChallenge = () => {
    if (completed) return;

    const updated = awardXP("challenge_complete", userXP, "Completed Daily Engineering Challenge (+150 XP)");
    setUserXP({
      ...updated,
      total: updated.total + 100, // Bonus XP increment
      streak: (updated.streak || 0) + 1,
    });
    setCompleted(true);

    if (user) {
      recordWorkSubmission(user.uid, {
        type: "daily_challenge",
        title: "Daily Coding Challenge Completed",
        payload: { date: new Date().toISOString(), xp: 150 },
      });
    }

    logProgress(user?.uid || null, {
      type: "daily-grind",
      refId: new Date().toISOString().split("T")[0],
      title: "Daily Coding Challenge Completed",
      xpEarned: 150,
    });
  };

  const codeLines = sourceCode.split("\n");

  // Check quiz progress count
  const partsCompletedCount =
    (dsaSubmitted ? 1 : 0) +
    (aptitudeAns !== null ? 1 : 0) +
    (sqlAns !== null ? 1 : 0) +
    (csAns !== null ? 1 : 0) +
    (aiAns !== null ? 1 : 0);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden select-none font-sans">
      {/* ── 1. Top LeetCode Header Bar ── */}
      <header className="h-14 border-b border-border bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 font-sans shadow-2xs">
        {/* Left: Title & Streak */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Zap size={16} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base text-foreground leading-none">
                Daily Engineering Grind
              </h1>
              <p className="text-[11px] text-muted font-mono mt-0.5 hidden sm:block">
                5-Part Daily Problem Set &bull; {challenge.date}
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-border hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 font-mono">
              <Flame size={14} className="fill-amber-500 text-amber-500" />
              <span>{userXP.streak} Day Streak</span>
            </span>

            <span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 font-mono">
              <Trophy size={13} className="text-emerald-600" />
              <span>+150 XP</span>
            </span>
          </div>
        </div>

        {/* Center: 5-Part Step Selector */}
        <div className="hidden lg:flex items-center bg-surface p-1 rounded-xl border border-border gap-1 font-mono text-xs">
          {[
            { id: "dsa", label: "1. DSA", done: dsaSubmitted },
            { id: "aptitude", label: "2. Aptitude", done: aptitudeAns !== null },
            { id: "sql", label: "3. SQL", done: sqlAns !== null },
            { id: "cs", label: "4. CS Fund", done: csAns !== null },
            { id: "ai", label: "5. AI & ML", done: aiAns !== null },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id as typeof activeStep)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeStep === step.id
                  ? "bg-foreground text-white shadow-xs"
                  : "text-muted hover:text-foreground hover:bg-white/50"
              }`}
            >
              {step.done && <CheckCircle2 size={12} className="text-emerald-400" />}
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {activeStep === "dsa" && (
            <button
              onClick={handleRunJudge0}
              disabled={executing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-border text-foreground border border-border text-xs font-bold font-mono transition-all disabled:opacity-50"
              title="Run code on Judge0 CE"
            >
              {executing ? (
                <Loader2 size={13} className="animate-spin text-amber-600" />
              ) : (
                <Play size={13} className="fill-current text-emerald-600" />
              )}
              <span className="hidden sm:inline">{executing ? "Compiling..." : "Run Code"}</span>
            </button>
          )}

          <Button
            variant="dark"
            size="sm"
            disabled={completed}
            onClick={handleFinishChallenge}
            className="gap-1.5 text-xs font-bold"
          >
            {completed ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle2 size={13} />
                <span>Challenge Completed (+150 XP)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Send size={13} />
                <span>Submit Grind ({partsCompletedCount}/5)</span>
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Step Switcher Bar */}
      <div className="flex lg:hidden items-center gap-1 overflow-x-auto p-2 border-b border-border bg-surface font-mono text-xs shrink-0">
        {[
          { id: "dsa", label: "1. DSA", done: dsaSubmitted },
          { id: "aptitude", label: "2. Aptitude", done: aptitudeAns !== null },
          { id: "sql", label: "3. SQL", done: sqlAns !== null },
          { id: "cs", label: "4. CS Fund", done: csAns !== null },
          { id: "ai", label: "5. AI MCQ", done: aiAns !== null },
        ].map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id as typeof activeStep)}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 flex items-center gap-1 ${
              activeStep === step.id
                ? "bg-foreground text-white"
                : "bg-white text-muted border border-border"
            }`}
          >
            {step.done && <CheckCircle2 size={12} className="text-emerald-400" />}
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* ── 2. Workspace Body (Two Panel Split) ── */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative"
      >
        {/* ── LEFT PANEL: Problem Details or Quiz Questions ── */}
        <div
          style={{ width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${leftWidth}%` : "100%" }}
          className="w-full lg:w-auto h-full border-b lg:border-b-0 lg:border-r border-border bg-white flex flex-col overflow-hidden shrink-0"
        >
          {/* DSA Step Content */}
          {activeStep === "dsa" && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Left Navigation Bar */}
              <div className="h-10 border-b border-border bg-surface px-4 flex items-center justify-between text-xs font-mono text-muted shrink-0">
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-border">
                  <button
                    onClick={() => setActiveLeftTab("statement")}
                    className={`px-2.5 py-0.5 rounded font-semibold transition-colors ${
                      activeLeftTab === "statement"
                        ? "bg-foreground text-white"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Problem Statement
                  </button>
                  <button
                    onClick={() => setActiveLeftTab("solution")}
                    className={`px-2.5 py-0.5 rounded font-semibold transition-colors ${
                      activeLeftTab === "solution"
                        ? "bg-foreground text-white"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Solution &amp; Editorial
                  </button>
                </div>

                <Badge variant="warning">{challenge.dsa.difficulty}</Badge>
              </div>

              {/* Tab 1: Statement */}
              {activeLeftTab === "statement" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-foreground leading-relaxed scrollbar-thin">
                  <div className="space-y-2 pb-4 border-b border-border">
                    <h2 className="text-xl font-bold font-heading text-foreground">
                      {challenge.dsa.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        {challenge.dsa.difficulty}
                      </span>
                      {(challenge.dsa as any).source === "codeforces" && (
                        <a
                          href={(challenge.dsa as any).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:underline"
                        >
                          <span>via Codeforces</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                      Description
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {challenge.dsa.description}
                    </p>
                  </div>

                  {/* Test Cases / Examples */}
                  {challenge.dsa.testCases && challenge.dsa.testCases.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                        Sample Examples
                      </h3>
                      {challenge.dsa.testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="bg-surface border border-border rounded-xl p-3.5 space-y-1.5 font-mono text-xs"
                        >
                          <div className="font-bold text-emerald-600">Example {idx + 1}:</div>
                          <div>
                            <span className="text-muted">Input: </span>
                            <span className="text-foreground font-bold">{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-muted">Output: </span>
                            <span className="text-foreground font-bold">{tc.output}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Solution & Editorial */}
              {activeLeftTab === "solution" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-foreground leading-relaxed scrollbar-thin">
                  <h3 className="text-base font-bold font-heading text-foreground">
                    Solution Explanation
                  </h3>
                  <div className="bg-surface border border-border p-4 rounded-xl text-xs leading-relaxed text-foreground">
                    {challenge.dsa.solutionExplanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Steps (Aptitude, SQL, CS, AI) */}
          {activeStep !== "dsa" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Step 2: Aptitude */}
              {activeStep === "aptitude" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      PART 2: APTITUDE QUANT
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {challenge.aptitude.question}
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {challenge.aptitude.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setAptitudeAns(i)}
                        className={`rounded-xl border p-4 text-left text-xs font-semibold transition-all ${
                          aptitudeAns === i
                            ? i === challenge.aptitude.correctIndex
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                              : "border-rose-500 bg-rose-50 text-rose-900 shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/30 hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {aptitudeAns === i && (
                            <span>
                              {i === challenge.aptitude.correctIndex ? (
                                <CheckCircle2 size={16} className="text-emerald-600" />
                              ) : (
                                <XCircle size={16} className="text-rose-600" />
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {aptitudeAns !== null && (
                    <div className="text-xs text-muted bg-surface border border-border p-4 rounded-xl space-y-1">
                      <span className="font-bold text-foreground block font-mono uppercase">Explanation:</span>
                      <p>{challenge.aptitude.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: SQL */}
              {activeStep === "sql" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      PART 3: SQL QUERY
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {challenge.sql.question}
                    </h3>
                  </div>

                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono border border-slate-800 overflow-x-auto">
                    {challenge.sql.schema}
                  </pre>

                  <div className="grid gap-3">
                    {challenge.sql.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSqlAns(i)}
                        className={`rounded-xl border p-4 text-left text-xs font-semibold transition-all ${
                          sqlAns === i
                            ? i === challenge.sql.correctIndex
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                              : "border-rose-500 bg-rose-50 text-rose-900 shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/30 hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {sqlAns === i && (
                            <span>
                              {i === challenge.sql.correctIndex ? (
                                <CheckCircle2 size={16} className="text-emerald-600" />
                              ) : (
                                <XCircle size={16} className="text-rose-600" />
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {sqlAns !== null && (
                    <div className="text-xs text-muted bg-surface border border-border p-4 rounded-xl space-y-1">
                      <span className="font-bold text-foreground block font-mono uppercase">Explanation:</span>
                      <p>{challenge.sql.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: CS Fundamentals */}
              {activeStep === "cs" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                      PART 4: CS FUNDAMENTALS ({challenge.csMcq.subject})
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {challenge.csMcq.question}
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {challenge.csMcq.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setCsAns(i)}
                        className={`rounded-xl border p-4 text-left text-xs font-semibold transition-all ${
                          csAns === i
                            ? i === challenge.csMcq.correctIndex
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                              : "border-rose-500 bg-rose-50 text-rose-900 shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/30 hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {csAns === i && (
                            <span>
                              {i === challenge.csMcq.correctIndex ? (
                                <CheckCircle2 size={16} className="text-emerald-600" />
                              ) : (
                                <XCircle size={16} className="text-rose-600" />
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {csAns !== null && (
                    <div className="text-xs text-muted bg-surface border border-border p-4 rounded-xl space-y-1">
                      <span className="font-bold text-foreground block font-mono uppercase">Explanation:</span>
                      <p>{challenge.csMcq.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: AI & ML */}
              {activeStep === "ai" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      PART 5: AI &amp; ML MCQ
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {challenge.aiMcq.question}
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {challenge.aiMcq.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setAiAns(i)}
                        className={`rounded-xl border p-4 text-left text-xs font-semibold transition-all ${
                          aiAns === i
                            ? i === challenge.aiMcq.correctIndex
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                              : "border-rose-500 bg-rose-50 text-rose-900 shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/30 hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {aiAns === i && (
                            <span>
                              {i === challenge.aiMcq.correctIndex ? (
                                <CheckCircle2 size={16} className="text-emerald-600" />
                              ) : (
                                <XCircle size={16} className="text-rose-600" />
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {aiAns !== null && (
                    <div className="text-xs text-muted bg-surface border border-border p-4 rounded-xl space-y-1">
                      <span className="font-bold text-foreground block font-mono uppercase">Explanation:</span>
                      <p>{challenge.aiMcq.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Draggable Divider for Desktop */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          className="hidden lg:flex w-2 bg-border hover:bg-amber-500/50 cursor-col-resize items-center justify-center transition-colors shrink-0 z-10"
        >
          <GripVertical size={12} className="text-muted" />
        </div>

        {/* ── RIGHT PANEL: Code Editor & Console for DSA, or Scratchpad for Quiz ── */}
        <div className="flex-1 h-full bg-white flex flex-col overflow-hidden min-w-0">
          {activeStep === "dsa" ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
              {/* Editor Bar */}
              <div className="h-10 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-xs font-mono text-slate-300 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <FileCode size={14} className="text-emerald-400" />
                    <span>Code Editor</span>
                  </span>

                  {/* Language Selector */}
                  <select
                    value={selectedLangId}
                    onChange={(e) => setSelectedLangId(Number(e.target.value))}
                    className="bg-slate-950 text-slate-100 text-xs font-mono font-semibold px-2.5 py-1 rounded border border-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {JUDGE0_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{codeLines.length} lines</span>
                  <button
                    onClick={handleResetCode}
                    className="hover:text-white transition-colors flex items-center gap-1"
                    title="Reset code to default starter template"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Reset Code</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Textarea with Line Numbers */}
              <div className="flex-1 flex overflow-hidden bg-slate-950 relative">
                {/* Left Gutter: Line Numbers */}
                <div className="w-10 py-3 bg-slate-900 text-slate-500 font-mono text-xs select-none text-right pr-3 border-r border-slate-800 shrink-0 leading-6">
                  {codeLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      const newCode =
                        sourceCode.substring(0, start) + "    " + sourceCode.substring(end);
                      setSourceCode(newCode);
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 4;
                      }, 0);
                    }
                  }}
                  className="flex-1 bg-slate-950 p-3 font-mono text-xs text-emerald-400 outline-none resize-none leading-6 scrollbar-thin"
                />
              </div>

              {/* STDIN Optional Bar */}
              <div className="border-t border-slate-800 bg-slate-900 p-2 px-3 flex items-center gap-2 text-xs font-mono shrink-0">
                <span className="text-slate-400 text-[11px]">stdin:</span>
                <input
                  type="text"
                  placeholder="Optional input passed to standard input..."
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-200 outline-none focus:border-slate-700 text-xs"
                />
              </div>

              {/* Terminal Console Output Section */}
              <div className="border-t border-slate-800 bg-slate-900 flex flex-col shrink-0">
                <button
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  className="w-full h-8 px-4 flex items-center justify-between text-xs font-mono text-slate-300 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Terminal size={13} className="text-amber-400" />
                    <span className="font-bold">Console Output</span>
                    {execResult?.status && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          execResult.status.id === 3
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-rose-950 text-rose-300 border-rose-800"
                        }`}
                      >
                        {execResult.status.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {execResult?.time && (
                      <span className="text-[10px] text-slate-400">
                        {execResult.time}s &bull; {execResult.memory || 0} KB
                      </span>
                    )}
                    {isConsoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </div>
                </button>

                {isConsoleOpen && execResult && (
                  <div className="max-h-48 overflow-y-auto p-4 bg-slate-950 text-xs font-mono space-y-3 text-slate-200 border-t border-slate-800 scrollbar-thin">
                    {execResult.stdout && (
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                          Standard Output (stdout):
                        </span>
                        <pre className="text-emerald-300 whitespace-pre-wrap bg-slate-900 p-2.5 rounded border border-slate-800">
                          {execResult.stdout}
                        </pre>
                      </div>
                    )}

                    {execResult.stderr && (
                      <div>
                        <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mb-1">
                          Standard Error (stderr):
                        </span>
                        <pre className="text-rose-300 whitespace-pre-wrap bg-slate-900 p-2.5 rounded border border-slate-800">
                          {execResult.stderr}
                        </pre>
                      </div>
                    )}

                    {execResult.compile_output && (
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                          Compiler Output:
                        </span>
                        <pre className="text-amber-300 whitespace-pre-wrap bg-slate-900 p-2.5 rounded border border-slate-800">
                          {execResult.compile_output}
                        </pre>
                      </div>
                    )}

                    {execResult.error && (
                      <div className="text-rose-400 font-bold">{execResult.error}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Steps Right Panel: Progress Tracker & Scratchpad */
            <div className="flex-1 flex flex-col h-full bg-surface p-6 space-y-6 overflow-y-auto">
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  <span>Grind Checklist &amp; Scratchpad</span>
                </h3>
                <p className="text-xs text-muted">
                  Track your 5-part challenge completion or use the scratchpad for rough calculations.
                </p>
              </div>

              {/* Progress Checklist Card */}
              <div className="bg-white border border-border rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-foreground">
                  <span>GRIND COMPLETION</span>
                  <span>{partsCompletedCount} / 5 Done</span>
                </div>

                <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-border">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(partsCompletedCount / 5) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1 font-mono text-xs">
                  {[
                    { title: "1. DSA Coding Problem", done: dsaSubmitted },
                    { title: "2. Aptitude Quant", done: aptitudeAns !== null },
                    { title: "3. SQL Query MCQ", done: sqlAns !== null },
                    { title: "4. CS Fundamentals", done: csAns !== null },
                    { title: "5. AI & ML MCQ", done: aiAns !== null },
                  ].map((part, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border"
                    >
                      <span className="text-foreground font-semibold">{part.title}</span>
                      {part.done ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : (
                        <span className="text-muted text-[11px]">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scratchpad Textarea */}
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-xs font-mono font-bold text-muted uppercase flex items-center gap-1.5">
                  <Edit3 size={13} />
                  <span>Scratchpad / Rough Notes</span>
                </label>
                <textarea
                  value={scratchNotes}
                  onChange={(e) => setScratchNotes(e.target.value)}
                  placeholder="Use this space to solve math problems, write draft SQL queries, or take quick notes..."
                  className="flex-1 min-h-[160px] bg-white border border-border p-4 rounded-xl font-mono text-xs text-foreground outline-none focus:border-foreground resize-none leading-relaxed shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
