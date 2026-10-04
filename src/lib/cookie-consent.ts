/**
 * Cookie / localStorage consent helper.
 *
 * The consent object stored in localStorage under `bec-cookie-consent`:
 *   { version: 1, timestamp: ISO-string, categories: { functional: bool, analytics: bool } }
 *
 * "Strictly Necessary" is always true and not stored (it cannot be refused).
 */

export const CONSENT_KEY = "bec-cookie-consent";
export const CONSENT_VERSION = 1;

export type ConsentCategory = "functional" | "analytics";

export interface ConsentRecord {
  version: number;
  timestamp: string;
  categories: Record<ConsentCategory, boolean>;
}

/** Read the stored consent record, or null if not yet set. */
export function getConsentRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    // Invalidate stale versions
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Write a consent record. */
export function setConsentRecord(categories: Record<ConsentCategory, boolean>): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories,
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  // Dispatch a custom event so any listener (e.g. the banner) can hide itself
  window.dispatchEvent(new CustomEvent("bec-consent-updated", { detail: record }));
}

/** Accept all optional categories. */
export function acceptAll(): void {
  setConsentRecord({ functional: true, analytics: true });
}

/** Reject all optional categories (strictly necessary only). */
export function rejectNonEssential(): void {
  setConsentRecord({ functional: false, analytics: false });
}

/**
 * Check whether the user has consented to a specific category.
 * Strictly Necessary always returns true.
 */
export function hasConsent(category: ConsentCategory | "strictly-necessary"): boolean {
  if (category === "strictly-necessary") return true;
  const record = getConsentRecord();
  if (!record) return false; // no consent given yet → deny
  return record.categories[category] === true;
}
