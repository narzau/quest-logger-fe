import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { StructuredData } from "./StructuredData";
import { cn } from "@/lib/utils";
import TrialNotification from "@/components/subscription/TrialNotification";

import "./globals.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://questlog.site/"),
  title: {
    default: "Quest Log - Gamified Task Management for ADHD",
    template: "%s | Quest Log",
  },
  description:
    "A revolutionary task management app designed specifically for people with ADHD. Transform your daily tasks into an engaging game-like experience with progress tracking, achievements, and motivation.",
  keywords: [
    "ADHD productivity",
    "task tracker",
    "gamified productivity",
    "adhd task management",
    "neurodivergent productivity app",
    "motivation app",
    "task gamification",
  ],
  verification: {
    google: "m-fqKKJL-jfqDBfKgXxrQpkdtnxnrhsQ0nKT030JCY8",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://questlog.site/",
    title: "Quest Log - Gamified Task Management",
    description:
      "Transform your daily tasks into an engaging game-like experience with progress tracking, achievements, and motivation.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quest Log - Gamify Your Productivity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quest Log - Gamified Task Management",
    description:
      "Transform your daily tasks into an engaging game-like experience with progress tracking, achievements, and motivation.",
    images: ["/images/twitter-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quest Log",
  },
};

export const viewport = {
  themeColor: "#6D28D9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed top-0 left-0 right-0 z-50">
              <TrialNotification />
            </div>
            <main className="relative">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
