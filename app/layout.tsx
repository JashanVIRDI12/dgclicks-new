import type { Metadata, Viewport } from "next";
import { Azeret_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/mini-navbar";
import SmoothWrapper from "@/components/smooth-wrapper";

// Inter — the neutral, high-legibility sans used across modern tech
// products (Apple/SF-adjacent). One family carries display + body; the
// mono stays for instrument labels.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digi Clicks — Building Digital Experiences That Move Businesses Forward",
  description:
    "Digi Clicks is a digital agency in Caledon, Ontario. Website design & development, brand strategy, social media management, performance marketing, creative design, and AI-powered solutions.",
  keywords: [
    "digital marketing agency",
    "website design",
    "web development",
    "brand strategy",
    "social media management",
    "performance marketing",
    "SEO",
    "AI solutions",
    "Caledon Ontario",
    "Canada",
  ],
  openGraph: {
    title: "Digi Clicks — Design. Strategy. Growth.",
    description:
      "Website design & development, brand strategy, social media management, performance marketing, creative design, and AI-powered solutions — Caledon, Ontario.",
    type: "website",
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#EAF0F7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${azeretMono.variable}`}
    >
      <body className="font-sans text-body antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <SmoothWrapper>{children}</SmoothWrapper>
      </body>
    </html>
  );
}
