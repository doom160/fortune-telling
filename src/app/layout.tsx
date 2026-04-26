import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0812",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://heavenly-secrets.app"),
  title: {
    default: "天機 Heavenly Secrets — The Ancient Arts of Divination",
    template: "%s | 天機 Heavenly Secrets",
  },
  description: "Free online divination tools: BaZi, Zi Wei Dou Shu, Qi Men Dun Jia, Western Astrology, Tarot, Guanyin Lots, and Numerology. All calculations run locally in your browser.",
  keywords: ["BaZi", "八字", "Zi Wei Dou Shu", "紫微斗數", "Qi Men Dun Jia", "奇門遁甲", "Tarot", "Guanyin Lots", "Western Astrology", "Numerology", "divination", "fortune telling", "natal chart", "Chinese astrology"],
  authors: [{ name: "天機 Heavenly Secrets" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "天機 Heavenly Secrets",
    title: "天機 Heavenly Secrets — The Ancient Arts of Divination",
    description: "Free online divination tools combining Chinese and Western metaphysical traditions. BaZi, Zi Wei Dou Shu, Astrology, Tarot, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "天機 Heavenly Secrets — The Ancient Arts of Divination",
    description: "Free online divination tools combining Chinese and Western metaphysical traditions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker" in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
