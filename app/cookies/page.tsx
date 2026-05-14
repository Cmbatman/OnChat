import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | OnChat",
  description: "Information about how we use cookies and similar technologies on OnChat.",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 13, 2026">
      <section>
        <h2>What are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
        </p>
      </section>

      <section>
        <h2>How We Use Cookies</h2>
        <p>
          OnChat uses cookies for the following purposes:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> These are necessary for the website to function, such as managing your session and authentication.</li>
          <li><strong>Preference Cookies:</strong> These allow us to remember your settings, such as your theme choice (dark/light mode).</li>
          <li><strong>Analytics Cookies:</strong> These help us understand how users interact with our site, so we can improve our services.</li>
        </ul>
      </section>

      <section>
        <h2>Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can set your browser to block cookies or notify you when a cookie is being set. Please note that disabling essential cookies may prevent you from using some features of OnChat.
        </p>
      </section>

      <section>
        <h2>Third-Party Cookies</h2>
        <p>
          We may also use third-party services, such as analytics providers, that may set cookies on your device. We do not control these cookies and you should check the respective third-party websites for more information about their cookie policies.
        </p>
      </section>
    </LegalLayout>
  );
}
