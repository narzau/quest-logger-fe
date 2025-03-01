"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/hooks/useUser";
import { updateUserSchema } from "@/lib/validators";
import { calculateLevelInfo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Award, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { useAchievements } from "@/hooks/useAchievements";

type ProfileFormValues = z.infer<typeof updateUserSchema>;

export function UserProfile() {
  const { user, updateUser, isUpdating } = useUser();
  const { userAchievements } = useAchievements();
  const [isEditing, setIsEditing] = useState(false);
  const { animationsEnabled } = useSettingsStore();

  const levelInfo = user
    ? calculateLevelInfo(user.experience)
    : {
        level: 1,
        currentXp: 0,
        nextLevelXp: 100,
        progress: 0,
      };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    await updateUser(values);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
        animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Your Profile</CardTitle>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <div className="font-medium text-2xl">{user.username}</div>
                  <div className="text-muted-foreground">
                    Level {levelInfo.level}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h3>
                      <p>{user.email}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Account Status
                      </h3>
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.is_active ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <p>{user.is_active ? "Active" : "Inactive"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Experience
                      </h3>
                      <div className="mt-1 space-y-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{levelInfo.currentXp} XP</span>
                          <span>{levelInfo.nextLevelXp} XP</span>
                        </div>
                        <Progress value={levelInfo.progress} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Achievements
                      </h3>
                      <p className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-500" />
                        {userAchievements?.length || 0} achievements unlocked
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
