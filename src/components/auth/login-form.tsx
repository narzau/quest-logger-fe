"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  // Animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto p-6 space-y-6 bg-[#131c33] rounded-lg shadow-xl border border-blue-900/30"
    >
      <div className="flex items-center justify-center mb-2">
        <Image
          src="/logo.png"
          alt="QuestLog Logo"
          width={64}
          height={64}
          className=""
        />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          QuestLog
        </span>
      </div>

      <div className="text-center">
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight text-slate-200"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-slate-400 mt-2"
        >
          Sign in to your account to continue your quest
        </motion.p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-md bg-red-900/10 text-red-400 text-sm flex items-start"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <Form {...form}>
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="bg-[#0f172a] border-blue-900/30 text-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="bg-[#0f172a] border-blue-900/30 text-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-blue-900/30 bg-[#0f172a] text-blue-500 focus:ring-blue-500/20"
              />
              <label htmlFor="remember" className="text-sm text-slate-400">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              className="w-full relative group cursor-pointer"
              disabled={isLoading}
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-200"></span>
              <span className="relative flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-md py-2 px-4 w-full">
                {isLoading ? "Logging in..." : "Sign in"}
                {!isLoading && (
                  <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </span>
            </Button>
          </motion.div>
        </motion.form>
      </Form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-400 hover:text-blue-300 group inline-flex items-center"
          >
            Sign up
            <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
