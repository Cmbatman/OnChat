"use client";

import React from "react";
import { Crown, CheckCircle2, Shield, Zap, Image, UsersRound, MessagesSquare } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { BrandLogo } from "@/components/chat/UI";

export const PremiumSection: React.FC = () => {
  const { isPremium } = useApp();

  return (
    <div className="premiumPage">
      <div className="premiumHeader">
        <Crown className="premiumIcon" size={48} />
        <h2>OnChat Premium</h2>
        <p>Unlock the ultimate chat experience.</p>
      </div>

      {isPremium ? (
        <div className="activePremiumState">
          <div className="successCard">
            <CheckCircle2 className="successIcon" size={32} />
            <h3>You are Premium!</h3>
            <p>Thank you for supporting OnChat. Enjoy your exclusive benefits.</p>
          </div>
        </div>
      ) : (
        <div className="premiumPlans">
          <div className="planCard">
            <div className="planHeader">
              <h3>Free Member</h3>
              <div className="price">$0<span>/mo</span></div>
            </div>
            <ul className="planFeatures">
              <li><CheckCircle2 size={16} /> Basic chat features</li>
              <li><CheckCircle2 size={16} /> Access to public rooms</li>
              <li><CheckCircle2 size={16} /> Standard matchmaking</li>
              <li className="disabled"><CheckCircle2 size={16} /> Ad-free experience</li>
              <li className="disabled"><CheckCircle2 size={16} /> Advanced filters</li>
              <li className="disabled"><CheckCircle2 size={16} /> Custom profile styling</li>
            </ul>
            <button className="secondaryButton" disabled>Current Plan</button>
          </div>

          <div className="planCard highlight">
            <div className="planBadge">Most Popular</div>
            <div className="planHeader">
              <h3>Premium</h3>
              <div className="price">$4.99<span>/mo</span></div>
            </div>
            <ul className="planFeatures">
              <li><CheckCircle2 size={16} className="activeIcon" /> Create Premium Rooms (up to 280 members)</li>
              <li><CheckCircle2 size={16} className="activeIcon" /> Send Images & GIFs in Chat</li>
              <li><CheckCircle2 size={16} className="activeIcon" /> Priority Matchmaking & Search</li>
              <li><CheckCircle2 size={16} className="activeIcon" /> See Who Favorited You</li>
              <li><CheckCircle2 size={16} className="activeIcon" /> Ad-free experience</li>
              <li><CheckCircle2 size={16} className="activeIcon" /> Premium Crown Badge</li>
            </ul>
            <button className="primaryButton">Upgrade Now</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .premiumPage { padding: 3rem 2rem; max-width: 900px; margin: 0 auto; height: 100%; overflow-y: auto; text-align: center; }
        .premiumHeader { margin-bottom: 3rem; }
        .premiumIcon { color: var(--accent); margin-bottom: 1rem; }
        .premiumHeader h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .premiumHeader p { color: var(--muted); font-size: 1.1rem; }
        
        .activePremiumState { display: flex; justify-content: center; }
        .successCard { background: var(--panel-bg); border: 2px solid var(--accent); border-radius: 1rem; padding: 3rem; max-width: 500px; }
        .successIcon { color: var(--accent); margin-bottom: 1rem; }
        
        .premiumPlans { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        @media (max-width: 768px) { .premiumPlans { grid-template-columns: 1fr; } }
        
        .planCard { background: var(--panel-bg); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2.5rem; display: flex; flex-direction: column; position: relative; text-align: left; transition: transform 0.2s; }
        .planCard:hover { transform: translateY(-5px); }
        .planCard.highlight { border: 2px solid var(--accent); box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.1); }
        
        .planBadge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 0.25rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: bold; }
        
        .planHeader { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
        .planHeader h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .price { font-size: 2.5rem; font-weight: bold; color: var(--text); }
        .price span { font-size: 1rem; color: var(--muted); font-weight: normal; }
        
        .planFeatures { list-style: none; padding: 0; margin: 0 0 2.5rem 0; flex: 1; }
        .planFeatures li { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; color: var(--text); font-weight: 500; }
        .planFeatures li.disabled { color: var(--faint); text-decoration: line-through; }
        .activeIcon { color: var(--accent); }
        
        .primaryButton, .secondaryButton { width: 100%; padding: 1rem; border-radius: 0.75rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
        .primaryButton { background: var(--accent); color: white; border: none; }
        .primaryButton:hover { filter: brightness(1.1); transform: scale(1.02); }
        .secondaryButton { background: var(--faint); color: var(--text); border: none; }
      `}</style>
    </div>
  );
};
