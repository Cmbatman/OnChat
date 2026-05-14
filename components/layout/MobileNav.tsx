"use client";

import React from "react";
import { UsersRound, Search, MessagesSquare, Rocket, Crown, Settings } from "lucide-react";
import { Tab } from "@/lib/types";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: "online" as Tab, label: "Online", icon: UsersRound },
    { id: "rooms" as Tab, label: "Rooms", icon: MessagesSquare },
    { id: "random" as Tab, label: "Match", icon: Rocket },
    { id: "search" as Tab, label: "Search", icon: Search },
    { id: "premium" as Tab, label: "VIP", icon: Crown },
  ];

  return (
    <nav className="mobileNav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
