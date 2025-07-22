"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeTrackingStats as Stats } from "@/types/time-tracking";
import { Clock, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeTrackingStatsProps {
  stats: Stats | undefined;
  isLoading: boolean;
}

export function TimeTrackingStats({ stats, isLoading }: TimeTrackingStatsProps) {
  const formatHours = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const statCards = [
    {
      title: "Today",
      icon: Clock,
      items: [
        { label: "Hours", value: stats ? formatHours(stats.total_hours_today) : "0h" },
        { label: "Earned", value: stats ? formatCurrency(stats.total_earned_today) : "$0" },
      ],
      color: "blue",
    },
    {
      title: "This Week",
      icon: Calendar,
      items: [
        { label: "Hours", value: stats ? formatHours(stats.total_hours_week) : "0h" },
        { label: "Earned", value: stats ? formatCurrency(stats.total_earned_week) : "$0" },
      ],
      color: "green",
    },
    {
      title: "This Month",
      icon: TrendingUp,
      items: [
        { label: "Hours", value: stats ? formatHours(stats.total_hours_month) : "0h" },
        { label: "Earned", value: stats ? formatCurrency(stats.total_earned_month) : "$0" },
      ],
      color: "purple",
    },
    {
      title: "Payment Status",
      icon: DollarSign,
      items: [
        { label: "Unpaid", value: stats ? formatCurrency(stats.unpaid_amount) : "$0", highlight: true },
        { label: "Invoiced", value: stats ? formatCurrency(stats.invoiced_amount) : "$0" },
      ],
      color: "orange",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icon className={cn("h-4 w-4", `text-${card.color}-500`)} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {card.items.map((item) => (
                <div key={item.label} className="mb-2 last:mb-0">
                  <p className={cn(
                    "text-2xl font-bold",
                    item.highlight && "text-orange-500"
                  )}>
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 