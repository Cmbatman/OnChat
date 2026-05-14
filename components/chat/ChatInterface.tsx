"use client";

import React, { useRef, useEffect } from "react";
import { MessageCircle, MessagesSquare, UsersRound, Crown, Rocket } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { GenderIcon } from "@/components/chat/UI";
import { displayAvatarUrl, countryFlag, userVibe } from "@/lib/helpers";

export const ChatInterface: React.FC = () => {
  const {
    session,
    chat,
    messages,
    chatStatus,
    activePartner,
    messageText,
    setMessageText,
    sendMessage,
    startRandomChat,
    leaveChat,
    blockPartner,
    reportPartner,
    reportOpen,
    setReportOpen,
    handleInviteToRoom,
    rooms,
    setActiveRoom,
    setTab,
    selectedAccentGender,
    genders,
    accountMode,
    setStatus,
    friends,
    sendFriendRequest,
  } = useApp();

  const messagesPaneRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesPaneRef.current) {
      messagesPaneRef.current.scrollTop = messagesPaneRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(e);
  };

  return (
    <div className={`chatCard ${selectedAccentGender}`}>
      <div className={`chatTop ${selectedAccentGender}`}>
        <div className="chatTitle">
          <img alt="" src={displayAvatarUrl(activePartner ?? session)} />
          <div>
            <strong className="userNameLine">
              {activePartner ? activePartner.username : chatStatus === "waiting" ? "Waiting for match" : "Start a random chat"}
              <span className={`statusDot ${chatStatus}`} />
            </strong>
            {activePartner ? (
              <p className="chatMetaLine">
                <span>{activePartner.age}</span>
                <span>{countryFlag(activePartner.country)} {activePartner.country}</span>
                <span>{activePartner.state ?? "State hidden"}</span>
                <span>{userVibe(activePartner)}</span>
                <span className={`genderChip ${activePartner.gender}`}>
                  <GenderIcon gender={activePartner.gender} />
                  {genders.find((item) => item.value === activePartner.gender)?.label}
                </span>
              </p>
            ) : (
              <p>Messages disappear when the chat ends.</p>
            )}
          </div>
        </div>
        <div className="chatActions">
          <button className="nextRandomAction" onClick={() => startRandomChat()} type="button">Next Random User</button>
          <button onClick={() => startRandomChat()} type="button">Skip</button>
          <button onClick={blockPartner} disabled={!activePartner} type="button">Block</button>
          <button onClick={() => setReportOpen(!reportOpen)} disabled={!activePartner} type="button">Report</button>
          {activePartner && activePartner.id.length > 20 && !friends.some(f => (f.user_id === session?.id && f.friend_id === activePartner.id) || (f.friend_id === session?.id && f.user_id === activePartner.id)) && (
            <button className="friendAction" onClick={() => sendFriendRequest(activePartner.id)} type="button">
              Add Friend
            </button>
          )}
          {messages.length >= 15 && (
            <button className="primaryButton" onClick={handleInviteToRoom} type="button">
              Invite to Room
            </button>
          )}
          <button onClick={() => leaveChat()} disabled={!chat} type="button">Leave Chat</button>
        </div>
      </div>

      {reportOpen && (
        <div className="reportPanel">
          {["harassment", "sexual_content", "hate", "spam", "underage", "other"].map((category) => (
            <button key={category} onClick={() => reportPartner(category)} type="button">
              {category.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <div className="messagesPane" ref={messagesPaneRef}>
        {!chat ? (
          <div className="emptyState">
            <h3>Start the conversation. Say hello.</h3>
            <p>Start random matching or choose someone from Online Users.</p>
            <button className="primaryButton" onClick={() => startRandomChat()} type="button">
              Start Random Chat
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="emptyState">
            <h3>Start the conversation. Say hello.</h3>
            <p>Your messages and read receipts will appear here during this session.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isInvite = message.body.startsWith("__ROOM_INVITE__:");
            let inviteData = null;
            if (isInvite) {
              try {
                inviteData = JSON.parse(message.body.replace("__ROOM_INVITE__:", ""));
              } catch (e) {
                console.error("Failed to parse invite data", e);
              }
            }

            return (
              <div className={`messageBubble ${message.sender_id === session?.id ? "mine" : ""} ${isInvite ? "invite" : ""}`} key={message.id}>
                {isInvite && inviteData ? (
                  <div className="inviteCard">
                    <div className="inviteHeader">
                      <Crown />
                      <span>Room Invite</span>
                    </div>
                    <h4>{inviteData.name}</h4>
                    <p>Created by {inviteData.creator}</p>
                    <div className="inviteStats">
                      <UsersRound /> {inviteData.members} / {inviteData.max} members
                    </div>
                    {message.sender_id !== session?.id && (
                      <div className="inviteActions">
                        <button className="accept" onClick={() => {
                          const targetRoom = rooms.find(r => r.id === inviteData.id);
                          if (targetRoom) {
                            setActiveRoom(targetRoom);
                            setTab("rooms");
                          } else {
                            setStatus("This room is no longer available.");
                          }
                        }}>
                          Accept
                        </button>
                        <button className="decline" onClick={() => setStatus("Invite declined.")}>
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{message.body}</p>
                )}
                <span>
                  {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {message.sender_id === session?.id ? (message.read_at ? " \u2713\u2713" : " \u2713") : ""}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <div className="emojiPicker" aria-label="Emoji picker">
          {[0x1F642, 0x1F602, 0x1F44D, 0x1F525, 0x1F4AC, 0x2728].map((code) => String.fromCodePoint(code)).map((emoji) => (
            <button key={emoji} onClick={() => setMessageText(`${messageText}${emoji}`)} type="button">
              {emoji}
            </button>
          ))}
        </div>
        <button className="composerTool" disabled={accountMode !== "registered"} title="GIFs unlock for registered users" type="button">GIF</button>
        <button className="composerTool" disabled={messages.length < 2} title="Images unlock after both users engage" type="button">Image</button>
        <input
          ref={messageInputRef}
          disabled={!chat || chatStatus === "waiting"}
          onChange={(event) => setMessageText(event.target.value)}
          placeholder="Type a message..."
          value={messageText}
        />
        <button disabled={!chat || chatStatus === "waiting" || !messageText.trim()} type="submit">Send</button>
      </form>
    </div>
  );
};
