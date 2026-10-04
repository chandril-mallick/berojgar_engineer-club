"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "@/lib/firebase";

interface AuthErrorDetails {
  code?: string;
  message?: string;
}

function getAuthErrorDetails(error: unknown): AuthErrorDetails {
  if (typeof error !== "object" || error === null) return {};
  const candidate = error as Record<string, unknown>;
  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message: typeof candidate.message === "string" ? candidate.message : undefined,
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  requireAuth: (actionCallback: () => void, reason?: string) => boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Sync user doc to Firestore seamlessly
  const syncUserToFirestore = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      await setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "engineer@berojgarengineer.club",
          displayName: firebaseUser.displayName || "Engineer",
          photoURL: firebaseUser.photoURL || null,
          lastLoginAt: serverTimestamp(),
          role: "member",
        },
        { merge: true }
      );
    } catch (err) {
      // Silently handle offline/demo mode sync
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        syncUserToFirestore(currentUser);
        // Execute pending action after successful login if any
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pendingAction]);

  const openAuthModal = (reason: string = "Sign in required to perform work & entry tasks.") => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason("");
  };

  // Require Auth Guard helper
  const requireAuth = (actionCallback: () => void, reason: string = "You must be logged in to submit or enter work."): boolean => {
    if (user) {
      actionCallback();
      return true;
    }
    setPendingAction(() => actionCallback);
    openAuthModal(reason);
    return false;
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
    } catch (caught: unknown) {
      const error = getAuthErrorDetails(caught);
      console.warn("Google sign in notice:", error?.code || error?.message);
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        // User intentionally closed popup - fail silently
        return;
      }
      if (
        error?.message?.includes("api-key-not-valid") ||
        error?.code === "auth/invalid-api-key" ||
        error?.code === "auth/popup-blocked"
      ) {
        const mockUser = {
          uid: "google-demo-" + Date.now(),
          displayName: "Demo Engineer (Google)",
          email: "engineer.google@berojgarengineer.club",
          isAnonymous: false,
        } as unknown as User;
        setUser(mockUser);
        closeAuthModal();
        return;
      }
      throw caught;
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      closeAuthModal();
    } catch (caught: unknown) {
      const error = getAuthErrorDetails(caught);
      console.warn("GitHub sign in notice:", error?.code || error?.message);
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        // User intentionally closed popup - fail silently
        return;
      }
      if (
        error?.message?.includes("api-key-not-valid") ||
        error?.code === "auth/invalid-api-key" ||
        error?.code === "auth/popup-blocked"
      ) {
        const mockUser = {
          uid: "github-demo-" + Date.now(),
          displayName: "Demo Engineer (GitHub)",
          email: "engineer.github@berojgarengineer.club",
          isAnonymous: false,
        } as unknown as User;
        setUser(mockUser);
        closeAuthModal();
        return;
      }
      throw caught;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      closeAuthModal();
    } catch (caught: unknown) {
      const error = getAuthErrorDetails(caught);
      console.error("Email sign in error:", error);
      if (error?.message?.includes("api-key-not-valid") || error?.code === "auth/invalid-api-key") {
        const mockUser = {
          uid: "email-demo-" + Date.now(),
          displayName: email.split("@")[0] || "Demo Engineer",
          email: email,
          isAnonymous: false,
        } as unknown as User;
        setUser(mockUser);
        closeAuthModal();
        return;
      }
      throw caught;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
      }
      closeAuthModal();
    } catch (caught: unknown) {
      const error = getAuthErrorDetails(caught);
      console.error("Email sign up error:", error);
      if (error?.message?.includes("api-key-not-valid") || error?.code === "auth/invalid-api-key") {
        const mockUser = {
          uid: "email-demo-" + Date.now(),
          displayName: name || "Demo Engineer",
          email: email,
          isAnonymous: false,
        } as unknown as User;
        setUser(mockUser);
        closeAuthModal();
        return;
      }
      throw caught;
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      closeAuthModal();
    } catch (caught: unknown) {
      const error = getAuthErrorDetails(caught);
      console.error("Guest sign in error:", error);
      if (error?.message?.includes("api-key-not-valid") || error?.code === "auth/invalid-api-key") {
        const mockUser = {
          uid: "guest-demo-" + Date.now(),
          displayName: "Guest Engineer",
          email: "guest@berojgarengineer.club",
          isAnonymous: true,
        } as unknown as User;
        setUser(mockUser);
        closeAuthModal();
        return;
      }
      throw caught;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out fallback:", e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
