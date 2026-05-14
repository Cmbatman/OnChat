"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import { UserPlus, UserMinus, Check, X, Clock, User as UserIcon } from "lucide-react";
import { displayAvatarUrl } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";

export const FriendsList: React.FC = () => {
  const { 
    friends, 
    authUser, 
    acceptFriendRequest, 
    removeFriend, 
    startRandomChat 
  } = useApp();

  const pendingRequests = friends.filter(f => f.status === "pending" && f.friend_id === authUser?.id);
  const sentRequests = friends.filter(f => f.status === "pending" && f.user_id === authUser?.id);
  const acceptedFriends = friends.filter(f => f.status === "accepted");

  const getFriendProfile = (f: any) => {
    return f.user_id === authUser?.id ? f.friend_profile : f.user_profile;
  };

  return (
    <div className="friendsPage">
      <header className="pageHeader">
        <UserPlus className="headerIcon" />
        <div>
          <h2>Social Network</h2>
          <p>Connect with people you've met and grow your circle.</p>
        </div>
      </header>

      <section className="friendsGrid">
        <div className="friendsCol">
          <div className="sectionLabel">
            <Clock size={16} />
            <span>Pending Requests ({pendingRequests.length})</span>
          </div>
          <div className="requestsList">
            <AnimatePresence mode="popLayout">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(req => {
                  const profile = getFriendProfile(req);
                  return (
                    <motion.div 
                      key={req.id} 
                      className="friendCard pending"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <img src={displayAvatarUrl(profile)} alt="" className="avatar" />
                      <div className="info">
                        <strong>{profile?.username || "Unknown User"}</strong>
                        <span>wants to be friends</span>
                      </div>
                      <div className="actions">
                        <button 
                          className="btn-accept" 
                          onClick={() => acceptFriendRequest(req.id)}
                          title="Accept"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className="btn-decline" 
                          onClick={() => removeFriend(profile?.id || "")}
                          title="Decline"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="emptyHint">No incoming requests</p>
              )}
            </AnimatePresence>
          </div>

          <div className="sectionLabel mt-xl">
            <span>Sent Requests ({sentRequests.length})</span>
          </div>
          <div className="requestsList">
            {sentRequests.map(req => {
              const profile = getFriendProfile(req);
              return (
                <div key={req.id} className="friendCard sent">
                  <img src={displayAvatarUrl(profile)} alt="" className="avatar" />
                  <div className="info">
                    <strong>{profile?.username}</strong>
                    <span>Waiting for response</span>
                  </div>
                  <button className="btn-cancel" onClick={() => removeFriend(profile?.id || "")}>
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="friendsCol">
          <div className="sectionLabel">
            <UserIcon size={16} />
            <span>My Friends ({acceptedFriends.length})</span>
          </div>
          <div className="acceptedList">
            <AnimatePresence mode="popLayout">
              {acceptedFriends.length > 0 ? (
                acceptedFriends.map(friend => {
                  const profile = getFriendProfile(friend);
                  return (
                    <motion.div 
                      key={friend.id} 
                      className="friendCard accepted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <img src={displayAvatarUrl(profile)} alt="" className="avatar" />
                      <div className="info">
                        <strong>{profile?.username}</strong>
                        <span className="status online">Online</span>
                      </div>
                      <div className="actions">
                        <button 
                          className="btn-chat" 
                          onClick={() => startRandomChat(profile)}
                        >
                          Chat
                        </button>
                        <button 
                          className="btn-remove" 
                          onClick={() => removeFriend(profile?.id || "")}
                          title="Remove Friend"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="emptyStateSmall">
                  <p>You haven't added any friends yet.</p>
                  <span>Start chatting and add people you vibe with!</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="sectionLabel mt-xl">
            <X size={16} className="text-danger" />
            <span>Blocked Users ({friends.filter(f => f.status === "blocked").length})</span>
          </div>
          <div className="blockedList">
            {friends.filter(f => f.status === "blocked").map(block => {
              const profile = getFriendProfile(block);
              return (
                <div key={block.id} className="friendCard blocked">
                  <img src={displayAvatarUrl(profile)} alt="" className="avatar grayscale" />
                  <div className="info">
                    <strong>{profile?.username}</strong>
                    <span>Blocked</span>
                  </div>
                  <button className="btn-unblock" onClick={() => removeFriend(profile?.id || "")}>
                    Unblock
                  </button>
                </div>
              );
            })}
            {friends.filter(f => f.status === "blocked").length === 0 && (
              <p className="emptyHint">No blocked users</p>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .friendsPage {
          padding: 2rem;
          height: 100%;
          overflow-y: auto;
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
        .friendsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 900px) {
          .friendsGrid {
            grid-template-columns: 1fr;
          }
        }
        .sectionLabel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .mt-xl { margin-top: 2.5rem; }
        .requestsList, .acceptedList {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .friendCard {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1rem;
          transition: all 0.2s ease;
        }
        .friendCard:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
        }
        .avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          object-fit: cover;
          background: var(--faint);
        }
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .info strong {
          font-size: 1rem;
          color: var(--text);
        }
        .info span {
          font-size: 0.8rem;
          color: var(--muted);
        }
        .status.online {
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .status.online::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-accept, .btn-decline, .btn-remove {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-accept { background: var(--success-faint); color: var(--success); }
        .btn-accept:hover { background: var(--success); color: white; }
        .btn-decline, .btn-remove { background: var(--danger-faint); color: var(--danger); }
        .btn-decline:hover, .btn-remove:hover { background: var(--danger); color: white; }
        .btn-chat {
          padding: 0.5rem 1rem;
          background: var(--accent);
          color: white;
          border-radius: 0.75rem;
          border: none;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-chat:hover { opacity: 0.9; }
        .btn-cancel, .btn-unblock {
          font-size: 0.8rem;
          color: var(--danger);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-unblock:hover {
          text-decoration: underline;
        }
        .avatar.grayscale {
          filter: grayscale(1);
          opacity: 0.5;
        }
        .text-danger {
          color: var(--danger);
        }
        .blockedList {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .emptyHint {
          padding: 1.5rem;
          text-align: center;
          color: var(--faint);
          font-size: 0.9rem;
          border: 1px dashed var(--border);
          border-radius: 1rem;
        }
        .emptyStateSmall {
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--faint);
          border-radius: 1.5rem;
        }
        .emptyStateSmall p {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .emptyStateSmall span {
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
};
