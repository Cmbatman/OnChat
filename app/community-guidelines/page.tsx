import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Community Guidelines | OnChat",
  description: "Rules and guidelines for interacting respectfully and safely on the OnChat platform.",
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalLayout title="Community Guidelines" lastUpdated="May 14, 2026">
      <section>
        <h2>Welcome to OnChat</h2>
        <p>
          OnChat is a space for meeting new people, chatting anonymously, and having great conversations. To keep our platform enjoyable and safe for everyone, we require all users to follow these Community Guidelines.
        </p>
      </section>

      <section>
        <h2>The Core Rules</h2>
        <ul>
          <li><strong>Be Respectful:</strong> Treat everyone with kindness. Diverse opinions are welcome, but personal attacks are not.</li>
          <li><strong>No Harassment:</strong> We have a zero-tolerance policy for bullying, harassment, stalking, or intimidation.</li>
          <li><strong>No Hate Speech:</strong> Content that promotes violence or incites hatred against individuals or groups based on race, ethnic origin, religion, disability, age, nationality, veteran status, sexual orientation, gender, or gender identity is strictly prohibited.</li>
          <li><strong>No Underage Users:</strong> OnChat is strictly for users aged 18 and older. Any accounts belonging to underage individuals will be immediately banned.</li>
          <li><strong>No Fake Profiles:</strong> Do not impersonate others or create deceptive profiles.</li>
        </ul>
      </section>

      <section>
        <h2>Chat Etiquette & Content</h2>
        <ul>
          <li><strong>No Explicit Content in First Messages:</strong> Keep introductions friendly and clean. Sending unsolicited explicit messages or media immediately upon connecting is a violation of our rules.</li>
          <li><strong>No Spam or Scams:</strong> Do not spam the chat or other users. Any behavior intended to defraud, scam, or exploit users financially is strictly prohibited.</li>
          <li><strong>No Links:</strong> For security reasons, sharing external links is heavily restricted and often blocked automatically. Do not use OnChat to promote other services or websites.</li>
          <li><strong>No Unsafe Image Uploads:</strong> If you use our image sharing features, ensure all content is legal, consensual, and follows our safety guidelines. CSAM or non-consensual intimate imagery will be reported to law enforcement.</li>
        </ul>
      </section>

      <section>
        <h2>Enforcement</h2>
        <p>
          We rely on both automated moderation tools and user reports to enforce these guidelines. If you encounter behavior that violates these rules, please <strong>use the Report and Block tools</strong> immediately. 
        </p>
        <p>
          Violations of these guidelines may result in a warning, a temporary restriction, or a permanent ban from OnChat without prior notice.
        </p>
      </section>
    </LegalLayout>
  );
}
