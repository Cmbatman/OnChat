import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | OnChat",
  description: "Read the rules and guidelines for using the OnChat platform.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 13, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using OnChat, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use OnChat. If you are under 18, you represent that you have your parent or guardian's permission to use the platform.
        </p>
      </section>

      <section>
        <h2>3. User Conduct</h2>
        <p>
          You are responsible for your conduct and any content you post on OnChat. You agree not to:
        </p>
        <ul>
          <li>Harass, bully, or intimidate other users.</li>
          <li>Post sexually explicit or pornographic content.</li>
          <li>Promote illegal activities or violence.</li>
          <li>Impersonate others or create multiple accounts for abusive purposes.</li>
        </ul>
      </section>

      <section>
        <h2>4. Account Security</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2>5. Content Ownership</h2>
        <p>
          You retain ownership of the content you post. However, by posting content on OnChat, you grant us a non-exclusive, worldwide license to use, display, and distribute that content.
        </p>
      </section>

      <section>
        <h2>6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including violation of these terms.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          OnChat is provided "as is" without any warranties. We are not liable for any damages arising from your use of the platform.
        </p>
      </section>

      <section>
        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of the jurisdiction in which OnChat operates.
        </p>
      </section>
    </LegalLayout>
  );
}
