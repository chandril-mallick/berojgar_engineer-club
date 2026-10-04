"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REAL_WORLD_DSA_CHALLENGES, TestCase } from "@/lib/real-world-dsa-data";
import { JUDGE0_LANGUAGES, runCodeOnJudge0, ExecutionResult } from "@/lib/judge0";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Play,
  Send,
  Loader2,
  Code2,
  Cpu,
  BookOpen,
  Sparkles,
  Terminal,
  RotateCcw,
  Copy,
  Check,
  Building2,
  Clock,
  HardDrive,
  FileCode,
  CheckCheck,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { useAuth } from "@/hooks/use-auth";
import { saveUserTask } from "@/lib/firestore-service";
import { logProgress } from "@/lib/progress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Clean Starter Code Templates (Empty boilerplate for user to code from scratch)
const STARTER_TEMPLATES: Record<number, string> = {
  71: `# Python 3 Starter Template
import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    # TODO: Write your solution logic here
    
    pass

if __name__ == "__main__":
    solve()
`,
  54: `// C++ Starter Template
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // TODO: Write your solution logic here

    return 0;
}
`,
  62: `// Java Starter Template
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // TODO: Write your solution logic here

    }
}
`,
  63: `// JavaScript (Node.js) Starter Template
const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === '') return;

    // TODO: Write your solution logic here

}

solve();
`,
  74: `// TypeScript Starter Template
import * as fs from 'fs';

function solve(): void {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === '') return;

    // TODO: Write your solution logic here

}

solve();
`
};

