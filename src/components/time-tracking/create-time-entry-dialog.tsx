"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { PaymentStatus } from "@/types/time-tracking";
import { getTodayInTimezone, userTimezoneToUtc } from "@/lib/timezone-utils";
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

const createTimeEntrySchema = z.object({
  date: z.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  hourly_rate: z.number().min(0.01, "Hourly rate must be greater than 0"),
  payment_status: z.nativeEnum(PaymentStatus),
  notes: z.string().optional(),
});

type CreateTimeEntryFormValues = z.infer<typeof createTimeEntrySchema>;

interface CreateTimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultHourlyRate: number;
}

export function CreateTimeEntryDialog({
  open,
  onOpenChange,
  defaultHourlyRate,
}: CreateTimeEntryDialogProps) {
  const { createEntry, isCreating, settings } = useTimeTracking();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const timezone = settings?.timezone || "UTC-3";

  const form = useForm<CreateTimeEntryFormValues>({
    resolver: zodResolver(createTimeEntrySchema),
    defaultValues: {
      date: new Date(),
      start_time: "09:00",
      end_time: "17:00",
      hourly_rate: defaultHourlyRate,
      payment_status: PaymentStatus.NOT_PAID,
      notes: "",
    },
  });

  // Update default date to today in user's timezone
  useEffect(() => {
    if (open && timezone) {
      const todayStr = getTodayInTimezone(timezone);
      const todayDate = new Date(todayStr + "T12:00:00");
      form.setValue("date", todayDate);
    }
  }, [open, timezone, form]);

  const onSubmit = (values: CreateTimeEntryFormValues) => {
    const dateStr = format(values.date, "yyyy-MM-dd");
    
    // Create local date times
    const localStartDateTime = new Date(`${dateStr}T${values.start_time}:00`);
    const localEndDateTime = new Date(`${dateStr}T${values.end_time}:00`);
    
    // Convert to UTC
    const utcStartDateTime = userTimezoneToUtc(localStartDateTime, timezone);
    const utcEndDateTime = userTimezoneToUtc(localEndDateTime, timezone);

    createEntry({
      date: dateStr,
      start_time: utcStartDateTime.toISOString(),
      end_time: utcEndDateTime.toISOString(),
      hourly_rate: values.hourly_rate,
      payment_status: values.payment_status,
      notes: values.notes,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Adding..." : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 