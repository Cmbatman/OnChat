"use client";

import React from "react";
import { 
  UsersRound, Search, MessagesSquare, Rocket, Crown, 
  Settings, UserCircle, MessageCircle, Ban, LogOut,
  Globe2, ShieldCheck, Heart, Sparkles, Bell, Bot, Gamepad2
} from "lucide-react";
import { Tab, AccountMode } from "@/lib/types";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  accountMode: AccountMode;
  onLogout: () => void;
  username: string;
  isPremium?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  accountMode, 
  onLogout, 
  username,
  isPremium,
  isOpen,
  onClose
}: SidebarProps) {
  
  const mainLinks = [
    { id: "online" as Tab, label: "Community", icon: UsersRound },
    { id: "rooms" as Tab, label: "Chat Rooms", icon: MessagesSquare },
    { id: "ai_chat" as Tab, label: "AI Assistant", icon: Bot },
    { id: "random" as Tab, label: "Random Match", icon: Rocket },
    { id: "search" as Tab, label: "Find People", icon: Search },
    { id: "my_chat" as Tab, label: "My Chats", icon: MessageCircle },
    { id: "games" as Tab, label: "Games", icon: Gamepad2 },
  ];

  const socialLinks = [
    { id: "friends" as Tab, label: "Friends", icon: Heart },
    { id: "blocked" as Tab, label: "Blocked", icon: Ban },
  ];

  const systemLinks = [
    { id: "premium" as Tab, label: "Premium VIP", icon: Crown, premium: true },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`sideNav ${isOpen ? "open" : ""}`}>
      <div className="userBrief">
        <div className="userAvatar">
          <UserCircle size={40} />
          {isPremium && <Crown className="premiumCrown" size={16} />}
        </div>
        <div className="userInfo">
          <strong>{username}</strong>
          <span>{accountMode === "registered" ? "Registered Member" : "Guest User"}</span>
        </div>
      </div>

      <div className="navLinks">
        <div className="navSection">
          <small>Main</small>
          {mainLinks.map(link => (
            <button 
              key={link.id}
              className={activeTab === link.id ? "active" : ""}
              onClick={() => onTabChange(link.id)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        <div className="navSection">
          <small>Social</small>
          {socialLinks.map(link => (
            <button 
              key={link.id}
              className={activeTab === link.id ? "active" : ""}
              onClick={() => onTabChange(link.id)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        <div className="navSection">
          <small>System</small>
          {systemLinks.map(link => (
            <button 
              key={link.id}
              className={`${activeTab === link.id ? "active" : ""} ${link.premium ? "premiumLink" : ""}`}
              onClick={() => onTabChange(link.id)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="navBottom">
        <button className="btn-premium btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onLogout}>
          <LogOut size={20} />
          <span>{accountMode === "registered" ? "Sign Out" : "Exit Session"}</span>
        </button>
      </div>
    </aside>
  );
}
