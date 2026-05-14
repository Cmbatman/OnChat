import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | OnChat",
  description: "Learn how OnChat collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 13, 2026">
      <section>
        <h2>1. Information We Collect</h2>
        <p>
          At OnChat, we respect your privacy. We collect information you provide directly to us when you create an account, such as your username, email address, age, and country.
        </p>
        <p>
          When you use our services, we also automatically collect certain information, including your IP address, device type, and usage data to improve our platform and ensure a safe environment.
        </p>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide and maintain our services.</li>
          <li>Personalize your experience.</li>
          <li>Communicate with you about updates and features.</li>
          <li>Protect our community and enforce our terms.</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide you with our services. If you wish to delete your account, you can do so through your profile settings.
        </p>
      </section>

      <section>
        <h2>4. Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>
          We use cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect the functionality of some parts of our site.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@onchat.app.
        </p>
      </section>
    </LegalLayout>
  );
}
