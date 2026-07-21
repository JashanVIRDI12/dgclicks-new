import type { Metadata, Viewport } from "next";
import { Azeret_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
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
  title: "DG Clicks — Clicks are cheap. Clients are the point.",
  description:
    "DG Clicks is a digital growth studio in Bolton, Ontario. SEO, website development, paid ads, social media management, and graphic design — measured in qualified enquiries, not impressions.",
  keywords: [
    "digital marketing agency",
    "SEO",
    "paid ads",
    "web development",
    "social media management",
    "graphic design",
    "Bolton Ontario",
    "Canada",
  ],
  openGraph: {
    title: "DG Clicks — Digital growth studio",
    description:
      "SEO, website development, paid ads, social media management, and graphic design built to create qualified enquiries. Bolton, Ontario.",
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
        <SmoothWrapper>
          <Nav />
          {children}
        </SmoothWrapper>
      </body>
    </html>
  );
}
