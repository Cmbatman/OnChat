"use client";

import React from "react";
import { LegalLayout } from "@/components/layout/LegalLayout";

export default function AdvertisePage() {
  return (
    <LegalLayout title="Advertise on OnChat">
      <section>
        <p>
          Reach millions of active users worldwide. OnChat offers high-visibility advertising opportunities for brands, app developers, and services.
        </p>

        <h2>Why Advertise with Us?</h2>
        <ul>
          <li><strong>Global Reach:</strong> Connect with a diverse audience across 150+ countries.</li>
          <li><strong>High Engagement:</strong> Our users spend an average of 25 minutes per session.</li>
          <li><strong>Targeted Placement:</strong> Place your ads in specific chat rooms or interest categories.</li>
          <li><strong>Premium Formats:</strong> Native integration, sponsored rooms, and banner placements.</li>
        </ul>

        <h2>Ad Formats</h2>
        <div className="adFormats">
          <div className="formatCard">
            <h3>Sponsored Rooms</h3>
            <p>Create a branded chat room with your logo and customized theme.</p>
          </div>
          <div className="formatCard">
            <h3>Native Banners</h3>
            <p>High-visibility placements within the chat interface and lobby.</p>
          </div>
          <div className="formatCard">
            <h3>Direct Promotion</h3>
            <p>Promote your own chat rooms or social groups to our active community.</p>
          </div>
        </div>

        <h2>Get Started</h2>
        <p>
          Ready to grow your brand with OnChat? Contact our advertising team for a custom quote and media kit.
        </p>
        <div className="ctaBox">
          <a href="mailto:ads@onchat.app" className="ctaBtn">Contact Advertising Team</a>
        </div>
      </section>

      <style jsx>{`
        .adFormats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }
        .formatCard {
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface-soft);
        }
        .formatCard h3 {
          margin: 0 0 12px;
          font-size: 16px;
        }
        .formatCard p {
          font-size: 14px;
          color: var(--muted);
          margin: 0;
        }
        .ctaBox {
          margin-top: 40px;
          text-align: center;
        }
        .ctaBtn {
          display: inline-block;
          background: var(--primary);
          color: white;
          padding: 16px 32px;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .ctaBtn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </LegalLayout>
  );
}
