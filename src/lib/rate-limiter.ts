/**
 * Lightweight in-memory sliding-window rate limiter for Next.js API routes.
 * No external packages needed — suitable for serverless environments.
 *
 * For production at scale, replace the store with Upstash Redis:
 * https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Module-level store persists across requests in the same lambda instance
const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}

export interface RateLimitOptions {
  /** Max allowed requests in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit for an identifier (typically IP address).
 * Returns { success: false } when limit is exceeded.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();

  cleanup(windowMs);

  const existing = store.get(identifier);

  // Fresh window
  if (!existing || now - existing.windowStart > windowMs) {
    store.set(identifier, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  // Limit exceeded
  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.windowStart + windowMs,
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.windowStart + windowMs,
  };
}

/**
 * Extract the real client IP from a Next.js Request.
 * Handles proxied requests via X-Forwarded-For.
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
