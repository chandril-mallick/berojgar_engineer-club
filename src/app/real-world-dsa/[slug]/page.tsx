"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { REAL_WORLD_DSA_CHALLENGES, RealWorldDSAChallenge, TestCase } from "@/lib/real-world-dsa-data";
import { JUDGE0_LANGUAGES, runCodeOnJudge0, ExecutionResult } from "@/lib/judge0";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Play,
  Send,
  Loader2,
  Code,
  Cpu,
  BookOpen,
  Sparkles,
  Layers,
  Terminal,
  HelpCircle,
  Award,
  Check,
  Zap
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { useAuth } from "@/hooks/use-auth";
import { saveUserTask } from "@/lib/firestore-service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ScenarioDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const challenge = REAL_WORLD_DSA_CHALLENGES.find((c) => c.slug === resolvedParams.slug);

  if (!challenge) {
    notFound();
  }

  const { user } = useAuth();
  const [completedSlugs, setCompletedSlugs] = useLocalStorage<string[]>(
    "bec-rwdsa-completed",
    []
  );
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);

  const isAlreadySolved = completedSlugs.includes(challenge.slug);

  // Editor & Language states
  const [selectedLangId, setSelectedLangId] = useState<number>(71); // Python default
  const [sourceCode, setSourceCode] = useState<string>(challenge.starterCode[71] || "");
  const [customStdin, setCustomStdin] = useState<string>(challenge.publicTestCases[0]?.input || "");

  // Execution & Test states
  const [executing, setExecuting] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  // Submission validation states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "failed">("idle");
  const [testResults, setTestResults] = useState<
    { description?: string; passed: boolean; actual: string; expected: string }[]
  >([]);

  // Post-solution explanation unlocked state
  const [unlockedExplanation, setUnlockedExplanation] = useState<boolean>(isAlreadySolved);

  // Switch starter code when language changes
  const handleLanguageChange = (langId: number) => {
    setSelectedLangId(langId);
    if (challenge.starterCode[langId]) {
      setSourceCode(challenge.starterCode[langId]);
    }
  };

  // Run Custom Execution (Raw Judge0 Run)
  const handleRunCode = async () => {
    setExecuting(true);
    setExecResult(null);
    try {
      const res = await runCodeOnJudge0(sourceCode, selectedLangId, customStdin);
      setExecResult(res);
    } catch (err) {
      console.error("Judge0 execution failed:", err);
      setExecResult({ error: "Code execution error. Check connection." });
    } finally {
      setExecuting(false);
    }
  };

  // Submit Solution & Test Case Validation
  const handleSubmitSolution = async () => {
    setSubmitting(true);
    setSubmissionStatus("idle");
    setTestResults([]);

    const allTestCases: TestCase[] = [
      ...challenge.publicTestCases,
      ...challenge.hiddenTestCases,
    ];

    let passedAll = true;
    const results = [];

    for (const tc of allTestCases) {
      try {
        const res = await runCodeOnJudge0(sourceCode, selectedLangId, tc.input);
        const actualOutput = (res.stdout || "").trim();
        const expectedOutput = tc.expectedOutput.trim();

        // Check exact or normalized output match
        const passed = actualOutput === expectedOutput || actualOutput.replace(/\r\n/g, "\n") === expectedOutput.replace(/\r\n/g, "\n");

        results.push({
          description: tc.description || "Hidden Test Case",
          passed,
          actual: actualOutput,
          expected: expectedOutput,
        });

        if (!passed) {
          passedAll = false;
        }
      } catch (err) {
        passedAll = false;
        results.push({
          description: tc.description || "Test Case Execution Error",
          passed: false,
          actual: "Execution Error",
          expected: tc.expectedOutput,
        });
      }
    }

    setTestResults(results);

    if (passedAll) {
      setSubmissionStatus("success");
      setUnlockedExplanation(true);

      // Save completion if not already recorded
      if (!completedSlugs.includes(challenge.slug)) {
        const updatedSlugs = [...completedSlugs, challenge.slug];
        setCompletedSlugs(updatedSlugs);

        // Award +100 XP
        const updatedXP = awardXP("challenge_complete", userXP, `Solved Real-World Lab: ${challenge.title} (+100 XP)`);
        setUserXP(updatedXP);

        // Sync with Firestore if logged in
        if (user) {
          saveUserTask(user.uid, {
            taskId: `rwdsa-${challenge.slug}`,
            title: challenge.title,
            category: "Real-World DSA Lab",
            pointsEarned: 100,
          });
        }
      }
    } else {
      setSubmissionStatus("failed");
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/real-world-dsa"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Real-World DSA Lab</span>
        </Link>

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
          {isAlreadySolved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={13} />
              <span>Solved</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Layout (Context/Problem on Left, Code Editor on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column: Problem & Scenario Details (5 cols) ── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-surface border border-border text-muted">
                {challenge.category}
              </span>
              <h1 className="font-heading text-2xl font-bold text-foreground mt-3">
                {challenge.title}
              </h1>
            </div>

            {/* 1. Real-World Context */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Cpu size={14} className="text-amber-600" />
                <span>1. Real-World Engineering Context</span>
              </h3>
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-950 leading-relaxed">
                {challenge.realWorldContext}
              </div>
            </div>

            {/* 2. Problem Statement */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Terminal size={14} className="text-brand" />
                <span>2. The Problem</span>
              </h3>
              <p className="text-xs text-foreground leading-relaxed">
                {challenge.problem}
              </p>
            </div>

            {/* 3 & 4. Input & Output Formats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-surface p-3 rounded-xl border border-border">
                <h4 className="text-[11px] font-bold text-foreground">Expected Input</h4>
                <p className="text-[11px] text-muted leading-snug">{challenge.inputFormat}</p>
              </div>
              <div className="space-y-1.5 bg-surface p-3 rounded-xl border border-border">
                <h4 className="text-[11px] font-bold text-foreground">Expected Output</h4>
                <p className="text-[11px] text-muted leading-snug">{challenge.outputFormat}</p>
              </div>
            </div>

            {/* 5. Constraints */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground">5. Constraints</h4>
              <code className="block text-[11px] font-mono bg-surface p-2.5 rounded-lg border border-border text-foreground">
                {challenge.constraints}
              </code>
            </div>

            {/* 6. DSA Learning Objective */}
            <div className="space-y-2 pt-2 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <BookOpen size={14} className="text-emerald-600" />
                <span>6. DSA Learning Objective</span>
              </h3>
              <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3 text-xs text-emerald-950 leading-relaxed">
                <p className="font-semibold text-emerald-800 mb-1 font-mono">
                  Target DSA: {challenge.dsaConcept}
                </p>
                <p>{challenge.dsaObjective}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Code Editor & Execution Engine (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            {/* Language Bar & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-brand" />
                <span className="text-xs font-bold text-foreground">Language:</span>
                <select
                  value={selectedLangId}
                  onChange={(e) => handleLanguageChange(Number(e.target.value))}
                  className="bg-surface text-xs font-semibold text-foreground px-3 py-1.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  {JUDGE0_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRunCode}
                  disabled={executing || submitting}
                  className="gap-1.5 text-xs"
                >
                  {executing ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                  <span>Run Custom</span>
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSubmitSolution}
                  disabled={executing || submitting}
                  className="gap-1.5 text-xs"
                >
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  <span>Submit &amp; Test</span>
                </Button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted font-mono uppercase">Source Code Solution</label>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full font-mono text-xs bg-gray-950 text-emerald-400 p-4 rounded-xl border border-gray-800 focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed"
                placeholder="Write your DSA solution here..."
              />
            </div>

            {/* Custom STDIN input box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted font-mono uppercase">Custom Test Input (STDIN)</label>
              <textarea
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                rows={3}
                className="w-full font-mono text-xs bg-surface text-foreground p-3 rounded-xl border border-border focus:outline-none"
              />
            </div>

            {/* Single Execution Result Box */}
            {execResult && (
              <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Custom Run Execution Output</span>
                  {execResult.status && (
                    <Badge variant={execResult.status.id === 3 ? "success" : "danger"}>
                      {execResult.status.description}
                    </Badge>
                  )}
                </div>
                {execResult.stdout && (
                  <pre className="font-mono text-xs text-foreground bg-white p-2.5 rounded-lg border border-border whitespace-pre-wrap">
                    {execResult.stdout}
                  </pre>
                )}
                {execResult.stderr && (
                  <pre className="font-mono text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 whitespace-pre-wrap">
                    {execResult.stderr}
                  </pre>
                )}
                {execResult.error && (
                  <p className="text-xs text-rose-600 font-semibold">{execResult.error}</p>
                )}
              </div>
            )}

            {/* Submission Test Cases Verification Banner & Grid */}
            {testResults.length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">Submission Test Results</h4>
                  <Badge variant={submissionStatus === "success" ? "success" : "danger"}>
                    {submissionStatus === "success" ? "All Test Cases Passed!" : "Test Failures Detected"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {testResults.map((tr, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs font-mono flex flex-col space-y-1 ${
                        tr.passed ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-rose-50/60 border-rose-200 text-rose-950"
                      }`}
                    >
                      <div className="flex items-center justify-between font-sans">
                        <span className="font-bold">{tr.description}</span>
                        {tr.passed ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Check size={13} /> Passed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 font-bold">
                            <XCircle size={13} /> Failed
                          </span>
                        )}
                      </div>
                      {!tr.passed && (
                        <div className="pt-1 text-[11px] space-y-0.5">
                          <p><span className="font-semibold text-muted">Expected:</span> {tr.expected}</p>
                          <p><span className="font-semibold text-rose-700">Actual Output:</span> {tr.actual || "(empty)"}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Post-Solution Explanation Section (Revealed after solving) ── */}
          <AnimatePresence>
            {unlockedExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-6 space-y-5 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Sparkles size={18} className="text-emerald-600" />
                    <span>Post-Solution Explanation &amp; Industry Insights</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Unlocked
                  </span>
                </div>

                {/* DSA Used & Why */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">Primary DSA Used</span>
                    <p className="text-xs font-bold text-foreground">{challenge.postSolutionExplanation.dsaUsed}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">Complexity</span>
                    <p className="text-xs font-mono font-semibold text-foreground">
                      Time: {challenge.postSolutionExplanation.timeComplexity}
                    </p>
                    <p className="text-xs font-mono text-muted">
                      Space: {challenge.postSolutionExplanation.spaceComplexity}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">Why Use This DSA?</span>
                  <p className="text-xs text-foreground leading-relaxed">
                    {challenge.postSolutionExplanation.why}
                  </p>
                </div>

                {/* Where this concept is used in real applications */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Where This Concept Is Used In Real Applications:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {challenge.postSolutionExplanation.realWorldApplications.map((app, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-foreground bg-white px-3 py-2 rounded-lg border border-emerald-200"
                      >
                        <Zap size={13} className="text-amber-500 shrink-0" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
