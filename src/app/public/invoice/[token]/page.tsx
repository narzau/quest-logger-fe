"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatInvoiceData } from "@/lib/invoice-utils";
import { TimeEntry } from "@/types/time-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatInTimezone } from "@/lib/timezone-utils";
import { CalendarDays, Clock, DollarSign, FileText } from "lucide-react";
import { format } from "date-fns";
import { defaultPalettes, colorToString } from "@/lib/color-config";

// Frost theme wrapper component
function FrostThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const palette = defaultPalettes.silver;
    const root = document.documentElement;
    
    // Apply frost theme CSS variables
    root.style.setProperty('--primary', colorToString(palette.primary));
    root.style.setProperty('--secondary', colorToString(palette.secondary));
    root.style.setProperty('--background', colorToString(palette.background));
    root.style.setProperty('--foreground', colorToString(palette.foreground));
    root.style.setProperty('--muted', colorToString(palette.muted));
    root.style.setProperty('--accent', colorToString(palette.accent));
    root.style.setProperty('--destructive', colorToString(palette.destructive));
    
    // Also set the oklch values directly
    root.style.setProperty('--primary', `oklch(${palette.primary.l} ${palette.primary.c} ${palette.primary.h})`);
    root.style.setProperty('--primary-foreground', `oklch(0.985 0 0)`);
    root.style.setProperty('--background', `oklch(${palette.background.l} ${palette.background.c} ${palette.background.h})`);
    root.style.setProperty('--foreground', `oklch(${palette.foreground.l} ${palette.foreground.c} ${palette.foreground.h})`);
    root.style.setProperty('--muted', `oklch(${palette.muted.l} ${palette.muted.c} ${palette.muted.h})`);
    root.style.setProperty('--muted-foreground', `oklch(0.3 0.05 220)`);
    root.style.setProperty('--accent', `oklch(${palette.accent.l} ${palette.accent.c} ${palette.accent.h})`);
    root.style.setProperty('--accent-foreground', `oklch(0.985 0 0)`);
    // Calculate border from muted color - slightly darker
    const borderL = Math.max(0, palette.muted.l - 0.1);
    root.style.setProperty('--border', `oklch(${borderL} ${palette.muted.c} ${palette.muted.h})`);
    root.style.setProperty('--card', `oklch(${palette.background.l} ${palette.background.c} ${palette.background.h})`);
    root.style.setProperty('--card-foreground', `oklch(${palette.foreground.l} ${palette.foreground.c} ${palette.foreground.h})`);
    
    // Cleanup function to reset on unmount
    return () => {
      // Remove the custom properties when component unmounts
      const properties = ['--primary', '--primary-foreground', '--secondary', '--background', '--foreground', '--muted', '--muted-foreground', '--accent', '--accent-foreground', '--destructive', '--border', '--card', '--card-foreground'];
      properties.forEach(prop => root.style.removeProperty(prop));
    };
  }, []);
  
  return <>{children}</>;
}

export default function PublicInvoicePage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set the page title when data is available
  useEffect(() => {
    if (data && data.length > 0) {
      const invoiceData = formatInvoiceData(data);
      if (invoiceData.startDate && invoiceData.endDate) {
        const startDate = formatInTimezone(invoiceData.startDate, "UTC", "MMM dd");
        const endDate = formatInTimezone(invoiceData.endDate, "UTC", "MMM dd, yyyy");
        document.title = `Invoice | ${startDate} - ${endDate}`;
      }
    }
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Token is now the complete signed token from the backend
        // The backend will validate and extract parameters from it
        const response = await fetch(`/api/v1/public/invoice/${encodeURIComponent(token)}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("This link has expired or is invalid");
          }
          throw new Error("Failed to load invoice data");
        }

        const entries = await response.json();
        setData(entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <FrostThemeWrapper>
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </FrostThemeWrapper>
    );
  }

  if (error) {
    return (
      <FrostThemeWrapper>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Unable to Load Invoice</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FrostThemeWrapper>
    );
  }

  const invoiceData = formatInvoiceData(data);

  return (
    <FrostThemeWrapper>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-foreground">Work Hours Summary</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {invoiceData.startDate && invoiceData.endDate && (
                    <>
                      {formatInTimezone(invoiceData.startDate, "UTC", "MMM dd")} - 
                      {formatInTimezone(invoiceData.endDate, "UTC", "MMM dd, yyyy")}
                    </>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">${invoiceData.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Summary Stats */}
                          <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                                      <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xl font-semibold text-foreground">{invoiceData.totalHours.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-semibold text-foreground">{Object.keys(invoiceData.groupedByDate).length}</p>
                    <p className="text-xs text-muted-foreground">Days Worked</p>
                  </div>
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-semibold text-foreground">${data[0]?.hourly_rate || 0}</p>
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Entries - Compact Grouped View */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-muted-foreground">Time Entries</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-foreground">Date</th>
                      <th className="text-left px-3 py-2 font-medium text-foreground">Hours</th>
                      <th className="text-right px-3 py-2 font-medium text-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(invoiceData.groupedByDate)
                      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                      .map(([date, entries]) => {
                        const dayTotal = entries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
                        const dayHours = entries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
                        
                        return (
                          <React.Fragment key={date}>
                            <tr className="border-b">
                              <td className="px-3 py-2 font-medium text-foreground">
                                {(() => {
                                  const [year, month, day] = date.split('-').map(Number);
                                  return format(new Date(year, month - 1, day, 12), "EEE, MMM dd");
                                })()}
                              </td>
                              <td className="px-3 py-2 text-foreground">
                                {dayHours.toFixed(2)}h
                              </td>
                              <td className="px-3 py-2 text-right font-medium text-foreground">
                                ${dayTotal.toFixed(2)}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td colSpan={3} className="px-3 py-1 pb-2">
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {entries.map((entry) => (
                                    <div key={entry.id} className="flex justify-between">
                                      <span>
                                        {formatInTimezone(entry.start_time, "UTC-3", "HH:mm")}-{entry.end_time ? formatInTimezone(entry.end_time, "UTC-3", "HH:mm") : "..."} 
                                        ({(entry.total_hours || 0).toFixed(1)}h)
                                        {entry.notes && <span className="ml-2 italic">{entry.notes}</span>}
                                      </span>
                                      <span>${entry.total_earned?.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                  <tfoot className="bg-muted border-t font-semibold">
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-foreground">Total</td>
                      <td className="px-3 py-2 text-right text-foreground">${invoiceData.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
              <p>Generated on {new Date().toLocaleDateString()} • For questions, contact the contractor directly</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </FrostThemeWrapper>
  );
} 