"use client";

import React from "react";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Clock,
  Share2,
  ThumbsUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/chat/UI";

const blogContent: Record<string, any> = {
  "stay-safe-anonymous-chat": {
    title: "10 Essential Tips for Staying Safe in Anonymous Chat",
    date: "May 10, 2026",
    author: "OnChat Safety Team",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    content: `
      <p>Anonymous chat platforms offer a unique way to connect with people from all walks of life without the pressure of social expectations. However, freedom comes with responsibility. To ensure your experience remains positive and safe, follow these ten essential tips.</p>
      
      <h3>1. Never Share Personal Information</h3>
      <p>This is the golden rule. Never share your real name, address, phone number, school, or workplace. Even seemingly innocent details can be pieces of a puzzle that someone could use to identify you.</p>
      
      <h3>2. Keep it on the Platform</h3>
      <p>Scammers often try to move the conversation to other apps like WhatsApp or Instagram. Stay within OnChat's secure environment where our moderation tools can protect you.</p>
      
      <h3>3. Trust Your Instincts</h3>
      <p>If a conversation feels "off" or someone makes you uncomfortable, don't hesitate to end the chat. You don't owe anyone an explanation.</p>
      
      <h3>4. Use the Block & Report Tools</h3>
      <p>OnChat provides instant blocking and reporting. Use them aggressively against harassment, spam, or inappropriate behavior. This helps us keep the community clean for everyone.</p>
      
      <h3>5. Be Wary of Links</h3>
      <p>Never click on suspicious links sent by strangers. They could lead to phishing sites or malware downloads. Our system filters many links, but new ones emerge constantly.</p>
    `
  },
  "best-free-chat-rooms-2026": {
    title: "The Top 5 Best Free Chat Rooms for Meeting New People in 2026",
    date: "May 8, 2026",
    author: "Community Manager",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    content: `
      <p>The landscape of online social interaction has evolved. In 2026, people are looking for deeper, more focused communities. Here are the top 5 rooms on OnChat that are buzzing with activity right now.</p>
      
      <h3>1. The General Chat Lobby</h3>
      <p>The heart of OnChat. Perfect for quick conversations, lighthearted jokes, and meeting people from absolutely everywhere. It's the best place to start your journey.</p>
      
      <h3>2. India Lounge</h3>
      <p>One of our most vibrant regional communities. From discussing Bollywood to cricket and local tech trends, the India Lounge is always alive with energy.</p>
      
      <h3>3. Gaming Hub</h3>
      <p>Looking for a squad for your favorite battle royale or want to discuss the latest RPG? The Gaming Hub is the go-to spot for players across all platforms.</p>
      
      <h3>4. Deep Talk Chat</h3>
      <p>If you're tired of small talk, this is your sanctuary. Philosophy, science, life goals—nothing is off-limits here for those seeking meaningful connection.</p>
      
      <h3>5. Movie Night</h3>
      <p>Discuss the latest streaming hits and cinema blockbusters. Share your reviews and get recommendations from fellow cinephiles.</p>
    `
  }
};

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const post = blogContent[slug as string];

  if (!post) {
    return (
      <div className="landingPage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Post Not Found</h1>
          <Link href="/blog" style={{ color: 'var(--primary)', marginTop: '20px', display: 'inline-block' }}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-dark appShell">
      <div className="landingPage">
      <nav className="landingNav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
          <div className="navLinks">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/app" className="btnPrimarySmall" style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--primary)', color: 'white' }}>Join Chat</Link>
          </div>
        </div>
      </nav>

      <article className="blogArticle" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px', marginBottom: '32px' }}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>{post.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{post.author}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{post.date} &bull; {post.readTime}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--muted)' }}><Share2 size={20} /></button>
                <button style={{ background: 'none', border: 'none', color: 'var(--muted)' }}><ThumbsUp size={20} /></button>
              </div>
            </div>

            <div style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div 
              className="articleContent" 
              style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div style={{ marginTop: '60px', padding: '40px', background: 'var(--primary-glow)', borderRadius: '24px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '16px' }}>Ready to start chatting?</h3>
              <p style={{ marginBottom: '24px', opacity: 0.8 }}>Join millions of people in our safe, anonymous community today.</p>
              <Link href="/app" className="btn btnPrimary" style={{ display: 'inline-flex' }}>
                Join OnChat Now <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </article>

      <footer className="landingFooter">
        <div className="container" style={{ textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} OnChat Anonymous Messenger. All rights reserved.
        </div>
      </footer>

      <style jsx global>{`
        .articleContent h3 {
          font-size: 24px;
          margin: 40px 0 20px;
          color: white;
        }
        .articleContent p {
          margin-bottom: 24px;
        }
      `}</style>
      </div>
    </div>
  );
}
