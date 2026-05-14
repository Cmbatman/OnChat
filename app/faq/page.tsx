import React from "react";
import { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | OnChat",
  description: "Find answers to common questions about using OnChat, room management, and more.",
};

export default function FAQPage() {
  return (
    <LegalLayout title="Frequently Asked Questions">
      <section>
        <h2>What is OnChat?</h2>
        <p>
          OnChat is a modern real-time chat platform where you can meet new people, join community rooms, and chat one-on-one with users from around the world.
        </p>
      </section>

      <section>
        <h2>Is OnChat free to use?</h2>
        <p>
          Yes, the core features of OnChat are free. We also offer a Premium subscription that unlocks additional features like custom room limits, advanced profile badges, and an ad-free experience.
        </p>
      </section>

      <section>
        <h2>How do I create an account?</h2>
        <p>
          You can create an account by clicking the "Sign Up" button on the landing page. You'll need to provide a username, email, and choose your gender and country.
        </p>
      </section>

      <section>
        <h2>What are the rules for chatting?</h2>
        <p>
          We expect all users to be respectful and follow our Community Guidelines. Harassment, explicit content, and spam are strictly prohibited and may result in a permanent ban.
        </p>
      </section>

      <section>
        <h2>How can I report a user?</h2>
        <p>
          You can report a user directly from their profile or within a chat room by clicking the "Report" button. Our moderation team reviews all reports.
        </p>
      </section>

      <section>
        <h2>Can I create my own chat rooms?</h2>
        <p>
          Yes! Registered users can create their own custom rooms. There are limits on the number of active rooms you can have based on your account type (Registered vs. Premium).
        </p>
      </section>

      <section>
        <h2>How do I delete my account?</h2>
        <p>
          You can delete your account at any time through the "Settings" page in your dashboard. Please note that this action is permanent and cannot be undone.
        </p>
      </section>
    </LegalLayout>
  );
}
