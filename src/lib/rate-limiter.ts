import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting backed by Upstash Redis when configured. Local development
 * deliberately falls back to an in-memory limiter so the app remains runnable
 * without external credentials.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Module-level store persists across requests in the same lambda instance.
//
// ⚠️  SERVERLESS WARNING (Task E): On Vercel (and any serverless platform) each
// cold-started function instance gets its OWN independent Map. Concurrent
// traffic will be spread across N instances, so the effective per-IP limit is
// N × limit rather than the configured limit. This in-memory fallback is safe
// only for local development and single-instance deployments.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable the
// distributed Upstash Redis limiter, which is correct for production.
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

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const distributedLimiters = new Map<string, Ratelimit>();

function getDistributedLimiter(options: RateLimitOptions): Ratelimit | null {
  if (!redis) return null;

  const cacheKey = `${options.limit}:${options.windowMs}`;
  const existing = distributedLimiters.get(cacheKey);
  if (existing) return existing;

  const duration = `${Math.max(1, Math.ceil(options.windowMs / 60_000))} m` as `${number} m`;
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.limit, duration),
    prefix: "bec:ratelimit",
    ephemeralCache: new Map(),
  });
  distributedLimiters.set(cacheKey, limiter);
  return limiter;
}

/**
 * Check and increment rate limit for an identifier (typically IP address).
 * Returns { success: false } when limit is exceeded.
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const distributedLimiter = getDistributedLimiter(options);
  if (distributedLimiter) {
    try {
      const result = await distributedLimiter.limit(identifier);
      return {
        success: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch (error) {
      // Keep the service available during a transient Redis outage. The local
      // limiter is intentionally a degraded mode, not the production default.
      console.warn("Distributed rate limiter unavailable; using local fallback.", error);
    }
  }

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
