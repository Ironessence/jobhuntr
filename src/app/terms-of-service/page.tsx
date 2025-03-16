/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  // Track page view
  usePageTracking("terms_of_service");

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

      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

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
          Welcome to ApplyNinja.ai. These Terms of Service ("Terms") govern your access to and use
          of the ApplyNinja.ai website, applications, and services (collectively, the "Services").
          Please read these Terms carefully before using our Services.
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms and our Privacy
          Policy. If you do not agree to these Terms, you may not access or use the Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
        <p>In these Terms:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>"ApplyNinja.ai," "we," "us," and "our" refer to the operators of ApplyNinja.ai.</li>
          <li>"User," "you," and "your" refer to the individual or entity using our Services.</li>
          <li>
            "Content" refers to text, images, videos, audio, and all other forms of data or
            communication.
          </li>
          <li>
            "User Content" refers to Content that users submit, upload, or transmit to or through
            our Services.
          </li>
          <li>
            "ApplyNinja.ai Content" refers to Content that we create and make available in
            connection with the Services.
          </li>
          <li>
            "Third-Party Content" refers to Content that originates from parties other than
            ApplyNinja.ai or its users, which is made available in connection with the Services.
          </li>
          <li>
            "Intellectual Property Rights" refers to all patent rights, copyright rights, mask work
            rights, moral rights, rights of publicity, trademark, trade dress and service mark
            rights, goodwill, trade secret rights, and other intellectual property rights that may
            exist now or come into existence in the future.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Account Registration and Eligibility
        </h2>
        <p>
          To access certain features of our Services, you may be required to register for an
          account. When you register, you agree to provide accurate, current, and complete
          information about yourself and to update this information to maintain its accuracy.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activities that occur under your account. You agree to notify us immediately of
          any unauthorized use of your account.
        </p>
        <p>By using our Services, you represent and warrant that:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>You are at least 16 years of age;</li>
          <li>You have the legal capacity to enter into these Terms;</li>
          <li>You will use the Services in accordance with these Terms;</li>
          <li>You will comply with all applicable laws and regulations; and</li>
          <li>All information you provide to us is accurate and complete.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payment Terms</h2>
        <p>
          ApplyNinja.ai offers both free and paid subscription plans. By selecting a paid
          subscription, you agree to pay the subscription fees indicated for your selected plan.
          Fees are non-refundable except as required by law or as explicitly stated in these Terms.
        </p>
        <p>
          Subscription fees are billed in advance on a monthly or annual basis, depending on the
          payment plan you select. You authorize us to charge your designated payment method for all
          fees incurred.
        </p>
        <p>
          We may change our subscription fees at any time. If we increase fees for your subscription
          plan, we will provide notice at least 30 days before the change takes effect. If you do
          not agree to the fee increase, you may cancel your subscription before the change takes
          effect.
        </p>
        <p>
          You may cancel your subscription at any time through your account settings or by
          contacting us at support@applyninja.ai. If you cancel, you will continue to have access to
          your subscription until the end of your current billing period, but you will not receive a
          refund for any fees already paid.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Token System</h2>
        <p>
          Our Services utilize a token-based system for accessing certain features. Tokens are
          allocated based on your subscription plan and are consumed when you use specific features.
        </p>
        <p>
          Tokens are non-transferable and have no monetary value. Unused tokens may expire as
          specified in your subscription plan. We reserve the right to modify the token allocation
          and consumption rates at any time, with notice provided to users.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Content and License</h2>
        <p>
          Our Services allow you to upload, submit, store, send, or receive content, including but
          not limited to resumes, cover letters, and job descriptions. You retain ownership of any
          Intellectual Property Rights that you hold in that content.
        </p>
        <p>
          By uploading, submitting, storing, sending, or receiving content through our Services, you
          grant ApplyNinja.ai a worldwide, non-exclusive, royalty-free license to use, host, store,
          reproduce, modify, create derivative works, communicate, publish, publicly perform,
          publicly display, and distribute such content for the limited purpose of operating,
          promoting, and improving our Services, and to develop new ones.
        </p>
        <p>You represent and warrant that:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>You own or have the necessary rights to the content you submit;</li>
          <li>
            The content does not and will not infringe, misappropriate, or violate a third party's
            Intellectual Property Rights, privacy rights, publicity rights, or other legal rights;
            and
          </li>
          <li>The content complies with these Terms and all applicable laws and regulations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. AI-Generated Content</h2>
        <p>
          Our Services use artificial intelligence to generate content based on your inputs. You
          acknowledge and agree that:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>AI-generated content may not be perfect or suitable for all purposes;</li>
          <li>
            You are responsible for reviewing, editing, and ensuring the accuracy and
            appropriateness of any AI-generated content before using it;
          </li>
          <li>
            We do not guarantee employment outcomes or interview success from using our AI-generated
            content;
          </li>
          <li>
            You will not use our Services to generate content that is illegal, harmful, fraudulent,
            infringing, or otherwise objectionable; and
          </li>
          <li>
            You own the output generated by our AI based on your inputs, subject to our underlying
            Intellectual Property Rights in our technology and algorithms.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Prohibited Uses</h2>
        <p>You agree not to use the Services to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Violate any applicable law or regulation;</li>
          <li>
            Infringe upon or violate our or any third party's Intellectual Property Rights, privacy
            rights, publicity rights, or other legal rights;
          </li>
          <li>
            Upload, transmit, or distribute any computer viruses, worms, or other malicious code;
          </li>
          <li>
            Interfere with, disrupt, or attempt to gain unauthorized access to our Services or
            servers;
          </li>
          <li>
            Engage in automated use of the system, such as using scripts to send messages or upload
            content;
          </li>
          <li>
            Attempt to circumvent any technological measure implemented by us to protect the
            Services;
          </li>
          <li>Advocate, encourage, or assist any third party in doing any of the foregoing; or</li>
          <li>
            Generate false, misleading, or fraudulent information in resumes, cover letters, or
            other job application materials.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Intellectual Property Rights</h2>
        <p>
          The Services and their entire contents, features, and functionality (including but not
          limited to all information, software, text, displays, images, video, and audio, and the
          design, selection, and arrangement thereof) are owned by ApplyNinja.ai, its licensors, or
          other providers of such material and are protected by copyright, trademark, patent, trade
          secret, and other intellectual property or proprietary rights laws.
        </p>
        <p>
          These Terms do not grant you any right, title, or interest in the Services, others'
          content in the Services, ApplyNinja.ai trademarks, logos, or other brand features. We
          welcome feedback, but please note that we may use comments or suggestions without any
          obligation to you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Disclaimer of Warranties</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          APPLYNINJA.AI DOES NOT WARRANT THAT THE SERVICES ARE ERROR-FREE OR THAT ACCESS THERETO
          WILL BE UNINTERRUPTED OR ERROR-FREE. NO INFORMATION OR ADVICE OBTAINED THROUGH THE
          SERVICES WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.
        </p>
        <p>
          WITHOUT LIMITING THE FOREGOING, APPLYNINJA.AI DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS
          CONCERNING THE ACCURACY, LIKELY RESULTS, OR RELIABILITY OF THE USE OF THE MATERIALS ON THE
          SERVICES, OR OTHERWISE RELATING TO SUCH MATERIALS OR ON ANY SITES LINKED TO THE SERVICES.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL APPLYNINJA.AI, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR
          AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
          INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR
          USE THE SERVICES; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES; (III)
          ANY CONTENT OBTAINED FROM THE SERVICES; AND (IV) UNAUTHORIZED ACCESS, USE, OR ALTERATION
          OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
          NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE
          POSSIBILITY OF SUCH DAMAGE.
        </p>
        <p>
          IN NO EVENT WILL OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES EXCEED
          THE GREATER OF $100 USD OR THE AMOUNT YOU PAID APPLYNINJA.AI IN THE 12 MONTHS PRECEDING
          THE DATE OF THE CLAIM.
        </p>
        <p>
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR
          EXCLUSION OF LIABILITY FOR CERTAIN TYPES OF DAMAGES. ACCORDINGLY, SOME OF THE ABOVE
          LIMITATIONS MAY NOT APPLY TO YOU.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless ApplyNinja.ai, its officers, directors,
          employees, and agents, from and against any and all claims, damages, obligations, losses,
          liabilities, costs or debt, and expenses (including but not limited to attorney's fees)
          arising from: (i) your use of and access to the Services; (ii) your violation of any term
          of these Terms; (iii) your violation of any third-party right, including without
          limitation any copyright, property, or privacy right; or (iv) any claim that your User
          Content caused damage to a third party. This defense and indemnification obligation will
          survive these Terms and your use of the Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Services immediately, without
          prior notice or liability, for any reason whatsoever, including without limitation if you
          breach these Terms.
        </p>
        <p>
          Upon termination, your right to use the Services will immediately cease. If you wish to
          terminate your account, you may simply discontinue using the Services or contact us at
          support@applyninja.ai.
        </p>
        <p>
          All provisions of these Terms which by their nature should survive termination shall
          survive termination, including, without limitation, ownership provisions, warranty
          disclaimers, indemnity, and limitations of liability.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of
          Delaware, without regard to its conflict of law provisions.
        </p>
        <p>
          Any legal action or proceeding arising out of or relating to these Terms or your use of
          the Services shall be brought exclusively in the federal or state courts located in
          Delaware, and you consent to the personal jurisdiction of such courts.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">15. Dispute Resolution</h2>
        <p>
          Any dispute, controversy, or claim arising out of or relating to these Terms or the
          breach, termination, or validity thereof, shall first be settled through good faith
          negotiations between you and ApplyNinja.ai. If such dispute cannot be resolved through
          negotiations, it shall be settled by binding arbitration in accordance with the rules of
          the American Arbitration Association.
        </p>
        <p>
          The arbitration shall take place in Delaware, in the English language, and the arbitral
          decision may be enforced in any court. The prevailing party in any action or proceeding to
          enforce these Terms shall be entitled to costs and attorneys' fees.
        </p>
        <p>
          YOU AND APPLYNINJA.AI AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR
          ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
          REPRESENTATIVE PROCEEDING.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">16. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any
          time. We will provide notice of any changes by posting the new Terms on this page and
          updating the "Last Updated" date. Your continued use of the Services after any such
          changes constitutes your acceptance of the new Terms.
        </p>
        <p>
          Please review these Terms periodically for changes. If you do not agree to any of this
          Agreement or any changes to this Agreement, do not use, access, or continue to access the
          Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">17. Severability</h2>
        <p>
          If any provision of these Terms is held to be invalid or unenforceable by a court, the
          remaining provisions of these Terms will remain in effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">18. Entire Agreement</h2>
        <p>
          These Terms constitute the entire agreement between you and ApplyNinja.ai regarding our
          Services and supersede all prior and contemporaneous agreements, proposals, or
          representations, written or oral, concerning the subject matter of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">19. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
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
