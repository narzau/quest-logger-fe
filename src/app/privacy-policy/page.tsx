import React from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                QuestLog ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                QuestLog application ("Application").
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
                <li>Create calendar events based on your tasks ("quests")</li>
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
                You may revoke the Application's access to your Google account
                at any time by:
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
                <li>Clicking "Remove Access"</li>
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
                information provided in the "Contact Us" section.
              </p>

              <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">
                8. Children's Privacy
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
                this page and updating the "Effective Date" at the top. You are
                advised to review this Privacy Policy periodically for any
                changes.
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
                information in the "Contact Us" section.
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
                    className="text-slate-400 hover:text-blue-400 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-400 hover:text-blue-400"
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
