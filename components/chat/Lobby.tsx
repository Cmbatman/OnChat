"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, UserRoundX, Globe2, Rocket, UsersRound, MessagesSquare, Gamepad2, GraduationCap } from "lucide-react";
import { useApp } from "@/lib/AppContext";

export const Lobby: React.FC = () => {
  const { session, startRandomChat, setTab } = useApp();

  return (
    <div className="lobbyPage">
      <section className="welcomeBlock">
        <h2>Welcome <span>{session?.username}</span> among us!</h2>
        <p>Join the conversation and start making new friends today.</p>
      </section>
      <section className="lobbyCard">
        <div>
          <h3><span>OnChat</span> is the best place to find new people...</h3>
          <div className="lobbyPoints">
            <p><CheckCircle2 aria-hidden="true" /><strong>Totally Free</strong><small>No subscriptions, no hidden fees. Just chat.</small></p>
            <p><ShieldCheck aria-hidden="true" /><strong>Secure & Safe</strong><small>Realtime chat with moderation and reporting controls.</small></p>
            <p><UserRoundX aria-hidden="true" /><strong>No Registration Required</strong><small>Jump straight into anonymous chats.</small></p>
            <p><Globe2 aria-hidden="true" /><strong>Global Community</strong><small>Connect with people from different countries and states.</small></p>
          </div>
          <div className="lobbyActions">
            <button className="primaryButton" onClick={() => startRandomChat()} type="button">
              <Rocket aria-hidden="true" />
              Random Match
            </button>
            <button className="quietAction" onClick={() => setTab("online")} type="button">
              <UsersRound aria-hidden="true" />
              Online Users
            </button>
          </div>
        </div>
        <MessagesSquare className="lobbyGhost" aria-hidden="true" />
      </section>
      <section className="lobbyTiles">
        <article><UsersRound aria-hidden="true" /><h3>Social Rooms</h3><p>Hang out and talk about anything.</p></article>
        <article><Gamepad2 aria-hidden="true" /><h3>Gaming Hub</h3><p>Find teammates for your next raid.</p></article>
        <article><GraduationCap aria-hidden="true" /><h3>Learning Lab</h3><p>Practice languages and share skills.</p></article>
      </section>
      <footer className="appFooter">
        <div><strong>Chat Rooms</strong><span>Global Lobby</span><span>India Rooms</span><span>Teen Chat</span></div>
        <div><strong>Company</strong><span>About Us</span><span>Safety Center</span><span>Blog</span></div>
        <div><strong>Support</strong><span>Contact</span><span>FAQ</span><span>Help Center</span></div>
        <div><strong>Legal</strong><span>Terms of Service</span><span>Privacy Policy</span><span>Cookie Policy</span></div>
      </footer>
    </div>
  );
};
