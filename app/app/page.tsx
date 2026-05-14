"use client";

import React, { useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import Sidebar from "@/components/chat/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { RoomsManager } from "@/components/chat/RoomsManager";
import { Lobby } from "@/components/chat/Lobby";
import { FriendsList } from "@/components/social/FriendsList";
import { DiscoverSection } from "@/components/social/DiscoverSection";
import { AdminPanel } from "@/components/social/AdminPanel";
import { PremiumSection } from "@/components/chat/PremiumSection";
import { MobileNav } from "@/components/chat/MobileNav";
import { BrandLogo, SvgIcon } from "@/components/chat/UI";
import { 
  UsersRound, 
  Search, 
  MessageSquare, 
  UserPlus, 
  Crown, 
  Settings, 
  Ban, 
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { displayAvatarUrl, countryFlag } from "@/lib/helpers";

export default function AppPage() {
  const {
    session,
    tab,
    setTab,
    status,
    warning,
    isSupabaseConfigured,
    chat,
    chatStatus,
    logout,
    accountMode,
    showAuthNotice,
    themeMode,
    toggleTheme,
    onlineUsers,
    filteredUsers,
    chatHistory,
    setBlockedIds,
    setChat,
    setMessages,
    setChatStatus,
    startRandomChat,
    setQuery,
    setFilterGender,
    setSearchCountry,
    setSearchState,
    setSearchVibe,
    setMinAge,
    setMaxAge,
    genders,
    profileDraft,
    updateProfileField,
    saveProfilePreview,
    registeredFeatures,
    moreAboutFields,
    moreAboutOptions,
    gender,
    setGender,
    friends,
    recentConnections,
    acceptFriendRequest,
    removeFriend,
    isPremium,
    isAdmin,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Close sidebar on tab change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [tab]);

  // Redirect to landing if no session
  // In a real app, this would be handled by middleware or a higher-level wrapper
  if (!session) {
    return (
      <div className="loadingScreen">
        <BrandLogo />
        <p>Connecting to OnChat...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case "profile":
        return (
          <div className="profilePage">
            <section className="profileHeader">
              <div className="profileAvatarWrap">
                <img alt="" src={displayAvatarUrl(session)} />
                <button className="avatarEdit" type="button">Change Photo</button>
              </div>
              <div className="profileSummary">
                <h2>{session.username}</h2>
                <p>{session.age} • {countryFlag(session.country)} {session.country}</p>
                <div className="profileBadges">
                  {accountMode === "registered" && <span className="badge verified">Registered</span>}
                  {isPremium && <span className="badge premium">Premium</span>}
                </div>
              </div>
              <div className="profileCompleteness">
                <div className="completenessInfo">
                  <span>Profile Completeness</span>
                  <strong>{Math.round((Object.values(profileDraft).filter(v => v !== "").length / Object.keys(profileDraft).length) * 100)}%</strong>
                </div>
                <div className="progressBar">
                  <motion.div 
                    className="progressFill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((Object.values(profileDraft).filter(v => v !== "").length / Object.keys(profileDraft).length) * 100)}%` }}
                  />
                </div>
              </div>
            </section>

            <section className="profileGrid">
              <article className="profilePanel">
                <div className="panelHeader">
                  <h3>Identity</h3>
                </div>
                <div className="profileGenderEdit" aria-label="Gender identity">
                  {genders.map((item) => (
                    <button
                      className={`genderCard ${item.value} ${gender === item.value ? "selected" : ""}`}
                      key={item.value}
                      onClick={() => setGender(item.value)}
                      type="button"
                    >
                      <SvgIcon name={item.value === "man" ? "man" : item.value === "woman" ? "woman" : "other"} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </article>

              <article className="profilePanel">
                <div className="panelHeader">
                  <h3>About Me</h3>
                  <button onClick={saveProfilePreview} type="button">Update profile</button>
                </div>
                <label className="field">
                  <span>Status message</span>
                  <input value={profileDraft.statusMessage} onChange={(event) => updateProfileField("statusMessage", event.target.value)} placeholder="Available" />
                </label>
                <label className="field">
                  <span>Bio</span>
                  <textarea value={profileDraft.bio} onChange={(event) => updateProfileField("bio", event.target.value)} placeholder="Tell people a little about you..." />
                </label>
              </article>

              <article className="profilePanel">
                <div className="panelHeader">
                  <h3>Registered unlocks</h3>
                  <button onClick={accountMode === "registered" ? saveProfilePreview : () => showAuthNotice("registered")} type="button">
                    {accountMode === "registered" ? "Save" : "Register"}
                  </button>
                </div>
                <div className="pillCloud">
                  {registeredFeatures.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
              </article>
            </section>
          </div>
        );
      case "rooms":
        return <RoomsManager />;
      case "online":
        return (
          <div className="onlinePage">
            <section className="welcomeHero">
              <UsersRound aria-hidden="true" />
              <h3>Browse Online Community</h3>
              <p>Discover real people online right now from all over the world.</p>
            </section>
            <div className="searchResults">
              {onlineUsers.length ? (
                onlineUsers.map((user) => (
                  <button className={`userRow ${user.gender}`} key={user.id} onClick={() => startRandomChat(user)} type="button">
                    <img alt="" src={displayAvatarUrl(user)} />
                    <div className="userIdentity">
                      <strong>{user.username}</strong>
                      <span>{user.age} • {user.state || "State hidden"}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="emptyState">
                  <p>No one online matching criteria</p>
                </div>
              )}
            </div>
          </div>
        );
      case "random":
      case "chat":
        return <ChatInterface />;
      case "friends":
        return <FriendsList />;
      case "discover":
        return <DiscoverSection />;
      case "premium":
        return <PremiumSection />;
      case "admin":
        return <AdminPanel />;
      case "my_chat":
        return (
          <div className="historyPage">
            <header className="pageHeader">
              <MessageSquare className="headerIcon" />
              <div>
                <h2>Chat History</h2>
                <p>Pick up where you left off with recent connections.</p>
              </div>
            </header>

            <section className="historyGrid">
              <div className="historyCol">
                <div className="sectionLabel">
                  <span>Registered Connections ({recentConnections.length})</span>
                </div>
                <div className="connectionsList">
                  {recentConnections.length > 0 ? (
                    recentConnections.map((conn) => (
                      <button 
                        key={conn.id} 
                        className="connectionRow"
                        onClick={() => startRandomChat(conn.profile)}
                      >
                        <img src={displayAvatarUrl(conn.profile)} alt="" className="avatar" />
                        <div className="info">
                          <strong>{conn.profile?.username}</strong>
                          <span>Last talked: {new Date(conn.last_met_at).toLocaleDateString()}</span>
                        </div>
                        <ChevronRight size={18} className="arrow" />
                      </button>
                    ))
                  ) : (
                    <p className="emptyHint">No registered connections yet.</p>
                  )}
                </div>
              </div>

              <div className="historyCol">
                <div className="sectionLabel">
                  <span>Guest Chat History ({chatHistory.length})</span>
                </div>
                <div className="historyList">
                  {chatHistory.length ? (
                    chatHistory.map((item) => (
                      <button 
                        key={item.chat.id} 
                        className="historyRow"
                        onClick={() => {
                          setChat(item.chat);
                          setMessages(item.messages);
                          setChatStatus(item.chat.status === "active" ? "active" : "waiting");
                          setTab("random");
                        }}
                      >
                        <img src={displayAvatarUrl(item.partner)} alt="" className="avatar" />
                        <div className="info">
                          <strong>{item.partner?.username || "Guest"}</strong>
                          <p className="preview">{item.lastMessage}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="emptyHint">No session history.</p>
                  )}
                </div>
              </div>
            </section>

            <style jsx>{`
              .historyPage { padding: 2rem; height: 100%; overflow-y: auto; }
              .pageHeader { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
              .headerIcon { width: 3.5rem; height: 3.5rem; padding: 0.75rem; background: var(--accent-faint); color: var(--accent); border-radius: 1rem; }
              .historyGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
              @media (max-width: 900px) { .historyGrid { grid-template-columns: 1fr; } }
              .sectionLabel { font-size: 0.85rem; font-weight: 600; color: var(--muted); text-transform: uppercase; margin-bottom: 1rem; }
              .connectionsList, .historyList { display: flex; flex-direction: column; gap: 0.75rem; }
              .connectionRow, .historyRow { 
                display: flex; align-items: center; gap: 1rem; padding: 1rem; 
                background: var(--panel-bg); border: 1px solid var(--border); border-radius: 1rem;
                text-align: left; transition: all 0.2s; cursor: pointer;
              }
              .connectionRow:hover, .historyRow:hover { border-color: var(--accent); transform: translateX(4px); }
              .avatar { width: 3rem; height: 3rem; border-radius: 50%; background: var(--faint); }
              .info { flex: 1; min-width: 0; }
              .info strong { display: block; color: var(--text); }
              .info span, .info p { font-size: 0.8rem; color: var(--muted); }
              .preview { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
              .emptyHint { padding: 1.5rem; text-align: center; color: var(--faint); border: 1px dashed var(--border); border-radius: 1rem; }
              .arrow { color: var(--faint); }
            `}</style>
          </div>
        );
      default:
        return <Lobby />;
    }
  };

  return (
    <main className={`appMain theme-${themeMode}`}>
      <nav className="sideNav">
        <BrandLogo />
        <div className="navLinks">
          <button className={tab === "lobby" ? "active" : ""} onClick={() => setTab("lobby")} title="Lobby">
            <MessageSquare />
          </button>
          <button className={tab === "online" ? "active" : ""} onClick={() => setTab("online")} title="Online">
            <UsersRound />
          </button>
          <button className={tab === "rooms" ? "active" : ""} onClick={() => setTab("rooms")} title="Rooms">
            <SvgIcon name="rooms" />
          </button>
          <button className={tab === "friends" ? "active" : ""} onClick={() => setTab("friends")} title="Friends">
            <UserPlus />
          </button>
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")} title="Discover">
            <Sparkles />
          </button>
          <button className={tab === "my_chat" ? "active" : ""} onClick={() => setTab("my_chat")} title="History">
            <MessageSquare />
          </button>
          <button className={tab === "premium" ? "active" : ""} onClick={() => setTab("premium")} title="Premium">
            <Crown />
          </button>
          {isAdmin && (
            <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")} title="Admin">
              <Shield size={24} />
            </button>
          )}
        </div>
        <div className="navBottom">
          <button onClick={() => setTab("profile")} title="Profile">
            <User />
          </button>
          <button onClick={() => setTab("settings")} title="Settings">
            <Settings />
          </button>
          <button className="logoutBtn" onClick={logout} title="Logout">
            <LogOut />
          </button>
        </div>
      </nav>

      <section className="appContent">
        <button 
          className="mobileSidebarToggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle online users"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`sidebarWrapper ${isSidebarOpen ? "open" : ""}`}>
          <Sidebar />
        </div>

        <section className="mainStage">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            {renderContent()}
          </motion.div>
        </section>
      </section>

      <MobileNav />

      {(status || warning) && (
        <div className="toast">
          {warning ? <strong>{warning}</strong> : null}
          {status ? <span>{status}</span> : null}
          {!isSupabaseConfigured && <span>Live Supabase connection is unavailable.</span>}
        </div>
      )}
    </main>
  );
}
