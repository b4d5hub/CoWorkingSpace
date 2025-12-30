// Shared pricing utilities for per-hour billing
// These helpers are frontend-only and do not alter backend contracts.

export type PriceBreakdown = {
  hours: number; // decimal hours (e.g., 1.5 means 1 hour 30 min)
  total: number; // total cost = hours * pricePerHour
};

// Parse a time string like "HH:MM" into minutes from midnight
export function parseTimeToMinutes(t?: string): number | null {
  if (!t) return null;
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh * 60 + mm;
}

// Compute decimal hours difference between two times in HH:MM format.
// Returns null if either time is invalid or end <= start.
export function diffHours(start?: string, end?: string): number | null {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s == null || e == null) return null;
  const deltaMin = e - s;
  if (deltaMin <= 0) return null;
  // Convert to hours with 2 decimal precision to avoid FP noise
  return Math.round((deltaMin / 60) * 100) / 100;
}

// Calculate price breakdown. If pricePerHour is missing/invalid or hours invalid, returns null.
export function calculateTotalPrice(pricePerHour: number | undefined, start?: string, end?: string): PriceBreakdown | null {
  if (typeof pricePerHour !== 'number' || isNaN(pricePerHour) || pricePerHour < 0) return null;
  const hours = diffHours(start, end);
  if (hours == null) return null;
  const total = Math.round(hours * pricePerHour * 100) / 100;
  return { hours, total };
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return 'N/A';
  return amount.toFixed(2);
}