export default function CleanDSAWorkspacePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const challenge = REAL_WORLD_DSA_CHALLENGES.find((c) => c.slug === resolvedParams.slug);

  if (!challenge) {
    notFound();
  }
  const currentChallenge = challenge;

  const { user } = useAuth();
  const [completedSlugs, setCompletedSlugs] = useLocalStorage<string[]>(
    "bec-rwdsa-completed",
    []
  );
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);

  const isAlreadySolved = completedSlugs.includes(challenge.slug);

  // Left panel active tab: 'description' | 'editorial' | 'submissions'
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "editorial" | "submissions">(
    "description"
  );

  // Bottom console active tab: 'testcases' | 'testresult'
  const [activeConsoleTab, setActiveConsoleTab] = useState<"testcases" | "testresult">("testcases");
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);

  // Language & Code states (Initializes with CLEAN STARTER TEMPLATE, NOT FULL SOLUTION)
  const [selectedLangId, setSelectedLangId] = useState<number>(71); // Python 3 default
  const [sourceCode, setSourceCode] = useState<string>(
    STARTER_TEMPLATES[71]
  );
  const [customStdin, setCustomStdin] = useState<string>(challenge.publicTestCases?.[0]?.input || "");

  // Execution & Test states
  const [executing, setExecuting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);

  // Submission validation state
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "accepted" | "wrong" | "error">("idle");
  const [testResults, setTestResults] = useState<
    { description?: string; passed: boolean; actual: string; expected: string; input: string }[]
  >([]);
  const [passCount, setPassCount] = useState<number>(0);
  const [totalCasesCount, setTotalCasesCount] = useState<number>(0);
  const [executionTimeMs, setExecutionTimeMs] = useState<string>("14 ms");
  const [executionMemoryMb, setExecutionMemoryMb] = useState<string>("13.9 MB");

  // Editorial solution unlocked state
  const [unlockedEditorial, setUnlockedEditorial] = useState<boolean>(isAlreadySolved);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Submissions history local state
  const [submissionsHistory, setSubmissionsHistory] = useLocalStorage<
    { id: string; status: "Accepted" | "Wrong Answer" | "Runtime Error"; time: string; lang: string; runtime: string }[]
  >(`bec-rwdsa-history-${challenge.slug}`, []);

  // Update code to starter template when language changes
  const handleLanguageChange = (langId: number) => {
    setSelectedLangId(langId);
    setSourceCode(STARTER_TEMPLATES[langId] || STARTER_TEMPLATES[71]);
  };

  const handleResetCode = () => {
    setSourceCode(STARTER_TEMPLATES[selectedLangId] || STARTER_TEMPLATES[71]);
  };

  // Handle Tab key in text editor
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = sourceCode.substring(0, start) + "    " + sourceCode.substring(end);
      setSourceCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // 1. RUN CODE against sample / active testcase
  async function handleRunCode() {
    if (executing || submitting) return;
    setExecuting(true);
    setIsConsoleOpen(true);
    setActiveConsoleTab("testresult");
    setSubmissionStatus("idle");
    setRunResult(null);

    const activeInput = currentChallenge.publicTestCases?.[activeCaseIndex]?.input || customStdin;

    try {
      const res = await runCodeOnJudge0(sourceCode, selectedLangId, activeInput);
      setRunResult(res);
      const elapsedSeconds = typeof res.time === "number" ? res.time : Number.parseFloat(res.time ?? "");
      setExecutionTimeMs(Number.isFinite(elapsedSeconds) ? `${Math.max(1, Math.round(elapsedSeconds * 1000))} ms` : "—");
    } catch (err) {
      setRunResult({ error: "Execution error. Please check your network." });
    } finally {
      setExecuting(false);
    }
  }

  // 2. SUBMIT CODE against full test suite (public + hidden)
  async function handleSubmitCode() {
    if (submitting || executing) return;
    setSubmitting(true);
    setIsConsoleOpen(true);
    setActiveConsoleTab("testresult");
    setSubmissionStatus("idle");
    setTestResults([]);

    const allTestCases: TestCase[] = [
      ...(currentChallenge.publicTestCases || []),
      ...(currentChallenge.hiddenTestCases || []),
    ];

    setTotalCasesCount(allTestCases.length);

    let passedCounter = 0;
    const results = [];
    let overallStatus: "accepted" | "wrong" | "error" = "accepted";

    for (const tc of allTestCases) {
      try {
        const res = await runCodeOnJudge0(sourceCode, selectedLangId, tc.input);
        const actualOutput = (res.stdout || "").trim();
        const expectedOutput = tc.expectedOutput.trim();

        const passed =
          actualOutput === expectedOutput ||
          actualOutput.replace(/\r\n/g, "\n") === expectedOutput.replace(/\r\n/g, "\n");

        if (passed) {
          passedCounter++;
        } else {
          overallStatus = "wrong";
        }

        results.push({
          description: tc.description || "Test Case",
          passed,
          actual: actualOutput || (res.stderr ? `Error: ${res.stderr}` : "No output"),
          expected: expectedOutput,
          input: tc.input
        });
      } catch (err) {
        overallStatus = "error";
        results.push({
          description: tc.description || "Execution Error",
          passed: false,
          actual: "Execution Failure",
          expected: tc.expectedOutput,
          input: tc.input
        });
      }
    }

    setTestResults(results);
    setPassCount(passedCounter);
    setSubmissionStatus(overallStatus);

    const selectedLangObj = JUDGE0_LANGUAGES.find(l => l.id === selectedLangId);
    const langName = selectedLangObj ? selectedLangObj.name : "Python 3";

    if (overallStatus === "accepted") {
      setUnlockedEditorial(true);

      if (!completedSlugs.includes(currentChallenge.slug)) {
        const updatedSlugs = [...completedSlugs, currentChallenge.slug];
        setCompletedSlugs(updatedSlugs);

        const updatedXP = awardXP(
          "challenge_complete",
          userXP,
          `Solved Real-World Lab: ${currentChallenge.title} (+100 XP)`
        );
        setUserXP(updatedXP);

        if (user) {
          saveUserTask(user.uid, {
            taskId: `rwdsa-${currentChallenge.slug}`,
            title: currentChallenge.title,
            category: "Real-World DSA Lab",
            pointsEarned: 100,
          });
        }

        logProgress(user?.uid || null, {
          type: "dsa-lab",
          refId: currentChallenge.slug,
          title: currentChallenge.title,
          difficulty: currentChallenge.difficulty,
          xpEarned: 100
        });
      }

      setSubmissionsHistory((history) => [
        {
          id: `sub-${crypto.randomUUID()}`,
          status: "Accepted",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lang: langName,
          runtime: "14 ms"
        },
        ...history.slice(0, 9)
      ]);
    } else {
      setSubmissionsHistory((history) => [
        {
          id: `sub-${crypto.randomUUID()}`,
          status: overallStatus === "wrong" ? "Wrong Answer" : "Runtime Error",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lang: langName,
          runtime: "0 ms"
        },
        ...history.slice(0, 9)
      ]);
    }

    setSubmitting(false);
  }

  // Keyboard shortcut listener (Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          void handleSubmitCode();
        } else {
          void handleRunCode();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sourceCode, selectedLangId, customStdin]);

  const handleCopyFullSolution = () => {
    const fullSolution = challenge.starterCode?.[selectedLangId] || challenge.starterCode?.[71] || "";
    navigator.clipboard.writeText(fullSolution);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codeLines = sourceCode.split("\n");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-surface text-foreground overflow-hidden select-none font-sans">
      
      {/* ── 1. Clean Top Navigation Bar ── */}
      <div className="h-12 border-b border-border bg-white px-4 flex items-center justify-between shrink-0 font-mono text-xs shadow-xs">
        {/* Left: Back Link & Problem Meta */}
        <div className="flex items-center gap-3">
          <Link
            href="/real-world-dsa"
            className="p-1.5 rounded-lg bg-surface hover:bg-border text-muted hover:text-foreground transition-colors"
            title="Back to Problem List"
          >
            <ChevronLeft size={16} />
          </Link>

          <span className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 font-sans font-bold text-sm">
            <span className="text-foreground">{challenge.title}</span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                challenge.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : challenge.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              }`}
            >
              {challenge.difficulty}
            </span>
            {isAlreadySolved && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 size={12} />
                <span>Solved</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Left Panel Tab Switcher */}
        <div className="flex items-center bg-surface p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveLeftTab("description")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeLeftTab === "description"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveLeftTab("editorial")}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              activeLeftTab === "editorial"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            {unlockedEditorial ? <Unlock size={12} className="text-emerald-600" /> : <Lock size={12} />}
            <span>Editorial &amp; Solution</span>
          </button>
          <button
            onClick={() => setActiveLeftTab("submissions")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeLeftTab === "submissions"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Submissions ({submissionsHistory.length})
          </button>
        </div>

        {/* Right: Actions (Run & Submit) */}
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <button
            onClick={handleRunCode}
            disabled={executing || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-border text-foreground border border-border text-xs font-bold transition-all disabled:opacity-50"
            title="Run code against sample input (Ctrl+Enter)"
          >
            {executing ? (
              <Loader2 size={14} className="animate-spin text-amber-600" />
            ) : (
              <Play size={14} className="fill-current text-emerald-600" />
            )}
            <span>Run</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmitCode}
            disabled={submitting || executing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-foreground hover:bg-foreground text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
            title="Submit solution to validate testcases (Ctrl+Shift+Enter)"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <Send size={14} className="fill-current text-emerald-400" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* ── 2. Split Workspace (Left & Right Panels) ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden select-none">
        
        {/* ── LEFT PANE: Description / Editorial / Submissions (5 cols) ── */}
        <div 
          onCopy={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          className="lg:col-span-5 border-r border-border bg-white flex flex-col overflow-hidden select-none"
        >
          
          {/* TAB 1: DESCRIPTION */}
          {activeLeftTab === "description" && (
            <div 
              onCopy={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-foreground leading-relaxed font-sans scrollbar-thin select-none"
            >
              
              {/* Problem Header */}
              <div className="space-y-3 pb-4 border-b border-border">
                <h1 className="text-2xl font-bold text-foreground font-heading">
                  {challenge.title}
                </h1>

                <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold ${
                      challenge.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : challenge.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-surface text-muted border border-border">
                    {challenge.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    +100 XP
                  </span>
                </div>

                {/* Company Tag Badges */}
                <div className="flex items-center gap-1.5 pt-1 text-xs font-mono">
                  <Building2 size={13} className="text-muted" />
                  <span className="text-muted">Companies:</span>
                  <span className="px-2 py-0.5 rounded bg-surface text-foreground border border-border text-[11px]">
                    Swiggy / Zomato
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface text-foreground border border-border text-[11px]">
                    Amazon
                  </span>
                </div>
              </div>

              {/* Real-World Context Card */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs font-mono">
                  <Cpu size={15} />
                  <span>REAL-WORLD ENGINEERING CONTEXT</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {challenge.realWorldContext}
                </p>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Problem Description
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {challenge.problem}
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Examples
                </h3>

                {(challenge.publicTestCases || []).map((tc, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border rounded-xl p-4 space-y-2 font-mono text-xs select-none"
                  >
                    <div className="font-bold text-emerald-600">Example {idx + 1}:</div>
                    <div>
                      <span className="text-muted">Input: </span>
                      <span className="text-foreground font-bold whitespace-pre-wrap">{tc.input}</span>
                    </div>
                    <div>
                      <span className="text-muted">Output: </span>
                      <span className="text-foreground font-bold whitespace-pre-wrap">{tc.expectedOutput}</span>
                    </div>
                    {tc.description && (
                      <div className="pt-1 text-muted italic font-sans text-xs">
                        Explanation: {tc.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Constraints
                </h3>
                <pre className="bg-surface border border-border p-3 rounded-xl text-xs font-mono text-foreground select-none">
                  {challenge.constraints}
                </pre>
              </div>

              {/* Target DSA Concept */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs font-mono">
                  <BookOpen size={14} />
                  <span>TARGET DSA CONCEPT: {challenge.dsaConcept}</span>
                </div>
                <p className="text-xs text-foreground">
                  {challenge.dsaObjective}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EDITORIAL & FULL SOLUTION */}
          {activeLeftTab === "editorial" && (
            <div 
              onCopy={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-foreground leading-relaxed font-sans scrollbar-thin select-none"
            >
              {unlockedEditorial ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h2 className="text-lg font-bold text-foreground font-heading">
                        Editorial &amp; Full Solution
                      </h2>
                      <p className="text-xs text-muted font-mono">
                        Optimal Reference Approach &amp; Complexity Analysis
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-surface text-muted border border-border text-xs font-mono flex items-center gap-1">
                      <Lock size={12} />
                      <span>Copying Disabled</span>
                    </span>
                  </div>

                  {/* Concept & Why */}
                  <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-emerald-700 font-mono uppercase">
                      DSA Choice: {challenge.postSolutionExplanation?.dsaUsed || "N/A"}
                    </h3>
                    <p className="text-xs text-foreground leading-relaxed">
                      {challenge.postSolutionExplanation?.why || "N/A"}
                    </p>
                  </div>

                  {/* Complexity Analysis */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-surface border border-border p-3 rounded-xl">
                      <div className="text-muted">Time Complexity</div>
                      <div className="text-base font-bold text-foreground mt-1">
                        {challenge.postSolutionExplanation?.timeComplexity || "N/A"}
                      </div>
                    </div>
                    <div className="bg-surface border border-border p-3 rounded-xl">
                      <div className="text-muted">Space Complexity</div>
                      <div className="text-base font-bold text-foreground mt-1">
                        {challenge.postSolutionExplanation?.spaceComplexity || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Real World Applications */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted uppercase font-mono">
                      Production Applications
                    </h4>
                    <ul className="space-y-1.5 text-xs text-foreground">
                      {(challenge.postSolutionExplanation?.realWorldApplications || []).map((app, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">&bull;</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full Reference Solution Code */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted uppercase font-mono">
                      Full Reference Code Solution
                    </h4>
                    <pre className="bg-foreground border border-foreground p-4 rounded-xl text-xs font-mono text-surface overflow-x-auto leading-relaxed shadow-sm">
                      {challenge.starterCode?.[selectedLangId] || challenge.starterCode?.[71] || ""}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="p-4 rounded-2xl bg-surface text-amber-600">
                    <Lock size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Full Solution Locked</h3>
                    <p className="text-xs text-muted max-w-xs">
                      Submit a valid solution passing all testcases or unlock the reference solution below.
                    </p>
                  </div>
                  <button
                    onClick={() => setUnlockedEditorial(true)}
                    className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground text-white text-xs font-bold font-mono transition-colors"
                  >
                    Unlock Full Solution
                  </button>
                </div>
              )}
          </div>
          )}

          {/* TAB 3: SUBMISSIONS HISTORY */}
          {activeLeftTab === "submissions" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
              <h2 className="text-base font-bold text-foreground font-heading font-sans">
                Submission History
              </h2>

              {submissionsHistory.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  No submission attempts yet. Click &quot;Submit&quot; to test your code!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {submissionsHistory.map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span
                          className={`font-bold ${
                            sub.status === "Accepted" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {sub.status}
                        </span>
                        <div className="text-[11px] text-muted">
                          {sub.lang} &bull; {sub.time}
                        </div>
                      </div>
                      <span className="text-foreground font-bold">{sub.runtime}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANE: Code Editor & Bottom Console (7 cols) ── */}
        <div className="lg:col-span-7 bg-white flex flex-col overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="h-10 border-b border-border bg-surface px-4 flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-bold flex items-center gap-1.5">
                <FileCode size={14} className="text-emerald-600" />
                <span>Code Editor</span>
              </span>

              {/* Language Selector */}
              <select
                value={selectedLangId}
                onChange={(e) => handleLanguageChange(Number(e.target.value))}
                className="bg-white text-foreground text-xs font-mono font-semibold px-2.5 py-1 rounded border border-border focus:outline-none focus:border-foreground"
              >
                {JUDGE0_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-muted text-[11px]">{codeLines.length} lines</span>
              <button
                onClick={handleResetCode}
                className="hover:text-foreground transition-colors flex items-center gap-1"
                title="Reset code to clean starter template"
              >
                <RotateCcw size={13} />
                <span>Reset Starter Code</span>
              </button>
            </div>
          </div>

          {/* Editor Core Textarea with Line Numbers (CLEAN LIGHT THEME) */}
          <div className="flex-1 flex overflow-hidden bg-white relative">
            {/* Left Gutter: Line Numbers */}
            <div className="w-12 py-3 bg-surface text-muted font-mono text-xs select-none text-right pr-3 border-r border-border shrink-0 leading-6">
              {codeLines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input Textarea */}
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              onPaste={(e) => {
                e.preventDefault();
                alert("Pasting code is disabled in Real-World DSA Lab. Please type out your code to practice!");
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              spellCheck={false}
              className="flex-1 p-3 bg-white text-foreground font-mono text-xs leading-6 resize-none focus:outline-none scrollbar-thin overflow-y-auto whitespace-pre"
              placeholder="// Write your code solution here..."
            />
          </div>

          {/* ── 3. Bottom Interactive Console Panel (CLEAN LIGHT THEME) ── */}
          <div className="border-t border-border bg-surface flex flex-col shrink-0">
            {/* Console Bar Header */}
            <div className="h-9 px-4 border-b border-border flex items-center justify-between text-xs font-mono text-muted">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setActiveConsoleTab("testcases");
                  }}
                  className={`flex items-center gap-1.5 py-1 font-semibold transition-colors ${
                    activeConsoleTab === "testcases" && isConsoleOpen
                      ? "text-foreground border-b-2 border-foreground"
                      : "hover:text-foreground"
                  }`}
                >
                  <Terminal size={13} />
                  <span>Testcase</span>
                </button>

                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setActiveConsoleTab("testresult");
                  }}
                  className={`flex items-center gap-1.5 py-1 font-semibold transition-colors ${
                    activeConsoleTab === "testresult" && isConsoleOpen
                      ? "text-foreground border-b-2 border-foreground"
                      : "hover:text-foreground"
                  }`}
                >
                  <CheckCheck size={13} />
                  <span>Test Result</span>
                </button>
              </div>

              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="hover:text-foreground flex items-center gap-1 text-[11px]"
              >
                <span>Console</span>
                {isConsoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>

            {/* Console Content Body */}
            {isConsoleOpen && (
              <div className="h-44 p-4 overflow-y-auto font-mono text-xs bg-white">
                
                {/* CONSOLE TAB 1: TESTCASES */}
                {activeConsoleTab === "testcases" && (
                  <div className="space-y-3">
                    {/* Case Buttons */}
                    <div className="flex items-center gap-2">
                      {(challenge.publicTestCases || []).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCaseIndex(idx)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            activeCaseIndex === idx
                              ? "bg-foreground text-white"
                              : "bg-surface text-muted hover:text-foreground"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Input Display Box */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-muted">Input =</div>
                      <textarea
                        value={customStdin}
                        onChange={(e) => setCustomStdin(e.target.value)}
                        className="w-full bg-surface border border-border p-2.5 rounded-lg text-foreground font-mono text-xs resize-none focus:outline-none focus:border-foreground"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {/* CONSOLE TAB 2: TEST RESULT / SUBMISSION RESULT */}
                {activeConsoleTab === "testresult" && (
                  <div className="space-y-3">
                    
                    {/* LOADING STATE */}
                    {(executing || submitting) && (
                      <div className="flex items-center gap-3 py-4 text-amber-600">
                        <Loader2 size={18} className="animate-spin" />
                        <span>{submitting ? "Evaluating test cases..." : "Executing code on Judge0..."}</span>
                      </div>
                    )}

                    {/* SUBMISSION RESULT: ACCEPTED */}
                    {submissionStatus === "accepted" && !submitting && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-700">
                          <div className="flex items-center gap-2 font-bold text-sm">
                            <CheckCircle2 size={18} />
                            <span>Accepted</span>
                          </div>
                          <div className="text-xs font-semibold">
                            Passed {passCount}/{totalCasesCount} Testcases
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-muted">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-emerald-600" />
                            <span>Runtime: <strong className="text-foreground">{executionTimeMs}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HardDrive size={13} className="text-emerald-600" />
                            <span>Memory: <strong className="text-foreground">{executionMemoryMb}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBMISSION RESULT: WRONG ANSWER */}
                    {submissionStatus === "wrong" && !submitting && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-700">
                          <div className="flex items-center gap-2 font-bold text-sm">
                            <XCircle size={18} />
                            <span>Wrong Answer</span>
                          </div>
                          <div className="text-xs font-semibold">
                            Passed {passCount}/{totalCasesCount} Testcases
                          </div>
                        </div>

                        {/* Failed Case Diff View */}
                        {testResults.find(r => !r.passed) && (
                          <div className="bg-surface border border-border p-3 rounded-xl space-y-2 text-xs">
                            <div className="text-muted">Failed Case Input:</div>
                            <pre className="text-foreground bg-white p-2 rounded border border-border">
                              {testResults.find(r => !r.passed)?.input}
                            </pre>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-rose-600 font-bold">Your Output:</span>
                                <pre className="text-rose-700 bg-white p-2 rounded mt-1 border border-rose-200">
                                  {testResults.find(r => !r.passed)?.actual}
                                </pre>
                              </div>
                              <div>
                                <span className="text-emerald-600 font-bold">Expected Output:</span>
                                <pre className="text-emerald-700 bg-white p-2 rounded mt-1 border border-emerald-200">
                                  {testResults.find(r => !r.passed)?.expected}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* RUN CODE RESULT */}
                    {runResult && !executing && submissionStatus === "idle" && (
                      <div className="space-y-2">
                        {runResult.error ? (
                          <div className="text-rose-700 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                            {runResult.error}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                              <CheckCircle2 size={15} />
                              <span>Code Executed Successfully ({executionTimeMs})</span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-muted">Standard Output:</div>
                              <pre className="bg-surface border border-border p-3 rounded-xl text-foreground font-mono text-xs whitespace-pre-wrap">
                                {runResult.stdout || "(No output printed)"}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!executing && !submitting && !runResult && submissionStatus === "idle" && (
                      <div className="text-muted text-center py-6">
                        Click &quot;Run&quot; or &quot;Submit&quot; above to see execution results.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
