"use client";

import React from "react";
import { UsersRound } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { GenderIcon } from "@/components/chat/UI";
import { displayAvatarUrl, countryFlag } from "@/lib/helpers";
import { Gender } from "@/lib/types";

// Note: helpers like countryFlag and displayAvatarUrl are currently in ClientApp.tsx
// I will move them to a helper file later. For now, I'll assume they are available or stub them.

export default function Sidebar() {
  const {
    session,
    onlineUsers,
    sidebarGender,
    setSidebarGender,
    accountMode,
    startRandomChat // This also needs to be in context or passed as prop
  } = useApp();

  // Filter users by sidebarGender
  const sidebarUsers = onlineUsers.filter((u) => {
    if (sidebarGender === "any") return true;
    return u.gender === sidebarGender;
  });

  const genders: { label: string; value: Gender }[] = [
    { label: "Man", value: "man" },
    { label: "Woman", value: "woman" },
    { label: "Non-binary", value: "non_binary" },
  ];

  if (!session) return null;

  return (
    <aside className="sidebar">
      <div className="sidebarTitle">
        <span>Online Users</span>
      </div>
      <div className="profileBlock">
        <img alt="" src={displayAvatarUrl(session as any)} />
        <div>
          <strong className="userNameLine">{session.username}</strong>
          <span className="userDetailsLine">
            {accountMode === "registered" ? "Registered" : "Guest"} • {session.age} • {session.country}
          </span>
        </div>
      </div>
      <div className="miniStats">
        <strong>{onlineUsers.length}</strong> active users now
      </div>
      <hr className="sidebarDivider" />
      <div className="sidebarGenderSelector" aria-label="Filter online users by gender">
        {(["any", "man", "woman", "non_binary"] as const).map((item) => (
          <button
            className={`${sidebarGender === item ? "active" : ""} filter-${item}`}
            key={item}
            onClick={() => setSidebarGender(item as any)}
            type="button"
          >
            {item === "any" ? <UsersRound aria-hidden="true" /> : <GenderIcon gender={item as Gender} />}
            <span>{item === "any" ? "All" : genders.find((g) => g.value === item)?.label}</span>
          </button>
        ))}
      </div>
      <div className="sideUsers">
        {sidebarUsers.slice(0, 25).map((user) => (
          <button className={`sideUser ${user.gender}`} key={user.id} onClick={() => startRandomChat(user)} type="button">
            <img alt="" src={displayAvatarUrl(user as any)} />
            <div className="sideInfo">
              <div className="sideTopLine">
                <strong className="userNameLine">
                  {user.username}
                </strong>
              </div>
              <div className="sideDetailLine">
                <GenderIcon gender={user.gender as Gender} />
                <span>{user.age} • {user.state || "State hidden"}</span>
              </div>
            </div>
            <div className="sideMeta">
              <span className="sideFlag">{countryFlag(user.country)}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
