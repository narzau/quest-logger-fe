"use client";

import { useMemo } from "react";
import { TimeEntry, PaymentStatus } from "@/types/time-tracking";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { formatInTimezone } from "@/lib/timezone-utils";
import { toast } from "sonner";

interface InvoiceSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceSummaryDialog({
  open,
  onOpenChange,
}: InvoiceSummaryDialogProps) {
  const { entries, settings } = useTimeTracking();
  const timezone = settings?.timezone || "UTC-3";
  
  // Filter only unpaid and not invoiced entries
  const invoiceEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter(entry => 
      entry.payment_status === PaymentStatus.NOT_PAID && 
      entry.end_time // Only completed sessions
    ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [entries]);

  // Calculate totals
  const totals = useMemo(() => {
    return invoiceEntries.reduce((acc, entry) => {
      const hours = entry.total_hours || 0;
      const earned = entry.total_earned || 0;
      return {
        hours: acc.hours + hours,
        earned: acc.earned + earned,
        days: acc.days.add(entry.date),
      };
    }, { hours: 0, earned: 0, days: new Set<string>() });
  }, [invoiceEntries]);

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, TimeEntry[]>();
    invoiceEntries.forEach(entry => {
      const date = entry.date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(entry);
    });
    return grouped;
  }, [invoiceEntries]);

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const copyToClipboard = () => {
    let text = "INVOICE SUMMARY\n";
    text += `Period: ${invoiceEntries.length > 0 ? formatInTimezone(invoiceEntries[0].start_time, timezone, "MMM dd") : ""} - ${invoiceEntries.length > 0 ? formatInTimezone(invoiceEntries[invoiceEntries.length - 1].start_time, timezone, "MMM dd, yyyy") : ""}\n`;
    text += `Total Days Worked: ${totals.days.size}\n`;
    text += `Total Hours: ${formatDuration(totals.hours)}\n`;
    text += `Total Amount: ${formatCurrency(totals.earned)}\n\n`;
    text += "DAILY BREAKDOWN:\n";
    text += "================\n\n";

    entriesByDate.forEach((entries, date) => {
      const dayTotal = entries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
      const dayHours = entries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
      
      text += `${format(new Date(date), "EEEE, MMM dd, yyyy")}\n`;
      entries.forEach(entry => {
        text += `  ${formatInTimezone(entry.start_time, timezone, "HH:mm")} - ${entry.end_time ? formatInTimezone(entry.end_time, timezone, "HH:mm") : "ongoing"}`;
        text += ` (${formatDuration(entry.total_hours || 0)})`;
        text += ` - ${formatCurrency(entry.total_earned || 0)}`;
        if (entry.notes) text += ` - ${entry.notes}`;
        text += "\n";
      });
      text += `  Day Total: ${formatDuration(dayHours)} = ${formatCurrency(dayTotal)}\n\n`;
    });

    navigator.clipboard.writeText(text);
    toast.success("Invoice summary copied to clipboard!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings?.currency || "USD",
    }).format(amount);
  };

  if (invoiceEntries.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Summary</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-muted-foreground">
            No unpaid entries to invoice.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Summary</span>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{totals.days.size}</div>
                  <div className="text-sm text-muted-foreground">Days Worked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatDuration(totals.hours)}</div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totals.earned)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period */}
          <div className="text-sm text-muted-foreground text-center">
            Period: {formatInTimezone(invoiceEntries[0].start_time, timezone, "MMMM dd")} - {formatInTimezone(invoiceEntries[invoiceEntries.length - 1].start_time, timezone, "MMMM dd, yyyy")}
          </div>

          <Separator />

          {/* Daily Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold">Daily Breakdown</h3>
            {Array.from(entriesByDate.entries()).map(([date, entries]) => {
              const dayTotal = entries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
              const dayHours = entries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
              
              return (
                <Card key={date} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(date), "EEEE, MMMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDuration(dayHours)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(dayTotal)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      {entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {formatInTimezone(entry.start_time, timezone, "HH:mm")} - {entry.end_time ? formatInTimezone(entry.end_time, timezone, "HH:mm") : "ongoing"}
                            </span>
                            <span className="text-muted-foreground">
                              ({formatDuration(entry.total_hours || 0)})
                            </span>
                            {entry.notes && (
                              <span className="text-muted-foreground italic">
                                - {entry.notes}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">
                            {formatCurrency(entry.total_earned || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 