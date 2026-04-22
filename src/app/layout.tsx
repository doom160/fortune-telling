import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const bodyFont = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mystic Matrix – The Ancient Arts of Divination",
  description: "Seek clarity through the wisdom of the ages. BaZi, Zi Wei Dou Shu, Guanyin Lots, and Tarot readings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
