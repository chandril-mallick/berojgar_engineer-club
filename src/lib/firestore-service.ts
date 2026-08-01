import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

/**
 * Firestore User Data Persistence Helper Service
 * Ensures all user metrics, scores, challenges, AI chats, tasks, and resumes
 * are saved directly to Cloud Firestore under the user's document.
 */

// 1. Save / Update User Profile
export async function saveUserProfile(
  uid: string,
  profileData: {
    displayName?: string;
    email?: string;
    photoURL?: string | null;
    college?: string;
    branch?: string;
    year?: string;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    score?: number;
  }
) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveUserProfile fallback:", error);
    return { success: false, error };
  }
}

// 2. Save Berojgar Score & Assessment Data
export async function saveUserAssessment(
  uid: string,
  assessment: {
    score: number;
    riskIndex: "Low" | "Medium" | "High" | "Critical";
    dsaScore: number;
    devScore: number;
    csFundamentalsScore: number;
    communicationScore: number;
    answers?: Record<string, any>;
  }
) {
  try {
    // Save detailed assessment record in subcollection
    const assessmentCol = collection(db, "users", uid, "assessments");
    await addDoc(assessmentCol, {
      ...assessment,
      createdAt: serverTimestamp(),
    });

    // Update main user document score
    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        berojgarScore: assessment.score,
        riskIndex: assessment.riskIndex,
        lastAssessmentAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveUserAssessment fallback:", error);
    return { success: false, error };
  }
}

// 3. Save Daily Challenge Submission & Increment Streak
export async function saveDailyChallenge(
  uid: string,
  challenge: {
    problemId: string;
    title: string;
    language: string;
    codeSubmitted: string;
    status: "accepted" | "failed";
  }
) {
  try {
    const challengesCol = collection(db, "users", uid, "daily_challenges");
    await addDoc(challengesCol, {
      ...challenge,
      createdAt: serverTimestamp(),
    });

    // Update streak counter in main user profile if accepted
    if (challenge.status === "accepted") {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        streak: increment(1),
        lastStreakAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveDailyChallenge fallback:", error);
    return { success: false, error };
  }
}

// 4. Save AI Coach Chat Message
export async function saveAIChatMessage(
  uid: string,
  chat: {
    prompt: string;
    reply: string;
    mode: string;
    model?: string;
  }
) {
  try {
    const aiChatsCol = collection(db, "users", uid, "ai_chats");
    await addDoc(aiChatsCol, {
      ...chat,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveAIChatMessage fallback:", error);
    return { success: false, error };
  }
}

// 5. Save Completed Task / Task Submission
export async function saveUserTask(
  uid: string,
  task: {
    taskId: string;
    title: string;
    category: string;
    pointsEarned: number;
    proofUrl?: string;
  }
) {
  try {
    const tasksCol = collection(db, "users", uid, "tasks");
    await addDoc(tasksCol, {
      ...task,
      completedAt: serverTimestamp(),
    });

    // Update total completed tasks count
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      completedTasksCount: increment(1),
    });
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveUserTask fallback:", error);
    return { success: false, error };
  }
}

// 6. Save Resume Roast & ATS Score
export async function saveResumeRoast(
  uid: string,
  resume: {
    atsScore: number;
    roastFeedback: string;
    suggestedFixes: string[];
    fileName?: string;
  }
) {
  try {
    const resumesCol = collection(db, "users", uid, "resumes");
    await addDoc(resumesCol, {
      ...resume,
      createdAt: serverTimestamp(),
    });

    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        latestAtsScore: resume.atsScore,
        lastResumeRoastAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.warn("Firestore saveResumeRoast fallback:", error);
    return { success: false, error };
  }
}

// 7. Get Full User Data Profile from Firestore
export async function getUserFirestoreProfile(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { success: true, data: snap.data() };
    }
    return { success: false, data: null };
  } catch (error) {
    console.warn("Firestore getUserFirestoreProfile fallback:", error);
    return { success: false, error };
  }
}
