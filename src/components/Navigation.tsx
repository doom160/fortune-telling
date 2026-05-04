"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/bazi", label: "八字 BaZi" },
  { href: "/ziwei", label: "紫微 Zi Wei" },
  { href: "/guanyin", label: "觀音 Guanyin" },
  { href: "/tarot", label: "塔羅 Tarot" },
  { href: "/numerology", label: "數理 Numerology" },
  { href: "/qmdj", label: "奇門 Qi Men" },
  { href: "/astrology", label: "星盤 Astrology" },
  { href: "/zodiac", label: "生肖 Zodiac" },
  { href: "/iching", label: "易經 I Ching" },
  { href: "/rune", label: "ᚱ Norse Runes" },
  { href: "/oracle", label: "合一 Oracle" },
  { href: "/faq", label: "常問 FAQ" },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const activeLabel = NAV_ITEMS.find(item => item.href === pathname)?.label || "Menu";

  return (
    <nav className="main-nav" ref={navRef}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          神圣秘密 Divine Secrets
        </Link>
        <div className="nav-dropdown-wrapper">
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-label="Navigation menu"
          >
            <span className="nav-toggle-label">{activeLabel}</span>
            <span className={`nav-toggle-arrow ${open ? "open" : ""}`}>&#x25BE;</span>
          </button>
          {open && (
            <div className="nav-dropdown">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
