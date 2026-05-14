"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import { 
  MessageSquare, 
  UsersRound, 
  Search, 
  Crown, 
  User 
} from "lucide-react";
import { SvgIcon } from "./UI";

export function MobileNav() {
  const { tab, setTab } = useApp();

  return (
    <nav className="mobileNav">
      <button 
        className={tab === "lobby" ? "active" : ""} 
        onClick={() => setTab("lobby")}
      >
        <MessageSquare size={20} />
        <span>Chat</span>
      </button>
      <button 
        className={tab === "online" ? "active" : ""} 
        onClick={() => setTab("online")}
      >
        <UsersRound size={20} />
        <span>Online</span>
      </button>
      <button 
        className={tab === "rooms" ? "active" : ""} 
        onClick={() => setTab("rooms")}
      >
        <SvgIcon name="rooms" />
        <span>Rooms</span>
      </button>
      <button 
        className={tab === "premium" ? "active" : ""} 
        onClick={() => setTab("premium")}
      >
        <Crown size={20} />
        <span>Pro</span>
      </button>
      <button 
        className={tab === "profile" ? "active" : ""} 
        onClick={() => setTab("profile")}
      >
        <User size={20} />
        <span>Me</span>
      </button>
    </nav>
  );
}
