"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { LEADERBOARD_DATA } from "@/lib/mock-data";
import { getBadgeById } from "@/lib/achievements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, AlertCircle } from "lucide-react";
import { BranchLeaderboard } from "@/components/community/branch-leaderboard";

import { useAuth } from "@/hooks/use-auth";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP, LeaderboardEntry } from "@/types";
import { DEFAULT_USER_XP } from "@/lib/xp";
import { getUserFirestoreProfile, getTopFirestoreUsers } from "@/lib/firestore-service";
import { isFirebaseConfigured } from "@/lib/firebase";

interface LeaderboardProfile {
  college?: string;
  branch?: string;
  year?: string;
  berojgarScore?: number;
  answers?: { projects?: number; internships?: number };
}

const TIME_TABS = ["Weekly", "Monthly", "All Time"] as const;
type TimeTab = (typeof TIME_TABS)[number];

const BRANCHES = ["All", "CSE", "ECE", "IT", "CS", "MECH", "EEE"];
const YEARS = ["All", "1st", "2nd", "3rd", "Final"];
const STATES = ["All", "West Bengal", "Tamil Nadu", "Gujarat", "Rajasthan", "Odisha", "Kerala", "Madhya Pradesh"];

const rankMedal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [userXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);
  const [mainTab, setMainTab] = useState<"overall" | "branch">("overall");
  const [activeTab, setActiveTab] = useState<TimeTab>("Weekly");
  const [branch, setBranch] = useState("All");
  const [year, setYear] = useState("All");
  const [state, setState] = useState("All");
  const [profile, setProfile] = useState<LeaderboardProfile | null>(null);
  // Task A: track whether we have real Firestore data or are showing mock data
  const [usingMockData, setUsingMockData] = useState(true);
  const [firestoreEntries, setFirestoreEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setProfile(null));
    } else {
      const uid = user.uid;
      async function fetchProfile() {
        const res = await getUserFirestoreProfile(uid);
        if (res.success && res.data) {
          setProfile(res.data as LeaderboardProfile);
        }
      }
      fetchProfile();
    }
  }, [user]);

  // Task A: Try to load real leaderboard entries from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUsingMockData(true);
      return;
    }
    async function fetchLeaderboard() {
      const res = await getTopFirestoreUsers();
      if (res.success && res.data && res.data.length > 0) {
        // Map Firestore user docs to LeaderboardEntry shape
        const mapped: LeaderboardEntry[] = (res.data as Record<string, unknown>[]).map((u, idx) => ({
          rank: idx + 1,
          name: (u.displayName as string) || "Anonymous Engineer",
          college: (u.college as string) || "Engineering College",
          branch: (u.branch as string) || "CSE",
          state: (u.state as string) || "India",
          year: (u.year as string) || "4",
          score: (u.berojgarScore as number) || 0,
          projects: (u.completedTasksCount as number) || 0,
          xp: (u.xp as number) || 0,
          // LeaderboardEntry.offer is string | null, not string | undefined
          offer: (u.targetCompany as string) || null,
          badgeIds: [],
          avatarColor: "var(--color-brand)",
        }));
        setFirestoreEntries(mapped);
        setUsingMockData(false);
      } else {
        setUsingMockData(true);
      }
    }
    fetchLeaderboard();
  }, []);

  // Construct combined leaderboard list merging seed entries + logged-in user
  const baseEntries = usingMockData ? LEADERBOARD_DATA : firestoreEntries;
  const combined: LeaderboardEntry[] = [...baseEntries];

  if (user) {
    const userDisplayName = user.displayName || user.email?.split("@")[0] || "You";
    const existingIdx = combined.findIndex(
      (e) => e.name.toLowerCase() === userDisplayName.toLowerCase()
    );

    const userEntry: LeaderboardEntry = {
      rank: 0,
      name: userDisplayName + " (You)",
      college: profile?.college || "Engineering College",
      branch: profile?.branch || "CSE",
      state: "West Bengal",
      year: profile?.year || "4",
      score: profile?.berojgarScore || 82,
      projects: profile?.answers?.projects || 2,
      xp: userXP.total || 120,
      offer: (profile?.answers?.internships ?? 0) > 0 ? "Placed" : "Grinding",
      badgeIds: userXP.earnedBadgeIds.length > 0 ? userXP.earnedBadgeIds : ["streak-7", "first-blood", "dsa-hero"],
      avatarColor: "var(--color-brand)",
    };

    if (existingIdx !== -1) {
      combined[existingIdx] = {
        ...combined[existingIdx],
        xp: Math.max(combined[existingIdx].xp, userXP.total),
      };
    } else {
      combined.push(userEntry);
    }
  }

  // Sort by XP descending and calculate live ranks
  combined.sort((a, b) => b.xp - a.xp);
  const rankedAll = combined.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));

  const filtered = rankedAll.filter((e) => {
    if (branch !== "All" && e.branch !== branch) return false;
    if (state !== "All" && e.state !== state) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Main Switcher */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setMainTab("overall")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
            mainTab === "overall" ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Trophy size={14} className="text-brand" /> Overall Engineers
        </button>

        <button
          onClick={() => setMainTab("branch")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
            mainTab === "branch" ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Award size={14} className="text-purple-500" /> Branch Leaderboards
        </button>
      </div>

      {mainTab === "branch" ? (
        <BranchLeaderboard />
      ) : (
        <div className="space-y-10">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className="text-brand" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Rankings</p>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Hall of Engineers</h1>
              <p className="mt-1 text-sm text-muted">
                {usingMockData
                  ? "Sample data preview — connect Firestore for the live leaderboard."
                  : "The most employable engineers in the country. Updated in real-time."}
              </p>
            </div>

            {/* Live User XP Link Banner */}
            <a
              href="/achievements"
              className="flex items-center gap-3 rounded-[14px] border border-amber-300 bg-amber-50/80 p-3 shadow-2xs hover:bg-amber-100/80 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand font-heading text-base font-black text-black">
                XP
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">My XP &amp; Rank</p>
                <p className="text-[11px] text-amber-900 font-mono">View Achievements &amp; Perks →</p>
              </div>
            </a>
          </div>

          {/* Task A: Sample-data banner — always visible when using mock data */}
          {usingMockData && (
            <div className="flex items-start gap-3 rounded-[10px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <span className="font-semibold">Sample data</span> — these are illustrative entries, not real users.{" "}
                <a href="/docs/firebase-setup" className="underline hover:text-amber-700">
                  Connect Firestore
                </a>{" "}
                to see the live leaderboard.
              </div>
            </div>
          )}

          {/* ── Time tabs ── */}
          <div className="flex items-center gap-1 border-b border-border">
            {TIME_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-3">
            {/* Branch */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Branch</p>
              <div className="flex flex-wrap gap-1.5">
                {BRANCHES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBranch(b)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      branch === b
                        ? "border-foreground bg-foreground text-white"
                        : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Year</p>
              <div className="flex flex-wrap gap-1.5">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      year === y
                        ? "border-foreground bg-foreground text-white"
                        : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div className="space-y-1 w-full sm:w-auto">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">State</p>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-8 rounded-[8px] border border-border bg-white px-3 text-xs text-foreground outline-none focus:border-foreground/30"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Count ── */}
          <p className="text-xs text-muted">
            Showing <span className="font-mono font-semibold text-foreground">{filtered.length}</span> engineers
          </p>

          {/* ── Leaderboard list ── */}
          <div className="space-y-0">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-muted">No engineers match this filter. Looks like HR still hasn&apos;t seen them.</p>
              </div>
            ) : (
              filtered.map((entry, i) => {
                const badgeEmojis = entry.badgeIds
                  .map((id) => getBadgeById(id)?.emoji)
                  .filter(Boolean)
                  .slice(0, 4);

                return (
                  <motion.div
                    key={`${entry.rank}-${activeTab}`}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="flex items-center gap-4 py-4 border-b border-border last:border-0 group"
                  >
                    {/* Rank */}
                    <div className="w-10 shrink-0 text-center">
                      <span className={`font-mono text-sm font-bold ${entry.rank <= 3 ? "text-xl" : "text-muted"}`}>
                        {rankMedal(entry.rank)}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: entry.avatarColor }}
                    >
                      {entry.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>

                    {/* Name + College */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
                      <p className="text-xs text-muted truncate">
                        {entry.college} &middot; {entry.branch}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="hidden sm:flex items-center gap-1">
                      {badgeEmojis.map((emoji, ei) => (
                        <span key={ei} className="text-base" title="Badge">
                          {emoji}
                        </span>
                      ))}
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-bold text-foreground">{entry.score}/100</p>
                      <p className="text-[10px] text-muted">{entry.projects} projects</p>
                    </div>

                    {/* XP */}
                    <div className="hidden md:block text-right shrink-0 w-24">
                      <p className="font-mono text-xs font-semibold text-foreground">
                        {entry.xp.toLocaleString()} XP
                      </p>
                      <p className="text-[10px] text-muted mt-0.5">{entry.offer ?? "Hunting"}</p>
                    </div>

                    {/* Offer badge */}
                    {entry.offer && (
                      <div className="hidden lg:block shrink-0">
                        <Badge variant="success">{entry.offer}</Badge>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* ── Your rank CTA ── */}
          <div className="rounded-[12px] border border-border bg-surface p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-foreground">Where do you rank?</p>
              <p className="mt-0.5 text-xs text-muted">Take the reality check to join the board.</p>
            </div>
            <a href="/assessment">
              <Button variant="dark" size="sm">Check My Score</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
