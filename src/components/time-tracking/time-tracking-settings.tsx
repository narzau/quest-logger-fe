"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TimeTrackingSettings as Settings } from "@/types/time-tracking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
  default_hourly_rate: z.number().min(0.01, "Hourly rate must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface TimeTrackingSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings | undefined;
  isLoading: boolean;
}

export function TimeTrackingSettings({
  open,
  onOpenChange,
  settings,
  isLoading,
}: TimeTrackingSettingsProps) {
  const { updateSettings, isUpdatingSettings } = useTimeTracking();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      default_hourly_rate: settings?.default_hourly_rate || 50,
      currency: settings?.currency || "USD",
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings(values);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Time Tracking Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Time Tracking Settings</DialogTitle>
          <DialogDescription>
            Configure your default settings for time tracking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="default_hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Hourly Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-7"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This rate will be used as the default when starting new sessions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your preferred currency for displaying earnings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdatingSettings}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingSettings}>
                {isUpdatingSettings ? "Saving..." : "Save Settings"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 