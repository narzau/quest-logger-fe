"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TimeEntry, PaymentStatus } from "@/types/time-tracking";
import { userTimezoneToUtc } from "@/lib/timezone-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const editTimeEntrySchema = z.object({
  date: z.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }).optional(),
  hourly_rate: z.number().min(0.01, "Hourly rate must be greater than 0"),
  payment_status: z.nativeEnum(PaymentStatus),
  notes: z.string().optional(),
});

type EditTimeEntryFormValues = z.infer<typeof editTimeEntrySchema>;

interface EditTimeEntryDialogProps {
  entry: TimeEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTimeEntryDialog({
  entry,
  open,
  onOpenChange,
}: EditTimeEntryDialogProps) {
  const { updateEntry, isUpdating, settings } = useTimeTracking();
  const timezone = settings?.timezone || "UTC-3";
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const form = useForm<EditTimeEntryFormValues>({
    resolver: zodResolver(editTimeEntrySchema),
    defaultValues: {
      date: new Date(entry.date),
      start_time: format(new Date(entry.start_time), "HH:mm"),
      end_time: entry.end_time ? format(new Date(entry.end_time), "HH:mm") : "",
      hourly_rate: entry.hourly_rate,
      payment_status: entry.payment_status,
      notes: entry.notes || "",
    },
  });

  // Reset form when entry changes
  useEffect(() => {
    if (entry) {
      form.reset({
        date: new Date(entry.date),
        start_time: format(new Date(entry.start_time), "HH:mm"),
        end_time: entry.end_time ? format(new Date(entry.end_time), "HH:mm") : "",
        hourly_rate: entry.hourly_rate,
        payment_status: entry.payment_status,
        notes: entry.notes || "",
      });
    }
  }, [entry, form]);

  const onSubmit = (values: EditTimeEntryFormValues) => {
    const dateStr = format(values.date, "yyyy-MM-dd");
    const startDateTime = `${dateStr}T${values.start_time}:00`;
    const endDateTime = values.end_time ? `${dateStr}T${values.end_time}:00` : undefined;
    
    // Convert to UTC before sending
    const startTimeUtc = userTimezoneToUtc(new Date(startDateTime), timezone);
    const endTimeUtc = endDateTime ? userTimezoneToUtc(new Date(endDateTime), timezone) : undefined;

    updateEntry({
      entryId: entry.id,
      data: {
        // Don't include date - backend derives it from start_time
        start_time: startTimeUtc.toISOString(),
        end_time: endTimeUtc?.toISOString(),
        hourly_rate: values.hourly_rate,
        payment_status: values.payment_status,
        notes: values.notes,
      },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setIsDatePickerOpen(true)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Button>
                      {isDatePickerOpen && (
                        <div className="absolute z-50 mt-2">
                          <SimpleDatePicker
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                              setIsDatePickerOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PaymentStatus.NOT_PAID}>Not Paid</SelectItem>
                      <SelectItem value={PaymentStatus.INVOICED_NOT_APPROVED}>
                        Invoiced (Not Approved)
                      </SelectItem>
                      <SelectItem value={PaymentStatus.INVOICED_APPROVED}>
                        Invoiced (Approved)
                      </SelectItem>
                      <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this work session..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 