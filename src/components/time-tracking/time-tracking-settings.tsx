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
  timezone: z.string().min(1, "Timezone is required"),
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
      timezone: settings?.timezone || "UTC-3",
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

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                      <SelectItem value="UTC-11">UTC-11 (American Samoa)</SelectItem>
                      <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                      <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                      <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                      <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                      <SelectItem value="UTC-4">UTC-4 (Atlantic Time)</SelectItem>
                      <SelectItem value="UTC-3">UTC-3 (Argentina, Brazil)</SelectItem>
                      <SelectItem value="UTC-2">UTC-2 (South Georgia)</SelectItem>
                      <SelectItem value="UTC-1">UTC-1 (Azores)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (London, Lisbon)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (Paris, Berlin)</SelectItem>
                      <SelectItem value="UTC+2">UTC+2 (Cairo, Athens)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3 (Moscow, Istanbul)</SelectItem>
                      <SelectItem value="UTC+4">UTC+4 (Dubai, Baku)</SelectItem>
                      <SelectItem value="UTC+5">UTC+5 (Karachi, Tashkent)</SelectItem>
                      <SelectItem value="UTC+5:30">UTC+5:30 (India, Sri Lanka)</SelectItem>
                      <SelectItem value="UTC+6">UTC+6 (Dhaka, Almaty)</SelectItem>
                      <SelectItem value="UTC+7">UTC+7 (Bangkok, Jakarta)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (Singapore, Beijing)</SelectItem>
                      <SelectItem value="UTC+9">UTC+9 (Tokyo, Seoul)</SelectItem>
                      <SelectItem value="UTC+10">UTC+10 (Sydney, Melbourne)</SelectItem>
                      <SelectItem value="UTC+11">UTC+11 (Solomon Islands)</SelectItem>
                      <SelectItem value="UTC+12">UTC+12 (Auckland, Fiji)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your timezone for time tracking. All times will be displayed in this timezone.
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