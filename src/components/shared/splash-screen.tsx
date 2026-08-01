"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function SplashScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show splash screen on initial mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-4"
        >
          {/* Background Skeleton Wireframe Layout */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex flex-col p-6 max-w-5xl mx-auto w-full space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center w-full border-b pb-4">
              <Skeleton className="h-9 w-36 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
            {/* Hero skeleton */}
            <div className="flex flex-col items-center py-10 space-y-4">
              <Skeleton className="h-10 w-3/4 max-w-md rounded-xl" />
              <Skeleton className="h-6 w-1/2 max-w-sm rounded-lg" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-11 w-36 rounded-xl" />
                <Skeleton className="h-11 w-36 rounded-xl" />
              </div>
            </div>
            {/* Cards skeleton grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          </div>

          {/* Centered Branded Logo & Loading Progress */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-5">
            {/* Pulsing Logo Container */}
            <div className="relative">
              {/* Outer Glowing Gradient Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-amber-300 opacity-75 blur-[2px]"
              />

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: [0.95, 1.05, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-white p-1 shadow-2xl"
              >
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src="/berojgar-logo.png"
                  alt="Berojgar Engineer Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Brand Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="font-heading text-lg font-black tracking-tight text-foreground">
                BEROJGAR ENGINEER CLUB
              </h1>
              <p className="text-xs font-medium text-muted">
                From Berojgar to Employable.
              </p>
            </motion.div>

            {/* Skeleton Loading Progress Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="pt-2"
            >
              <div className="h-1.5 w-36 overflow-hidden rounded-full bg-muted-bg relative">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full bg-gradient-to-r from-amber-400 via-pink-500 to-amber-300 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
