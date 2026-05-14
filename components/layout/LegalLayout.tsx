"use client";

import React from "react";
import { BrandLogo } from "@/components/chat/UI";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/AppContext";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
}

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  const { themeMode } = useApp();
  
  return (
    <div className={`legalPage appShell theme-${themeMode}`}>
      <header className="topNav">
        <BrandLogo />
        <nav className="siteLinks">
          <Link href="/">Home</Link>
          <Link href="/app">Dashboard</Link>
        </nav>
      </header>

      <main className="legalContainer">
        <div className="legalContent">
          <Link href="/" className="backLink">
            <ChevronLeft size={18} />
            Back to Home
          </Link>
          
          <div className="legalHeader">
            <h1>{title}</h1>
            {lastUpdated && <p className="lastUpdated">Last Updated: {lastUpdated}</p>}
          </div>

          <div className="legalBody">
            {children}
          </div>
        </div>
      </main>

      <footer className="legalFooter">
        <div className="footerInner">
          <p>&copy; {new Date().getFullYear()} OnChat. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .legalPage {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }
        .legalContainer {
          flex: 1;
          padding: 64px 24px;
          display: flex;
          justify-content: center;
        }
        .legalContent {
          width: min(800px, 100%);
        }
        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          transition: color 0.2s ease;
        }
        .backLink:hover {
          color: var(--primary);
        }
        .legalHeader {
          margin-bottom: 48px;
        }
        .legalHeader h1 {
          font-size: 40px;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .lastUpdated {
          color: var(--faint);
          font-size: 14px;
        }
        .legalBody {
          color: var(--text);
          line-height: 1.7;
          font-size: 16px;
        }
        .legalBody :global(h2) {
          font-size: 24px;
          font-weight: 700;
          margin: 40px 0 16px;
        }
        .legalBody :global(p) {
          margin-bottom: 16px;
        }
        .legalFooter {
          padding: 48px 24px;
          border-top: 1px solid var(--border);
          background: var(--surface);
          color: var(--muted);
          text-align: center;
          font-size: 14px;
        }
        @media (max-width: 768px) {
          .legalContainer {
            padding: 40px 20px;
          }
          .legalHeader h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}
