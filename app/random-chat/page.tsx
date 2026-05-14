"use client";

import React, { useState } from "react";
import { 
  Zap, 
  ArrowRight, 
  Sparkles,
  MessageSquare,
  Search,
  Shuffle,
  Users,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/AppContext";
import { BrandLogo } from "@/components/chat/UI";

export default function RandomChatPage() {
  const { 
    setUsername: setGlobalUsername, 
    setGender: setGlobalGender, 
    setAccountMode,
    enterGuestApp 
  } = useApp();
  
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalUsername(username.trim());
    setGlobalGender("man");
    const success = await enterGuestApp();
    if (success) {
      setAccountMode("guest");
      router.push("/app");
    }
    setLoading(false);
  };

  return (
    <div className="theme-dark appShell">
      <div className="landingPage">
      <nav className="landingNav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
          <div className="navLinks">
            <Link href="/">Home</Link>
            <Link href="/anonymous-chat">Anonymous Chat</Link>
            <Link href="/free-chat-rooms">Rooms</Link>
          </div>
        </div>
      </nav>

      <section className="heroSection">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="heroBadge">
              <Shuffle size={14} />
              Instant 1-on-1 Connections
            </div>
            <h1 className="heroTitle">
              Instant <br />
              <span>Random Chat</span> with Strangers.
            </h1>
            <p className="heroText">
              The world's fastest way to meet new people. Click start and get paired with a random person instantly for a private conversation. Completely free, completely anonymous.
            </p>
            
            <div className="heroActions">
              <button onClick={() => setShowGuestForm(true)} className="btn btnPrimary">
                Start Random Chat
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2>Why Random Chat?</h2>
            <p className="heroText">Excitement and serendipity at your fingertips.</p>
          </div>
          
          <div className="featureGrid">
            <div className="featureCard">
              <div className="featureIcon"><Zap style={{ color: '#3b82f6' }} /></div>
              <h3>Fast Pairing</h3>
              <p>No more waiting. Our algorithm finds you a partner in less than 2 seconds.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><Search style={{ color: '#f59e0b' }} /></div>
              <h3>Gender Filters</h3>
              <p>Registered users can filter their random matches by gender and location.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><Shield style={{ color: '#10b981' }} /></div>
              <h3>Safe Space</h3>
              <p>Report and block toxic users instantly. We keep the community clean and friendly.</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showGuestForm && (
          <div className="modalOverlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuestForm(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="modalCard">
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Who are you?</h2>
              <form onSubmit={handleGuestSubmit} className="guestForm">
                <input type="text" placeholder="Your nickname" value={username} onChange={(e) => setUsername(e.target.value)} className="formInput" required />
                <button type="submit" disabled={loading} className="btn btnPrimary" style={{ width: '100%', marginTop: '16px' }}>
                  {loading ? "Matching..." : "Start Chatting"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
