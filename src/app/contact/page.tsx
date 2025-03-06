"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Send, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

// Reuse the GridBackground component from landing page
const GridBackground = () => (
  <div className="absolute inset-0">
    <svg
      className="absolute left-0 top-0 opacity-20"
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(96, 165, 250, 0.2)"
            strokeWidth="1"
          ></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

// Reuse fadeIn animation
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-blue-900/30 backdrop-blur-md bg-[#0f172a]/80 fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-200 hover:text-blue-400 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                FAQ
              </a>
            </nav>
            {isAuthenticated ? (
              <div className="hidden md:flex space-x-4">
                <a
                  href="/dashboard"
                  className="px-4 py-2 text-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium  flex items-center justify-center"
                >
                  GO TO APP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-blue-400"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#131c33] border-b border-blue-900/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                FAQ
              </a>
              <div className="pt-4 flex space-x-4 px-3">
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-blue-400"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden py-20 sm:py-32">
          <GridBackground />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Get in Touch
                  </span>
                </h1>
                <p className="text-xl text-slate-400">
                  Have questions or need support? Our team is here to help!
                </p>
              </div>

              {/* Contact Information */}
              <motion.div
                className="grid md:grid-cols-2 gap-12"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <div className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-600/20 p-2 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 mb-1">
                        Email Us
                      </h3>
                      <p className="text-slate-400">
                        support@questlog.site
                        <br />
                        partnerships@questlog.site
                        <br />
                        privacy@questlog.site
                        <br />
                        terms@questlog.site
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-600/20 p-2 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 mb-1">
                        Call Us
                      </h3>
                      <p className="text-slate-400">
                        (358) 4158248
                        <br />
                        Mon-Fri, 9am-5pm PST
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full bg-[#0f172a] border border-blue-900/30 rounded-md px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full bg-[#0f172a] border border-blue-900/30 rounded-md px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2">
                        Subject
                      </label>
                      <select
                        className="w-full bg-[#0f172a] border border-blue-900/30 rounded-md px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option>Support</option>
                        <option>Partnerships</option>
                        <option>Legal Inquiry</option>
                        <option>Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full bg-[#0f172a] border border-blue-900/30 rounded-md px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium flex items-center justify-center"
                    >
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1424] border-t border-blue-900/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-48 mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/changelog"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="/roadmap"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/tos" className="text-slate-400 hover:text-blue-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-900/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
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

            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} QuestLog. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Add the CSS for gradient backgrounds */}
      <style jsx global>{`
        .radial-gradient {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.1) 0%,
            rgba(56, 189, 248, 0) 50%
          );
        }

        .radial-gradient-subtle {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.05) 0%,
            rgba(56, 189, 248, 0) 50%
          );
        }
      `}</style>
    </div>
  );
}
