"use client";

import { useState } from "react";
import { TimeEntry, PaymentStatus } from "@/types/time-tracking";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash, Calendar, Clock } from "lucide-react";
import { EditTimeEntryDialog } from "@/components/time-tracking/edit-time-entry-dialog";
import { formatInTimezone } from "@/lib/timezone-utils";

interface TimeTrackingTableProps {
  entries: TimeEntry[];
  isLoading: boolean;
}

export function TimeTrackingTable({ entries, isLoading }: TimeTrackingTableProps) {
  const { deleteEntry, isDeleting, settings } = useTimeTracking();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<TimeEntry | null>(null);
  
  const timezone = settings?.timezone || "UTC-3";

  const formatDuration = (start: string, end?: string) => {
    if (!end) return "Ongoing";
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / 1000 / 3600; // hours
    
    if (diff < 1) {
      return `${Math.round(diff * 60)}m`;
    }
    return `${diff.toFixed(2)}h`;
  };



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const config = {
      [PaymentStatus.NOT_PAID]: { 
        label: "Not Paid", 
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-800" 
      },
      [PaymentStatus.INVOICED_NOT_APPROVED]: { 
        label: "Invoiced (Pending)", 
        variant: "outline" as const,
        className: "border-yellow-500 text-yellow-700" 
      },
      [PaymentStatus.INVOICED_APPROVED]: { 
        label: "Invoiced (Approved)", 
        variant: "default" as const,
        className: "bg-blue-100 text-blue-800" 
      },
      [PaymentStatus.PAID]: { 
        label: "Paid", 
        variant: "default" as const,
        className: "bg-green-100 text-green-800" 
      },
    };

    const { label, variant, className } = config[status];
    return (
      <Badge variant={variant} className={className}>
        {label}
      </Badge>
    );
  };

  const handleDelete = () => {
    if (deletingEntry) {
      deleteEntry(deletingEntry.id);
      setDeletingEntry(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No time entries yet. Start tracking your time to see entries here.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatInTimezone(entry.start_time, timezone, "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatInTimezone(entry.start_time, timezone, "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.end_time ? (
                          formatInTimezone(entry.end_time, timezone, "HH:mm")
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            Ongoing
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDuration(entry.start_time, entry.end_time)}
                      </TableCell>
                      <TableCell>{formatCurrency(entry.hourly_rate)}/hr</TableCell>
                      <TableCell className="font-semibold">
                        {entry.total_earned ? formatCurrency(entry.total_earned) : "-"}
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(entry.payment_status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                          {entry.notes || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingEntry(entry)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingEntry(entry)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingEntry && (
        <EditTimeEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open: boolean) => !open && setEditingEntry(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 