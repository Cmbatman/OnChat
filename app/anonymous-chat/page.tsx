"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Shield, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Lock,
  MessageSquare,
  Users,
  Search,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Country, State } from "country-state-city";
import { useApp } from "@/lib/AppContext";
import { BrandLogo } from "@/components/chat/UI";

export default function AnonymousChatPage() {
  const { 
    setUsername: setGlobalUsername, 
    setGender: setGlobalGender, 
    setAge: setGlobalAge, 
    setCountry: setGlobalCountry, 
    setState: setGlobalState, 
    setAccountMode,
    enterGuestApp 
  } = useApp();
  
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"man" | "woman" | "non_binary">("man");
  const [age, setAge] = useState(18);
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatus("Please enter a nickname.");
      return;
    }
    if (!consentAccepted) {
      setStatus("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    setGlobalUsername(username.trim());
    setGlobalGender(gender);
    setGlobalAge(age);
    setGlobalCountry(country);
    setGlobalState(state);

    const success = await enterGuestApp();
    setLoading(false);

    if (success) {
      setAccountMode("guest");
      router.push("/app");
    }
  };

  return (
    <div className="theme-dark appShell">
      <div className="landingPage">
      <nav className="landingNav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
          <div className="navLinks">
            <Link href="/">Home</Link>
            <Link href="/free-chat-rooms">Rooms</Link>
            <Link href="/random-chat">Random Chat</Link>
            <Link href="/login" style={{ color: 'var(--primary)' }}>Login</Link>
          </div>
        </div>
      </nav>

      <section className="heroSection">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="heroBadge">
              <Shield size={14} />
              100% Private & Encrypted
            </div>
            <h1 className="heroTitle">
              The Ultimate <br />
              <span>Anonymous Chat</span> Experience.
            </h1>
            <p className="heroText">
              No registration. No tracking. Just pure conversation. OnChat is the premier destination for anonymous chat, connecting you with interesting people around the globe instantly.
            </p>
            
            <div className="heroActions">
              <button onClick={() => setShowGuestForm(true)} className="btn btnPrimary">
                Start Anonymous Chat
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2>Why Anonymous Chat?</h2>
            <p className="heroText">Freedom to be yourself, without judgment.</p>
          </div>
          
          <div className="featureGrid">
            <div className="featureCard">
              <div className="featureIcon"><Lock style={{ color: '#10b981' }} /></div>
              <h3>Privacy First</h3>
              <p>We don't store your personal data. Your identity remains 100% confidential.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><MessageSquare style={{ color: '#3b82f6' }} /></div>
              <h3>Real-Time Talk</h3>
              <p>Low latency, high speed chat that feels as natural as talking in person.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><Users style={{ color: '#8b5cf6' }} /></div>
              <h3>Verified Guests</h3>
              <p>Our moderation tools ensure a safe environment even for anonymous users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Form Modal */}
      <AnimatePresence>
        {showGuestForm && (
          <div className="modalOverlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuestForm(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="modalCard">
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Start Chatting</h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Jump into the conversation in seconds.</p>
              
              <form onSubmit={handleGuestSubmit} className="guestForm">
                <div className="formField">
                  <label>Nickname</label>
                  <input type="text" placeholder="e.g. SecretUser" value={username} onChange={(e) => setUsername(e.target.value)} className="formInput" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="formField">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="formInput">
                      <option value="man">Man</option>
                      <option value="woman">Woman</option>
                      <option value="non_binary">Non-Binary</option>
                    </select>
                  </div>
                  <div className="formField">
                    <label>Age</label>
                    <input type="number" min="18" max="99" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="formInput" />
                  </div>
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      I agree to the <Link href="/terms" style={{ color: 'var(--success)', fontWeight: 600 }}>Terms</Link>
                    </span>
                  </label>
                </div>
                <button type="submit" disabled={loading} className="btn btnPrimary" style={{ width: '100%', marginTop: '8px' }}>
                  {loading ? "Connecting..." : "Join Now"}
                  <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="landingFooter">
        <div className="container">
          <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>
            &copy; {new Date().getFullYear()} OnChat Anonymous Messenger. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
