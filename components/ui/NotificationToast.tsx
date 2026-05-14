"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, UserPlus, CheckCircle } from "lucide-react";
import { useApp } from "@/lib/AppContext";

export const NotificationToast: React.FC = () => {
    const { notifications, removeNotification, clearNotifications } = useApp();
  
    return (
      <div className="notificationContainer">
        <AnimatePresence>
          {notifications.length > 1 && (
            <motion.button
              className="clearAll"
              onClick={clearNotifications}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              Clear All
            </motion.button>
          )}
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              className={`toast notif-${notif.type}`}
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <div className="icon">
                {notif.type === "friend_request" ? <UserPlus size={18} /> : <CheckCircle size={18} />}
              </div>
              <div className="content">
                <p>{notif.message}</p>
              </div>
              <button className="close" onClick={() => removeNotification(notif.id)}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
  
        <style jsx>{`
          .notificationContainer {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column-reverse;
            gap: 0.75rem;
            z-index: 9999;
            pointer-events: none;
          }
          .clearAll {
            pointer-events: auto;
            align-self: flex-end;
            background: var(--panel-bg);
            border: 1px solid var(--border);
            color: var(--muted);
            padding: 0.4rem 0.8rem;
            border-radius: 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 0.5rem;
          }
          .clearAll:hover {
            border-color: var(--accent);
            color: var(--accent);
          }
          .toast {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1rem;
          box-shadow: 0 8px 32px var(--shadow);
          min-width: 280px;
          backdrop-filter: blur(8px);
        }
        .icon {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--accent-faint);
          color: var(--accent);
        }
        .notif-friend_accepted .icon {
          background: var(--success-faint);
          color: var(--success);
        }
        .content {
          flex: 1;
        }
        .content p {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .close {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close:hover {
          color: var(--text);
        }
      `}</style>
    </div>
  );
};
