"use client";

import { useState } from "react";
import { DAILY_CHALLENGE_DATA } from "@/lib/community-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Code, CheckCircle2, XCircle, Zap, Flame, Trophy, ChevronRight, Play, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { JUDGE0_LANGUAGES, runCodeOnJudge0, ExecutionResult } from "@/lib/judge0";

import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";
import { Lock } from "lucide-react";

export function DailyChallengeWidget() {
  const { user, requireAuth } = useAuth();
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [activeStep, setActiveStep] = useState<"dsa" | "aptitude" | "sql" | "cs" | "ai">("dsa");

  // Judge0 Online Code Execution states
  const [selectedLangId, setSelectedLangId] = useState<number>(71); // Python 3 default
  const [sourceCode, setSourceCode] = useState<string>(JUDGE0_LANGUAGES[0].defaultCode);
  const [customStdin, setCustomStdin] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  // Quiz states
  const [aptitudeAns, setAptitudeAns] = useState<number | null>(null);
  const [sqlAns, setSqlAns] = useState<number | null>(null);
  const [csAns, setCsAns] = useState<number | null>(null);
  const [aiAns, setAiAns] = useState<number | null>(null);
  const [dsaSubmitted, setDsaSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const challenge = DAILY_CHALLENGE_DATA;

  const handleRunJudge0 = async () => {
    setExecuting(true);
    setExecResult(null);
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
      total: updated.total + 100, // Extra bonus to total +150 XP
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
  };


  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Daily Engineering Grind</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Daily Coding & Aptitude Challenge</h2>
          <p className="text-xs text-muted mt-1">
            Solve today&apos;s 5-part problem set to maintain your streak and earn +150 XP on the Leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Flame size={14} className="fill-amber-500 text-amber-500" />
            <span>{userXP.streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Step Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: "dsa", label: "1. DSA Problem" },
          { id: "aptitude", label: "2. Aptitude Quant" },
          { id: "sql", label: "3. SQL Query" },
          { id: "cs", label: "4. CS Fundamentals" },
          { id: "ai", label: "5. AI & ML MCQ" },
        ].map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id as typeof activeStep)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-[8px] transition-colors shrink-0 ${
              activeStep === step.id
                ? "bg-foreground text-white"
                : "bg-surface text-muted hover:text-foreground border border-border"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Main Challenge Card */}
      <div className="rounded-[16px] border border-border bg-white p-6 shadow-xs space-y-6">
        {/* Step 1: DSA with Judge0 Online Code Compiler */}
        {activeStep === "dsa" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-bold text-foreground">{challenge.dsa.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="warning">{challenge.dsa.difficulty}</Badge>
                <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Judge0 CE Engine
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">{challenge.dsa.description}</p>

            {/* Language & Compiler Selector */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-brand" />
                <label className="text-xs font-bold text-foreground">Language:</label>
                <select
                  value={selectedLangId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedLangId(id);
                    const lang = JUDGE0_LANGUAGES.find((l) => l.id === id);
                    if (lang) setSourceCode(lang.defaultCode);
                  }}
                  className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground outline-none shadow-2xs"
                >
                  {JUDGE0_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[10px] font-mono text-muted">API: ce.judge0.com</span>
            </div>

            {/* Code Editor */}
            <div className="space-y-1">
              <textarea
                rows={10}
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full rounded-[10px] border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400 outline-none resize-none leading-relaxed shadow-inner"
              />
            </div>

            {/* Optional STDIN Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-muted">Standard Input (stdin)</label>
              <input
                type="text"
                placeholder="Optional input passed to standard input..."
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground outline-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="dark"
                size="sm"
                onClick={handleRunJudge0}
                disabled={executing}
                className="gap-2 text-xs font-bold"
              >
                {executing ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                <span>{executing ? "Compiling on Judge0 CE..." : "Run Code (Judge0 CE)"}</span>
              </Button>

              {execResult?.status && (
                <span className={`text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono ${
                  execResult.status.id === 3
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-rose-50 text-rose-700 border-rose-300"
                }`}>
                  {execResult.status.id === 3 ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  <span>{execResult.status.description}</span>
                </span>
              )}
            </div>

            {/* Output Execution Terminal Console */}
            {execResult && (
              <div className="rounded-[12px] border border-slate-800 bg-slate-900 p-4 text-xs font-mono space-y-2 text-slate-100 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                  <span>TERMINAL EXECUTION OUTPUT</span>
                  <span>
                    Time: {execResult.time || "0.00"}s • Memory: {execResult.memory || 0} KB
                  </span>
                </div>

                {execResult.stdout && (
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">Standard Output (stdout):</span>
                    <pre className="text-emerald-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-md border border-slate-800">{execResult.stdout}</pre>
                  </div>
                )}

                {execResult.stderr && (
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mb-1">Standard Error (stderr):</span>
                    <pre className="text-rose-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-md border border-slate-800">{execResult.stderr}</pre>
                  </div>
                )}

                {execResult.compile_output && (
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">Compiler Output:</span>
                    <pre className="text-amber-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-md border border-slate-800">{execResult.compile_output}</pre>
                  </div>
                )}

                {execResult.error && (
                  <div className="text-rose-400 font-bold">{execResult.error}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Aptitude */}
        {activeStep === "aptitude" && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">{challenge.aptitude.question}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {challenge.aptitude.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAptitudeAns(i)}
                  className={`rounded-[10px] border p-3 text-left text-xs font-medium transition-all ${
                    aptitudeAns === i
                      ? i === challenge.aptitude.correctIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-rose-500 bg-rose-50 text-rose-900"
                      : "border-border bg-white text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {aptitudeAns !== null && (
              <p className="text-xs text-muted bg-surface border border-border p-3 rounded-[8px]">
                <span className="font-bold">Explanation:</span> {challenge.aptitude.explanation}
              </p>
            )}
          </div>
        )}

        {/* Step 3: SQL */}
        {activeStep === "sql" && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">{challenge.sql.question}</h3>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-[8px] text-xs font-mono">{challenge.sql.schema}</pre>
            <div className="grid gap-2 sm:grid-cols-2">
              {challenge.sql.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSqlAns(i)}
                  className={`rounded-[10px] border p-3 text-left text-xs font-medium transition-all ${
                    sqlAns === i
                      ? i === challenge.sql.correctIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-rose-500 bg-rose-50 text-rose-900"
                      : "border-border bg-white text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: CS Fundamentals */}
        {activeStep === "cs" && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">{challenge.csMcq.question}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {challenge.csMcq.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setCsAns(i)}
                  className={`rounded-[10px] border p-3 text-left text-xs font-medium transition-all ${
                    csAns === i
                      ? i === challenge.csMcq.correctIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-rose-500 bg-rose-50 text-rose-900"
                      : "border-border bg-white text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: AI & ML MCQ */}
        {activeStep === "ai" && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">{challenge.aiMcq.question}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {challenge.aiMcq.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAiAns(i)}
                  className={`rounded-[10px] border p-3 text-left text-xs font-medium transition-all ${
                    aiAns === i
                      ? i === challenge.aiMcq.correctIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-rose-500 bg-rose-50 text-rose-900"
                      : "border-border bg-white text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion CTA */}
      <div className="flex justify-end">
        <Button
          variant="dark"
          size="md"
          disabled={completed}
          onClick={handleFinishChallenge}
          className="gap-2 text-xs font-bold"
        >
          {!user && !completed && <Lock size={13} className="text-amber-400" />}
          {completed
            ? "✓ Challenge Completed (+150 XP Added to Leaderboard!)"
            : "Submit Today's Challenge (+150 XP)"}
        </Button>
      </div>
    </div>
  );
}
