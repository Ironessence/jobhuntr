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
  title: "ApplyNinja.ai",
  description: "Apply to jobs faster and better with AI",
  openGraph: {
    title: "ApplyNinja.ai",
    description: "Apply to jobs faster and better with AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApplyNinja.ai Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyNinja.ai",
    description: "Apply to jobs faster and better with AI",
    images: ["/og-image.png"],
  },
  other: {
    "reddit-pixel": "a2_gs7s1ae0xvbb",
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
          id="reddit-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init','a2_gs7s1ae0xvbb');
            rdt('track', 'PageVisit');
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
