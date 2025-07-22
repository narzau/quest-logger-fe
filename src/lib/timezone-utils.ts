import { format, parseISO, addHours } from "date-fns";

/**
 * Parse timezone offset from string like "UTC-3" or "UTC+5:30"
 */
export function parseTimezoneOffset(timezone: string): number {
  const match = timezone.match(/UTC([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  
  const [, sign, hours, minutes = "0"] = match;
  const offset = parseInt(hours) + parseInt(minutes) / 60;
  return sign === "+" ? -offset : offset; // Negative because we add to UTC to get local
}

/**
 * Convert a UTC date to the user's timezone
 */
export function utcToUserTimezone(utcDate: string | Date, timezone: string): Date {
  const date = typeof utcDate === "string" ? parseISO(utcDate) : utcDate;
  const offset = parseTimezoneOffset(timezone);
  return addHours(date, -offset);
}

/**
 * Convert a date in user's timezone to UTC
 */
export function userTimezoneToUtc(localDate: Date, timezone: string): Date {
  const offset = parseTimezoneOffset(timezone);
  return addHours(localDate, offset);
}

/**
 * Format a UTC date string to display in user's timezone
 */
export function formatInTimezone(utcDate: string, timezone: string, formatStr: string): string {
  const localDate = utcToUserTimezone(utcDate, timezone);
  return format(localDate, formatStr);
}

/**
 * Get the current date in the user's timezone
 */
export function getCurrentDateInTimezone(timezone: string): Date {
  const now = new Date();
  return utcToUserTimezone(now, timezone);
}

/**
 * Get today's date string (YYYY-MM-DD) in the user's timezone
 */
export function getTodayInTimezone(timezone: string): string {
  const today = getCurrentDateInTimezone(timezone);
  return format(today, "yyyy-MM-dd");
}

/**
 * Convert a date-only string to a datetime at start of day in user's timezone
 */
export function dateToStartOfDayUtc(dateStr: string, timezone: string): string {
  // Parse the date and set to start of day in user's timezone
  const localDate = new Date(dateStr + "T00:00:00");
  const utcDate = userTimezoneToUtc(localDate, timezone);
  return utcDate.toISOString();
}

/**
 * Convert a date-only string to a datetime at end of day in user's timezone
 */
export function dateToEndOfDayUtc(dateStr: string, timezone: string): string {
  // Parse the date and set to end of day in user's timezone
  const localDate = new Date(dateStr + "T23:59:59");
  const utcDate = userTimezoneToUtc(localDate, timezone);
  return utcDate.toISOString();
} 