"use client";

import { useState } from "react";
import { TOP_COLLEGES } from "@/lib/community-data";
import { CollegeRankEntry, CollegeType } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trophy, MapPin, Building2, Users, Briefcase, ExternalLink, X, ChevronRight, Award } from "lucide-react";

const TYPES: ("All" | CollegeType)[] = ["All", "IIT", "NIT", "IIIT", "Government", "Private", "University"];
const STATES = ["All", "Tamil Nadu", "Delhi NCR", "Maharashtra", "Uttar Pradesh", "West Bengal", "Rajasthan"];
const SORT_FACTORS = [
  { id: "nirf", label: "NIRF 2025 Rank" },
  { id: "score", label: "Lowest Berojgar Score" },
  { id: "placement", label: "Placement Rate (%)" },
  { id: "package", label: "Avg Package (LPA)" },
  { id: "members", label: "Active Members" },
];

export function CollegeRankings() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | CollegeType>("All");
  const [selectedState, setSelectedState] = useState("All");
  const [sortBy, setSortBy] = useState("nirf");
  const [activeCollege, setActiveCollege] = useState<CollegeRankEntry | null>(null);

  const filtered = TOP_COLLEGES.filter((col) => {
    if (selectedType !== "All" && col.type !== selectedType) return false;
    if (selectedState !== "All" && col.state !== selectedState) return false;
    if (search && !col.name.toLowerCase().includes(search.toLowerCase()) && !col.city.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "nirf") return (a.nirfRank || a.overallRank) - (b.nirfRank || b.overallRank);
    if (sortBy === "score") return a.avgBerojgarScore - b.avgBerojgarScore; // lower is better
    if (sortBy === "placement") return b.placementRate - a.placementRate;
    if (sortBy === "package") return b.avgPackageLpa - a.avgPackageLpa;
    if (sortBy === "members") return b.activeMembers - a.activeMembers;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Official NIRF 2025 Engineering Rankings</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Top Engineering Colleges in India</h2>
          <p className="text-xs text-muted mt-1">
            Updated with NIRF 2025 Engineering Rankings, placement rates, average package (LPA), and active student DSA activity.
          </p>
        </div>
        <a href="/assessment">
          <Button variant="dark" size="sm">Evaluate My College</Button>
        </a>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3 rounded-[12px] border border-border bg-surface p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search college name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-[8px] border border-border bg-white pl-9 pr-3 text-xs text-foreground outline-none focus:border-foreground/40"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="h-9 rounded-[8px] border border-border bg-white px-3 text-xs text-foreground outline-none focus:border-foreground/40 w-full sm:w-auto"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All States" : s}</option>
            ))}
          </select>

          {/* Sort factor */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 rounded-[8px] border border-border bg-white px-3 text-xs text-foreground outline-none focus:border-foreground/40 w-full sm:w-auto font-medium"
          >
            {SORT_FACTORS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Type Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selectedType === t
                  ? "border-foreground bg-foreground text-white"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* College List */}
      <div className="space-y-3">
        {filtered.map((college, idx) => (
          <motion.div
            key={college.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => setActiveCollege(college)}
            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[14px] border border-border bg-white p-4 hover:border-foreground/30 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              {/* Official Crest Logo Badge */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-heading font-black text-xs text-white shadow-xs border border-white/20 transition-transform group-hover:scale-105"
                style={{ backgroundColor: college.badgeColor || "#1e293b" }}
              >
                {college.shortCode || college.name.slice(0, 4)}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground group-hover:text-amber-600 transition-colors">
                    {college.name}
                  </h3>
                  <Badge variant="muted">{college.type}</Badge>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 font-mono">
                    <Award size={11} className="text-amber-600" /> NIRF 2025 #{college.nirfRank || college.overallRank}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {college.city}, {college.state}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {college.activeMembers.toLocaleString()} members</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap border-t md:border-t-0 border-border pt-3 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase font-semibold text-muted">Berojgar Score</p>
                <p className="font-mono text-sm font-bold text-foreground">{college.avgBerojgarScore}/100</p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase font-semibold text-muted">Placement Rate</p>
                <p className="font-mono text-sm font-bold text-emerald-600">{college.placementRate}%</p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase font-semibold text-muted">Avg Package</p>
                <p className="font-mono text-sm font-bold text-foreground">₹{college.avgPackageLpa} LPA</p>
              </div>

              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View Profile <ChevronRight size={13} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* College Detail Modal */}
      <AnimatePresence>
        {activeCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCollege(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-6"
            >
              {/* Modal Close */}
              <button
                onClick={() => setActiveCollege(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-muted-bg hover:text-foreground"
              >
                <X size={18} />
              </button>

              {/* College Header */}
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-heading font-black text-sm text-white shadow-md border border-white/20"
                  style={{ backgroundColor: activeCollege.badgeColor || "#1e293b" }}
                >
                  {activeCollege.shortCode || activeCollege.name.slice(0, 4)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-xl font-bold text-foreground">{activeCollege.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900 font-mono">
                      <Award size={13} className="text-amber-600" /> NIRF 2025 #{activeCollege.nirfRank}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{activeCollege.city}, {activeCollege.state} &middot; {activeCollege.type}</p>
                  <p className="text-xs text-muted leading-relaxed mt-2">{activeCollege.description}</p>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-[10px] border border-border bg-surface p-3 text-center">
                  <p className="text-[10px] uppercase font-semibold text-muted">NIRF 2025 Rank</p>
                  <p className="font-mono text-lg font-bold text-amber-600">#{activeCollege.nirfRank}</p>
                </div>
                <div className="rounded-[10px] border border-border bg-surface p-3 text-center">
                  <p className="text-[10px] uppercase font-semibold text-muted">Placement Rate</p>
                  <p className="font-mono text-lg font-bold text-emerald-600">{activeCollege.placementRate}%</p>
                </div>
                <div className="rounded-[10px] border border-border bg-surface p-3 text-center">
                  <p className="text-[10px] uppercase font-semibold text-muted">Avg CTC</p>
                  <p className="font-mono text-lg font-bold text-foreground">₹{activeCollege.avgPackageLpa} LPA</p>
                </div>
                <div className="rounded-[10px] border border-border bg-surface p-3 text-center">
                  <p className="text-[10px] uppercase font-semibold text-muted">Active Members</p>
                  <p className="font-mono text-lg font-bold text-foreground">{activeCollege.activeMembers}</p>
                </div>
              </div>

              {/* Top Performers */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Top College Performers</p>
                <div className="space-y-2">
                  {activeCollege.topPerformers.map((student) => (
                    <div key={student.id} className="flex items-center justify-between rounded-[8px] border border-border p-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: student.avatarColor }}
                        >
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{student.name}</p>
                          <p className="text-[10px] text-muted">{student.branch} &middot; {student.year} Year</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-foreground">{student.score}/100</span>
                        {student.placedCompany && (
                          <span className="ml-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {student.placedCompany}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Placement Offers */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Recent Placement Offers</p>
                <div className="space-y-2">
                  {activeCollege.recentOffers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between rounded-[8px] border border-border p-2.5 bg-surface/50">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{offer.logo}</span>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{offer.studentName} &rarr; {offer.company}</p>
                          <p className="text-[10px] text-muted">{offer.role} &middot; {offer.branch}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-bold text-emerald-600">₹{offer.packageLpa} LPA</p>
                        <p className="text-[10px] text-muted">{offer.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <a href={activeCollege.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    Official Website <ExternalLink size={12} />
                  </Button>
                </a>
                <Button variant="dark" size="sm" onClick={() => setActiveCollege(null)}>
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
