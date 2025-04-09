import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@/context/ProgressContext";
import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "ApplyNinja.ai | AI-Powered Job Application Assistant",
  description:
    "Transform your job search with ApplyNinja.ai. Our AI-powered platform helps you create winning applications, track your progress, and land your dream job faster. Craft personalized resumes, cover letters, and get insider tips for successful applications.",
  keywords:
    "job application, AI assistant, resume builder, cover letter generator, job search tool, career advancement, job hunting AI, application tracking",
  authors: [{ name: "ApplyNinja.ai" }],
  creator: "ApplyNinja.ai",
  publisher: "ApplyNinja.ai",
  openGraph: {
    title: "ApplyNinja.ai | AI-Powered Job Application Assistant",
    description:
      "Transform your job search with ApplyNinja.ai. Our AI-powered platform helps you create winning applications, track your progress, and land your dream job faster.",
    url: "https://applyninja.ai",
    siteName: "ApplyNinja.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApplyNinja.ai Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyNinja.ai | AI-Powered Job Application Assistant",
    description:
      "Transform your job search with ApplyNinja.ai. Our AI-powered platform helps you create winning applications, track your progress, and land your dream job faster.",
    images: ["/og-image.png"],
    creator: "@applyninja",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    minimumScale: 1,
  },
  // verification: {
  //   google: "google-site-verification=YOUR_VERIFICATION_CODE", // Add your Google verification code
  // },
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '3131677536981074');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivoBlack.variable} antialiased`}
      >
        <PostHogProvider>
          <Providers>
            <ProgressProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </ProgressProvider>
          </Providers>
        </PostHogProvider>
        <Toaster />
      </body>
    </html>
  );
}
