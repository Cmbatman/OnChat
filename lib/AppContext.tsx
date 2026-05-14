"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import {
  Tab, ChatStatus, AccountMode, AuthView, ThemeMode, GameKey,
  GuestSession, Chat, ChatMessage, ChatHistoryItem, ProfileDraft, Room,
  Friendship, RecentConnection, RegisteredProfileRow, AppNotification, UserReport
} from "@/lib/types";
import { 
  defaultCountryName, firstStateForCountry, botUsers, preMadeRooms, 
  botReplies, vibeOptions, moreAboutFields, moreAboutOptions, registeredFeatures,
  roomLimits, genders
} from "@/lib/constants";
import { makeId, isBotUser, messageProblem } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { Gender } from "./ui-utils";

interface AppContextType {
  tab: Tab; setTab: React.Dispatch<React.SetStateAction<Tab>>;
  username: string; setUsername: React.Dispatch<React.SetStateAction<string>>;
  gender: any; setGender: React.Dispatch<React.SetStateAction<any>>;
  age: number; setAge: React.Dispatch<React.SetStateAction<number>>;
  country: string; setCountry: React.Dispatch<React.SetStateAction<string>>;
  state: string; setState: React.Dispatch<React.SetStateAction<string>>;
  selectedVibes: string[]; setSelectedVibes: React.Dispatch<React.SetStateAction<string[]>>;
  session: GuestSession | null; setSession: React.Dispatch<React.SetStateAction<GuestSession | null>>;
  authUser: User | null; setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
  accountMode: AccountMode; setAccountMode: React.Dispatch<React.SetStateAction<AccountMode>>;
  authView: AuthView; setAuthView: React.Dispatch<React.SetStateAction<AuthView>>;
  authOpen: boolean; setAuthOpen: React.Dispatch<React.SetStateAction<boolean>>;
  themeMode: ThemeMode; setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  consentAccepted: boolean; setConsentAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  consentOpen: boolean; setConsentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pendingConsentAction: "guest" | "login" | "register" | null; setPendingConsentAction: React.Dispatch<React.SetStateAction<"guest" | "login" | "register" | null>>;
  onlineUsers: GuestSession[]; setOnlineUsers: React.Dispatch<React.SetStateAction<GuestSession[]>>;
  chat: Chat | null; setChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  chatStatus: ChatStatus; setChatStatus: React.Dispatch<React.SetStateAction<ChatStatus>>;
  messages: ChatMessage[]; setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatHistory: ChatHistoryItem[]; setChatHistory: React.Dispatch<React.SetStateAction<ChatHistoryItem[]>>;
  status: string; setStatus: React.Dispatch<React.SetStateAction<string>>;
  warning: string; setWarning: React.Dispatch<React.SetStateAction<string>>;
  moderationAlert: { reason: string } | null; setModerationAlert: React.Dispatch<React.SetStateAction<{ reason: string } | null>>;
  query: string; setQuery: React.Dispatch<React.SetStateAction<string>>;
  filterGender: any; setFilterGender: React.Dispatch<React.SetStateAction<any>>;
  sidebarGender: any; setSidebarGender: React.Dispatch<React.SetStateAction<any>>;
  searchCountry: string; setSearchCountry: React.Dispatch<React.SetStateAction<string>>;
  searchState: string; setSearchState: React.Dispatch<React.SetStateAction<string>>;
  searchVibe: string; setSearchVibe: React.Dispatch<React.SetStateAction<string>>;
  minAge: number; setMinAge: React.Dispatch<React.SetStateAction<number>>;
  maxAge: number; setMaxAge: React.Dispatch<React.SetStateAction<number>>;
  blockedIds: string[]; setBlockedIds: React.Dispatch<React.SetStateAction<string[]>>;
  favoriteIds: string[]; setFavoriteIds: React.Dispatch<React.SetStateAction<string[]>>;
  customAvatarUrl: string; setCustomAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  profileDraft: ProfileDraft; setProfileDraft: React.Dispatch<React.SetStateAction<ProfileDraft>>;
  rooms: Room[]; setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  activeRoom: Room | null; setActiveRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  roomMessages: ChatMessage[]; setRoomMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isPremium: boolean; setIsPremium: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean; setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  friends: Friendship[]; setFriends: React.Dispatch<React.SetStateAction<Friendship[]>>;
  recentConnections: RecentConnection[]; setRecentConnections: React.Dispatch<React.SetStateAction<RecentConnection[]>>;
  notifications: AppNotification[]; setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  activePartner: GuestSession | null;
  messageText: string; setMessageText: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent | string) => Promise<void>;
  blockPartner: () => Promise<void>;
  reportPartner: (category: string) => Promise<void>;
  reportOpen: boolean; setReportOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAccentGender: string;
  roomMessageText: string; setRoomMessageText: React.Dispatch<React.SetStateAction<string>>;
  sendRoomMessage: (e: React.FormEvent) => Promise<void>;
  roomSearchQuery: string; setRoomSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredRooms: Room[];
  createRoomModalOpen: boolean; setCreateRoomModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateRoom: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  lastActivityRef: React.MutableRefObject<number>;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  startRandomChat: (targetUser?: GuestSession | RegisteredProfileRow | null) => Promise<void>;
  leaveChat: (reason?: string, expired?: boolean) => Promise<void>;
  showAuthNotice: (mode: AccountMode) => void;
  saveProfilePreview: () => Promise<void>;
  updateProfileField: (field: keyof ProfileDraft, value: string) => void;
  performSendMessage: (body: string) => Promise<void>;
  handleInviteToRoom: () => Promise<void>;
  enterGuestApp: () => Promise<boolean>;
  sendFriendRequest: (friendId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (targetId: string) => Promise<void>;
  reportUser: (reportedId: string, reason: string, details?: string) => Promise<void>;
  discoverUsers: () => Promise<RegisteredProfileRow[]>;
  trackConnection: (connectedUserId: string) => Promise<void>;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  filteredUsers: GuestSession[];
  isSupabaseConfigured: boolean;
  registeredFeatures: string[];
  moreAboutFields: readonly (readonly [keyof ProfileDraft, string])[];
  moreAboutOptions: Partial<Record<keyof ProfileDraft, string[]>>;
  genders: Array<{ value: Gender; label: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("lobby");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<any>("");
  const [age, setAge] = useState(18);
  const [country, setCountry] = useState(defaultCountryName);
  const [state, setState] = useState(() => firstStateForCountry(defaultCountryName));
  const [selectedVibes, setSelectedVibes] = useState<string[]>(["Deep Talk"]);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [accountMode, setAccountMode] = useState<AccountMode>("guest");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingConsentAction, setPendingConsentAction] = useState<"guest" | "login" | "register" | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<GuestSession[]>(botUsers);
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [status, setStatus] = useState("");
  const [warning, setWarning] = useState("");
  const [moderationAlert, setModerationAlert] = useState<{ reason: string } | null>(null);
  const [query, setQuery] = useState("");
  const [filterGender, setFilterGender] = useState<any>("any");
  const [sidebarGender, setSidebarGender] = useState<any>("any");
  const [searchCountry, setSearchCountry] = useState("any");
  const [searchState, setSearchState] = useState("any");
  const [searchVibe, setSearchVibe] = useState("any");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(89);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    statusMessage: "Available", bio: "", lookingFor: "", height: "", weight: "",
    education: "", profession: "", maritalStatus: "", zodiac: "", hair: "",
    bodyType: "", tattoos: "", religion: "", smoking: "", drinking: "",
  });
  const [rooms, setRooms] = useState<Room[]>(preMadeRooms);
  const [customRooms, setCustomRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [recentConnections, setRecentConnections] = useState<RecentConnection[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [messageText, setMessageText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [roomMessageText, setRoomMessageText] = useState("");
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const router = useRouter();

  const isSupabaseConfigured = !!supabase;

  // Authentication & Admin Detection
  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setAuthUser(currentSession.user);
        // Admin logic: Check app_metadata or hardcoded email for project owner
        const isUserAdmin = currentSession.user.app_metadata?.role === 'admin' || 
                          currentSession.user.email?.includes('admin@onchat.app') ||
                          currentSession.user.email === 'axel@onchat.app';
        setIsAdmin(isUserAdmin);
        setAccountMode('registered');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      if (sessionData) {
        setAuthUser(sessionData.user);
        const isUserAdmin = sessionData.user.app_metadata?.role === 'admin' || 
                          sessionData.user.email?.includes('admin@onchat.app') ||
                          sessionData.user.email === 'axel@onchat.app';
        setIsAdmin(isUserAdmin);
        setAccountMode('registered');
      } else {
        setAuthUser(null);
        setIsAdmin(false);
        setAccountMode('guest');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Realtime Notifications
  useEffect(() => {
    if (!supabase || !authUser) return;

    const channel = supabase
      .channel('social_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'friendships',
        filter: `friend_id=eq.${authUser.id}`
      }, (payload) => {
        const newRequest = payload.new as Friendship;
        if (newRequest.status === 'pending') {
          addNotification({
            type: 'friend_request',
            message: `New friend request received!`,
            payload: newRequest
          });
          fetchSocialData(authUser.id);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'friendships',
        filter: `user_id=eq.${authUser.id}`
      }, (payload) => {
        const updated = payload.new as Friendship;
        if (updated.status === 'accepted') {
          addNotification({
            type: 'friend_accepted',
            message: `Your friend request was accepted!`,
            payload: updated
          });
          fetchSocialData(authUser.id);
        }
      })
      .subscribe();

    return () => {
      if (supabase) supabase?.removeChannel(channel);
    };
  }, [authUser]);

  // Rooms Fetching & Realtime
  useEffect(() => {
    if (!supabase) return;

    const fetchRooms = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setCustomRooms(data as Room[]);
    };

    fetchRooms();

    const channel = supabase
      .channel('rooms_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  // Sync rooms state
  useEffect(() => {
    setRooms([...preMadeRooms, ...customRooms]);
  }, [customRooms]);

  // Active Room Messages Sync
  useEffect(() => {
    if (!supabase || !activeRoom) {
      setRoomMessages([]);
      return;
    }

    const fetchRoomMessages = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", activeRoom.id)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setRoomMessages(data as ChatMessage[]);
    };

    fetchRoomMessages();

    const channel = supabase
      .channel(`room_${activeRoom.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'room_messages', 
        filter: `room_id=eq.${activeRoom.id}` 
      }, (payload) => {
        setRoomMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [activeRoom]);

  const addNotification = (notif: Omit<AppNotification, "id" | "created_at" | "read">) => {
    const newNotif: AppNotification = {
      ...notif,
      id: makeId("notif"),
      created_at: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };

  const fetchSocialData = async (userId: string) => {
    if (!supabase) return;
    // Fetch friends
    const { data: friendsData } = await supabase
      .from("friendships")
      .select(`
        *,
        friend_profile:friend_id(*),
        user_profile:user_id(*)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
    if (friendsData) setFriends(friendsData as Friendship[]);

    // Fetch recent connections
    const { data: recentData } = await supabase
      .from("recent_connections")
      .select(`
        *,
        profile:connected_user_id(*)
      `)
      .eq("user_id", userId)
      .order("last_met_at", { ascending: false })
      .limit(20);
    if (recentData) setRecentConnections(recentData as RecentConnection[]);
  };

  useEffect(() => {
    if (authUser) {
      fetchSocialData(authUser.id);
    } else {
      setFriends([]);
      setRecentConnections([]);
    }
  }, [authUser]);
  
  const activePartner = useMemo(() => {
    if (!chat || !session) return null;
    const partnerId = chat.user_a === session.id ? chat.user_b : chat.user_a;
    // Check online users (guests/bots)
    const onlineMatch = onlineUsers.find(u => u.id === partnerId);
    if (onlineMatch) return onlineMatch;
    
    // Check if we matched with a registered user from history/recent
    const recentMatch = recentConnections.find(c => c.connected_user_id === partnerId);
    if (recentMatch?.profile) {
      return { 
        ...recentMatch.profile, 
        id: recentMatch.profile.user_id,
        avatar_seed: recentMatch.profile.avatar_url || "" 
      } as GuestSession;
    }

    return null;
  }, [chat, session, onlineUsers, recentConnections]);

  const selectedAccentGender = useMemo(() => {
    return session?.gender || "man";
  }, [session]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchQuery = !roomSearchQuery || 
        r.name.toLowerCase().includes(roomSearchQuery.toLowerCase()) || 
        r.category.toLowerCase().includes(roomSearchQuery.toLowerCase());
      return matchQuery;
    });
  }, [rooms, roomSearchQuery]);

  const markActivity = () => {
    lastActivityRef.current = Date.now();
  };

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const filteredUsers = useMemo(() => {
    return onlineUsers.filter((u) => {
      const matchQuery = !query || u.username.toLowerCase().includes(query.toLowerCase());
      const matchGender = filterGender === "any" || u.gender === filterGender;
      const matchAge = u.age >= minAge && u.age <= maxAge;
      return matchQuery && matchGender && matchAge;
    });
  }, [onlineUsers, query, filterGender, minAge, maxAge]);

  const logout = async () => {
    if (chat) {
      await leaveChat("Signed out. Chat history cleared.", true);
    }
    if (supabase) await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
    setAccountMode("guest");
    setChat(null);
    setChatStatus("idle");
    setMessages([]);
    setChatHistory([]);
    setBlockedIds([]);
    setFavoriteIds([]);
    setTab("online");
    setStatus("Signed out. Session chat history was cleared.");
    router.push("/");
  };

  const leaveChat = async (reason = "Chat ended.", expired = false) => {
    if (!chat) return;
    const isLocalBotChat = chat.id.startsWith("bot-chat") || isBotUser(chat.user_a) || isBotUser(chat.user_b);
    if (supabase && !isLocalBotChat) {
      await supabase.from("chat_messages").delete().eq("chat_id", chat.id);
      await supabase
        .from("chats")
        .update({ status: expired ? "expired" : "ended", ended_at: new Date().toISOString() })
        .eq("id", chat.id);
    }
    setChat(null);
    setChatStatus("idle");
    setMessages([]);
    if (expired) {
      setChatHistory([]);
      setSession(null);
      setAccountMode("guest");
      setTab("online");
    }
    setWarning("");
    setStatus(reason);
  };

  const showAuthNotice = (mode: AccountMode) => {
    setAccountMode(mode);
    setAuthView(mode === "registered" ? "register" : "login");
    setAuthOpen(true);
  };

  const startRandomChat = async (targetUser?: GuestSession | RegisteredProfileRow | null) => {
    if (chatStatus !== "idle" && !targetUser) return;
    
    // Convert targetUser to GuestSession if it's RegisteredProfileRow
    let normalizedTarget: GuestSession | null = null;
    if (targetUser) {
      if ('user_id' in targetUser) {
        normalizedTarget = {
          id: targetUser.user_id,
          username: targetUser.username,
          age: targetUser.age || 18,
          gender: (targetUser.gender as Gender) || "man",
          country: targetUser.country || "United States",
          state: targetUser.state,
          avatar_seed: targetUser.avatar_url || ""
        };
      } else {
        normalizedTarget = targetUser as GuestSession;
      }
    }

    if (!session) return;

    if (normalizedTarget && blockedIds.includes(normalizedTarget.id)) {
      setStatus("That user is blocked.");
      return;
    }
    markActivity();
    setChatStatus("waiting");
    setStatus(normalizedTarget ? `Connecting to ${normalizedTarget.username}...` : "Finding a random match...");
    setMessages([]);

    const botPartner = normalizedTarget && isBotUser(normalizedTarget.id) ? normalizedTarget : null;

    if (botPartner) {
      const botChat = {
        id: makeId("bot-chat"),
        user_a: session.id,
        user_b: botPartner.id,
        status: "active",
      };
      setChat(botChat);
      setChatStatus("active");
      setTab("random");
      setStatus(`Matched with ${botPartner.username}. Say hello.`);
      return;
    }

    if (!supabase) {
      const partner = normalizedTarget ?? onlineUsers[0];
      if (!partner) {
        setStatus("No users available right now.");
        setChatStatus("idle");
        return;
      }
      const demoChat = {
        id: makeId("chat"),
        user_a: session.id,
        user_b: partner.id,
        status: "active",
      };
      setChat(demoChat);
      setChatStatus("active");
      setStatus(`Connected with ${partner.username}.`);
      return;
    }

    if (normalizedTarget) {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          user_a: session.id,
          user_b: normalizedTarget.id,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        setStatus(error.message);
        setChatStatus("idle");
      } else if (data) {
        setChat(data);
        setChatStatus("active");
        setTab("random");
        
        // Track connection if partner is registered
        if (normalizedTarget.id.length > 20) { // Simple check for UUID vs guest-xxxx
          trackConnection(normalizedTarget.id);
        }
      }
    } else {
      // RANDOM MATCHING via RPC
      const { data, error } = await supabase.rpc('match_random_user', {
        p_requester_id: session.id
      });

      if (error) {
        console.error("Match error:", error);
        setStatus("Could not find a match right now. Please try again.");
        setChatStatus("idle");
      } else if (data) {
        // match_random_user returns the chat record
        setChat(data as Chat);
        setChatStatus("active");
        setTab("random");
        setStatus("Matched! Say hello.");
        
        // Track connection if partner is registered
        const partnerId = data.user_a === session.id ? data.user_b : data.user_a;
        if (partnerId && partnerId.length > 20) {
          trackConnection(partnerId);
        }
      } else {
        setStatus("No users found matching your criteria. Try again in a moment.");
        setChatStatus("idle");
      }
    }
  };

  const performSendMessage = async (body: string) => {
    if (!chat || !session) return;
    
    if (!supabase) {
      setMessages((current) => [
        ...current,
        {
          id: makeId("message"),
          chat_id: chat.id,
          sender_id: session.id,
          body,
          created_at: new Date().toISOString(),
          read_at: null,
        },
      ]);
      
      const partnerId = chat.user_a === session.id ? chat.user_b : chat.user_a;
      if (isBotUser(partnerId)) {
        setTimeout(() => {
          const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
          setMessages((current) => [
            ...current,
            {
              id: makeId("message"),
              chat_id: chat.id,
              sender_id: partnerId ?? "bot-maya",
              body: reply,
              created_at: new Date().toISOString(),
              read_at: null,
            },
          ]);
        }, 1000);
      }
      return;
    }

    const { data, error } = await supabase.from("chat_messages").insert({
      chat_id: chat.id,
      sender_id: session.id,
      body,
    }).select().single();
    
    if (error) {
      setStatus(error.message);
      return;
    }
    
    if (data) {
      setMessages((current) => [...current, data as ChatMessage]);
    }
  };

  const sendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") e.preventDefault?.();
    const body = typeof e === "string" ? e : messageText;
    if (!body.trim()) return;
    
    await performSendMessage(body);
    setMessageText("");
  };

  const blockPartner = async () => {
    if (!activePartner) return;
    await blockUser(activePartner.id);
    await leaveChat("User blocked.");
  };

  const reportPartner = async (category: string) => {
    if (!activePartner) return;
    await reportUser(activePartner.id, category);
    setReportOpen(false);
    setStatus("Report submitted.");
  };

  const enterGuestApp = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setStatus("Please enter a username.");
      return false;
    }
    if (trimmed.length < 3) {
      setStatus("Username must be at least 3 characters.");
      return false;
    }

    if (supabase) {
      const { data: onlineCheck } = await supabase
        .from("guest_sessions")
        .select("id")
        .ilike("username", trimmed)
        .eq("status", "online")
        .limit(1);

      const { data: regCheck } = await supabase
        .from("registered_profiles")
        .select("id")
        .ilike("username", trimmed)
        .limit(1);

      if ((onlineCheck && onlineCheck.length > 0) || (regCheck && regCheck.length > 0)) {
        setStatus("Username already in use. Please choose another username.");
        return false;
      }
    } else {
      if (onlineUsers.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())) {
        setStatus("Username already in use. Please choose another username.");
        return false;
      }
    }

    window.localStorage.setItem("onchat.cachedUsername", trimmed);
    const profile = {
      username: trimmed,
      age,
      gender: gender as Gender,
      country,
      state: state || null,
      avatar_seed: `${trimmed}-${Date.now()}`,
      status: "online",
    };
    const localSession = { ...profile, vibe: selectedVibes[0] ?? "Casual" };

    if (!supabase) {
      const demoSession = { ...localSession, id: makeId("guest") };
      setSession(demoSession);
      setStatus("Demo mode enabled.");
      return true;
    }

    const { data, error } = await supabase
      .from("guest_sessions")
      .insert(profile)
      .select()
      .single();

    if (error) {
      const taken = error.message.toLowerCase().includes("duplicate");
      setStatus(taken ? "That username is currently in use. Try another." : error.message);
      return false;
    }

    setSession({ ...(data as GuestSession), vibe: localSession.vibe });
    setStatus("You are online.");
    return true;
  };

  const handleInviteToRoom = async () => {
    if (!chat || !session) return;
    const roomToInvite = activeRoom ?? rooms[0];
    if (!roomToInvite) return;

    const inviteData = {
      id: roomToInvite.id,
      name: roomToInvite.name,
      creator: session.username,
      members: roomToInvite.participant_count,
      max: roomToInvite.max_participants
    };

    const inviteBody = `__ROOM_INVITE__:${JSON.stringify(inviteData)}`;
    await performSendMessage(inviteBody);
    setStatus("Invite sent.");
  };

  const sendRoomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom || !session || !roomMessageText.trim()) return;

    const body = roomMessageText.trim();
    if (!supabase) {
      setRoomMessages(prev => [...prev, {
        id: makeId("msg"),
        chat_id: activeRoom.id,
        sender_id: session.id,
        body,
        created_at: new Date().toISOString(),
        read_at: null
      }]);
      setRoomMessageText("");
      return;
    }

    const { data, error } = await supabase
      .from("room_messages")
      .insert({
        room_id: activeRoom.id,
        sender_id: session.id,
        body
      })
      .select()
      .single();

    if (error) {
      setStatus(error.message);
    } else {
      setRoomMessages(prev => [...prev, data as ChatMessage]);
      setRoomMessageText("");
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !authUser) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("roomName") as string;
    const description = formData.get("roomDescription") as string;

    const newRoom: Partial<Room> = {
      name,
      description,
      creator_id: authUser.id,
      category: "Social",
      is_premium: isPremium,
      max_participants: isPremium ? 100 : 20,
      participant_count: 1
    };

    if (!supabase) {
      const demoRoom: Room = {
        ...newRoom as Room,
        id: makeId("room"),
        created_at: new Date().toISOString(),
        expires_at: null
      };
      setRooms(prev => [demoRoom, ...prev]);
      setActiveRoom(demoRoom);
      setCreateRoomModalOpen(false);
      setStatus("Demo room created.");
      return;
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert(newRoom)
      .select()
      .single();

    if (error) {
      setStatus(error.message);
    } else {
      setRooms(prev => [data as Room, ...prev]);
      setActiveRoom(data as Room);
      setCreateRoomModalOpen(false);
      setStatus("Room created!");
    }
  };

  const updateProfileField = (field: keyof ProfileDraft, value: string) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  };

  const saveProfilePreview = async () => {
    // Basic implementation for now
    setStatus("Profile updated locally.");
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!authUser || !supabase) return;
    const { error } = await supabase
      .from("friendships")
      .insert({
        user_id: authUser.id,
        friend_id: friendId,
        status: "pending"
      });
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Friend request sent!");
      fetchSocialData(authUser.id);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (!authUser || !supabase) return;
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", requestId);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Friend request accepted!");
      fetchSocialData(authUser.id);
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!authUser || !supabase) return;
    const { error } = await supabase
      .from("friendships")
      .delete()
      .or(`and(user_id.eq.${authUser.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${authUser.id})`);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Friend removed.");
      fetchSocialData(authUser.id);
    }
  };

  const blockUser = async (targetId: string) => {
    if (!authUser || !supabase) return;
    const { error } = await supabase
      .from("friendships")
      .upsert({
        user_id: authUser.id,
        friend_id: targetId,
        status: "blocked",
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,friend_id' });
    
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("User blocked.");
      setBlockedIds(prev => [...prev, targetId]);
      fetchSocialData(authUser.id);
    }
  };

  const reportUser = async (reportedId: string, reason: string, details?: string) => {
    if (!authUser || !supabase) return;
    const { error } = await supabase
      .from("user_reports")
      .insert({
        reporter_id: authUser.id,
        reported_user_id: reportedId,
        reason,
        details
      });
    
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Report submitted. Thank you for keeping OnChat safe.");
    }
  };

  const discoverUsers = async () => {
    if (!authUser || !supabase) return [];
    
    // Call the RPC to get profiles while excluding friends, blocked, and self
    const { data, error } = await supabase.rpc('get_discover_profiles', {
      p_requester_id: authUser.id
    });
    
    if (error) {
      console.error("Discovery error:", error);
      return [];
    }
    return data as RegisteredProfileRow[];
  };

  const trackConnection = async (connectedUserId: string) => {
    if (!authUser || !supabase) return;
    // We only track connections for registered users talking to others
    const { error } = await supabase
      .from("recent_connections")
      .upsert({
        user_id: authUser.id,
        connected_user_id: connectedUserId,
        last_met_at: new Date().toISOString()
      }, { onConflict: 'user_id,connected_user_id' });
    if (error) {
      console.error("Error tracking connection:", error);
    } else {
      fetchSocialData(authUser.id);
    }
  };

  const value = {
    tab, setTab, username, setUsername, gender, setGender, age, setAge,
    country, setCountry, state, setState, selectedVibes, setSelectedVibes,
    session, setSession, authUser, setAuthUser, accountMode, setAccountMode,
    authView, setAuthView, authOpen, setAuthOpen, themeMode, setThemeMode,
    consentAccepted, setConsentAccepted, consentOpen, setConsentOpen,
    pendingConsentAction, setPendingConsentAction, onlineUsers, setOnlineUsers,
    chat, setChat, chatStatus, setChatStatus, messages, setMessages,
    chatHistory, setChatHistory, status, setStatus, warning, setWarning,
    moderationAlert, setModerationAlert, query, setQuery, filterGender, setFilterGender,
    sidebarGender, setSidebarGender, searchCountry, setSearchCountry, searchState, setSearchState,
    searchVibe, setSearchVibe, minAge, setMinAge, maxAge, setMaxAge, blockedIds, setBlockedIds,
    favoriteIds, setFavoriteIds, customAvatarUrl, setCustomAvatarUrl, profileDraft, setProfileDraft,
    rooms, setRooms, activeRoom, setActiveRoom, 
    roomMessages, setRoomMessages,
    isPremium, setIsPremium,
    isAdmin, setIsAdmin,
    friends, setFriends,
    recentConnections, setRecentConnections,
    notifications, setNotifications,
    activePartner,
    messageText, setMessageText,
    sendMessage,
    blockPartner,
    reportPartner,
    reportOpen, setReportOpen,
    selectedAccentGender,
    roomMessageText, setRoomMessageText,
    sendRoomMessage,
    roomSearchQuery, setRoomSearchQuery,
    filteredRooms,
    createRoomModalOpen, setCreateRoomModalOpen,
    handleCreateRoom,
    lastActivityRef,
    logout,
    toggleTheme,
    startRandomChat,
    leaveChat,
    showAuthNotice,
    saveProfilePreview,
    updateProfileField,
    performSendMessage,
    handleInviteToRoom,
    enterGuestApp,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    blockUser,
    reportUser,
    discoverUsers,
    trackConnection,
    removeNotification,
    clearNotifications,
    filteredUsers,
    isSupabaseConfigured,
    registeredFeatures,
    moreAboutFields,
    moreAboutOptions,
    genders: genders as Array<{ value: Gender; label: string }>
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
