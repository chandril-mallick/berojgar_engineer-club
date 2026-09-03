import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserTask {
  id?: string;
  title: string;
  category: "dsa" | "project" | "interview" | "aptitude" | "resume" | "general";
  priority: "high" | "medium" | "low";
  completed: boolean;
  xpReward: number;
  dueDate?: string;
  createdAt?: Timestamp | FieldValue | string;
  updatedAt?: Timestamp | FieldValue | string;
}

export interface WorkSubmission {
  id?: string;
  type: "daily_challenge" | "meme" | "referral_request" | "ambassador_app" | "placement_story" | "project" | "assessment";
  title: string;
  payload: Record<string, unknown>;
  createdAt?: Timestamp | FieldValue | string;
}

// Local Storage Fallback Key Generator for User Tasks
const getLocalKey = (uid: string) => `bec-user-tasks-${uid}`;

// Fetch User Tasks from Firestore with Local Storage Fallback
export async function getUserTasks(uid: string): Promise<UserTask[]> {
  try {
    const tasksRef = collection(db, "users", uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const tasks: UserTask[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserTask, "id">),
      }));
      // Cache locally
      window.localStorage.setItem(getLocalKey(uid), JSON.stringify(tasks));
      return tasks;
    }
  } catch (error) {
    console.warn("Firestore fetch offline, loading local cached tasks:", error);
  }

  // Fallback to local storage cache
  const cached = window.localStorage.getItem(getLocalKey(uid));
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to parse cached tasks", e);
    }
  }

  return [];
}

// Add a new Task to Firestore
export async function createUserTask(uid: string, task: Omit<UserTask, "id">): Promise<UserTask> {
  const newTask: UserTask = {
    ...task,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  let createdId = "local-" + Date.now();

  try {
    const tasksRef = collection(db, "users", uid, "tasks");
    const docRef = await addDoc(tasksRef, {
      ...task,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    createdId = docRef.id;
  } catch (error) {
    console.warn("Firestore task creation fallback to local cache:", error);
  }

  const finalTask = { ...newTask, id: createdId };

  // Update local cache
  const existing = await getUserTasks(uid);
  const updated = [finalTask, ...existing.filter((t) => t.id !== createdId)];
  window.localStorage.setItem(getLocalKey(uid), JSON.stringify(updated));

  return finalTask;
}

// Toggle Task Completion in Firestore
export async function toggleUserTask(uid: string, taskId: string, completed: boolean): Promise<void> {
  try {
    if (!taskId.startsWith("local-")) {
      const taskRef = doc(db, "users", uid, "tasks", taskId);
      await updateDoc(taskRef, {
        completed,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn("Firestore task toggle fallback:", error);
  }

  // Update local cache
  const existing = await getUserTasks(uid);
  const updated = existing.map((t) => (t.id === taskId ? { ...t, completed } : t));
  window.localStorage.setItem(getLocalKey(uid), JSON.stringify(updated));
}

// Delete Task from Firestore
export async function deleteUserTask(uid: string, taskId: string): Promise<void> {
  try {
    if (!taskId.startsWith("local-")) {
      const taskRef = doc(db, "users", uid, "tasks", taskId);
      await deleteDoc(taskRef);
    }
  } catch (error) {
    console.warn("Firestore task delete fallback:", error);
  }

  // Update local cache
  const existing = await getUserTasks(uid);
  const updated = existing.filter((t) => t.id !== taskId);
  window.localStorage.setItem(getLocalKey(uid), JSON.stringify(updated));
}

// Record Work Submission to Firestore
export async function recordWorkSubmission(uid: string, submission: WorkSubmission): Promise<void> {
  try {
    const subRef = collection(db, "users", uid, "submissions");
    await addDoc(subRef, {
      ...submission,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Firestore work submission recorded locally:", error);
  }
}
