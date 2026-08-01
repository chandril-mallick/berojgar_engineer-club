"use client";

import { useState } from "react";
import { REFERRALS_DATA } from "@/lib/community-data";
import { ReferralListing, StudentReferralRequest } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, Building2, FileText, Send, CheckCircle2, Clock, XCircle, Search, X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";

export function ReferralMarketplace() {
  const { user, requireAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [activeListing, setActiveListing] = useState<ReferralListing | null>(null);
  const [myRequests, setMyRequests] = useState<StudentReferralRequest[]>([
    {
      id: "req101",
      listingId: "ref1",
      company: "Google",
      role: "Software Engineer (L3)",
      studentName: "Priyam Das",
      college: "Brainware University",
      branch: "CSE",
      cgpa: 8.4,
      resumeUrl: "https://drive.google.com/resume",
      portfolioUrl: "https://github.com/priyam",
      message: "Hey Saurabh, I have 350+ LeetCode problems solved and built 3 fullstack web apps.",
      status: "Pending",
      updatedAt: "Today, 11:30 AM",
    },
  ]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const filtered = REFERRALS_DATA.filter((r) => {
    if (selectedCompany !== "All" && r.company !== selectedCompany) return false;
    if (search && !r.referrerName.toLowerCase().includes(search.toLowerCase()) && !r.company.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Handshake size={16} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Referral Marketplace</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Get Referred by Verified Engineers</h2>
          <p className="text-xs text-muted mt-1">
            Connect directly with seniors at top tech firms who are offering official employee referrals.
          </p>
        </div>
      </div>

      {/* Referral Status Monitor */}
      {myRequests.length > 0 && (
        <div className="rounded-[12px] border border-border bg-surface p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">My Referral Requests Status</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {myRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-[8px] border border-border bg-white p-3">
                <div>
                  <p className="text-xs font-bold text-foreground">{req.company} &middot; {req.role}</p>
                  <p className="text-[10px] text-muted">Submitted: {req.updatedAt}</p>
                </div>
                <Badge variant={req.status === "Pending" ? "warning" : req.status === "Accepted" ? "success" : "danger"}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referrers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => {
          const remaining = listing.availableLimitMonthly - listing.usedThisMonth;
          return (
            <motion.div
              key={listing.id}
              whileHover={{ y: -2 }}
              className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5 shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                      style={{ background: listing.avatarColor }}
                    >
                      {listing.referrerName[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{listing.referrerName}</h3>
                      <p className="text-xs text-muted">{listing.role} @ <span className="font-semibold text-foreground">{listing.company}</span></p>
                    </div>
                  </div>
                  <Badge variant={remaining > 0 ? "success" : "muted"}>
                    {remaining} / {listing.availableLimitMonthly} Left
                  </Badge>
                </div>

                <p className="text-xs text-muted leading-relaxed line-clamp-2">{listing.notes}</p>

                <div className="flex flex-wrap gap-1">
                  {listing.preferredSkills.map((sk) => (
                    <span key={sk} className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-muted border border-border">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                variant="dark"
                size="sm"
                disabled={remaining <= 0}
                onClick={() => { setActiveListing(listing); setFormSubmitted(false); }}
                className="w-full gap-2 text-xs"
              >
                <Send size={13} /> Request Referral
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {activeListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveListing(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-4"
            >
              <button
                onClick={() => setActiveListing(null)}
                className="absolute right-4 top-4 text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">Referral Pitch</h3>
                <p className="text-xs text-muted">To {activeListing.referrerName} ({activeListing.company})</p>
              </div>

              {formSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <span className="text-3xl">🎉</span>
                  <p className="text-sm font-bold text-foreground">Referral Request Sent!</p>
                  <p className="text-xs text-muted">
                    {activeListing.referrerName} has received your application pitch.
                  </p>
                  <Button variant="dark" size="sm" onClick={() => setActiveListing(null)} className="mt-2 w-full">
                    Close
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    requireAuth(async () => {
                      setFormSubmitted(true);
                      setMyRequests((prev) => [
                        ...prev,
                        {
                          id: `req-${Date.now()}`,
                          listingId: activeListing.id,
                          company: activeListing.company,
                          role: activeListing.role,
                          studentName: user?.displayName || "You",
                          college: "Your College",
                          branch: "CSE",
                          cgpa: 8.5,
                          resumeUrl: "https://drive.google.com/resume",
                          portfolioUrl: "https://github.com",
                          message: "Elevator pitch submitted",
                          status: "Pending",
                          updatedAt: "Just now",
                        },
                      ]);

                      if (user) {
                        await recordWorkSubmission(user.uid, {
                          type: "referral_request",
                          title: `Referral pitch for ${activeListing.company}`,
                          payload: { company: activeListing.company, role: activeListing.role },
                        });
                      }
                    }, "Authentication Required: You must be logged in to request referrals.");
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Target Role / Job ID</label>
                    <input type="text" required placeholder="e.g. Software Engineer - Job #94821" className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Resume PDF URL</label>
                    <input type="url" required placeholder="https://drive.google.com/your-resume" className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Personal Pitch Message</label>
                    <textarea required rows={3} placeholder="Introduce yourself, projects, and top skills..." className="w-full rounded-[8px] border border-border p-2.5 text-xs outline-none focus:border-foreground/40 mt-1 resize-none" />
                  </div>

                  <Button type="submit" variant="dark" size="sm" className="w-full gap-2">
                    Send Request
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
