"use client";

import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { useEffect } from "react";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function StatCounter({ value, suffix = "", prefix = "", className = "" }: StatCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
