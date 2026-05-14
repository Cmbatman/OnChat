"use client";

import React, { useState } from "react";
import { 
  Users, 
  Globe, 
  Zap, 
  ArrowRight, 
  Sparkles,
  MessageSquare,
  Search,
  PlusCircle,
  Crown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/AppContext";
import { BrandLogo } from "@/components/chat/UI";

export default function FreeChatRoomsPage() {
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
            <Link href="/random-chat">Random Chat</Link>
          </div>
        </div>
      </nav>

      <section className="heroSection">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="heroBadge">
              <Users size={14} />
              12,000+ Active Rooms
            </div>
            <h1 className="heroTitle">
              Free <br />
              <span>Chat Rooms</span> for Everyone.
            </h1>
            <p className="heroText">
              Discover a world of conversation. Join specialized chat rooms for gaming, dating, technology, and local communities. Connect with like-minded individuals in real-time, for free.
            </p>
            
            <div className="heroActions">
              <button onClick={() => setShowGuestForm(true)} className="btn btnPrimary">
                Explore Rooms Now
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2>Our Room Categories</h2>
            <p className="heroText">Something for everyone, no matter your interest.</p>
          </div>
          
          <div className="featureGrid">
            <div className="featureCard">
              <div className="featureIcon"><Globe style={{ color: '#3b82f6' }} /></div>
              <h3>Global Communities</h3>
              <p>Rooms for every country and language. Connect with your roots or learn something new.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><Zap style={{ color: '#f59e0b' }} /></div>
              <h3>Interests & Hobbies</h3>
              <p>Gaming, Anime, Movies, Sports, and Tech. Find your tribe and dive deep into discussions.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon"><Crown style={{ color: '#8b5cf6' }} /></div>
              <h3>Custom Rooms</h3>
              <p>Premium users can create their own private or public rooms with custom rules.</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showGuestForm && (
          <div className="modalOverlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuestForm(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="modalCard">
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Join the Lobby</h2>
              <form onSubmit={handleGuestSubmit} className="guestForm">
                <input type="text" placeholder="Choose a nickname" value={username} onChange={(e) => setUsername(e.target.value)} className="formInput" required />
                <button type="submit" disabled={loading} className="btn btnPrimary" style={{ width: '100%', marginTop: '16px' }}>
                  {loading ? "Joining..." : "Enter Chat Rooms"}
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
