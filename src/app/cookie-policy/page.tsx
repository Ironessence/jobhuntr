/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CookiePolicy() {
  // Track page view
  usePageTracking("cookie_policy");

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

      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

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
          This Cookie Policy explains how ApplyNinja.ai ("we", "us", or "our") uses cookies and
          similar technologies to recognize you when you visit our website at applyninja.ai
          ("Website"). It explains what these technologies are and why we use them, as well as your
          rights to control our use of them.
        </p>
        <p>
          This Cookie Policy should be read together with our Privacy Policy and Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you
          visit a website. Cookies are widely used by website owners to make their websites work, or
          to work more efficiently, as well as to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, ApplyNinja.ai) are called "first-party
          cookies". Cookies set by parties other than the website owner are called "third-party
          cookies". Third-party cookies enable third-party features or functionality to be provided
          on or through the website (e.g., advertising, interactive content, and analytics). The
          parties that set these third-party cookies can recognize your computer both when it visits
          the website in question and also when it visits certain other websites.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Why Do We Use Cookies?</h2>
        <p>
          We use first-party and third-party cookies for several reasons. Some cookies are required
          for technical reasons in order for our Website to operate, and we refer to these as
          "essential" or "strictly necessary" cookies. Other cookies also enable us to track and
          target the interests of our users to enhance the experience on our Website. Third parties
          serve cookies through our Website for advertising, analytics, and other purposes.
        </p>
        <p>
          The specific types of first and third-party cookies served through our Website and the
          purposes they perform are described below:
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">3.1 Essential Cookies</h3>
        <p>
          These cookies are strictly necessary to provide you with services available through our
          Website and to use some of its features, such as access to secure areas. Because these
          cookies are strictly necessary to deliver the Website, you cannot refuse them without
          impacting how our Website functions.
        </p>
        <p>Examples of essential cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Authentication cookies that identify you when you log into our Website</li>
          <li>
            Session cookies that enable our Website to remember choices you make (such as your
            language preference)
          </li>
          <li>Security cookies that help maintain the security of our Website</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">3.2 Performance and Functionality Cookies</h3>
        <p>
          These cookies are used to enhance the performance and functionality of our Website but are
          non-essential to their use. However, without these cookies, certain functionality may
          become unavailable.
        </p>
        <p>Examples of performance and functionality cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Cookies that remember your preferences and settings</li>
          <li>Cookies that help provide services like chat functionality</li>
          <li>Cookies that help with debugging and problem diagnosis</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">3.3 Analytics and Customization Cookies</h3>
        <p>
          These cookies collect information that is used either in aggregate form to help us
          understand how our Website is being used or how effective our marketing campaigns are, or
          to help us customize our Website for you.
        </p>
        <p>Examples of analytics and customization cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Analytics cookies to track user behavior and measure site performance</li>
          <li>Cookies that help us understand which pages are most popular</li>
          <li>Cookies that help us measure the effectiveness of our advertising</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">3.4 Targeting Cookies</h3>
        <p>
          These cookies are used to make advertising messages more relevant to you. They perform
          functions like preventing the same ad from continuously reappearing, ensuring that ads are
          properly displayed for advertisers, and in some cases selecting advertisements that are
          based on your interests.
        </p>
        <p>Examples of targeting cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Cookies placed by advertising networks to collect browsing habits and show relevant ads
          </li>
          <li>Cookies that measure the effectiveness of our advertising campaigns</li>
          <li>Cookies used for retargeting purposes</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">3.5 Social Media Cookies</h3>
        <p>
          These cookies are used to enable you to share pages and content that you find interesting
          on our Website through third-party social networking and other websites. These cookies may
          also be used for advertising purposes.
        </p>
        <p>Examples of social media cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Cookies from social media platforms (like Facebook, Twitter, LinkedIn) for sharing
            content
          </li>
          <li>Cookies that help with social media integration and marketing</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. How Can You Control Cookies?</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your
          cookie preferences by clicking on the appropriate opt-out links provided in the cookie
          table above.
        </p>
        <p>
          You can also set or amend your web browser controls to accept or refuse cookies. If you
          choose to reject cookies, you may still use our Website though your access to some
          functionality and areas of our Website may be restricted. As the means by which you can
          refuse cookies through your web browser controls vary from browser-to-browser, you should
          visit your browser's help menu for more information.
        </p>
        <p>
          In addition, most advertising networks offer you a way to opt out of targeted advertising.
          If you would like to find out more information, please visit{" "}
          <a
            href="http://www.aboutads.info/choices/"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.aboutads.info/choices/
          </a>{" "}
          or{" "}
          <a
            href="http://www.youronlinechoices.com"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.youronlinechoices.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          5. Specific Information About the Cookies We Use
        </h2>
        <p>The table below provides more information about the cookies we use and why:</p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-700">Name</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-700">Provider</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-700">Purpose</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-700">Expiry</th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">_ga</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Google Analytics
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Used to distinguish users
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">2 years</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Analytics</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">_gid</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Google Analytics
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Used to distinguish users
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">24 hours</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Analytics</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">_gat</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Google Analytics
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Used to throttle request rate
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">1 minute</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Analytics</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">session</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  ApplyNinja.ai
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Used to maintain user session
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Session</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Essential</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  auth_token
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  ApplyNinja.ai
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Used for authentication
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">30 days</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">Essential</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  preferences
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  ApplyNinja.ai
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Stores user preferences
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">1 year</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  Functionality
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          6. How Often Will We Update This Cookie Policy?
        </h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example,
          changes to the cookies we use or for other operational, legal, or regulatory reasons.
          Please therefore revisit this Cookie Policy regularly to stay informed about our use of
          cookies and related technologies.
        </p>
        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Where Can You Get Further Information?
        </h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please email us
          at support@applyninja.ai.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookie Consent</h2>
        <p>
          By continuing to use our website, you are agreeing to our placing cookies on your computer
          in order to analyze the way you use our website. Please read this Cookie Policy for more
          information about the cookies we use and how we use them.
        </p>
        <p>
          If you do not wish to accept cookies in connection with your use of our Website, you must
          disable the use of cookies by changing your browser settings to reject cookies or to
          notify you when a website tries to put a cookie on your computer.
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
