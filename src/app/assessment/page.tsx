"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { calculateBerojgarScore } from "@/services/scoring";
import { recordWorkSubmission } from "@/services/task-service";
import { saveUserAssessment } from "@/lib/firestore-service";
import { AssessmentInput } from "@/types";
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface QuestionOption {
  label: string;
  sublabel?: string;
  value: string | number;
}

interface QuestionDef {
  id: keyof AssessmentInput | "interviewConfidence" | "targetRole";
  number: string;
  title: string;
  helper: string;
  options: QuestionOption[];
}

const QUESTIONS: QuestionDef[] = [
  {
    id: "year",
    number: "01",
    title: "Which year of engineering are you studying in?",
    helper: "Be honest. Nobody is judging.",
    options: [
      { label: "1st Year", sublabel: "Freshman grind begins", value: "1" },
      { label: "2nd Year", sublabel: "Core CS & initial coding", value: "2" },
      { label: "3rd Year", sublabel: "Pre-final placement prep", value: "3" },
      { label: "Final Year / Graduated", sublabel: "Placement season active", value: "4" },
    ],
  },
  {
    id: "branch",
    number: "02",
    title: "What is your engineering branch?",
    helper: "Select your primary specialization.",
    options: [
      { label: "Computer Science / IT", value: "CSE / IT" },
      { label: "Electronics & Communication (ECE/EEE)", value: "ECE / EEE" },
      { label: "Mechanical / Civil / Allied", value: "Mech / Civil" },
      { label: "Other Branch / Non-Tech", value: "Other Tech" },
    ],
  },
  {
    id: "cgpa",
    number: "03",
    title: "What is your current CGPA?",
    helper: "College grades aren't everything, but recruiters still use them as initial filters.",
    options: [
      { label: "Below 6.0", sublabel: "Strict placement cutoff risk", value: 5.5 },
      { label: "6.0 – 7.0", sublabel: "Clears basic criteria", value: 6.5 },
      { label: "7.0 – 8.5", sublabel: "Solid academic standing", value: 7.8 },
      { label: "8.5+", sublabel: "Top tier academic record", value: 9.0 },
    ],
  },
  {
    id: "projects",
    number: "04",
    title: "How many real projects have you shipped?",
    helper: "College assignments don't count unless you actually built and shipped them.",
    options: [
      { label: "None", sublabel: "Tutorial project count: 0 😭", value: 0 },
      { label: "1", sublabel: "Built one working app", value: 1 },
      { label: "2–3", sublabel: "Deploys & live users", value: 2 },
      { label: "4+", sublabel: "Full production portfolio", value: 4 },
    ],
  },
  {
    id: "internships",
    number: "05",
    title: "How many internships have you completed?",
    helper: "Real industry experience or verified startup work.",
    options: [
      { label: "None", sublabel: "No commercial work experience yet", value: 0 },
      { label: "1 Internship", sublabel: "1–3 months hands-on experience", value: 1 },
      { label: "2+ Internships", sublabel: "Multiple industry roles", value: 2 },
    ],
  },
  {
    id: "github",
    number: "06",
    title: "How active is your GitHub profile?",
    helper: "Your GitHub has entered the interview.",
    options: [
      { label: "No profile yet", sublabel: "Ghost town / empty account", value: "no" },
      { label: "Low Activity", sublabel: "A few random repos", value: "low" },
      { label: "Active", sublabel: "Consistent green squares & real READMEs", value: "yes" },
    ],
  },
  {
    id: "dsa",
    number: "07",
    title: "What is your DSA confidence?",
    helper: "Can you solve a Medium problem without watching a solution video?",
    options: [
      { label: "What is DSA?", sublabel: "Just starting syntax", value: 2 },
      { label: "Basic Arrays & Strings", sublabel: "Familiar with Easy problems", value: 4 },
      { label: "100+ Solved", sublabel: "Comfortable with Trees, Graphs, DP", value: 7 },
      { label: "LeetCode Wizard", sublabel: "Contestant / High rating", value: 9 },
    ],
  },
  {
    id: "interviewConfidence",
    number: "08",
    title: "How confident are you in technical interviews?",
    helper: "Can you explain your thought process out loud while being watched?",
    options: [
      { label: "Panic immediately", sublabel: "Struggle with live coding anxiety", value: 2 },
      { label: "Need heavy prep time", sublabel: "Can solve if given hints", value: 5 },
      { label: "Moderately confident", sublabel: "Can walk through logic clearly", value: 7 },
      { label: "Ready today", sublabel: "Cracked multiple mocks", value: 9 },
    ],
  },
  {
    id: "communication",
    number: "09",
    title: "How strong is your technical communication?",
    helper: "LinkedIn headline ≠ experience. Clear articulation matters.",
    options: [
      { label: "Shy / Nervous in English", sublabel: "Difficulty expressing technical ideas", value: 3 },
      { label: "Basic Conversational", sublabel: "Can answer standard questions", value: 5 },
      { label: "Clear & Fluent", sublabel: "Explains architecture with ease", value: 8 },
      { label: "Pitch Perfect", sublabel: "Highly persuasive & articulate", value: 10 },
    ],
  },
  {
    id: "targetRole",
    number: "10",
    title: "What is your target engineering role?",
    helper: "What role are you aiming for in your career transition?",
    options: [
      { label: "Frontend / Web SDE", value: "Frontend Developer" },
      { label: "Backend / Systems Engineer", value: "Backend SDE" },
      { label: "Full-Stack Developer", value: "Full Stack SDE" },
      { label: "AI / ML / Data Engineer", value: "AI / Data Engineer" },
      { label: "DevOps / Cloud", value: "DevOps Engineer" },
      { label: "Open to any SDE role", value: "Software Engineer" },
    ],
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { user, requireAuth } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState(false);
  const [isCompletedState, setIsCompletedState] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSteps, setAnalyzedSteps] = useState({
    education: false,
    projects: false,
    dsa: false,
    experience: false,
    careerReadiness: false,
  });

  const currentQ = QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const handleSelectOption = (val: string | number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    setValidationError(false);
  };

  const handleNext = () => {
    if (answers[currentQ.id] === undefined || answers[currentQ.id] === null || answers[currentQ.id] === "") {
      setValidationError(true);
      return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setValidationError(false);
    } else {
      setIsCompletedState(true);
    }
  };

  const handleBack = () => {
    if (isCompletedState) {
      setIsCompletedState(false);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setValidationError(false);
    }
  };

  const handleGenerateScore = () => {
    requireAuth(async () => {
      setIsAnalyzing(true);

      // Smooth step-by-step analysis visual sequence (1.5s total)
      setTimeout(() => setAnalyzedSteps((s) => ({ ...s, education: true })), 200);
      setTimeout(() => setAnalyzedSteps((s) => ({ ...s, projects: true })), 500);
      setTimeout(() => setAnalyzedSteps((s) => ({ ...s, dsa: true })), 800);
      setTimeout(() => setAnalyzedSteps((s) => ({ ...s, experience: true })), 1100);
      setTimeout(() => setAnalyzedSteps((s) => ({ ...s, careerReadiness: true })), 1400);

      const payload: AssessmentInput = {
        college: "Engineering College",
        branch: String(answers.branch || "CSE / IT"),
        year: String(answers.year || "4"),
        cgpa: Number(answers.cgpa ?? 7.5),
        projects: Number(answers.projects ?? 1),
        internships: Number(answers.internships ?? 0),
        github: String(answers.github || "no"),
        linkedin: "yes",
        dsa: Number(answers.dsa ?? 5),
        communication: Number(answers.communication ?? 5),
        targetCompany: String(answers.targetRole || "Software Engineer"),
        interviewConfidence: Number(answers.interviewConfidence ?? 5),
        targetRole: String(answers.targetRole || "Software Engineer"),
      };

      let result;
      try {
        result = await calculateBerojgarScore(payload);
      } catch (err) {
        console.error("Score calculation failed:", err);
        setIsAnalyzing(false);
        return;
      }

      // Query AI Coach for roast summary
      try {
        const promptText = `Student Profile: Branch=${payload.branch}, Year=${payload.year}, CGPA=${payload.cgpa}, Projects=${payload.projects}, Internships=${payload.internships}, GitHub=${payload.github}, DSA=${payload.dsa}/10, Interview=${payload.interviewConfidence}/10, Communication=${payload.communication}/10, Target Role=${payload.targetRole}. Calculated Berojgar Score=${result.score}/100.`;

        const res = await fetch("/api/ai-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, mode: "assessment" }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            result = { ...result, roast: data.reply };
          }
        }
      } catch (err) {
        console.warn("AI score roast fallback:", err);
      }

      window.localStorage.setItem("bec-assessment-input", JSON.stringify(payload));
      window.localStorage.setItem("bec-score-result", JSON.stringify(result));

      if (user) {
        await saveUserAssessment(user.uid, {
          score: result.score,
          riskIndex: result.riskLevel === "HIGH" ? "High" : result.riskLevel === "MEDIUM" ? "Medium" : "Low",
          dsaScore: payload.dsa * 10,
          devScore: payload.projects * 20,
          csFundamentalsScore: Math.round(payload.cgpa * 10),
          communicationScore: payload.communication * 10,
          answers: payload,
        });

        await recordWorkSubmission(user.uid, {
          type: "assessment",
          title: "Berojgar Reality Check Assessment",
          payload: { score: result.score, date: new Date().toISOString() },
        });
      }

      setTimeout(() => {
        setIsAnalyzing(false);
        router.push("/score");
      }, 1600);
    }, "Authentication Required: Log in to generate & save your Reality Check score.");
  };

  return (
    <div className="mx-auto max-w-xl py-4 sm:py-8 px-4 select-none">
      {/* ── Page Header ── */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono font-bold text-foreground">
          <Sparkles size={13} className="text-amber-500" />
          REALITY CHECK
        </div>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
          10 QUESTIONS. 60 SECONDS.
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted font-medium">
          Maximum honesty. Minimum drama.
        </p>
      </div>

      {/* ── Analyzing Loading State Screen ── */}
      {isAnalyzing ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-foreground bg-white p-8 rounded-[16px] text-center space-y-6 shadow-md"
        >
          <div className="flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-foreground" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              ANALYZING YOUR PROFILE...
            </h2>
            <p className="text-xs text-muted mt-1 font-mono">
              Running diagnostic assessment against engineering standards
            </p>
          </div>

          <div className="mx-auto max-w-xs space-y-3 text-left font-mono text-xs">
            <div className={`flex items-center gap-2.5 ${analyzedSteps.education ? "text-foreground font-bold" : "text-muted/40"}`}>
              <Check size={14} className={analyzedSteps.education ? "text-emerald-600" : "opacity-0"} />
              <span>Education & Branch</span>
            </div>
            <div className={`flex items-center gap-2.5 ${analyzedSteps.projects ? "text-foreground font-bold" : "text-muted/40"}`}>
              <Check size={14} className={analyzedSteps.projects ? "text-emerald-600" : "opacity-0"} />
              <span>Projects & GitHub Proof</span>
            </div>
            <div className={`flex items-center gap-2.5 ${analyzedSteps.dsa ? "text-foreground font-bold" : "text-muted/40"}`}>
              <Check size={14} className={analyzedSteps.dsa ? "text-emerald-600" : "opacity-0"} />
              <span>DSA & Technical Foundations</span>
            </div>
            <div className={`flex items-center gap-2.5 ${analyzedSteps.experience ? "text-foreground font-bold" : "text-muted/40"}`}>
              <Check size={14} className={analyzedSteps.experience ? "text-emerald-600" : "opacity-0"} />
              <span>Experience & Interview Readiness</span>
            </div>
            <div className={`flex items-center gap-2.5 ${analyzedSteps.careerReadiness ? "text-foreground font-bold" : "text-muted/40"}`}>
              <Check size={14} className={analyzedSteps.careerReadiness ? "text-emerald-600" : "opacity-0"} />
              <span>Career Readiness Score</span>
            </div>
          </div>
        </motion.div>
      ) : isCompletedState ? (
        /* ── Form Completion State ── */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-foreground bg-white p-8 rounded-[16px] space-y-6 shadow-md text-center"
        >
          <div className="space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight">
              THAT&apos;S IT.
            </h2>
            <h3 className="font-heading text-xl font-bold text-muted uppercase tracking-tight">
              No more guessing.
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 font-medium pt-2">
              Your Reality Check is ready.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              variant="dark"
              size="lg"
              className="w-full text-sm font-bold uppercase tracking-wider h-12 gap-2 shadow-sm"
              onClick={handleGenerateScore}
            >
              <span>GENERATE MY REALITY CHECK</span>
              <ArrowRight size={16} />
            </Button>

            <button
              onClick={handleBack}
              className="text-xs font-semibold text-muted hover:text-foreground transition-colors underline"
            >
              Review my answers
            </button>
          </div>
        </motion.div>
      ) : (
        /* ── Core 10 Questions Step Flow ── */
        <div className="space-y-6">
          {/* Progress Indicator Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-foreground">
              <span>REALITY CHECK</span>
              <span>QUESTION {currentQ.number} / {QUESTIONS.length}</span>
            </div>
            {/* Smooth Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted-bg border border-border">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Question UI Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="border-2 border-foreground bg-white p-6 sm:p-8 rounded-[16px] space-y-6 shadow-sm"
            >
              {/* Question Heading & Helper */}
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {currentQ.title}
                </h2>
                {currentQ.helper && (
                  <p className="mt-2 text-xs sm:text-sm text-muted italic border-l-2 border-brand pl-3 py-0.5">
                    &gt; {currentQ.helper}
                  </p>
                )}
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className={`w-full flex items-center justify-between text-left p-4 rounded-[12px] border transition-all min-h-[52px] ${
                        isSelected
                          ? "border-foreground bg-brand/15 text-foreground font-semibold shadow-xs"
                          : "border-border bg-white text-foreground hover:border-foreground/40 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-foreground bg-foreground text-white"
                              : "border-muted/50 bg-white"
                          }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{opt.label}</p>
                          {opt.sublabel && (
                            <p className="text-[11px] text-muted font-normal mt-0.5">{opt.sublabel}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Validation Warning Notice (Inline, not popup) */}
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-amber-950"
                >
                  <AlertCircle size={15} className="text-amber-600 shrink-0" />
                  <span>Pick one — honesty is the whole point.</span>
                </motion.div>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                {currentIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors min-h-[44px]"
                  >
                    <ArrowLeft size={14} />
                    <span>BACK</span>
                  </button>
                ) : (
                  <div />
                )}

                <Button
                  type="button"
                  variant="dark"
                  size="md"
                  onClick={handleNext}
                  className="gap-2 text-xs font-bold uppercase tracking-wider px-6 h-11"
                >
                  <span>{currentIndex === QUESTIONS.length - 1 ? "SEE MY RESULT" : "NEXT"}</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
