"use client";

import { useState } from "react";
import { LEADERBOARD_DATA } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Cpu, Code, Layers, Zap, Wrench, ShieldAlert, Award } from "lucide-react";

const BRANCHES = [
  { id: "CSE", name: "Computer Science", icon: "💻" },
  { id: "AI", name: "Artificial Intelligence", icon: "🤖" },
  { id: "IT", name: "Information Technology", icon: "🌐" },
  { id: "ECE", name: "Electronics & Comm", icon: "📡" },
  { id: "EEE", name: "Electrical & Electronics", icon: "⚡" },
  { id: "MECH", name: "Mechanical", icon: "⚙️" },
  { id: "CIVIL", name: "Civil", icon: "🏗️" },
];

const YEARS = ["All", "1st", "2nd", "3rd", "Final"];
const STATES = ["All", "West Bengal", "Tamil Nadu", "Gujarat", "Rajasthan", "Maharashtra", "Delhi NCR"];

export function BranchLeaderboard() {
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedState, setSelectedState] = useState("All");

  const filtered = LEADERBOARD_DATA.filter((e) => {
    if (selectedBranch !== "All" && e.branch !== selectedBranch) return false;
    if (selectedState !== "All" && e.state !== selectedState) return false;
    return true;
  }).sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award size={16} className="text-brand" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Branch Championship</p>
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Branch Leaderboards</h2>
        <p className="text-xs text-muted mt-1">
          Compare your score only against peers in your engineering discipline.
        </p>
      </div>

      {/* Branch Tabs */}
      <div className="flex flex-wrap gap-2">
        {BRANCHES.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBranch(b.id)}
            className={`flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedBranch === b.id
                ? "border-foreground bg-foreground text-white shadow-xs"
                : "border-border bg-white text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            <span>{b.icon}</span>
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* Year & State Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-border bg-surface p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">Year:</span>
          <div className="flex gap-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedYear === y ? "bg-foreground text-white" : "text-muted hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="h-7 rounded-md border border-border bg-white px-2 text-xs text-foreground outline-none"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center rounded-[12px] border border-dashed border-border p-6">
            <p className="text-xs text-muted">No engineers found for this branch filter.</p>
          </div>
        ) : (
          filtered.map((entry, idx) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 rounded-[10px] border border-border bg-white p-3 hover:border-foreground/20 transition-all"
            >
              <div className="w-8 text-center shrink-0">
                <span className={`font-mono text-xs font-bold ${idx === 0 ? "text-amber-500 text-sm" : "text-muted"}`}>
                  #{idx + 1}
                </span>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: entry.avatarColor }}
              >
                {entry.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{entry.name}</p>
                <p className="text-[10px] text-muted truncate">{entry.college} &middot; {entry.state}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-mono text-xs font-bold text-foreground">{entry.score}/100</p>
                <p className="text-[10px] text-muted">{entry.projects} projects</p>
              </div>

              {entry.offer && (
                <div className="hidden sm:block shrink-0">
                  <Badge variant="success">{entry.offer}</Badge>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
