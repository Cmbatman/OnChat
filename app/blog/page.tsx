"use client";

import React from "react";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Clock,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/chat/UI";

const blogPosts = [
  {
    slug: "stay-safe-anonymous-chat",
    title: "10 Essential Tips for Staying Safe in Anonymous Chat",
    excerpt: "Learn how to protect your identity and enjoy meaningful conversations without compromising your security.",
    date: "May 10, 2026",
    author: "OnChat Safety Team",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "best-free-chat-rooms-2026",
    title: "The Top 5 Best Free Chat Rooms for Meeting New People in 2026",
    excerpt: "Discover the most active and friendly communities to join this year, from gaming hubs to regional lounges.",
    date: "May 8, 2026",
    author: "Community Manager",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "finding-friends-online-india",
    title: "How to Find Meaningful Friendships Online in India",
    excerpt: "India's digital landscape is changing. Here's how to navigate the best platforms for authentic local connections.",
    date: "May 5, 2026",
    author: "Rajesh Kumar",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1529070538074-18b1ea367182?auto=format&fit=crop&w=800&q=80"
  }
];

export default function BlogPage() {
  return (
    <div className="theme-dark appShell">
      <div className="landingPage">
      <nav className="landingNav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
          <div className="navLinks">
            <Link href="/">Home</Link>
            <Link href="/anonymous-chat">Chat</Link>
            <Link href="/free-chat-rooms">Rooms</Link>
          </div>
        </div>
      </nav>

      <section className="heroSection" style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="heroBadge">
              <BookOpen size={14} />
              OnChat Blog
            </div>
            <h1 className="heroTitle" style={{ fontSize: '48px' }}>
              Insights, Safety & <br />
              <span>Community Stories.</span>
            </h1>
            <p className="heroText">
              Stay updated with the latest tips, platform news, and guides for the anonymous chat world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="blogGridSection" style={{ paddingBottom: '100px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {blogPosts.map((post, i) => (
              <motion.div 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="blogCard"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {post.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', flex: 1 }}>{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="readMoreLink"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    Read Full Article <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landingFooter">
        <div className="container" style={{ textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} OnChat Anonymous Messenger. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .blogCard:hover img {
          transform: scale(1.05);
        }
        .readMoreLink:hover {
          gap: 12px !important;
        }
      `}</style>
      </div>
    </div>
  );
}
