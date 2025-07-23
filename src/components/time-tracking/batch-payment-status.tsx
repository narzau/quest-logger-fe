"use client";

import { useState } from "react";
import { PaymentStatus } from "@/types/time-tracking";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CreditCard } from "lucide-react";

interface BatchPaymentStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusFlow = [
  { from: PaymentStatus.NOT_PAID, to: PaymentStatus.INVOICED_NOT_APPROVED, label: "Mark as Invoiced" },
  { from: PaymentStatus.INVOICED_NOT_APPROVED, to: PaymentStatus.INVOICED_APPROVED, label: "Mark as Approved" },
  { from: PaymentStatus.INVOICED_APPROVED, to: PaymentStatus.PAID, label: "Mark as Paid" },
];

const statusLabels = {
  [PaymentStatus.NOT_PAID]: "Not Paid",
  [PaymentStatus.INVOICED_NOT_APPROVED]: "Invoiced (Not Approved)",
  [PaymentStatus.INVOICED_APPROVED]: "Invoiced (Approved)",
  [PaymentStatus.PAID]: "Paid",
};

export function BatchPaymentStatus({ open, onOpenChange }: BatchPaymentStatusProps) {
  const { entries, batchUpdatePaymentStatus, isBatchUpdating } = useTimeTracking();
  const [selectedTransition, setSelectedTransition] = useState<string>("");
  
  // Count entries by status
  const statusCounts = entries.reduce((acc, entry) => {
    acc[entry.payment_status] = (acc[entry.payment_status] || 0) + 1;
    return acc;
  }, {} as Record<PaymentStatus, number>);

  const handleUpdate = () => {
    if (!selectedTransition) return;
    
    const [fromStatus, toStatus] = selectedTransition.split("->") as [PaymentStatus, PaymentStatus];
    const entriesToUpdate = entries.filter(e => e.payment_status === fromStatus);
    const entryIds = entriesToUpdate.map(e => e.id);
    
    if (entryIds.length > 0) {
      batchUpdatePaymentStatus(
        { entryIds, paymentStatus: toStatus },
        {
          onSuccess: () => {
            onOpenChange(false);
            setSelectedTransition("");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Batch Update Payment Status
          </DialogTitle>
          <DialogDescription>
            Update payment status for multiple entries at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="p-3 rounded-lg border bg-card">
                <div className="text-2xl font-semibold">
                  {statusCounts[status as PaymentStatus] || 0}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Transition Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Transition</label>
            <Select value={selectedTransition} onValueChange={setSelectedTransition}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a status transition" />
              </SelectTrigger>
              <SelectContent>
                {statusFlow.map(({ from, to }) => {
                  const count = statusCounts[from] || 0;
                  const key = `${from}->${to}`;
                  
                  return (
                    <SelectItem 
                      key={key} 
                      value={key}
                      disabled={count === 0}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          {statusLabels[from]} 
                          <ArrowRight className="h-3 w-3" />
                          {statusLabels[to]}
                        </span>
                        <span className="text-muted-foreground ml-4">
                          ({count} entries)
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {selectedTransition && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm">
                This will update{" "}
                <span className="font-medium">
                  {statusCounts[selectedTransition.split("->")[0] as PaymentStatus] || 0}
                </span>{" "}
                entries from{" "}
                <span className="font-medium">
                  {statusLabels[selectedTransition.split("->")[0] as PaymentStatus]}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {statusLabels[selectedTransition.split("->")[1] as PaymentStatus]}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={!selectedTransition || isBatchUpdating}
          >
            {isBatchUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 