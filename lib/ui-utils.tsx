import React from "react";

export type Gender = "man" | "woman" | "non_binary";

export function defaultAvatarUrl(gender: Gender) {
  const map: Record<Gender, string> = {
    man: "/default_man.png",
    woman: "/default_woman.png",
    non_binary: "/default_non_binary.png",
  };
  return map[gender];
}

export type SvgIconName = "moon" | "sun" | "user" | "users" | "send" | "login" | "register" | "bot" | "bolt" | "devices" | "bell" | "eye" | "shield" | "man" | "woman" | "other";

export function SvgIcon({ name, className = "" }: { name: SvgIconName; className?: string }) {
  if (name === "moon") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "sun") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.95-6.95 1.4-1.4M3.65 20.35l1.4-1.4m0-13.9-1.4-1.4m16.7 16.7-1.4-1.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.4a4 4 0 1 0 0 5.2M15 21H3v-1a6 6 0 0 1 12 0v1Zm0 0h6v-1a6 6 0 0 0-9-5.2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "send") {
    return (
      <svg className={`svgIcon ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    );
  }
  if (name === "login") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m11 16-4-4m0 0 4-4m-4 4h14m-5 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "register") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 20a6 6 0 0 1 12 0v1H3v-1Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "bot") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6V3m-6 8a6 6 0 0 1 12 0v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-5Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M9 13h.01M15 13h.01M10 17h4M5 11H3m18 0h-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg className={`svgIcon ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
      </svg>
    );
  }
  if (name === "devices") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h11a2 2 0 0 1 2 2v8H2V7a2 2 0 0 1 2-2Zm-2 10h15v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2Zm17-4h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "bell") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 17H9m9-5a6 6 0 0 0-12 0c0 2.7-1 4-2 5h16c-1-1-2-2.3-2-5ZM10 20a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "man") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M17 5h4V1m0 4-4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "woman") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Zm0 6v3m-2-1.5h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "other") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Zm0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={`svgIcon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
