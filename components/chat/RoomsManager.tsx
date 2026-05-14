"use client";

import React, { useRef, useEffect } from "react";
import { UsersRound, Rocket, MessageCircle, PlusCircle, Crown, Search, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/AppContext";

export const RoomsManager: React.FC = () => {
  const {
    session,
    authUser,
    isPremium,
    activeRoom,
    setActiveRoom,
    roomMessages,
    roomMessageText,
    setRoomMessageText,
    sendRoomMessage,
    roomSearchQuery,
    setRoomSearchQuery,
    filteredRooms,
    createRoomModalOpen,
    setCreateRoomModalOpen,
    handleCreateRoom,
    showAuthNotice,
    setIsPremium,
    setStatus,
  } = useApp();

  const roomMessagesPaneRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of room messages
  useEffect(() => {
    if (roomMessagesPaneRef.current) {
      roomMessagesPaneRef.current.scrollTop = roomMessagesPaneRef.current.scrollHeight;
    }
  }, [roomMessages]);

  if (activeRoom) {
    return (
      <div className="activeRoomView">
        <div className="roomHeader">
          <button className="backAction" onClick={() => setActiveRoom(null)} type="button">
            <Rocket style={{ transform: "rotate(-90deg)" }} /> Back to Rooms
          </button>
          <div className="roomInfo">
            <h3>{activeRoom.name}</h3>
            <p>{activeRoom.description}</p>
          </div>
          <div className="roomMeta">
            <span><UsersRound /> {activeRoom.participant_count} / {activeRoom.max_participants}</span>
            <button className="leaveAction" onClick={() => setActiveRoom(null)} type="button">Leave Room</button>
          </div>
        </div>
        <div className="roomChatWrap">
          <div className="roomMessagesPane" ref={roomMessagesPaneRef}>
            <div className="systemMessage">Welcome to {activeRoom.name}. Keep it friendly!</div>
            {roomMessages.length > 0 ? (
              roomMessages.map((msg) => (
                <div className={`chatMessage ${msg.sender_id === session?.id ? "own" : "partner"}`} key={msg.id}>
                  <div className="messageBody">{msg.body}</div>
                  <div className="messageMeta">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">
                <MessageCircle />
                <p>Start the conversation in {activeRoom.name}.</p>
              </div>
            )}
          </div>
          <form className="roomComposer" onSubmit={sendRoomMessage}>
            <input 
              placeholder={`Message ${activeRoom.name}...`} 
              value={roomMessageText}
              onChange={(e) => setRoomMessageText(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="roomsPage">
      <section className="sectionIntro">
        <div className="introHeader">
          <div>
            <p className="eyebrow">Public & Custom</p>
            <h2>Chat Rooms</h2>
            <p>Join a room to hang out with multiple people at once.</p>
          </div>
          <button className="primaryButton createRoomBtn" onClick={() => setCreateRoomModalOpen(true)} type="button">
            <PlusCircle /> Create Room
          </button>
        </div>
        <div className="roomSearch">
          <Search />
          <input 
            placeholder="Search rooms by name or category..." 
            value={roomSearchQuery}
            onChange={(e) => setRoomSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="roomsGrid">
        {filteredRooms.map((room) => (
          <button 
            className={`roomCard ${room.is_premium ? "premium" : ""}`} 
            key={room.id}
            onClick={() => setActiveRoom(room)}
            type="button"
          >
            <div className="roomCardHeader">
              <span className="roomCategory">{room.category}</span>
              {room.is_premium && <span className="premiumBadge"><Crown /> Premium</span>}
            </div>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <div className="roomCardFooter">
              <span className="participantCount">
                <UsersRound /> {room.participant_count} online
              </span>
              <span className="joinAction">Join Room</span>
            </div>
          </button>
        ))}
      </div>

      {createRoomModalOpen && (
        <div className="modalOverlay" onClick={() => setCreateRoomModalOpen(false)}>
          <div className="modalBody" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Create Custom Room</h3>
              <button className="closeBtn" onClick={() => setCreateRoomModalOpen(false)}>×</button>
            </div>
            <div className="modalContent">
              <p className="helperText">
                {isPremium 
                  ? "As a Premium member, you can create up to 280 rooms that last for 30 days." 
                  : authUser 
                    ? "Registered users can create up to 10 rooms that last for 24 hours." 
                    : "Guest users cannot create rooms. Please register to unlock this feature."
                }
              </p>
              {!authUser ? (
                <button className="primaryButton" onClick={() => { setCreateRoomModalOpen(false); showAuthNotice("registered"); }} type="button">
                  Register to Create Rooms
                </button>
              ) : (
                <form className="createRoomForm" onSubmit={handleCreateRoom}>
                  <label className="field">
                    <span>Room Name</span>
                    <input name="roomName" maxLength={30} placeholder="e.g. My Awesome Hangout" required />
                  </label>
                  <label className="field">
                    <span>Description</span>
                    <textarea name="roomDescription" maxLength={100} placeholder="What is this room about?" required />
                  </label>
                  <div className="formActions">
                    <button className="secondaryButton" onClick={() => setCreateRoomModalOpen(false)} type="button">Cancel</button>
                    <button className="primaryButton" type="submit">Create Room</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
