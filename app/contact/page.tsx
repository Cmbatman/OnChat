"use client";

import React from "react";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <section>
        <p>
          Have a question, suggestion, or need help? We'd love to hear from you. Please use one of the contact methods below to get in touch with the OnChat team.
        </p>

        <div className="contactGrid">
          <div className="contactCard">
            <h3>Support</h3>
            <p>For technical issues or account help:</p>
            <a href="mailto:support@onchat.app">support@onchat.app</a>
          </div>

          <div className="contactCard">
            <h3>Partnerships</h3>
            <Globe size={20} />
            <p>For business inquiries and collaborations:</p>
            <a href="mailto:partners@onchat.app">partners@onchat.app</a>
          </div>

          <div className="contactCard">
            <h3>Legal</h3>
            <p>For legal inquiries or report concerns:</p>
            <a href="mailto:legal@onchat.app">legal@onchat.app</a>
          </div>
        </div>

        <div className="contactFormWrap">
          <h2>Send us a message</h2>
          <form className="contactForm">
            <div className="formGroup">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="formGroup">
              <label>Email</label>
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="formGroup">
              <label>Subject</label>
              <select>
                <option>General Inquiry</option>
                <option>Account Issue</option>
                <option>Feature Request</option>
                <option>Bug Report</option>
                <option>Premium Subscription</option>
              </select>
            </div>
            <div className="formGroup">
              <label>Message</label>
              <textarea placeholder="How can we help you?" rows={5}></textarea>
            </div>
            <button type="submit" className="submitBtn">Send Message</button>
          </form>
        </div>
      </section>

      <style jsx>{`
        .contactGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin: 40px 0 64px;
        }
        .contactCard {
          padding: 32px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          text-align: center;
        }
        .contactCard h3 {
          margin: 0 0 12px;
          font-size: 18px;
        }
        .contactCard p {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 16px;
        }
        .contactCard a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
        }
        .contactFormWrap {
          max-width: 600px;
          margin: 0 auto;
        }
        .contactForm {
          display: grid;
          gap: 24px;
          margin-top: 32px;
        }
        .formGroup {
          display: grid;
          gap: 8px;
        }
        .formGroup label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }
        .formGroup input,
        .formGroup select,
        .formGroup textarea {
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
          color: var(--text);
        }
        .submitBtn {
          background: var(--primary);
          color: white;
          border: 0;
          padding: 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .submitBtn:hover {
          background: var(--primary-strong);
        }
      `}</style>
    </LegalLayout>
  );
}
