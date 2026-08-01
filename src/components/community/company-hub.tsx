"use client";

import { useState } from "react";
import { COMPANY_HUB_DATA } from "@/lib/community-data";
import { CompanyPrepInfo } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building, CheckCircle2, ChevronRight, HelpCircle, FileText, Send, Sparkles, X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";

export function CompanyHub() {
  const { user, requireAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCompany, setActiveCompany] = useState<CompanyPrepInfo>(COMPANY_HUB_DATA[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "rounds" | "oa" | "roadmap">("overview");
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const filteredCompanies = COMPANY_HUB_DATA.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building size={16} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Company Preparation Hub</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Crack Your Dream Tech Company</h2>
          <p className="text-xs text-muted mt-1">
            Hiring process, OA questions, salary packages, interview experiences, and referral connections.
          </p>
        </div>

        <Button variant="dark" size="sm" onClick={() => setReferralModalOpen(true)} className="gap-2">
          <Send size={13} /> Request Referral at {activeCompany.name}
        </Button>
      </div>

      {/* Company Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredCompanies.map((comp) => (
          <button
            key={comp.id}
            onClick={() => { setActiveCompany(comp); setActiveTab("overview"); }}
            className={`flex items-center gap-2.5 rounded-[12px] border px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
              activeCompany.id === comp.id
                ? "border-foreground bg-foreground text-white shadow-sm"
                : "border-border bg-white text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {comp.logoUrl ? (
              <div className="h-5 w-5 relative overflow-hidden rounded-md bg-white shrink-0 p-0.5 border border-black/10 flex items-center justify-center">
                {/* eslint-disable-next-next/no-img-element */}
                <img src={comp.logoUrl} alt={comp.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <span className="text-lg">{comp.logo}</span>
            )}
            <span>{comp.name}</span>
          </button>
        ))}
      </div>

      {/* Main Selected Company Hub Card */}
      <div className="rounded-[16px] border border-border bg-white p-6 shadow-xs space-y-6">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-4">
            {activeCompany.logoUrl ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border p-2 shadow-xs shrink-0">
                {/* eslint-disable-next-next/no-img-element */}
                <img src={activeCompany.logoUrl} alt={activeCompany.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-3xl shrink-0">
                {activeCompany.logo}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-xl font-bold text-foreground">{activeCompany.name}</h3>
                <Badge variant="muted">{activeCompany.category}</Badge>
                <Badge variant={activeCompany.difficulty === "Brutal" ? "danger" : "warning"}>
                  {activeCompany.difficulty} Difficulty
                </Badge>
              </div>
              <p className="text-xs text-muted mt-1">
                Avg SDE CTC: <span className="font-mono font-bold text-emerald-600">₹{activeCompany.avgSalaryLpa.totalCtc} LPA</span> (Base: ₹{activeCompany.avgSalaryLpa.base} LPA)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/referrals">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Find {activeCompany.name} Referrers &rarr;
              </Button>
            </a>
          </div>
        </div>

        {/* Inner Tabs */}
        <div className="flex items-center gap-2 border-b border-border text-xs font-semibold">
          {[
            { id: "overview", label: "Hiring Overview" },
            { id: "rounds", label: "Interview Rounds" },
            { id: "oa", label: "OA Questions" },
            { id: "roadmap", label: "Prep Roadmap" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-foreground text-foreground font-bold"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Hiring Steps</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeCompany.hiringProcess.map((step) => (
                  <div key={step.step} className="rounded-[10px] border border-border bg-surface p-3.5 space-y-1">
                    <span className="font-mono text-xs font-bold text-brand">Step 0{step.step}</span>
                    <p className="text-xs font-bold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Resume Tips for {activeCompany.name}</h4>
              <ul className="space-y-1.5 text-xs text-muted">
                {activeCompany.resumeTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "rounds" && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Round-by-Round Breakdown</h4>
            {activeCompany.interviewRounds.map((round, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[10px] border border-border p-3.5 bg-white">
                <div>
                  <p className="text-xs font-bold text-foreground">{round.name}</p>
                  <p className="text-xs text-muted mt-0.5">Focus: {round.focus}</p>
                </div>
                <Badge variant="muted" className="w-fit">{round.duration}</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === "oa" && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Frequently Asked OA Questions</h4>
            {activeCompany.oaQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-[10px] border border-border p-3.5 bg-white">
                <div>
                  <p className="text-xs font-bold text-foreground">{q.title}</p>
                  <p className="text-[10px] text-muted">{q.topic} &middot; Frequency: {q.frequency}</p>
                </div>
                <Badge variant={q.difficulty === "Hard" ? "danger" : "warning"}>{q.difficulty}</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Recommended Preparation Path</h4>
            <div className="space-y-2">
              {activeCompany.preparationRoadmap.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-[10px] border border-border p-3 bg-surface">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white text-[10px] font-mono shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Referral Request Modal */}
      <AnimatePresence>
        {referralModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReferralModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-4"
            >
              <button
                onClick={() => setReferralModalOpen(false)}
                className="absolute right-4 top-4 text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeCompany.logo}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">Request Referral</h3>
                  <p className="text-xs text-muted">Target Company: {activeCompany.name}</p>
                </div>
              </div>

              {requestSent ? (
                <div className="py-6 text-center space-y-2">
                  <span className="text-3xl">🎉</span>
                  <p className="text-sm font-bold text-foreground">Referral Pitch Submitted!</p>
                  <p className="text-xs text-muted">
                    Verified {activeCompany.name} engineers on BEC have received your resume pitch.
                  </p>
                  <Button variant="dark" size="sm" onClick={() => { setReferralModalOpen(false); setRequestSent(false); }} className="mt-3 w-full">
                    Done
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    requireAuth(async () => {
                      setRequestSent(true);
                      if (user) {
                        await recordWorkSubmission(user.uid, {
                          type: "referral_request",
                          title: `Pitch to ${activeCompany.name}`,
                          payload: { company: activeCompany.name },
                        });
                      }
                    }, "Authentication Required: You must be logged in to submit pitches to company referrers.");
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Target Job Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SDE-1 / Graduate Engineer Trainee"
                      className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Resume PDF Link / Portfolio</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/your-resume"
                      className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Elevator Pitch for Referrer</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Briefly state your key projects, LeetCode count, and why you are a fit..."
                      className="w-full rounded-[8px] border border-border p-2.5 text-xs outline-none focus:border-foreground/40 mt-1 resize-none"
                    />
                  </div>

                  <Button type="submit" variant="dark" size="sm" className="w-full gap-2">
                    <Send size={13} /> Submit Pitch to {activeCompany.name} Referrers
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
