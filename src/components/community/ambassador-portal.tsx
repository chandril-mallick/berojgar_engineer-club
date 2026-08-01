"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Gift, Users, Sparkles, CheckCircle2, Trophy, DollarSign } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";

export function AmbassadorPortal() {
  const { user, requireAuth } = useAuth();
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    requireAuth(async () => {
      setApplied(true);
      if (user) {
        await recordWorkSubmission(user.uid, {
          type: "ambassador_app",
          title: "Campus Ambassador Application",
          payload: { date: new Date().toISOString() },
        });
      }
    }, "Authentication Required: You must be logged in to apply for Campus Ambassador.");
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-[20px] border border-border bg-foreground p-8 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="uppercase tracking-widest text-[10px]">Official Program</Badge>
          <span className="text-xs text-white/60">Cohort 2026</span>
        </div>

        <h2 className="font-heading text-3xl font-bold text-white max-w-xl leading-tight">
          Become the Campus Ambassador for BEROJGAR ENGINEER CLUB
        </h2>
        <p className="text-sm text-white/70 max-w-lg leading-relaxed">
          Lead your college engineering community, organize DSA sprints, invite your batchmates, and earn exclusive perks, cash stipends, and verified certificates.
        </p>

        <div className="pt-2">
          <Button variant="dark" size="md" onClick={handleApply} className="gap-2 font-bold bg-amber-500 hover:bg-amber-600 text-black border-none">
            <Sparkles size={14} /> Apply for Campus Ambassador
          </Button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Ambassador Perks & Rewards</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-[14px] border border-border bg-white p-4 space-y-2">
            <span className="text-2xl">⚡</span>
            <p className="text-sm font-bold text-foreground">+2,000 XP & Badges</p>
            <p className="text-xs text-muted">Unlock the exclusive &ldquo;Campus Champion&rdquo; badge on your public profile.</p>
          </div>

          <div className="rounded-[14px] border border-border bg-white p-4 space-y-2">
            <span className="text-2xl">📜</span>
            <p className="text-sm font-bold text-foreground">Verified Certificate</p>
            <p className="text-xs text-muted">Official Leadership Certificate signed by the Berojgar Engineer Club team.</p>
          </div>

          <div className="rounded-[14px] border border-border bg-white p-4 space-y-2">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-bold text-foreground">Monthly Cash Rewards</p>
            <p className="text-xs text-muted">Earn cash stipends based on community engagement and referral milestones.</p>
          </div>

          <div className="rounded-[14px] border border-border bg-white p-4 space-y-2">
            <span className="text-2xl">🤝</span>
            <p className="text-sm font-bold text-foreground">Direct HR Referral Access</p>
            <p className="text-xs text-muted">Priority access to employee referrals from top tech companies.</p>
          </div>
        </div>
      </div>

      {/* Application Confirmation */}
      {applied && (
        <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
          <span className="text-3xl">🎉</span>
          <h4 className="text-base font-bold text-emerald-900">Application Submitted!</h4>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Our student lead team will review your college details and reach out via WhatsApp/Email within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
