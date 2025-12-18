/**
 * Pricing utilities for room reservations.
 *
 * Centralizes all price-related calculations and formatting so that
 * ReservationForm, Confirmation, Dashboard, etc. remain consistent.
 */

/**
 * Parses times in format "HH:mm" and returns fractional hours between them.
 * Returns null if parsing fails or end <= start.
 */
export function calculateHours(startTime?: string, endTime?: string): number | null {
  if (!startTime || !endTime) return null;
  const [sh, sm] = startTime.split(':').map((v) => Number(v));
  const [eh, em] = endTime.split(':').map((v) => Number(v));
  if (
    [sh, sm, eh, em].some((n) => Number.isNaN(n)) ||
    sh < 0 || sh > 23 || eh < 0 || eh > 23 ||
    sm < 0 || sm > 59 || em < 0 || em > 59
  ) {
    return null;
  }
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (endMinutes <= startMinutes) return null;
  const diffMinutes = endMinutes - startMinutes;
  // Allow fractional hours (e.g., 30 minutes = 0.5h). Round to 2 decimals for display.
  const hours = diffMinutes / 60;
  return Math.round(hours * 100) / 100;
}

/**
 * Calculates total price as hours × pricePerHour.
 * Returns null when pricePerHour or hours are missing/invalid.
 */
export function calculateTotalPrice(pricePerHour?: number, hours?: number | null): number | null {
  if (pricePerHour === undefined || pricePerHour === null) return null;
  if (hours === undefined || hours === null) return null;
  const total = pricePerHour * hours;
  if (!Number.isFinite(total)) return null;
  // Round to 2 decimals
  return Math.round(total * 100) / 100;
}

/**
 * Formats a numeric value to 2 decimals. If null/undefined, returns fallback (default "N/A").
 */
export function formatMoney(value: number | null | undefined, fallback = 'N/A'): string {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  return value.toFixed(2);
}

/**
 * Formats price per hour consistently: "XX.XX / hr" or "N/A" if missing.
 */
export function formatPricePerHour(price?: number, opts?: { na?: string }): string {
  if (price === undefined || price === null || Number.isNaN(price)) return opts?.na ?? 'N/A';
  return `${price.toFixed(2)} / hr`;
}
