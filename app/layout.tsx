import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/app/_components/navbar";
import { SiteFooter } from "@/app/_components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headings only. Geist is a fine text face but it reads corporate at display
// sizes; Space Grotesk keeps the wordmark and section titles a little louder.
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flozo712",
  description: "Live streams and past broadcasts from Flozo712 on Twitch.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {/* Purely decorative wash + grid; see .page-backdrop in globals.css. */}
        <div className="page-backdrop" aria-hidden="true" />
        <Navbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
