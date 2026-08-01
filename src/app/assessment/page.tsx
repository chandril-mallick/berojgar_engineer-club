"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { calculateBerojgarScore } from "@/services/scoring";
import { AssessmentInput } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";

import { saveUserAssessment } from "@/lib/firestore-service";

const schema = z.object({
  college: z.string().min(2),
  branch: z.string().min(2),
  year: z.string().min(1),
  cgpa: z.number().min(0).max(10),
  projects: z.number().min(0).max(10),
  internships: z.number().min(0).max(10),
  github: z.string().min(1),
  linkedin: z.string().min(1),
  dsa: z.number().min(0).max(10),
  communication: z.number().min(0).max(10),
  targetCompany: z.string().min(2),
  topProject: z.string().optional(),
  keyAchievement: z.string().optional(),
});

const TOTAL_FIELDS = 11;
const STEPS = [
  { label: "Your Profile", count: 3 },
  { label: "Academics", count: 2 },
  { label: "Portfolio", count: 2 },
  { label: "Skills", count: 3 },
  { label: "Target", count: 1 },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const form = useForm<AssessmentInput>({
    defaultValues: {
      college: "",
      branch: "",
      year: "",
      cgpa: 7.5,
      projects: 2,
      internships: 0,
      github: "Moderate",
      linkedin: "Moderate",
      dsa: 3,
      communication: 5,
      targetCompany: "",
    },
  });

  const values = form.watch();
  const filledCount = Object.values(values).filter(
    (v) => v !== "" && v !== undefined && v !== null,
  ).length;
  const progress = Math.round((filledCount / TOTAL_FIELDS) * 100);

  const onSubmit = (values: AssessmentInput) => {
    const validated = schema.safeParse(values);
    if (!validated.success) return;

    requireAuth(async () => {
      const payload = validated.data;
      const result = calculateBerojgarScore(payload);

      // Query NVIDIA Nemotron 70B AI Model for custom roast
      try {
        const promptText = `Student Profile: College=${payload.college}, Branch=${payload.branch}, Year=${payload.year}, CGPA=${payload.cgpa}, Projects=${payload.projects}, Internships=${payload.internships}, GitHub=${payload.github}, LinkedIn=${payload.linkedin}, DSA Score=${payload.dsa}/10, Communication=${payload.communication}/10, Target Company=${payload.targetCompany}, Top Project=${payload.topProject || "N/A"}, Key Achievement=${payload.keyAchievement || "N/A"}. Calculated Berojgar Score=${result.score}/100 (${result.riskLevel} Risk).`;

        const res = await fetch("/api/ai-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, mode: "assessment" }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            result.roast = data.reply;
          }
        }
      } catch (err) {
        console.warn("NVIDIA Nemotron score roast fallback:", err);
      }

      window.localStorage.setItem("bec-assessment-input", JSON.stringify(payload));
      window.localStorage.setItem("bec-score-result", JSON.stringify(result));

      if (user) {
        // Save assessment to Cloud Firestore
        await saveUserAssessment(user.uid, {
          score: result.score,
          riskIndex: result.riskLevel === "HIGH" ? "High" : result.riskLevel === "MEDIUM" ? "Medium" : "Low",
          dsaScore: payload.dsa,
          devScore: payload.projects * 10,
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

      router.push("/score");
    }, "Authentication Required: You must be logged in to calculate and save your Berojgar Score.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto max-w-2xl"
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Reality Check Test</h1>
        <p className="mt-1.5 text-sm text-muted">
          10 questions. 60 seconds. Maximum honesty, minimum drama.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Progress</span>
          <span className="font-mono text-xs text-muted">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Form — no card wrapper */}
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>

        {/* Section: Profile */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Your Profile
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">College</label>
              <Input placeholder="e.g. VIT, NIT, BITS..." {...form.register("college")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Branch</label>
              <Input placeholder="e.g. CSE, ECE, IT..." {...form.register("branch")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Year of Study</label>
              <Select {...form.register("year")}>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">Final Year</option>
              </Select>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Section: Academics */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Academics
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">CGPA (0–10)</label>
              <Input
                type="number"
                step="0.1"
                min={0}
                max={10}
                placeholder="e.g. 7.8"
                {...form.register("cgpa", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Projects Built</label>
              <Input
                type="number"
                min={0}
                max={20}
                placeholder="0"
                {...form.register("projects", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Section: Portfolio */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Portfolio & Experience
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Internships</label>
              <Input
                type="number"
                min={0}
                max={10}
                placeholder="0"
                {...form.register("internships", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">GitHub Profile</label>
              <Select {...form.register("github")}>
                <option value="yes">Yes, I have one</option>
                <option value="no">No, not yet</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">LinkedIn Profile</label>
              <Select {...form.register("linkedin")}>
                <option value="yes">Yes, I have one</option>
                <option value="no">No, not yet</option>
              </Select>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Section: Skills */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Self-Assessment
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">DSA Confidence (0–10)</label>
              <Input
                type="number"
                min={0}
                max={10}
                placeholder="5"
                {...form.register("dsa", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Communication (0–10)</label>
              <Input
                type="number"
                min={0}
                max={10}
                placeholder="5"
                {...form.register("communication", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Section: Target */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Target
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Dream Company</label>
            <Input
              placeholder="e.g. Google, TCS, a startup, anywhere..."
              {...form.register("targetCompany")}
            />
          </div>
        </section>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" variant="dark" size="lg" className="w-full sm:w-auto">
            Generate My Berojgar Score™
          </Button>
          <p className="mt-3 text-xs text-muted">
            Takes 2 seconds. No account required.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
