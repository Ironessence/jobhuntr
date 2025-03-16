/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  // Track page view
  usePageTracking("privacy_policy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-8">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to ApplyNinja.ai ("we," "our," or "us"). We respect your privacy and are committed
          to protecting your personal data. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our website and services.
        </p>
        <p>
          By using ApplyNinja.ai, you consent to the data practices described in this Privacy
          Policy. If you do not agree with the data practices described, you should not use our
          website or services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">2.1 Personal Information</h3>
        <p>We may collect the following types of personal information:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Contact information (name, email address)</li>
          <li>Account credentials (username, password)</li>
          <li>Professional information (resume/CV content, job history, skills)</li>
          <li>Payment information (processed through secure third-party payment processors)</li>
          <li>Communication data (messages, feedback, support inquiries)</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">2.2 Usage Information</h3>
        <p>
          We automatically collect certain information about your device and how you interact with
          our services:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>IP address and device identifiers</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and features used</li>
          <li>Time and date of visits</li>
          <li>Referring website or application</li>
          <li>Click patterns and interaction with our services</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">2.3 AI Training Data</h3>
        <p>
          To provide our AI-powered services, we may use content you provide (such as resumes, cover
          letters, and job descriptions) to train and improve our AI models. This data is anonymized
          and aggregated before being used for training purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and manage your account</li>
          <li>Generate personalized job application materials (resumes, cover letters)</li>
          <li>Provide company insights and salary information</li>
          <li>Prepare you for interviews with AI-generated practice questions</li>
          <li>Communicate with you about our services, updates, and promotions</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Monitor and analyze usage patterns and trends</li>
          <li>Protect against unauthorized access and ensure the security of our platform</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Share Your Information</h2>
        <p>We may share your information with the following categories of third parties:</p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.1 Service Providers</h3>
        <p>
          We work with third-party service providers who perform services on our behalf, such as
          hosting, payment processing, analytics, email delivery, and customer support. These
          providers have access to your information only to perform these tasks on our behalf and
          are obligated not to disclose or use it for any other purpose.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.2 Legal Requirements</h3>
        <p>
          We may disclose your information if required to do so by law or in response to valid
          requests by public authorities (e.g., a court or government agency).
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.3 Business Transfers</h3>
        <p>
          If we are involved in a merger, acquisition, or sale of all or a portion of our assets,
          your information may be transferred as part of that transaction. We will notify you via
          email and/or a prominent notice on our website of any change in ownership or uses of your
          personal information.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.4 With Your Consent</h3>
        <p>
          We may share your information with third parties when you have given us your consent to do
          so.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          information against unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission over the Internet or electronic storage is 100% secure, and we
          cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes
          outlined in this Privacy Policy, unless a longer retention period is required or permitted
          by law. When we no longer need to process your information, we will either delete or
          anonymize it.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal
          information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access and receive a copy of your personal information</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Data portability (receiving your data in a structured, machine-readable format)</li>
          <li>Withdraw consent at any time (where processing is based on consent)</li>
        </ul>
        <p>
          To exercise these rights, please contact us at support@applyninja.ai. We will respond to
          your request within the timeframe required by applicable law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies and Similar Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect information about your
          browsing activities and to remember your preferences. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent. However, if you do not
          accept cookies, you may not be able to use some portions of our service.
        </p>
        <p>
          For more information about the cookies we use, please see our{" "}
          <a
            href="/cookies"
            className="text-blue-600 hover:text-blue-800"
          >
            Cookie Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 16. We do not knowingly
          collect personal information from children under 16. If we become aware that we have
          collected personal information from a child under 16 without verification of parental
          consent, we will take steps to remove that information from our servers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than the country
          in which you reside. These countries may have data protection laws that are different from
          the laws of your country. We have taken appropriate safeguards to require that your
          personal information will remain protected in accordance with this Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites and services. We have no control
          over the content, privacy policies, or practices of these third-party services. We
          encourage you to review the privacy policies of any third-party services you access.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last Updated" date. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact
          us at:
        </p>
        <p className="mb-8">
          Email:{" "}
          <a
            href="mailto:support@applyninja.ai"
            className="text-blue-600 hover:text-blue-800"
          >
            support@applyninja.ai
          </a>
        </p>
      </div>

      <div className="mt-12 mb-8">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
