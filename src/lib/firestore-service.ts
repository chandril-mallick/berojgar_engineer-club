import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
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

    // Update main user document score and profile metadata
    const userRef = doc(db, "users", uid);
    const profileUpdates: Record<string, any> = {
      berojgarScore: assessment.score,
      riskIndex: assessment.riskIndex,
      lastAssessmentAt: serverTimestamp(),
    };

    if (assessment.answers) {
      profileUpdates.college = assessment.answers.college || "Engineering College";
      profileUpdates.branch = assessment.answers.branch || "CSE";
      profileUpdates.year = assessment.answers.year || "4";
      profileUpdates.github = assessment.answers.github || "no";
      profileUpdates.linkedin = assessment.answers.linkedin || "no";
      profileUpdates.targetCompany = assessment.answers.targetCompany || "";
    }

    await setDoc(userRef, profileUpdates, { merge: true });
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

// 8. Save & Get Global Community Referral Requests
export async function saveCommunityReferral(referral: {
  company: string;
  role: string;
  targetPackage: string;
  requesterName: string;
  college: string;
  branch: string;
  yoGrad: string;
  experience: string;
  skills: string[];
  proofLink: string;
}) {
  try {
    const refCol = collection(db, "community_referrals");
    const docRef = await addDoc(refCol, {
      ...referral,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firestore saveCommunityReferral fallback:", error);
    return { success: false, error };
  }
}

export async function getCommunityReferrals() {
  try {
    const refCol = collection(db, "community_referrals");
    const q = query(refCol, orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data: results };
  } catch (error) {
    console.warn("Firestore getCommunityReferrals fallback:", error);
    return { success: false, data: [] };
  }
}

// 9. Save & Get Global Offer Wall Posts
export async function saveCommunityOffer(offer: {
  studentName: string;
  college: string;
  company: string;
  role: string;
  packageLpa: number;
  branch: string;
  year: string;
  storySnippet: string;
}) {
  try {
    const offerCol = collection(db, "community_offers");
    const docRef = await addDoc(offerCol, {
      ...offer,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firestore saveCommunityOffer fallback:", error);
    return { success: false, error };
  }
}

export async function getCommunityOffers() {
  try {
    const offerCol = collection(db, "community_offers");
    const q = query(offerCol, orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data: results };
  } catch (error) {
    console.warn("Firestore getCommunityOffers fallback:", error);
    return { success: false, data: [] };
  }
}

// 10. Get Top Registered Users for Leaderboard
export async function getTopFirestoreUsers() {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, orderBy("berojgarScore", "desc"), limit(20));
    const snap = await getDocs(q);
    const results = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return { success: true, data: results };
  } catch (error) {
    console.warn("Firestore getTopFirestoreUsers fallback:", error);
    return { success: false, data: [] };
  }
}

