"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Lock,
  Search,
  Heart,
  Coffee,
  Ghost,
  Hash,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Country, State } from "country-state-city";
import { useApp } from "@/lib/AppContext";
import { BrandLogo } from "@/components/chat/UI";

export default function LandingPage() {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const genders = [
    { label: "Man", value: "man" },
    { label: "Woman", value: "woman" },
    { label: "Non-Binary", value: "non_binary" }
  ];

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
    
    // Set global context values
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
    <div className="landingPage">
      {/* Navigation */}
      <nav className="landingNav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
          
          <div className="navLinks">
            <a href="#features">Features</a>
            <a href="#rooms">Rooms</a>
            <a href="#premium">Premium</a>
            <Link href="/login" style={{ color: 'var(--primary)' }}>Login</Link>
          </div>

          <button 
            className="mobileMenuBtn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)' }}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="heroSection">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="heroBadge">
              <Sparkles size={14} />
              Next-Gen Anonymous Social
            </div>
            <h1 className="heroTitle">
              Real People. <br />
              <span>Real Conversations.</span>
            </h1>
            <p className="heroText">
              Experience the world's most vibrant free chat community. Connect instantly with random people or join curated rooms for meaningful discussions.
            </p>
            
            <div className="heroActions">
              <button
                onClick={() => setShowGuestForm(true)}
                className="btn btnPrimary"
              >
                Chat as Guest
                <ArrowRight size={20} />
              </button>
              <Link 
                href="/register"
                className="btn btnSecondary"
              >
                Create Account
                <Lock size={20} style={{ opacity: 0.5 }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guest Form Modal Overlay */}
      <AnimatePresence>
        {showGuestForm && (
          <div className="modalOverlay">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuestForm(false)}
              style={{ position: 'absolute', inset: 0 }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modalCard"
            >
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Quick Entry</h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Choose a nickname and start chatting instantly.</p>
              
              <form onSubmit={handleGuestSubmit} className="guestForm">
                <div className="formField">
                  <label>Username</label>
                  <input 
                    type="text"
                    placeholder="e.g. ChatExplorer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="formInput"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="formField">
                    <label>Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="formInput"
                    >
                      {genders.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="formField">
                    <label>Age</label>
                    <input 
                      type="number"
                      min="18"
                      max="99"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="formInput"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="formField">
                    <label>Country</label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setState("");
                      }}
                      className="formInput"
                    >
                      {Country.getAllCountries().map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="formField">
                    <label>State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="formInput"
                      disabled={!country || State.getStatesOfCountry(country).length === 0}
                    >
                      <option value="">(Optional)</option>
                      {country && State.getStatesOfCountry(country).map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ paddingTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      I agree to the <Link href="/terms" style={{ color: 'var(--success)', fontWeight: 600 }}>Terms</Link> and <Link href="/safety" style={{ color: 'var(--success)', fontWeight: 600 }}>Safety Rules</Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btnPrimary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {loading ? "Connecting..." : "Start Chatting"}
                  <ArrowRight size={20} />
                </button>
                
                {status && (
                  <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--danger)', marginTop: '8px' }}>{status}</p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <section id="features" className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2>Why OnChat?</h2>
            <p className="heroText" style={{ marginBottom: 0 }}>Built for humans, optimized for connection. No fluff, just real talk.</p>
          </div>
          
          <div className="featureGrid">
            <FeatureCard 
              icon={<Globe size={24} style={{ color: '#3b82f6' }} />}
              title="Global Community"
              description="Connect with millions of users from every corner of the world, 24/7."
            />
            <FeatureCard 
              icon={<Shield size={24} style={{ color: '#10b981' }} />}
              title="Safe & Anonymous"
              description="Your privacy is our priority. No registration required to get started."
            />
            <FeatureCard 
              icon={<Zap size={24} style={{ color: '#f59e0b' }} />}
              title="Instant Matching"
              description="No waiting. Our advanced matching algorithm finds you a partner in seconds."
            />
            <FeatureCard 
              icon={<Users size={24} style={{ color: '#8b5cf6' }} />}
              title="Interest Rooms"
              description="Join specialized rooms for hobbies, gaming, dating, and local meetups."
            />
            <FeatureCard 
              icon={<MessageSquare size={24} style={{ color: '#ec4899' }} />}
              title="Rich Media"
              description="Share photos, voice notes, and more in our premium 1-on-1 chat experience."
            />
            <FeatureCard 
              icon={<Sparkles size={24} style={{ color: '#6366f1' }} />}
              title="Premium Perks"
              description="Unlock exclusive features like room creation, verified badges, and advanced filters."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="statsSection">
        <div className="container">
          <div className="statsGrid">
            <div className="statItem">
              <div className="statValue">12M+</div>
              <div className="statLabel">Monthly Active Users</div>
            </div>
            <div className="statItem">
              <div className="statValue">50k+</div>
              <div className="statLabel">Live Chat Rooms</div>
            </div>
            <div className="statItem">
              <div className="statValue">100%</div>
              <div className="statLabel">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landingFooter">
        <div className="container">
          <div className="footerGrid">
            <div className="footerBrand">
              <BrandLogo />
              <p>The world's largest anonymous chat platform. Connecting people since 2018.</p>
            </div>
            <div className="footerCol">
              <h4>Platform</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#rooms">Rooms</a></li>
                <li><Link href="/promote">Promote</Link></li>
                <li><Link href="/advertise">Advertise</Link></li>
              </ul>
            </div>
            <div className="footerCol">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
                <li><Link href="/safety">Safety Center</Link></li>
                <li><Link href="/community-guidelines">Community Guidelines</Link></li>
              </ul>
            </div>
            <div className="footerCol">
              <h4>Support</h4>
              <ul>
                <li><Link href="/faq">Help & FAQ</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><a href="mailto:abuse@onchat.app">Report Abuse</a></li>
                <li><a href="https://twitter.com/onchat">Twitter / X</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footerBottom">
            <p>&copy; {new Date().getFullYear()} OnChat Anonymous Messenger. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#">Status</a>
              <a href="#">English</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="featureCard">
      <div className="featureIcon">{icon}</div>
      <h3 className="featureTitle">{title}</h3>
      <p className="featureText">{description}</p>
    </div>
  );
}
