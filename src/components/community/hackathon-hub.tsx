"use client";

import { useState } from "react";
import { HACKATHONS_DATA } from "@/lib/community-data";
import { Hackathon } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Calendar, MapPin, Users, Trophy, Bell, UserPlus, MessageSquare, X, Check } from "lucide-react";

const TAGS = ["All", "AI", "Blockchain", "Cyber Security", "Open Source", "Flutter", "Web"];

export function HackathonHub() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [activeHackathon, setActiveHackathon] = useState<Hackathon | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [remindersSet, setRemindersSet] = useState<Record<string, boolean>>({});

  const filtered = HACKATHONS_DATA.filter((h) => {
    if (selectedTag !== "All" && !h.tags.includes(selectedTag)) return false;
    return true;
  });

  const toggleReminder = (id: string) => {
    setRemindersSet((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket size={16} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Hackathon Arena</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Build, Compete & Win Hackathons</h2>
          <p className="text-xs text-muted mt-1">
            Discover national hackathons, find teammates, access project templates, and win prize money.
          </p>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedTag === t
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Hackathons Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hackathon) => (
          <motion.div
            key={hackathon.id}
            whileHover={{ y: -2 }}
            className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5 shadow-xs hover:border-foreground/30 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-xl shrink-0">
                  {hackathon.logoEmoji}
                </div>
                <Badge variant={hackathon.mode === "Online" ? "success" : "muted"}>
                  {hackathon.mode}
                </Badge>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-foreground leading-snug">{hackathon.title}</h3>
                <p className="text-xs text-muted mt-0.5">{hackathon.organizer}</p>
              </div>

              <div className="space-y-1 text-xs text-muted">
                <p className="flex items-center gap-1.5"><Trophy size={13} className="text-brand" /> <span className="font-semibold text-foreground">{hackathon.prizeMoney}</span></p>
                <p className="flex items-center gap-1.5"><Calendar size={13} /> Deadline: <span className="font-mono text-foreground font-semibold">{hackathon.registrationDeadline}</span></p>
                <p className="flex items-center gap-1.5"><MapPin size={13} /> {hackathon.location}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {hackathon.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button variant="dark" size="sm" onClick={() => setActiveHackathon(hackathon)} className="flex-1 text-xs">
                View & Find Team
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReminder(hackathon.id)}
                className={`p-2 ${remindersSet[hackathon.id] ? "text-emerald-600 bg-emerald-50" : "text-muted"}`}
                title="Set Reminder"
              >
                {remindersSet[hackathon.id] ? <Check size={14} /> : <Bell size={14} />}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hackathon Detail & Team Finder Modal */}
      <AnimatePresence>
        {activeHackathon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveHackathon(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setActiveHackathon(null)}
                className="absolute right-4 top-4 text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-3xl shrink-0">
                  {activeHackathon.logoEmoji}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{activeHackathon.title}</h3>
                  <p className="text-xs text-muted mt-0.5">{activeHackathon.organizer} &middot; {activeHackathon.mode}</p>
                  <p className="text-xs text-muted leading-relaxed mt-2">{activeHackathon.overview}</p>
                </div>
              </div>

              {/* Team Finder Section */}
              <div className="rounded-[12px] border border-border bg-surface p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted flex items-center gap-1.5">
                    <Users size={13} /> Team Finder Requests
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setTeamModalOpen(true)} className="text-xs gap-1">
                    <UserPlus size={12} /> Post Request
                  </Button>
                </div>

                {activeHackathon.teamRequests.length === 0 ? (
                  <p className="text-xs text-muted py-2">No team requests posted yet. Be the first to build a team!</p>
                ) : (
                  <div className="space-y-2">
                    {activeHackathon.teamRequests.map((req) => (
                      <div key={req.id} className="rounded-[8px] border border-border bg-white p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-foreground">{req.authorName} ({req.college})</p>
                          <a href={`mailto:${req.contact}`} className="text-[10px] font-semibold text-brand underline">
                            Contact
                          </a>
                        </div>
                        <p className="text-xs text-muted">{req.pitch}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {req.rolesNeeded.map((role) => (
                            <Badge key={role} variant="muted">{role}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="dark" size="sm" onClick={() => alert("Registered! Good luck in the hackathon.")}>
                  Register Now
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setActiveHackathon(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
