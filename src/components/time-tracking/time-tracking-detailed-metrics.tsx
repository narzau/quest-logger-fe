"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { PaymentStatus } from "@/types/time-tracking";
import { 
  DollarSign, 
  Clock, 
  Activity,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, isAfter } from "date-fns";

export function TimeTrackingDetailedMetrics() {
  const { entries, settings } = useTimeTracking();
  
  const metrics = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        avgHoursPerDay: 0,
        avgHourlyRate: 0,
        totalDaysWorked: 0,
        yearToDateEarned: 0,
        longestSession: 0,
        shortestSession: 0,
        mostProductiveDay: "",
        unpaidBreakdown: {
          notInvoiced: 0,
          invoicedPending: 0,
          invoicedApproved: 0,
        },
        weeklyTrend: "stable" as "up" | "down" | "stable",
      };
    }

    // Calculate unique days worked
    const uniqueDays = new Set(entries.map(e => e.date));
    const totalDaysWorked = uniqueDays.size;

    // Calculate average hours per day
    const totalHours = entries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
    const avgHoursPerDay = totalDaysWorked > 0 ? totalHours / totalDaysWorked : 0;

    // Calculate average hourly rate
    const ratesSum = entries.reduce((sum, e) => sum + e.hourly_rate, 0);
    const avgHourlyRate = entries.length > 0 ? ratesSum / entries.length : 0;

    // Calculate year to date earnings
    const currentYear = new Date().getFullYear();
    const yearToDateEarned = entries
      .filter(e => new Date(e.start_time).getFullYear() === currentYear)
      .reduce((sum, e) => sum + (e.total_earned || 0), 0);

    // Find longest and shortest sessions
    const completedSessions = entries.filter(e => e.end_time && e.total_hours);
    const longestSession = completedSessions.length > 0 
      ? Math.max(...completedSessions.map(e => e.total_hours || 0))
      : 0;
    const shortestSession = completedSessions.length > 0
      ? Math.min(...completedSessions.map(e => e.total_hours || 0))
      : 0;

    // Find most productive day of week
    const dayHours: Record<string, number> = {};
    entries.forEach(entry => {
      const dayName = format(new Date(entry.date), "EEEE");
      dayHours[dayName] = (dayHours[dayName] || 0) + (entry.total_hours || 0);
    });
    const mostProductiveDay = Object.entries(dayHours)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    // Calculate unpaid breakdown
    const unpaidBreakdown = {
      notInvoiced: entries
        .filter(e => e.payment_status === PaymentStatus.NOT_PAID)
        .reduce((sum, e) => sum + (e.total_earned || 0), 0),
      invoicedPending: entries
        .filter(e => e.payment_status === PaymentStatus.INVOICED_NOT_APPROVED)
        .reduce((sum, e) => sum + (e.total_earned || 0), 0),
      invoicedApproved: entries
        .filter(e => e.payment_status === PaymentStatus.INVOICED_APPROVED)
        .reduce((sum, e) => sum + (e.total_earned || 0), 0),
    };

    // Calculate weekly trend
    const thisWeekStart = startOfWeek(new Date());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const thisWeekHours = entries
      .filter(e => isAfter(new Date(e.start_time), thisWeekStart))
      .reduce((sum, e) => sum + (e.total_hours || 0), 0);
    
    const lastWeekHours = entries
      .filter(e => {
        const date = new Date(e.start_time);
        return isAfter(date, lastWeekStart) && !isAfter(date, thisWeekStart);
      })
      .reduce((sum, e) => sum + (e.total_hours || 0), 0);

    const weeklyTrend = thisWeekHours > lastWeekHours ? "up" : 
                       thisWeekHours < lastWeekHours ? "down" : "stable";

    return {
      avgHoursPerDay,
      avgHourlyRate,
      totalDaysWorked,
      yearToDateEarned,
      longestSession,
      shortestSession,
      mostProductiveDay,
      unpaidBreakdown,
      weeklyTrend,
    };
  }, [entries]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings?.currency || "USD",
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const detailedMetrics = [
    {
      title: "Productivity Insights",
      icon: Activity,
      metrics: [
        { label: "Avg Hours/Day", value: formatHours(metrics.avgHoursPerDay) },
        { label: "Days Worked", value: metrics.totalDaysWorked.toString() },
        { label: "Most Productive", value: metrics.mostProductiveDay },
      ],
      color: "blue",
    },
    {
      title: "Session Analytics",
      icon: Clock,
      metrics: [
        { label: "Longest Session", value: formatHours(metrics.longestSession) },
        { label: "Shortest Session", value: formatHours(metrics.shortestSession) },
        { label: "Avg Hourly Rate", value: formatCurrency(metrics.avgHourlyRate) },
      ],
      color: "green",
    },
    {
      title: "Financial Overview",
      icon: DollarSign,
      metrics: [
        { label: "Year to Date", value: formatCurrency(metrics.yearToDateEarned), highlight: true },
        { label: "Not Invoiced", value: formatCurrency(metrics.unpaidBreakdown.notInvoiced) },
        { label: "Pending Approval", value: formatCurrency(metrics.unpaidBreakdown.invoicedPending) },
      ],
      color: "purple",
    },
    {
      title: "Weekly Trend",
      icon: BarChart3,
      metrics: [
        { 
          label: "This Week vs Last", 
          value: metrics.weeklyTrend === "up" ? "↑ Increasing" : 
                 metrics.weeklyTrend === "down" ? "↓ Decreasing" : "→ Stable",
          highlight: metrics.weeklyTrend === "up"
        },
        { label: "Invoiced Approved", value: formatCurrency(metrics.unpaidBreakdown.invoicedApproved) },
      ],
      color: "orange",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detailed Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {detailedMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={cn(
                    "h-4 w-4",
                    metric.color === "blue" && "text-blue-500",
                    metric.color === "green" && "text-green-500",
                    metric.color === "purple" && "text-purple-500",
                    metric.color === "orange" && "text-orange-500"
                  )} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {metric.metrics.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      item.highlight && "text-green-600 font-semibold"
                    )}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 