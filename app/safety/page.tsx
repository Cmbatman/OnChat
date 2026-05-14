import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Community Safety | OnChat",
  description: "Our commitment to providing a safe and respectful environment for all users.",
};

export default function SafetyPage() {
  return (
    <LegalLayout title="Safety Center" lastUpdated="May 13, 2026">
      <section>
        <h2>Our Commitment to Safety</h2>
        <p>
          OnChat is designed to be a fun and safe environment for meeting new people. We take user safety seriously and have implemented various tools and policies to protect our community.
        </p>
      </section>

      <section>
        <h2>Safety Tips for Users</h2>
        <ul>
          <li><strong>Stay Anonymous:</strong> Never share your real name, address, phone number, or other personal identifiers with strangers.</li>
          <li><strong>Be Cautious with Photos:</strong> Don't share photos that reveal your location or personal information.</li>
          <li><strong>Don't Send Money:</strong> Never send money to anyone you meet on a chat platform, no matter their story.</li>
          <li><strong>Report Abuse:</strong> If someone makes you feel uncomfortable or violates our rules, use the report button immediately.</li>
          <li><strong>Trust Your Gut:</strong> If a conversation feels wrong, leave the room or end the chat. You are in control.</li>
        </ul>
      </section>

      <section>
        <h2>Moderation Tools</h2>
        <p>
          We use a combination of automated filters and human moderation to monitor chat rooms and reportable content. Users who violate our community guidelines will be warned or banned.
        </p>
      </section>

      <section>
        <h2>Reporting Process</h2>
        <p>
          When you report a user, our team receives a transcript of the relevant conversation and any reported media. We investigate every report and take appropriate action based on our policies.
        </p>
      </section>
    </LegalLayout>
  );
}
