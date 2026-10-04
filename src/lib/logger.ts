/**
 * Tiny logger utility.
 *
 * Rules:
 *  - logger.debug()  → only emits in development (NEXT_PUBLIC or Node env).
 *  - logger.warn()   → always emits (degraded-mode fallbacks, etc.).
 *  - logger.error()  → always emits (genuine error paths).
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.debug("Loaded user profile", uid);
 *   logger.warn("Firestore unavailable, using cache");
 *   logger.error("Assessment API failed", err);
 */

const isDev =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test");

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...args: any[]) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log("[BEC debug]", ...args);
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn("[BEC]", ...args);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error("[BEC]", ...args);
  },
};
