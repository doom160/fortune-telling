"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          天機 · Mystic Matrix
        </Link>
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/bazi"
            className={`nav-link ${isActive("/bazi") ? "active" : ""}`}
          >
            八字 BaZi
          </Link>
          <Link
            href="/ziwei"
            className={`nav-link ${isActive("/ziwei") ? "active" : ""}`}
          >
            紫微 Zi Wei
          </Link>
          <Link
            href="/guanyin"
            className={`nav-link ${isActive("/guanyin") ? "active" : ""}`}
          >
            觀音 Guanyin
          </Link>
          <Link
            href="/tarot"
            className={`nav-link ${isActive("/tarot") ? "active" : ""}`}
          >
            塔羅 Tarot
          </Link>
        </div>
      </div>
    </nav>
  );
}
