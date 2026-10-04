"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Handshake, Send, CheckCircle2, AlertCircle, Clock, FileText, Building2, User, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { recordWorkSubmission } from "@/services/task-service";
import { saveCommunityReferral } from "@/lib/firestore-service";

export interface QueueItem {
  id: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  githubUrl: string;
  resumeUrl: string;
  targetCompany?: string;
  pitch?: string;
  status: "In Queue" | "Matched" | "Under Review";
  submittedAt: string;
}

export function ReferralMarketplace() {
  const { user, requireAuth } = useAuth();

  // ── Local storage queue state persistence ────────────────────────────────
  const [myQueue, setMyQueue] = useLocalStorage<QueueItem[]>("bec_referral_queue_v1", [
    {
      id: "queue-demo-1",
      name: "Priyam Das",
      college: "Brainware University",
      branch: "Computer Science & AI",
      year: "4th Year / Final Year",
      githubUrl: "https://github.com/priyam",
      resumeUrl: "https://drive.google.com/file/d/sample-resume",
      targetCompany: "Google, TCS Digital",
      pitch: "350+ LeetCode solved, built AI ATS resume optimizer and fullstack web apps.",
      status: "In Queue",
      submittedAt: "Today, 11:30 AM",
    },
  ]);

  // ── Form State ────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("CSE / IT");
  const [year, setYear] = useState("4th Year / Final Year");
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [pitch, setPitch] = useState("");

  const [githubError, setGithubError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    const displayName = user?.displayName;
    if (displayName && !name) {
      queueMicrotask(() => setName(displayName));
    }
  }, [user, name]);

  const validateGithub = (url: string): boolean => {
    if (!url.trim()) return false;
    const clean = url.trim().toLowerCase();
    return clean.includes("github.com/") || clean.includes("github.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubError("");

    if (!validateGithub(githubUrl)) {
      setGithubError("Please enter a valid GitHub profile link (e.g. https://github.com/your-username)");
      return;
    }

    requireAuth(async () => {
      setIsSubmitting(true);

      const newItem: QueueItem = {
        id: `req-${Date.now()}`,
        name: name.trim() || user?.displayName || "Engineer",
        college: college.trim(),
        branch,
        year,
        githubUrl: githubUrl.trim(),
        resumeUrl: resumeUrl.trim(),
        targetCompany: targetCompany.trim() || "Any Tech Company",
        pitch: pitch.trim(),
        status: "In Queue",
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", Today",
      };

      // Update local storage state
      setMyQueue([newItem, ...myQueue]);

      // Save to Firestore & Record Work Submission
      if (user) {
        try {
          await saveCommunityReferral({
            company: targetCompany.trim() || "Open / Queue",
            role: "Software Development Engineer",
            targetPackage: "Open",
            requesterName: name.trim() || user.displayName || "Engineer",
            college: college.trim(),
            branch,
            yoGrad: year,
            experience: "Student / Fresher",
            skills: ["GitHub: " + githubUrl.trim()],
            proofLink: resumeUrl.trim(),
          });

          await recordWorkSubmission(user.uid, {
            type: "referral_request",
            title: `Joined Referral Queue for ${targetCompany.trim() || "Tech SDE Roles"}`,
            payload: { ...newItem } as Record<string, unknown>,
          });
        } catch (err) {
          console.warn("Firestore referral queue save fallback:", err);
        }
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, "Sign in required to join the Referral Queue.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      
      {/* ── HEADER ── */}
      <div className="border border-[#c8c8d0] bg-white p-6 md:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Handshake size={18} className="text-black" />
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
            Referral Queue
          </p>
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Join the Referral Queue
        </h1>
        <p className="text-sm text-muted max-w-2xl leading-relaxed">
          Submit your details once &mdash; we&apos;ll match you with a real engineer as our referrer network grows.
        </p>
      </div>

      {/* ── MY REFERRAL QUEUE STATUS ── */}
      {myQueue.length > 0 && (
        <div className="border border-[#c8c8d0] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#c8c8d0] pb-3">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-muted" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                My Referral Queue Status
              </h2>
            </div>
            <span className="font-mono text-[11px] font-extrabold text-muted">
              {myQueue.length} {myQueue.length === 1 ? "Submission" : "Submissions"}
            </span>
          </div>

          <div className="space-y-3">
            {myQueue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#c8c8d0] bg-surface p-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm">
                      {item.targetCompany ? item.targetCompany : "Open Referral Queue"}
                    </span>
                    <Badge variant={item.status === "In Queue" ? "warning" : "success"} className="rounded-none text-[10px] uppercase font-bold">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-muted">
                    <span className="font-bold text-foreground">{item.name}</span> &bull; {item.college} ({item.branch}, {item.year})
                  </p>
                  {item.pitch && (
                    <p className="text-muted/80 text-[11px] italic max-w-xl truncate">
                      &ldquo;{item.pitch}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-[10px] text-muted pt-1">
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-bold text-foreground hover:underline"
                    >
                      <Code2 size={11} /> GitHub Profile
                    </a>
                    <a
                      href={item.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-bold text-foreground hover:underline"
                    >
                      <FileText size={11} /> Resume Link
                    </a>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 text-[10px] text-muted">
                  Submitted: <span className="font-bold text-foreground">{item.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INTAKE FORM / SUCCESS CONFIRMATION ── */}
      <div className="border border-[#c8c8d0] bg-white p-6 md:p-8 space-y-6">
        
        {submittedSuccess ? (
          /* ── POST-SUBMIT CONFIRMATION ── */
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300">
              <CheckCircle2 size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                You&apos;re in the queue!
              </h3>
              <p className="text-sm font-mono text-muted max-w-md mx-auto">
                We&apos;ll notify you when a verified referrer matches your profile.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button
                variant="dark"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setPitch("");
                  setTargetCompany("");
                }}
                className="rounded-none font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5"
              >
                Submit Another Entry
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ── SINGLE INTAKE FORM ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#c8c8d0] pb-3">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Submit Referral Profile
              </h2>
              <p className="text-xs font-mono text-muted">
                Complete all required fields below to enter the verified candidate queue.
              </p>
            </div>

            {/* Field 1: Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <User size={13} />
                <span>Full Name <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyam Das"
                className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Field 2: College */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <Building2 size={13} />
                <span>College / University <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Brainware University / IIT Kharagpur / VIT Vellore"
                className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Field 3: Branch & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Branch & Specialization <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science & AI"
                  className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Year of Study / Status <span className="text-rose-600">*</span>
                </label>
                <select
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-[#c8c8d0] bg-white px-3 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors cursor-pointer"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final Year">4th Year / Final Year</option>
                  <option value="Graduated / Alumni">Graduated / Alumni</option>
                </select>
              </div>
            </div>

            {/* Field 4: GitHub URL */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <Code2 size={13} />
                <span>GitHub Profile URL <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                required
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  if (githubError) setGithubError("");
                }}
                placeholder="https://github.com/your-username"
                className={`w-full border bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors ${
                  githubError ? "border-rose-500 bg-rose-50/20" : "border-[#c8c8d0]"
                }`}
              />
              {githubError ? (
                <p className="flex items-center gap-1 font-mono text-[11px] font-bold text-rose-600 mt-1">
                  <AlertCircle size={12} /> {githubError}
                </p>
              ) : (
                <p className="font-mono text-[10px] text-muted">
                  Must be a valid GitHub profile link (e.g., https://github.com/your-username)
                </p>
              )}
            </div>

            {/* Field 5: Resume Link / Upload */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <FileText size={13} />
                <span>Resume Link (Google Drive / Notion / PDF) <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="url"
                required
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/your-resume-pdf"
                className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
              />
              <p className="font-mono text-[10px] text-muted">
                Ensure Google Drive link permissions are set to &ldquo;Anyone with link can view&rdquo;.
              </p>
            </div>

            {/* Field 6: Target Company (Optional) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-muted">
                <Building2 size={13} />
                <span>Target Company (Optional)</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Amazon, Swiggy, TCS Digital"
                className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Field 7: One-Line Pitch (Optional) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                  One-Line Pitch (Optional)
                </label>
                <span className="font-mono text-[10px] text-muted">
                  {pitch.length}/150
                </span>
              </div>
              <input
                type="text"
                maxLength={150}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="e.g. 350+ LeetCode solved, built a real-time collaborative IDE in Rust."
                className="w-full border border-[#c8c8d0] bg-white px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="dark"
                disabled={isSubmitting}
                className="w-full gap-2 rounded-none bg-black text-white hover:bg-neutral-800 border border-black py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                {isSubmitting ? (
                  "Joining Queue..."
                ) : (
                  <>
                    <Send size={14} /> Join the Referral Queue
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
