import React from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-blue-900/30 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                QuestLog
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
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
              <span className="text-slate-200">Terms of Service</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#131c33] rounded-lg border border-blue-900/30 p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>

            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-slate-300">Last Updated: March 6, 2025</p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the QuestLog application ("Application"),
                you agree to be bound by these Terms of Service ("Terms"). If
                you disagree with any part of the Terms, you do not have
                permission to access or use the Application.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                2. Description of Service
              </h2>
              <p>
                QuestLog is a gamified task management application designed to
                help individuals with ADHD track and complete tasks through an
                engaging quest-based system. Features include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Task ("Quest") creation and management</li>
                <li>Experience points and level progression</li>
                <li>Achievement system</li>
                <li>Google Calendar integration for task scheduling</li>
                <li>User profiles and statistics</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                3. Account Registration and Security
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                3.1 Account Creation
              </h3>
              <p>
                To use certain features of the Application, you must register
                for an account. When registering, you agree to provide accurate,
                current, and complete information.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                3.2 Account Security
              </h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>
                  Notifying us immediately of any unauthorized use of your
                  account
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                3.3 Account Restrictions
              </h3>
              <p>You must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Create more than one account per person</li>
                <li>Share your account with any other person</li>
                <li>Use another user's account</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                4. User Conduct
              </h2>
              <p>You agree not to use the Application to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Application or servers</li>
                <li>
                  Attempt to gain unauthorized access to any parts of the
                  Application
                </li>
                <li>
                  Use the Application for any harmful, illegal, or exploitative
                  purpose
                </li>
                <li>Upload or transmit viruses or other malicious code</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                5. Intellectual Property
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                5.1 Our Intellectual Property
              </h3>
              <p>
                The Application, including its content, features, and
                functionality, is owned by us and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                5.2 User Content
              </h3>
              <p>
                You retain ownership of any content you create or upload to the
                Application. However, by creating or uploading content, you
                grant us a non-exclusive, transferable, sublicensable,
                royalty-free, worldwide license to use, modify, publicly
                display, and distribute such content in connection with
                operating and improving the Application.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                6. Third-Party Services
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                6.1 Google Calendar Integration
              </h3>
              <p>
                The Application offers integration with Google Calendar. By
                enabling this integration:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  You authorize us to access your Google Calendar according to
                  the permissions you grant
                </li>
                <li>
                  You acknowledge that your use of Google Calendar is subject to
                  Google's Terms of Service and Privacy Policy
                </li>
                <li>
                  You can revoke our access to your Google account at any time
                  through your Google account settings
                </li>
                <li>
                  You understand that revoking access will disable Google
                  Calendar features within our Application
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                7. Subscription and Payment Terms
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.1 Free and Paid Services
              </h3>
              <p>
                The Application may offer both free and paid subscription
                options. Features available under each option will be clearly
                indicated within the Application or on our website.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                7.2 Subscription Terms
              </h3>
              <p>If you choose a paid subscription:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Payment will be charged to your selected payment method</li>
                <li>
                  Subscriptions automatically renew unless canceled at least 24
                  hours before the end of the current period
                </li>
                <li>You can cancel anytime through your account settings</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                8. Termination
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                8.1 Termination by You
              </h3>
              <p>
                You may terminate your account at any time by following the
                instructions in the Application or by contacting us.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                8.2 Termination by Us
              </h3>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason, including if you
                breach the Terms.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                8.3 Effect of Termination
              </h3>
              <p>
                Upon termination, your right to use the Application will
                immediately cease. All provisions of the Terms which by their
                nature should survive termination shall survive, including
                ownership provisions, warranty disclaimers, indemnity, and
                limitations of liability.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                9. Disclaimers
              </h2>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                9.1 "As Is" and "As Available"
              </h3>
              <p>
                The Application is provided on an "as is" and "as available"
                basis without warranties of any kind, either express or implied.
              </p>

              <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">
                9.2 No Medical Advice
              </h3>
              <p>
                The Application is not intended to provide medical advice,
                diagnosis, or treatment. It is designed as a supportive tool for
                individuals with ADHD but is not a substitute for professional
                medical advice, diagnosis, or treatment.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                10. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use or inability to use the
                Application.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                11. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless us and our
                affiliates, officers, agents, employees, and partners from and
                against any claims, liabilities, damages, losses, costs,
                expenses, or fees arising from your use of the Application or
                violation of these Terms.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                12. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify you of significant changes by posting a notice on our
                website or sending you an email. Your continued use of the
                Application after such modifications constitutes your acceptance
                of the modified Terms.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                13. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which QuestLog operates,
                without regard to its conflict of law principles.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                14. Dispute Resolution
              </h2>
              <p>
                Any dispute arising out of or relating to these Terms or the
                Application shall be resolved through good faith negotiations.
                If negotiations fail, the dispute shall be submitted to binding
                arbitration in accordance with the rules of the appropriate
                Arbitration Association.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                15. Severability
              </h2>
              <p>
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision will be limited or eliminated to the
                minimum extent necessary so that the Terms will otherwise remain
                in full force and effect.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                16. Contact Information
              </h2>
              <p>For questions about these Terms, please contact us at:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:terms@questlog.site"
                    className="text-blue-400 hover:underline"
                  >
                    terms@questlog.site
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1424] border-t border-blue-900/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#features"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    User Guides
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-400 hover:text-blue-400 font-medium"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-900/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-400 mr-2" />
              <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                QuestLog
              </span>
            </div>

            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} QuestLog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
