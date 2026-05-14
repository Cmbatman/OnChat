"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { Sparkles, UserPlus, RefreshCw, MapPin } from "lucide-react";
import { displayAvatarUrl } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { RegisteredProfileRow } from "@/lib/types";

export const DiscoverSection: React.FC = () => {
  const { discoverUsers, sendFriendRequest, friends } = useApp();
  const [users, setUsers] = useState<RegisteredProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDiscovery = async () => {
    setLoading(true);
    const results = await discoverUsers();
    setUsers(results);
    setLoading(false);
  };

  useEffect(() => {
    loadDiscovery();
  }, []);

  const isAlreadySent = (targetId: string) => {
    return friends.some(f => f.friend_id === targetId && f.status === 'pending');
  };

  return (
    <div className="discoverPage">
      <header className="pageHeader">
        <Sparkles className="headerIcon" />
        <div>
          <h2>Discover People</h2>
          <p>Find new connections who share your vibes.</p>
        </div>
        <button className="refreshBtn" onClick={loadDiscovery} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </header>

      <div className="discoverGrid">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeletonCard" />
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <motion.div
                key={user.user_id}
                className="discoverCard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
              >
                <div className="cardMedia">
                  <img src={displayAvatarUrl(user)} alt="" className="discoverAvatar" />
                  <div className="vibeTag">{user.zodiac || "Friendly"}</div>
                </div>
                <div className="cardBody">
                  <div className="nameRow">
                    <h3>{user.username}</h3>
                    <span className="age">{user.age}</span>
                  </div>
                  <div className="location">
                    <MapPin size={12} />
                    <span>{user.country}{user.state ? `, ${user.state}` : ""}</span>
                  </div>
                  <p className="bio">{user.bio || "Just joined OnChat! Say hi."}</p>
                  
                  <button 
                    className="addBtn"
                    onClick={() => sendFriendRequest(user.user_id)}
                    disabled={isAlreadySent(user.user_id)}
                  >
                    {isAlreadySent(user.user_id) ? "Request Sent" : (
                      <>
                        <UserPlus size={16} />
                        <span>Add Friend</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="emptyDiscovery">
              <p>No new people found right now. Check back later!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .discoverPage {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .pageHeader {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .headerIcon {
          width: 3.5rem;
          height: 3.5rem;
          padding: 0.75rem;
          background: var(--accent-faint);
          color: var(--accent);
          border-radius: 1rem;
        }
        .refreshBtn {
          margin-left: auto;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          color: var(--text);
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .refreshBtn:hover {
          background: var(--faint);
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .discoverGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .discoverCard {
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .discoverCard:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
        }

        .cardMedia {
          position: relative;
          height: 200px;
          background: var(--faint);
        }
        .discoverAvatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vibeTag {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          padding: 0.25rem 0.75rem;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          color: white;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .cardBody {
          padding: 1.25rem;
        }
        .nameRow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .nameRow h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .age {
          font-size: 0.9rem;
          color: var(--muted);
        }
        .location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .bio {
          font-size: 0.85rem;
          line-height: 1.4;
          color: var(--text);
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .addBtn {
          width: 100%;
          padding: 0.75rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .addBtn:hover { opacity: 0.9; }
        .addBtn:disabled {
          background: var(--faint);
          color: var(--muted);
          cursor: not-allowed;
        }

        .skeletonCard {
          height: 380px;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

        .emptyDiscovery {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
};
