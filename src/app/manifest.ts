import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "神圣秘密 Divine Secrets",
    short_name: "神圣秘密",
    description:
      "Ancient arts of divination — BaZi, Zi Wei Dou Shu, Qi Men Dun Jia, Western Astrology, Tarot, Guanyin Lots, and Numerology.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0812",
    theme_color: "#0a0812",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
