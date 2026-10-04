"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, Flame } from "lucide-react";
import { UserXP } from "@/types";

interface ActivityDay {
  dateStr: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityHeatmapProps {
  streak: number;
  totalXP: number;
  completedCount: number;
  userXP?: UserXP;
}

function hasSubmissionId(value: unknown): value is { id: string } {
  return typeof value === "object" && value !== null && "id" in value && typeof value.id === "string";
}

export function ActivityHeatmap({ streak, totalXP, completedCount, userXP }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const [realActivityCounts, setRealActivityCounts] = useState<Record<string, number>>({});

  // Scan localStorage for 100% real user activities across all features
  useEffect(() => {
    if (typeof window === "undefined") return;

    const counts: Record<string, number> = {};

    const incrementDate = (dateString?: string, amount = 1) => {
      if (!dateString) return;
      try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return;
        const key = d.toISOString().split("T")[0];
        counts[key] = (counts[key] || 0) + amount;
      } catch {
        // ignore invalid dates
      }
    };

    // 1. Process XP History entries
    if (userXP?.history) {
      userXP.history.forEach(item => {
        if (item.timestamp === "Just now") {
          incrementDate(new Date().toISOString(), 1);
        } else {
          incrementDate(item.timestamp, 1);
        }
      });
    }

    // 2. Process Real-World DSA submission histories from localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("bec-rwdsa-history-")) {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              parsed.forEach((sub: unknown) => {
                // If sub has timestamp or ID with timestamp
                if (hasSubmissionId(sub) && sub.id.startsWith("sub-")) {
                  const timestampMs = parseInt(sub.id.replace("sub-", ""), 10);
                  if (!isNaN(timestampMs)) {
                    incrementDate(new Date(timestampMs).toISOString(), 1);
                  }
                }
              });
            }
          }
        }
      }
    } catch {
      // ignore
    }

    // 3. Process completed challenges & active streak days
    if (streak > 0) {
      const today = new Date();
      for (let s = 0; s < streak; s++) {
        const d = new Date();
        d.setDate(today.getDate() - s);
        const k = d.toISOString().split("T")[0];
        counts[k] = Math.max(counts[k] || 0, 1);
      }
    }

    queueMicrotask(() => setRealActivityCounts(counts));
  }, [userXP, streak, completedCount]);

  // Generate 52 weeks (364 days) of contribution data ending today based on REAL counts
  const { weeks, totalSubmissions, activeDaysCount, maxStreak } = useMemo(() => {
    const today = new Date();
    const days: ActivityDay[] = [];
    let totalSubs = 0;
    let activeDays = 0;
    let currentConsecutive = 0;
    let maxConsecutive = streak;

    for (let i = 363; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Exact count from real user activity
      const count = realActivityCounts[dateStr] || 0;

      if (count > 0) {
        totalSubs += count;
        activeDays++;
        currentConsecutive++;
        if (currentConsecutive > maxConsecutive) {
          maxConsecutive = currentConsecutive;
        }
      } else {
        currentConsecutive = 0;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 1 && count <= 2) level = 1;
      else if (count >= 3 && count <= 5) level = 2;
      else if (count >= 6 && count <= 8) level = 3;
      else if (count >= 9) level = 4;

      days.push({ dateStr, count, level });
    }

    // Chunk into 52 weeks of 7 days each
    const weekChunks: ActivityDay[][] = [];
    for (let w = 0; w < 52; w++) {
      weekChunks.push(days.slice(w * 7, (w + 1) * 7));
    }

    return {
      weeks: weekChunks,
      totalSubmissions: totalSubs,
      activeDaysCount: activeDays,
      maxStreak: maxConsecutive
    };
  }, [realActivityCounts, streak]);

  const levelColors = {
    0: "bg-[#f1f5f9] border-[#e2e8f0]",
    1: "bg-[#bbf7d0] border-[#86efac]",
    2: "bg-[#4ade80] border-[#22c55e]",
    3: "bg-[#22c55e] border-[#16a34a]",
    4: "bg-[#15803d] border-[#166534]",
  };

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-5 select-none">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-emerald-600" />
            <h3 className="font-heading text-base font-bold text-foreground">
              Daily Grind &amp; Contribution Heatmap
            </h3>
          </div>
          <p className="text-xs text-muted font-mono mt-0.5">
            {totalSubmissions} real submissions &amp; activities recorded in the past year
          </p>
        </div>

        {/* Streak Metrics Pills */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl text-amber-900 font-bold flex items-center gap-1.5">
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>{streak} Days Streak</span>
          </div>
          <div className="bg-surface border border-border px-3 py-1.5 rounded-xl text-foreground font-semibold">
            Max Streak: {maxStreak} Days
          </div>
          <div className="bg-surface border border-border px-3 py-1.5 rounded-xl text-foreground font-semibold">
            Active: {activeDaysCount} Days
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] space-y-2">
          
          {/* Month Labels Bar */}
          <div className="flex text-[10px] font-mono text-muted pl-6 justify-between pr-2">
            {monthLabels.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* 52-Week Grid */}
          <div className="flex gap-1">
            {/* Days of week indicators */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-muted pr-1.5 py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 rounded-[3px] border transition-transform hover:scale-125 cursor-pointer ${
                        levelColors[day.level]
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend & Hover Tooltip */}
      <div className="flex items-center justify-between text-xs font-mono text-muted pt-2 border-t border-border">
        <div>
          {hoveredDay ? (
            <span className="text-foreground font-bold">
              {hoveredDay.count === 0 ? "No activity" : `${hoveredDay.count} real activity event(s)`}{" "}
              <span className="text-muted font-normal">on {hoveredDay.dateStr}</span>
            </span>
          ) : (
            <span>Hover over squares to inspect daily grind activity</span>
          )}
        </div>

        {/* Level Legend */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#f1f5f9] border border-[#e2e8f0]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#bbf7d0] border border-[#86efac]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#4ade80] border border-[#22c55e]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#22c55e] border border-[#16a34a]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#15803d] border border-[#166534]" />
          <span>More</span>
        </div>
      </div>

    </div>
  );
}
