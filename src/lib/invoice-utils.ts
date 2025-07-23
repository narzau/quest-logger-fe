import { TimeEntry } from "@/types/time-tracking";

/**
 * Format invoice data for display
 */
export function formatInvoiceData(entries: TimeEntry[]) {
  const totalHours = entries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
  const totalAmount = entries.reduce((sum, entry) => sum + (entry.total_earned || 0), 0);
  
  // Group by date (using start_time to get accurate date)
  const groupedByDate = entries.reduce((acc, entry) => {
    // Extract date from start_time instead of using entry.date
    const date = entry.start_time.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);
  
  return {
    totalHours,
    totalAmount,
    groupedByDate,
    startDate: entries.length > 0 ? entries[entries.length - 1].start_time.split('T')[0] : null,
    endDate: entries.length > 0 ? entries[0].start_time.split('T')[0] : null,
  };
} 