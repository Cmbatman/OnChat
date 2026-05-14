"use client";

import React from "react";
import { User, Users, UserPlus, UserMinus, UserX, Rocket, Search, MessageCircle, Gamepad2, Settings, Crown, MessagesSquare, CircleSlash, Bot, LogIn, UserCircle } from "lucide-react";
import { Gender } from "@/lib/types";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brandLogo ${compact ? "compact" : ""}`}>
      <div className="logoMark">
        <Rocket />
      </div>
      {!compact && <span className="logoText">OnChat</span>}
    </div>
  );
}

export function GenderIcon({ gender }: { gender: Gender | "any" }) {
  if (gender === "man") return <User className="gender-man" />;
  if (gender === "woman") return <User className="gender-woman" />;
  if (gender === "non_binary") return <User className="gender-non-binary" />;
  return <Users className="gender-any" />;
}

export function SvgIcon({ name }: { name: string }) {
  // Map icon names to Lucide icons
  const icons: Record<string, React.ElementType> = {
    user: User,
    users: Users,
    rocket: Rocket,
    search: Search,
    message: MessageCircle,
    game: Gamepad2,
    settings: Settings,
    crown: Crown,
    chat: MessagesSquare,
    block: CircleSlash,
    bot: Bot,
    login: LogIn,
    register: UserPlus,
    bell: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    eye: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    moon: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    sun: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    send: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  };

  const IconComponent = icons[name] || UserCircle;
  return <IconComponent className="icon" size={20} />;
}
