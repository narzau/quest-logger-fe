"use client";

import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-muted/30">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <Link href="/" className="flex items-center justify-center mb-8">
          <span className="font-bold text-2xl">Quest Logger</span>
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
