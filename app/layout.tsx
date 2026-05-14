import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onchat.app"),
  title: "OnChat | Free Anonymous Chat & Live Rooms",
  description: "Connect instantly with real people worldwide. Join free chat rooms, enjoy private 1-on-1 conversations, and meet new friends on the most vibrant anonymous social platform.",
  keywords: ["chat rooms", "anonymous chat", "free chat", "meet new people", "online chat", "social network"],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logos/onchat-icon-light.png",
    apple: "/logos/onchat-icon-light.png",
  },
  openGraph: {
    title: "OnChat | Free Anonymous Chat & Live Rooms",
    description: "Connect instantly with real people worldwide. Join free chat rooms and enjoy private 1-on-1 conversations.",
    url: "https://onchat.app",
    siteName: "OnChat",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnChat | Free Anonymous Chat & Live Rooms",
    description: "The ultimate destination for real-time anonymous connections.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  appleWebApp: {
    capable: true,
    title: "OnChat",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1211" },
  ],
};

import { Providers } from "@/lib/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
