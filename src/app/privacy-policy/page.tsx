"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-blue-900/30 backdrop-blur-md bg-[#0f172a]/80 fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-400 mr-2" />
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

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-slate-400">
              <Link href="/" className="hover:text-blue-400">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-slate-200">Privacy Policy</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#131c33] rounded-lg border border-blue-900/30 p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>

            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-slate-300">Effective Date: March 6, 2025</p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                1. Introduction
              </h2>
              <p>
                QuestLog (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our QuestLog application
                (&quot;Application&quot;).
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using
                the Application, you acknowledge that you have read, understood,
                and agree to be bound by all the terms outlined in this Privacy
                Policy.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                2.1 Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Create an account (email address, username)</li>
                <li>Update your profile</li>
                <li>Use features of our Application</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                2.2 Usage Data
              </h3>
              <p>
                We automatically collect certain information when you use the
                Application, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Device information (device type, operating system)</li>
                <li>Log and usage data (time of access, pages viewed)</li>
                <li>Performance data related to the Application</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                2.3 Google User Data
              </h3>
              <p>
                With your explicit consent, we collect and process data from
                your Google account to provide the Google Calendar integration
                feature. Specifically, we access:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Google Calendar events and data</li>
                <li>Calendar creation and modification permissions</li>
              </ul>
              <p>We use this data solely to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Create calendar events based on your tasks
                  (&quot;quests&quot;)
                </li>
                <li>Update calendar events when you modify your tasks</li>
                <li>Delete calendar events when you delete tasks</li>
                <li>Synchronize task completion status</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide, maintain, and improve the Application</li>
                <li>Create and manage your account</li>
                <li>Process your requests and transactions</li>
                <li>Send administrative information</li>
                <li>Respond to your comments and questions</li>
                <li>Track and analyze usage and trends</li>
                <li>
                  Integrate with Google Calendar based on your preferences
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                4. Data Storage and Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information. However, no method of
                transmission over the Internet or electronic storage is 100%
                secure, and we cannot guarantee absolute security.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                4.1 Data Retention
              </h3>
              <p>
                We retain your personal information for as long as your account
                is active or as needed to provide you services. We will delete
                or anonymize your information upon request unless we are legally
                required to retain it.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                4.2 Google User Data Storage
              </h3>
              <p>
                Google OAuth tokens are stored securely in our database and are
                used solely for the purpose of maintaining your Google Calendar
                integration. We do not store copies of your calendar events
                beyond what is necessary for synchronization purposes.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                5. Sharing Your Information
              </h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to outside parties except in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights or property</li>
                <li>
                  To prevent or investigate possible wrongdoing in connection
                  with the Application
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                5.1 Google API Services User Data Policy
              </h3>
              <p>
                Our use and transfer of information received from Google APIs to
                any other app will adhere to{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                6. Third-Party Services
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                6.1 Google Calendar
              </h3>
              <p>
                The Application integrates with Google Calendar to allow you to
                create and manage calendar events based on your tasks. When you
                enable this integration:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>We request access to your Google Calendar</li>
                <li>
                  We create, update, or delete events in your calendar based on
                  your actions in the Application
                </li>
                <li>
                  We never read or modify calendar events that were not created
                  by our Application
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                7. Your Rights and Choices
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.1 Account Information
              </h3>
              <p>
                You can review and change your personal information by logging
                into the Application and visiting your account settings page.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.2 Google Account Permissions
              </h3>
              <p>
                You may revoke the Application&quot;s access to your Google
                account at any time by:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>
                  Visiting{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Google Security Settings
                  </a>
                </li>
                <li>
                  Selecting QuestLog from the list of connected applications
                </li>
                <li>Clicking &quot;Remove Access&quot;</li>
              </ol>
              <p>
                Upon revocation, we will no longer have access to your Google
                Calendar, and the integration features will be disabled.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.3 Opt-Out Options
              </h3>
              <p>
                You can choose not to provide certain information, but this may
                limit your ability to use some features of the Application.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.4 Data Subject Rights
              </h3>
              <p>
                Depending on your location, you may have rights related to your
                personal information, such as:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Erasure of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information provided in the &quot;Contact Us&quot; section.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                8. Children&quot;s Privacy
              </h2>
              <p>
                The Application is not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If we learn we have collected personal
                information from a child under 13, we will delete this
                information.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                9. Changes to this Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Effective Date&quot; at the
                top. You are advised to review this Privacy Policy periodically
                for any changes.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                10. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:privacy@questlog.site"
                    className="text-blue-400 hover:underline"
                  >
                    privacy@questlog.site
                  </a>
                </li>
                <li>
                  Website:{" "}
                  <a
                    href="https://www.questlog.site/contact"
                    className="text-blue-400 hover:underline"
                  >
                    www.questlog.site/contact
                  </a>
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                11. Specific Disclosures for International Users
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                11.1 European Users (GDPR Compliance)
              </h3>
              <p>
                For users in the European Economic Area (EEA), we process your
                personal data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Performance of a contract when we provide you with services
                </li>
                <li>Legitimate interests in conducting our business</li>
                <li>Your consent when we request it for specific uses</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                11.2 California Users (CCPA Compliance)
              </h3>
              <p>
                If you are a California resident, you have additional rights
                regarding your personal information under the California
                Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Right to know what personal information is collected, used,
                  shared, or sold
                </li>
                <li>Right to delete personal information held by businesses</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information in the &quot;Contact Us&quot; section.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                12. Data Security Measures
              </h2>
              <p>
                We take the security of your data seriously and implement
                industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Encryption of data in transit using SSL/TLS protocols</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security assessments and audits</li>
                <li>
                  Access controls and authentication requirements for our staff
                </li>
                <li>
                  Employee training on data protection and security practices
                </li>
              </ul>
              <p>
                We regularly review and update our security practices to
                maintain the highest levels of data protection.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                13. Offline Use and Data Synchronization
              </h2>
              <p>
                As a Progressive Web App (PWA), the Application can function
                offline. During offline use:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Your quest data is stored locally on your device</li>
                <li>
                  Changes made offline will be synchronized with our servers
                  when your device reconnects to the internet
                </li>
                <li>
                  We implement conflict resolution strategies to handle
                  situations where changes are made to the same data on multiple
                  devices while offline
                </li>
              </ul>
              <p>
                This offline functionality ensures you can access and update
                your tasks at any time, with or without an internet connection.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                14. Analytics and Cookies
              </h2>
              <p>
                We use analytics tools and cookies to understand how you use our
                Application, which helps us improve it. These technologies
                collect information such as:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Features you use most frequently</li>
                <li>Error reports and performance data</li>
                <li>How you navigate through the Application</li>
              </ul>
              <p>
                You can control cookies through your browser settings. However,
                disabling cookies may limit your ability to use certain features
                of the Application.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                15. Commitment to Privacy
              </h2>
              <p>
                At QuestLog, we believe that your privacy is paramount. We
                design our systems with privacy in mind from the ground up and
                continuously work to minimize data collection to only what is
                necessary to provide you with an excellent service.
              </p>
              <p>
                We are committed to transparency in our data practices and to
                empowering you with control over your information. If you have
                any concerns about how we handle your data, we encourage you to
                contact us directly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-[#0d1424] border-t border-blue-900/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center lg:gap-48 sm:gap-20 mb-8">
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
              <Shield className="h-8 w-8 text-blue-400 mr-2" />
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
