"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-muted/30">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <Link href="/" className="flex items-center justify-center mb-8">
          <span className="font-bold text-2xl">Quest Logger</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
