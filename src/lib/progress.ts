import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export interface ProgressEntry {
  id: string;
  type: "dsa-lab" | "daily-grind";
  refId: string;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Unknown" | string;
  completedAt: string;
  xpEarned: number;
}

export interface ProgressStats {
  totalXP: number;
  streak: number;
  dsaStats: {
    total: number;
    Easy: number;
    Medium: number;
    Hard: number;
  };
  dailyGrindCount: number;
}

const LOCAL_STORAGE_KEY = "bec-progress-log";

// Helper to get local date string YYYY-MM-DD
function getLocalDateString(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date.toISOString().split("T")[0];
}

export const getProgress = (): ProgressEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading progress", e);
    return [];
  }
};

export const logProgress = async (
  uid: string | null,
  entryParams: Omit<ProgressEntry, "id" | "completedAt">
): Promise<void> => {
  if (typeof window === "undefined") return;

  const existing = getProgress();
  const todayDateStr = getLocalDateString();
  const nowIso = new Date().toISOString();

  // Deduplication
  if (entryParams.type === "dsa-lab") {
    if (existing.some((e) => e.type === "dsa-lab" && e.refId === entryParams.refId)) {
      return; // Already completed
    }
  } else if (entryParams.type === "daily-grind") {
    if (existing.some((e) => e.type === "daily-grind" && e.refId === todayDateStr)) {
      return; // Already done today
    }
    // Update refId to today if it isn't
    entryParams.refId = todayDateStr;
  }

  const newEntry: ProgressEntry = {
    ...entryParams,
    id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    completedAt: nowIso,
  };

  const newLog = [...existing, newEntry];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLog));

  // Mirror to Firestore if authenticated
  if (uid && db) {
    try {
      const docRef = doc(collection(db, "users", uid, "progress"), newEntry.id);
      await setDoc(docRef, newEntry);
    } catch (err) {
      console.error("Error syncing progress to Firestore:", err);
    }
  }
};

export const getStats = (): ProgressStats => {
  const log = getProgress();
  
  const stats: ProgressStats = {
    totalXP: 0,
    streak: 0,
    dsaStats: { total: 0, Easy: 0, Medium: 0, Hard: 0 },
    dailyGrindCount: 0,
  };

  const dates = new Set<string>();

  for (const entry of log) {
    stats.totalXP += entry.xpEarned || 0;
    
    // Add local date to dates set for streak calculation
    const localDate = new Date(entry.completedAt).toLocaleDateString("en-CA"); // YYYY-MM-DD
    dates.add(localDate);

    if (entry.type === "dsa-lab") {
      stats.dsaStats.total += 1;
      const diff = entry.difficulty || "Unknown";
      if (diff === "Easy") stats.dsaStats.Easy += 1;
      else if (diff === "Medium") stats.dsaStats.Medium += 1;
      else if (diff === "Hard") stats.dsaStats.Hard += 1;
    } else if (entry.type === "daily-grind") {
      stats.dailyGrindCount += 1;
    }
  }

  // Calculate Streak
  const sortedDates = Array.from(dates).sort((a, b) => b.localeCompare(a));
  const today = getLocalDateString();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayOffset = yesterdayDate.getTimezoneOffset();
  yesterdayDate.setMinutes(yesterdayDate.getMinutes() - yesterdayOffset);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  let currentStreak = 0;
  let expectedNextDate = today;

  // Check if today is in the set
  if (sortedDates.includes(today)) {
    currentStreak = 1;
    expectedNextDate = yesterday;
  } else if (sortedDates.includes(yesterday)) {
    currentStreak = 0; // Streak continues from yesterday, but haven't done today yet
    expectedNextDate = yesterday;
  } else {
    // Neither today nor yesterday, streak is broken
    stats.streak = 0;
    return stats;
  }

  // Calculate backward
  for (const date of sortedDates) {
    if (date === expectedNextDate && date !== today) {
      currentStreak += 1;
      // move expected date back by 1
      const d = new Date(date);
      d.setDate(d.getDate() - 1);
      const off = d.getTimezoneOffset();
      d.setMinutes(d.getMinutes() - off);
      expectedNextDate = d.toISOString().split("T")[0];
    } else if (date < expectedNextDate) {
      break; // Gap found
    }
  }

  stats.streak = currentStreak;
  return stats;
};
