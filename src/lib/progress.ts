import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressEntry {
  id: string;
  type: "dsa-lab" | "daily-grind" | "roadmap";
  refId: string;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Unknown" | string;
  completedAt: string; // ISO 8601
  xpEarned: number;
}

export interface ProgressStats {
  // DSA Lab
  dsaSolved: number;
  dsaByDifficulty: { Easy: number; Medium: number; Hard: number; Unknown: number };
  recentSolves: ProgressEntry[]; // newest 5 dsa-lab entries

  // Daily Grind
  dailyCompletions: number;
  currentStreak: number;  // consecutive calendar days with ≥1 daily-grind entry ending today or yesterday
  longestStreak: number;

  // Totals
  totalXPEarned: number;
  recent: ProgressEntry[]; // newest 10 entries of any type

  // Legacy aliases (keep existing callers compiling)
  totalXP: number;
  streak: number;
  dsaStats: { total: number; Easy: number; Medium: number; Hard: number };
  dailyGrindCount: number;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "bec-progress-log";
const MIGRATED_KEY = "bec-progress-migrated-v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns local YYYY-MM-DD using the browser's timezone */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns YYYY-MM-DD from an ISO timestamp string, in local timezone */
function isoToLocalDate(iso: string): string {
  return getLocalDateString(new Date(iso));
}

/** Returns yesterday's YYYY-MM-DD in local timezone */
function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

/** Generate a random id */
function makeId(): string {
  return `prog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Storage read / write ─────────────────────────────────────────────────────

export function getProgress(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressEntry[]) : [];
  } catch {
    return [];
  }
}

function saveProgress(log: ProgressEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

// ─── Migration: bec-rwdsa-completed → progress log ───────────────────────────

/**
 * One-time migration that reads the legacy `bec-rwdsa-completed` array of slugs
 * and inserts them into the progress log with difficulty "Unknown".
 * Runs at most once (guarded by MIGRATED_KEY).
 */
export function migrateOldData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATED_KEY) === "1") return;

  try {
    const raw = localStorage.getItem("bec-rwdsa-completed");
    if (raw) {
      const slugs: string[] = JSON.parse(raw);
      if (Array.isArray(slugs) && slugs.length > 0) {
        const existing = getProgress();
        const existingRefIds = new Set(
          existing.filter((e) => e.type === "dsa-lab").map((e) => e.refId)
        );

        const newEntries: ProgressEntry[] = slugs
          .filter((slug) => !existingRefIds.has(slug))
          .map((slug) => ({
            id: makeId(),
            type: "dsa-lab" as const,
            refId: slug,
            title: slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            difficulty: "Unknown",
            completedAt: new Date(0).toISOString(), // epoch — visibly old
            xpEarned: 100,
          }));

        if (newEntries.length > 0) {
          saveProgress([...existing, ...newEntries]);
        }
      }
    }
  } catch {
    // ignore migration errors
  } finally {
    localStorage.setItem(MIGRATED_KEY, "1");
  }
}

// ─── Log a new entry ─────────────────────────────────────────────────────────

export async function logProgress(
  uid: string | null,
  entryParams: Omit<ProgressEntry, "id" | "completedAt">
): Promise<{ blocked: boolean; reason?: string }> {
  if (typeof window === "undefined") return { blocked: true, reason: "ssr" };

  migrateOldData();
  const existing = getProgress();
  const today = getLocalDateString();

  // ── Deduplication ──
  if (entryParams.type === "dsa-lab") {
    if (existing.some((e) => e.type === "dsa-lab" && e.refId === entryParams.refId)) {
      return { blocked: true, reason: "already-solved" };
    }
  } else if (entryParams.type === "daily-grind") {
    // refId for daily-grind is always today's date
    entryParams = { ...entryParams, refId: today };
    if (existing.some((e) => e.type === "daily-grind" && e.refId === today)) {
      return { blocked: true, reason: "already-done-today" };
    }
  }

  const newEntry: ProgressEntry = {
    ...entryParams,
    id: makeId(),
    completedAt: new Date().toISOString(),
  };

  saveProgress([...existing, newEntry]);

  // ── Mirror to Firestore ──
  if (uid && db) {
    try {
      const ref = doc(collection(db, "users", uid, "progress"), newEntry.id);
      await setDoc(ref, newEntry);
    } catch (err) {
      console.error("Firestore progress sync failed:", err);
    }
  }

  return { blocked: false };
}

// ─── Stats computation ────────────────────────────────────────────────────────

export function getStats(): ProgressStats {
  if (typeof window !== "undefined") migrateOldData();

  const log = getProgress();

  // ── DSA stats ──
  const dsaEntries = log.filter((e) => e.type === "dsa-lab");
  const dsaByDiff = { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 };
  for (const e of dsaEntries) {
    const d = (e.difficulty || "Unknown") as keyof typeof dsaByDiff;
    if (d in dsaByDiff) dsaByDiff[d]++;
    else dsaByDiff.Unknown++;
  }

  const recentSolves = [...dsaEntries]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 5);

  // ── Daily-grind streak (only daily-grind type counts for streak) ──
  const grindEntries = log.filter((e) => e.type === "daily-grind");
  // Collect unique local-date strings
  const grindDates = Array.from(
    new Set(grindEntries.map((e) => isoToLocalDate(e.completedAt)))
  ).sort((a, b) => b.localeCompare(a)); // newest first

  const today = getLocalDateString();
  const yesterday = getYesterday();

  let currentStreak = 0;
  let longestStreak = 0;

  if (grindDates.length > 0) {
    // currentStreak: count backward from today (or yesterday if today not done yet)
    let expected = grindDates.includes(today) ? today : yesterday;

    // If neither today nor yesterday, streak is 0
    if (grindDates.includes(expected)) {
      for (const d of grindDates) {
        if (d === expected) {
          currentStreak++;
          // advance expected to the day before
          const prev = new Date(d);
          prev.setDate(prev.getDate() - 1);
          expected = getLocalDateString(prev);
        } else if (d < expected) {
          break; // gap
        }
        // d > expected means it's a newer date we already passed, skip
      }
    }

    // longestStreak: full scan
    // Sort ascending for this
    const ascDates = [...grindDates].sort();
    let run = 0;
    let prevDate = "";
    for (const d of ascDates) {
      if (!prevDate) {
        run = 1;
      } else {
        const prev = new Date(prevDate);
        prev.setDate(prev.getDate() + 1);
        const expectedNext = getLocalDateString(prev);
        if (d === expectedNext) {
          run++;
        } else {
          run = 1;
        }
      }
      if (run > longestStreak) longestStreak = run;
      prevDate = d;
    }
  }

  // ── Recent (all types) ──
  const recent = [...log]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 10);

  // ── Total XP ──
  const totalXPEarned = log.reduce((sum, e) => sum + (e.xpEarned || 0), 0);

  return {
    dsaSolved: dsaEntries.length,
    dsaByDifficulty: dsaByDiff,
    recentSolves,
    dailyCompletions: grindEntries.length,
    currentStreak,
    longestStreak,
    totalXPEarned,
    recent,

    // Legacy aliases
    totalXP: totalXPEarned,
    streak: currentStreak,
    dsaStats: {
      total: dsaEntries.length,
      Easy: dsaByDiff.Easy,
      Medium: dsaByDiff.Medium,
      Hard: dsaByDiff.Hard,
    },
    dailyGrindCount: grindEntries.length,
  };
}

// ─── Utility: has user completed daily grind today? ─────────────────────────

export function hasCompletedGrindToday(): boolean {
  if (typeof window === "undefined") return false;
  const today = getLocalDateString();
  return getProgress().some((e) => e.type === "daily-grind" && e.refId === today);
}
