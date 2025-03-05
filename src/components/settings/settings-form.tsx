import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { settingsSchema } from "@/lib/validators";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Bell, Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ColorPaletteSelector } from "./color-palette-selector";

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const {
    darkMode,
    animationsEnabled,
    notificationsEnabled,
    autoCreateQuestsFromVoice,
    setDarkMode,
    setAnimationsEnabled,
    setNotificationsEnabled,
    setAutoCreateQuestsFromVoice,
  } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      darkMode,
      animationsEnabled,
      notificationsEnabled,
      autoCreateQuestsFromVoice,
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    setIsSaving(true);

    // Update settings
    setDarkMode(values.darkMode);
    setAnimationsEnabled(values.animationsEnabled);
    setNotificationsEnabled(values.notificationsEnabled);
    setAutoCreateQuestsFromVoice(values.autoCreateQuestsFromVoice);
    // Show saved toast
    setTimeout(() => {
      setIsSaving(false);
      toast("Settings saved", {
        description: "Your preferences have been updated.",
      });
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>
              Customize your quest tracker experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="animationsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                            <FormLabel className="text-base">
                              Animations
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Enable animations for a more engaging experience
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoCreateQuestsFromVoice"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Mic className="h-4 w-4 mr-2 text-pink-500" />
                            <FormLabel className="text-base">
                              Auto-Create Voice Quests
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Automatically create quests from voice recordings
                            without review
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notificationsEnabled"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-2 text-green-500" />
                            <FormLabel className="text-base">
                              Notifications
                              <span className="text-xs text-secondary">
                                [coming soon]
                              </span>
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Receive notifications for upcoming quests and
                            achievements
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={false} // {field.value}
                            // onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <ColorPaletteSelector />
      </div>
    </motion.div>
  );
}
