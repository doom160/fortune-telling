import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://divine-secrets.app";
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/bazi`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ziwei`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guanyin`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tarot`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/numerology`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/qmdj`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/astrology`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/zodiac`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/bazi/compatibility`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
