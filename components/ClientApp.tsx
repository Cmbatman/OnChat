"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Ban,
  Bot,
  CheckCircle2,
  CircleSlash,
  Gamepad2,
  Globe2,
  GraduationCap,
  Heart,
  MessageCircle,
  MessagesSquare,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  UserCircle,
  UserPlus,
  UserRoundX,
  UsersRound,
  Crown,
  PlusCircle,
} from "lucide-react";
import { Country, State } from "country-state-city";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

import { ExperienceCards } from "@/components/ExperienceCards";
import { Gender, SvgIcon, defaultAvatarUrl, SvgIconName } from "@/lib/ui-utils";
import { 
  Tab, ChatStatus, AccountMode, AuthView, ThemeMode, GameKey, 
  GuestSession, Chat, ChatMessage, ChatHistoryItem, ProfileDraft, RegisteredProfileRow,
  Room
} from "@/lib/types";
import { useApp } from "@/lib/AppContext";
import { 
  genders, vibeOptions, moreAboutFields, moreAboutOptions, 
  countryOptions, defaultCountryName, statesForCountry, firstStateForCountry, 
  botUsers, botReplies, registeredFeatures, guestLimitations, gameOptions, 
  bannedUsernameWords, sexualTerms, offensiveTerms, linkPattern, roomLimits
} from "@/lib/constants";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const demoUsers = botUsers;
const profileBucketName = process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET || "OnChat Profile";
const maxAvatarBytes = 2 * 1024 * 1024;
const allowedAvatarTypes = ["image/png", "image/jpeg"];

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brandLogo ${compact ? "compact" : ""}`}>
      <img className="logoLight" src="/logos/onchat-wordmark-light.png" alt="OnChat" />
      <img className="logoDark" src="/logos/onchat-wordmark-dark.png" alt="OnChat" />
    </span>
  );
}

function GenderIcon({ gender, className = "" }: { gender: Gender; className?: string }) {
  if (gender === "man") {
    return (
      <svg className={`genderIcon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M14 10 20 4M16 4h4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }
  if (gender === "woman") {
    return (
      <svg className={`genderIcon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M12 14v7M8.5 18h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={`genderIcon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="16" r="6" stroke="currentColor" strokeWidth="2.1" />
      <path d="M12 10V3" stroke="currentColor" strokeLinecap="round" strokeWidth="2.1" />
      <path d="M12 3v5M7.7 5.5l8.6-5M16.3 5.5l-8.6-5M7.7 0.5l8.6 5M16.3 0.5l-8.6 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.1" transform="translate(0 1)" />
    </svg>
  );
}

function ProfileFieldIcon({ field }: { field: keyof ProfileDraft }) {
  const paths: Partial<Record<keyof ProfileDraft, string>> = {
    lookingFor: "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z",
    height: "M7 4v16M17 4v16M5 6h4M15 18h4",
    weight: "M7 8h10l1.5 12h-13L7 8ZM9 8a3 3 0 0 1 6 0",
    education: "M3 8l9-4 9 4-9 4-9-4ZM7 10v5c3 2 7 2 10 0v-5",
    profession: "M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M4 7h16v12H4V7Z",
    maritalStatus: "M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM15 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    zodiac: "M12 2l2.7 6 6.3.6-4.8 4.1 1.4 6.1L12 15.6 6.4 18.8l1.4-6.1L3 8.6 9.3 8 12 2Z",
    hair: "M5 19V9a7 7 0 0 1 14 0v10M8 19v-8M16 19v-8",
    bodyType: "M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 21c0-4 2.5-7 6-7s6 3 6 7",
    tattoos: "M7 17l10-10M8 7h9v9M5 19l3-1-2-2-1 3Z",
    religion: "M12 3v18M7 8h10M8 21h8",
    smoking: "M4 16h11v3H4v-3ZM17 16h3v3h-3v-3ZM15 8c3 0 4 2 2 4",
    drinking: "M8 3h8l-1 7a4 4 0 0 1-6 0L8 3ZM12 13v8M9 21h6",
  };
  return (
    <svg className="fieldGlyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[field] ?? "M12 5v14M5 12h14"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function displayAvatarUrl(user?: Pick<GuestSession, "gender"> | null, customAvatarUrl = "") {
  if (customAvatarUrl) return customAvatarUrl;
  return defaultAvatarUrl(user?.gender ?? "man");
}

function hashString(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function userVibe(user: GuestSession) {
  if (user.vibe) return user.vibe;
  const status = user.status && user.status !== "online" ? user.status : "";
  if (status) return status;
  return vibeOptions[hashString(user.id) % vibeOptions.length];
}

function countryFlag(country: string) {
  const map: Record<string, string> = {
    "United States": "us",
    India: "in",
    "United Kingdom": "gb",
    Canada: "ca",
    Australia: "au",
    Germany: "de",
    France: "fr",
    Brazil: "br",
    Mexico: "mx",
    Japan: "jp",
    "South Korea": "kr",
    Philippines: "ph",
    Indonesia: "id",
    "United Arab Emirates": "ae",
  };
  const code = map[country] ?? "un";
  return (
    <img 
      src={`https://flagcdn.com/w40/${code}.png`} 
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width="30" 
      alt={country}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

function isUsernameValid(username: string) {
  const trimmed = username.trim();
  if (!trimmed || trimmed.length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (trimmed.length > 20) {
    return "Username must be 20 characters or less.";
  }
  if (!/^[A-Za-z0-9_]+$/.test(trimmed)) {
    return "Username can only contain letters, numbers, and underscores.";
  }
  if (/^_+$/.test(trimmed)) {
    return "Username cannot be only underscores.";
  }
  if (/^_{2,}/.test(trimmed) || /_{2,}$/.test(trimmed)) {
    return "Username cannot start or end with multiple underscores.";
  }
  const lowered = trimmed.toLowerCase();
  if (bannedUsernameWords.some((word) => lowered.includes(word))) {
    return "That username is not allowed.";
  }
  return "";
}

function messageProblem(body: string, isEarlyMessage: boolean) {
  const lowered = body.toLowerCase();
  if (linkPattern.test(body)) {
    return "Links are blocked in the MVP.";
  }
  if (isEarlyMessage && sexualTerms.some((term) => lowered.includes(term))) {
    return "Keep first messages clean and friendly.";
  }
  if (offensiveTerms.some((term) => lowered.includes(term))) {
    return "That message was blocked by the safety filter.";
  }
  return "";
}

function isBotUser(userId?: string | null) {
  return Boolean(userId?.startsWith("bot-"));
}

function mergeOnlineUsers(realUsers: GuestSession[], currentSession?: GuestSession | null) {
  const seen = new Set(realUsers.map((user) => user.id));
  const bots = botUsers.filter((bot) => bot.id !== currentSession?.id && !seen.has(bot.id));
  return [...realUsers, ...bots];
}

function profileDraftFromRow(row: RegisteredProfileRow): ProfileDraft {
  return {
    statusMessage: row.status_message ?? "Available",
    bio: row.bio ?? "",
    lookingFor: row.looking_for ?? "",
    height: row.height ?? "",
    weight: row.weight ?? "",
    education: row.education ?? "",
    profession: row.profession ?? "",
    maritalStatus: row.marital_status ?? "",
    zodiac: row.zodiac ?? "",
    hair: row.hair ?? "",
    bodyType: row.body_type ?? "",
    tattoos: row.tattoos ?? "",
    religion: row.religion ?? "",
    smoking: row.smoking_habits ?? "",
    drinking: row.drinking_habits ?? "",
  };
}

export default function Home() {
  const {
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
    rooms, setRooms, activeRoom, setActiveRoom, isPremium, setIsPremium,
    roomMessages, setRoomMessages,
    lastActivityRef
  } = useApp();

  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [consentRejected, setConsentRejected] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [roomMessageText, setRoomMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameKey>("tic_tac_toe");
  const [ticBoard, setTicBoard] = useState<Array<"X" | "O" | "">>(Array(9).fill(""));
  const [ticTurn, setTicTurn] = useState<"X" | "O">("X");
  const [dinoScore, setDinoScore] = useState(0);
  const [snakeScore, setSnakeScore] = useState(0);
  const [rpsResult, setRpsResult] = useState("Choose a move to begin.");
  const [memoryOpen, setMemoryOpen] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const messagesPaneRef = useRef<HTMLDivElement | null>(null);
  const roomMessagesPaneRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const availableStates = useMemo(() => statesForCountry(country), [country]);
  const searchStates = useMemo(
    () => (searchCountry === "any" ? [] : statesForCountry(searchCountry)),
    [searchCountry],
  );
  const currentAvatarSrc =
    authUser && customAvatarUrl ? customAvatarUrl : displayAvatarUrl(session, customAvatarUrl);
  const activePartner = useMemo(() => {
    if (!session || !chat) return null;
    const partnerId = chat.user_a === session.id ? chat.user_b : chat.user_a;
    return onlineUsers.find((user) => user.id === partnerId) ?? null;
  }, [chat, onlineUsers, session]);

  const filteredUsers = onlineUsers.filter((user) => {
    if (session?.id === user.id || blockedIds.includes(user.id)) return false;
    if (filterGender !== "any" && user.gender !== filterGender) return false;
    if (searchCountry !== "any" && user.country !== searchCountry) return false;
    if (searchState !== "any" && user.state !== searchState) return false;
    if (searchVibe !== "any" && userVibe(user) !== searchVibe) return false;
    if (user.age < minAge || user.age > maxAge) return false;
    const searchable = `${user.username} ${user.country} ${user.state ?? ""} ${genders.find((item) => item.value === user.gender)?.label ?? ""} ${userVibe(user)}`.toLowerCase();
    if (query && !searchable.includes(query.toLowerCase())) return false;
    return true;
  });
  
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const searchable = `${room.name} ${room.description} ${room.category}`.toLowerCase();
      return searchable.includes(roomSearchQuery.toLowerCase());
    });
  }, [rooms, roomSearchQuery]);

  const sidebarUsers = onlineUsers.filter((user) => {
    if (session?.id === user.id || blockedIds.includes(user.id)) return false;
    if (sidebarGender !== "any" && user.gender !== sidebarGender) return false;
    return true;
  });
  const blockedUsers = onlineUsers.filter((user) => blockedIds.includes(user.id));

  const selectedAccentGender: Gender =
    activePartner?.gender ?? (filterGender !== "any" ? filterGender : (session?.gender || (gender as Gender || "man")));

  const ownMessagesBeforeReply = useMemo(() => {
    if (!session || messages.some((message) => message.sender_id !== session.id)) return 0;
    return messages.filter((message) => message.sender_id === session.id).length;
  }, [messages, session]);

  const profileCompleteness = useMemo(() => {
    const fields = [
      session?.username,
      session?.age,
      session?.gender,
      session?.country,
      session?.state,
      profileDraft.statusMessage,
      profileDraft.bio,
      profileDraft.lookingFor,
      profileDraft.profession,
      profileDraft.education,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profileDraft, session]);

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [messages.length, chat?.id]);

  useEffect(() => {
    if (!chat || !session) return;
    const last = messages[messages.length - 1];
    const nextItem: ChatHistoryItem = {
      chat,
      partner: activePartner,
      messages,
      lastMessage: last?.body ?? (activePartner ? `Matched with ${activePartner.username}` : "Chat started"),
      updatedAt: last?.created_at ?? new Date().toISOString(),
    };
    setChatHistory((current) => [
      nextItem,
      ...current.filter((item) => item.chat.id !== chat.id),
    ].slice(0, 20));
  }, [activePartner, chat, messages, session]);

  useEffect(() => {
    const cached = window.localStorage.getItem("onchat.cachedUsername");
    if (cached) {
      setUsername(cached);
      setStatus("Cached username loaded.");
    }
    const cachedProfile = window.localStorage.getItem("onchat.profileDraft");
    if (cachedProfile) {
      try {
        setProfileDraft(JSON.parse(cachedProfile) as ProfileDraft);
      } catch {
        window.localStorage.removeItem("onchat.profileDraft");
      }
    }
    const cachedTheme = window.localStorage.getItem("onchat.theme");
    if (cachedTheme === "light" || cachedTheme === "dark") {
      setThemeMode(cachedTheme);
    } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
      setThemeMode("light");
    }
    const acceptedConsent = window.localStorage.getItem("onchat.consentAccepted") === "true";
    setConsentAccepted(acceptedConsent);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("onchat.theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!availableStates.includes(state)) {
      setState(availableStates[0] ?? "Not specified");
    }
  }, [availableStates, state]);

  useEffect(() => {
    let cancelled = false;

    async function detectLocation() {
      try {
        const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { country_name?: string; region?: string };
        const detectedCountry = countryOptions.find(
          (item) => item.name.toLowerCase() === String(data.country_name ?? "").toLowerCase(),
        );
        if (!detectedCountry || cancelled) return;

        const detectedStates = statesForCountry(detectedCountry.name);
        const detectedState =
          detectedStates.find(
            (item) => item.toLowerCase() === String(data.region ?? "").toLowerCase(),
          ) ?? detectedStates[0];

        setCountry(detectedCountry.name);
        setState(detectedState ?? "Not specified");
      } catch {
        // Alphabetical defaults remain in place when IP location is unavailable.
      }
    }

    void detectLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // The app still works without offline shell caching.
      }
    };

    void registerWorker();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    client.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setAuthUser(user);
      if (user) {
        setAccountMode("registered");
        void loadRegisteredProfile(user);
      }
    });

    const { data } = client.auth.onAuthStateChange((_event, authSession) => {
      const user = authSession?.user ?? null;
      setAuthUser(user);
      if (user) {
        setAccountMode("registered");
        void loadRegisteredProfile(user);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    const client = supabase;

    const loadUsers = async () => {
      await client.rpc("expire_inactive_sessions");
      const { data } = await client
        .from("guest_sessions")
        .select("*")
        .in("status", ["online", "chatting"])
        .order("last_seen_at", { ascending: false });
      if (data) setOnlineUsers(mergeOnlineUsers(data as GuestSession[], session));
    };

    loadUsers();
    const usersChannel = client
      .channel("guest-sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guest_sessions" },
        loadUsers,
      )
      .subscribe();

    const heartbeat = window.setInterval(async () => {
      await client.rpc("touch_guest_session", { session_id: session.id });
    }, 30000);

    return () => {
      window.clearInterval(heartbeat);
      client.removeChannel(usersChannel);
    };
  }, [session]);

  useEffect(() => {
    if (!session || !supabase) return;
    const client = supabase;

    const activateIncomingChat = (nextChat: Chat) => {
      if (!nextChat || !["waiting", "active"].includes(nextChat.status)) return;
      if (nextChat.user_a !== session.id && nextChat.user_b !== session.id) return;
      if (chat && chat.id !== nextChat.id && chatStatus === "active") {
        setStatus("A new chat request arrived while you are in another chat.");
        return;
      }
      setChat(nextChat);
      setChatStatus(nextChat.status === "active" ? "active" : "waiting");
      setMessages([]);
      setTab("random");
      setStatus(nextChat.status === "active" ? "Matched. Say hello." : "Waiting for another online user...");
    };

    const loadIncomingChats = async () => {
      const { data } = await client
        .from("chats")
        .select("*")
        .or(`user_a.eq.${session.id},user_b.eq.${session.id}`)
        .in("status", ["waiting", "active"])
        .order("created_at", { ascending: false })
        .limit(1);
      const nextChat = data?.[0] as Chat | undefined;
      if (nextChat && nextChat.id !== chat?.id) activateIncomingChat(nextChat);
    };

    void loadIncomingChats();

    const incomingAsReceiver = client
      .channel(`incoming-chat-receiver-${session.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats", filter: `user_b=eq.${session.id}` },
        (payload) => activateIncomingChat(payload.new as Chat),
      )
      .subscribe();

    const incomingAsStarter = client
      .channel(`incoming-chat-starter-${session.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats", filter: `user_a=eq.${session.id}` },
        (payload) => activateIncomingChat(payload.new as Chat),
      )
      .subscribe();

    return () => {
      client.removeChannel(incomingAsReceiver);
      client.removeChannel(incomingAsStarter);
    };
  }, [chat?.id, chatStatus, session]);

  useEffect(() => {
    if (!session || !chat || !supabase) return;
    if (chat.id.startsWith("bot-chat") || isBotUser(chat.user_a) || isBotUser(chat.user_b)) return;
    const client = supabase;

    const loadChat = async () => {
      const { data } = await client.from("chats").select("*").eq("id", chat.id).single();
      if (!data) return;
      setChat(data as Chat);
      if (data.status === "active") {
        setChatStatus("active");
        setStatus("Matched. Say hello.");
      }
    };

    const channel = client
      .channel(`chat-state-${chat.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats", filter: `id=eq.${chat.id}` },
        loadChat,
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [chat?.id, session]);

  useEffect(() => {
    if (!session || !chat || !supabase) return;
    if (chat.id.startsWith("bot-chat") || isBotUser(chat.user_a) || isBotUser(chat.user_b)) return;
    const client = supabase;

    const loadMessages = async () => {
      const { data } = await client
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true });
      if (!data) return;
      const rows = data as ChatMessage[];
      const unreadIncoming = rows
        .filter((message) => message.sender_id !== session.id && !message.read_at)
        .map((message) => message.id);
      if (unreadIncoming.length) {
        const readAt = new Date().toISOString();
        await client.from("chat_messages").update({ read_at: readAt }).in("id", unreadIncoming);
        setMessages(rows.map((message) => (
          unreadIncoming.includes(message.id) ? { ...message, read_at: readAt } : message
        )));
        return;
      }
      setMessages(rows);
    };

    loadMessages();
    const channel = client
      .channel(`chat-${chat.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages", filter: `chat_id=eq.${chat.id}` },
        loadMessages,
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [chat, session]);
  
  useEffect(() => {
    if (!session || !activeRoom || !supabase) {
      if (!activeRoom) setRoomMessages([]);
      return;
    }
    const client = supabase;

    const loadRoomMessages = async () => {
      const { data } = await client
        .from("room_messages")
        .select("*")
        .eq("room_id", activeRoom.id)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setRoomMessages(data as ChatMessage[]);
    };

    void loadRoomMessages();
    const channel = client
      .channel(`room-${activeRoom.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "room_messages", filter: `room_id=eq.${activeRoom.id}` },
        (payload) => {
          setRoomMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [activeRoom?.id, session, setRoomMessages, supabase]);

  useEffect(() => {
    const pane = roomMessagesPaneRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [roomMessages.length, activeRoom?.id]);

  useEffect(() => {
    const check = window.setInterval(() => {
      if (!session) return;
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs > 10 * 60 * 1000) {
        void leaveChat("Chat expired after inactivity.", true);
      } else if (idleMs > 8 * 60 * 1000) {
        setWarning("Chat will expire soon");
      }
    }, 15000);
    return () => window.clearInterval(check);
  }, [session, chat]);

  function markActivity() {
    lastActivityRef.current = Date.now();
    setWarning("");
  }

  async function enterGuestAfterConsent() {
    markActivity();
    const problem = isUsernameValid(username);
    if (problem) {
      setStatus(problem);
      return;
    }

    if (!gender) {
      setStatus("Please select your gender before continuing.");
      return;
    }

    const trimmed = username.trim();

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
        return;
      }
    } else {
      if (onlineUsers.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())) {
        setStatus("Username already in use. Please choose another username.");
        return;
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
      setOnlineUsers([demoSession, ...demoUsers]);
      setStatus("Live connection unavailable. You can still preview the chat UI locally.");
      return;
    }

    const { data, error } = await supabase
      .from("guest_sessions")
      .insert(profile)
      .select()
      .single();

    if (error) {
      const taken = error.message.toLowerCase().includes("duplicate");
      setStatus(taken ? "That username is currently in use. Try another." : error.message);
      return;
    }

    setSession({ ...(data as GuestSession), vibe: localSession.vibe });
    setStatus("You are online.");
  }

  async function enterAsGuest(event: FormEvent) {
    event.preventDefault();
    if (!consentAccepted) {
      setPendingConsentAction("guest");
      setConsentOpen(true);
      setStatus("Please agree to the OnChat rules before entering.");
      return;
    }

    await enterGuestAfterConsent();
  }

  async function enterRegisteredApp(user: User) {
    markActivity();
    const fallbackName = user.email?.split("@")[0]?.replace(/[^A-Za-z0-9_ ]/g, "") || "OnChat User";
    const trimmed = (username.trim() || fallbackName).slice(0, 25);
    const problem = isUsernameValid(trimmed);
    if (problem) {
      setStatus(problem);
      return;
    }

    if (!gender) {
      setStatus("Please select your gender before continuing.");
      return;
    }

    setUsername(trimmed);
    window.localStorage.setItem("onchat.cachedUsername", trimmed);
    setAccountMode("registered");

    await upsertRegisteredProfile(user, trimmed);

    const presence = {
      username: trimmed,
      age,
      gender: gender as Gender,
      country,
      state: state || null,
      avatar_seed: user.id,
      status: "online",
    };
    const localPresence = { ...presence, vibe: selectedVibes[0] ?? "Casual" };

    if (!supabase) {
      const demoSession = { ...localPresence, id: makeId("registered") };
      setSession(demoSession);
      setOnlineUsers([demoSession, ...demoUsers]);
      return;
    }

    const { data, error } = await supabase
      .from("guest_sessions")
      .insert(presence)
      .select()
      .single();

    if (error) {
      const taken = error.message.toLowerCase().includes("duplicate");
      setStatus(taken ? "That username is currently online. Try another display name for now." : error.message);
      return;
    }

    setSession({ ...(data as GuestSession), vibe: localPresence.vibe });
    setTab("profile");
    setStatus("Signed in. Registered profile is active.");
  }

  async function loadRegisteredProfile(user: User) {
    if (!supabase) return;
    const { data } = await supabase
      .from("registered_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!data) return;
    const profile = data as RegisteredProfileRow;
    setUsername(profile.username);
    setAge(profile.age ?? 18);
    setGender(profile.gender ?? "man");
    const profileCountry = profile.country ?? defaultCountryName;
    setCountry(profileCountry);
    setState(profile.state ?? firstStateForCountry(profileCountry));
    setCustomAvatarUrl(profile.avatar_url ?? "");
    setProfileDraft(profileDraftFromRow(profile));
  }

  async function upsertRegisteredProfile(user: User, displayName = username.trim()) {
    if (!supabase) return;
    const problem = isUsernameValid(displayName);
    if (problem) {
      setStatus(problem);
      return;
    }
    const payload = {
      user_id: user.id,
      username: displayName,
      age,
      gender,
      country,
      state: state || null,
      avatar_url: customAvatarUrl || null,
      status_message: profileDraft.statusMessage || "Available",
      bio: profileDraft.bio || null,
      looking_for: profileDraft.lookingFor || null,
      height: profileDraft.height || null,
      weight: profileDraft.weight || null,
      education: profileDraft.education || null,
      profession: profileDraft.profession || null,
      marital_status: profileDraft.maritalStatus || null,
      zodiac: profileDraft.zodiac || null,
      hair: profileDraft.hair || null,
      body_type: profileDraft.bodyType || null,
      tattoos: profileDraft.tattoos || null,
      religion: profileDraft.religion || null,
      smoking_habits: profileDraft.smoking || null,
      drinking_habits: profileDraft.drinking || null,
      profile_completeness: profileCompleteness,
      priority_score: 25 + Math.round(profileCompleteness / 4),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("registered_profiles").upsert(payload, {
      onConflict: "user_id",
    });
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Registered profile saved.");
  }

  async function uploadProfileAvatar(file: File | null) {
    if (!file) return;
    if (!authUser || !supabase) {
      setStatus("Log in or register before uploading a custom avatar.");
      return;
    }
    if (!allowedAvatarTypes.includes(file.type)) {
      setStatus("Only PNG and JPEG profile pictures are allowed.");
      return;
    }
    if (file.size > maxAvatarBytes) {
      setStatus("Profile picture must be under 2 MB.");
      return;
    }

    const extension = file.type === "image/png" ? "png" : "jpg";
    const objectPath = `${authUser.id}/avatar.${extension}`;
    setAvatarUploading(true);

    const { error } = await supabase.storage
      .from(profileBucketName)
      .upload(objectPath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: true,
      });

    setAvatarUploading(false);
    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from(profileBucketName).getPublicUrl(objectPath);
    const publicUrl = `${data.publicUrl}?v=${Date.now()}`;
    setCustomAvatarUrl(publicUrl);

    const { error: profileError } = await supabase
      .from("registered_profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", authUser.id);

    if (profileError) {
      setStatus(profileError.message);
      return;
    }

    setStatus("Profile picture updated.");
  }

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }
    if (!authEmail.trim() || authPassword.length < 6) {
      setStatus("Enter an email and a password with at least 6 characters.");
      return;
    }
    if (authView === "register") {
      const usernameError = isUsernameValid(authUsername || username);
      if (usernameError) {
        setStatus(usernameError);
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setStatus("Passwords do not match.");
        return;
      }
    }

    setAuthLoading(true);
    const client = supabase;
    const credentials = {
      email: authEmail.trim(),
      password: authPassword,
    };
    const result =
      authView === "register"
        ? await client.auth.signUp({
            ...credentials,
            options: {
              data: {
                username: (authUsername || username).trim(),
              },
            },
          })
        : await client.auth.signInWithPassword(credentials);
    setAuthLoading(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    const user = result.data.user;
    if (!user || !result.data.session) {
      setStatus("Check your email to confirm your account, then log in.");
      setAuthOpen(false);
      return;
    }

    setAuthUser(user);
    if (authView === "register" && authUsername.trim()) {
      setUsername(authUsername.trim());
    }
    setAuthOpen(false);
    await enterRegisteredApp(user);
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) setStatus(error.message);
  }

  async function signOut() {
    await logout();
  }

  async function logout() {
    const currentChat = chat;
    if (currentChat) {
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
    setProfileMenuOpen(false);
    setQuery("");
    setTab("online");
    setStatus("Signed out. Session chat history was cleared.");
  }

  async function startRandomChat(targetUser?: GuestSession) {
    if (!session) return;
    if (targetUser && blockedIds.includes(targetUser.id)) {
      setStatus("That user is blocked. Unblock them before starting a chat.");
      return;
    }
    markActivity();
    setChatStatus("waiting");
    setStatus(targetUser ? `Connecting to ${targetUser.username}...` : "Finding a random match...");
    setMessages([]);

    const botPartner =
      targetUser && isBotUser(targetUser.id)
        ? targetUser
        : !targetUser && !supabase
          ? botUsers[Math.floor(Math.random() * botUsers.length)]
          : null;

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
      const partner = targetUser ?? sidebarUsers[0] ?? demoUsers[0];
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

    if (targetUser) {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          user_a: session.id,
          user_b: targetUser.id,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        setStatus(error.message);
        setChatStatus("idle");
        return;
      }

      setChat(data as Chat);
      setChatStatus("active");
      setTab("random");
      setStatus(`Matched with ${targetUser.username}. Say hello.`);
      return;
    }

    const existingQuery = supabase
      .from("chats")
      .select("*")
      .eq("status", "waiting")
      .is("user_b", null)
      .neq("user_a", session.id)
      .limit(1);

    const { data: waitingChats } = await existingQuery;

    const waiting = waitingChats?.[0] as Chat | undefined;
    if (waiting) {
      const { data, error } = await supabase
        .from("chats")
        .update({ user_b: session.id, status: "active" })
        .eq("id", waiting.id)
        .select()
        .single();
      if (error) {
        setStatus(error.message);
        setChatStatus("idle");
        return;
      }
      setChat(data as Chat);
      setChatStatus("active");
      setStatus("Matched. Say hello.");
      return;
    }

    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_a: session.id,
        status: "waiting",
      })
      .select()
      .single();

    if (error) {
      setStatus(error.message);
      setChatStatus("idle");
      return;
    }

    setChat(data as Chat);
    setTab("random");
    setStatus("Waiting for another online user...");
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!session || !chat || !messageText.trim()) return;
    if (activePartner && blockedIds.includes(activePartner.id)) {
      setStatus("This user is blocked. Unblock them before chatting again.");
      return;
    }
    markActivity();
    const isEarly = messages.length < 4;
    const problem = messageProblem(messageText, isEarly);
    if (problem) {
      setStatus(problem);
      setModerationAlert({ reason: problem });
      return;
    }
    if (ownMessagesBeforeReply >= 2) {
      const reason = "Wait for the other person to reply before sending more.";
      setStatus(reason);
      setModerationAlert({ reason });
      return;
    }

    await performSendMessage(messageText);
  }

  async function performSendMessage(body: string) {
    if (!chat || !session) return;
    setMessageText("");
    
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
      
      if (isBotUser(activePartner?.id)) {
        setTimeout(() => {
          const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
          setMessages((current) => [
            ...current,
            {
              id: makeId("message"),
              chat_id: chat.id,
              sender_id: activePartner?.id ?? "bot-maya",
              body: reply,
              created_at: new Date().toISOString(),
              read_at: null,
            },
          ]);
        }, 650 + Math.floor(Math.random() * 700));
      }
      return;
    }

    const pendingId = makeId("pending-message");
    const pendingMessage: ChatMessage = {
      id: pendingId,
      chat_id: chat.id,
      sender_id: session.id,
      body,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((current) => [...current, pendingMessage]);

    const { data, error } = await supabase.from("chat_messages").insert({
      chat_id: chat.id,
      sender_id: session.id,
      body,
    }).select().single();
    
    if (error) {
      setMessages((current) => current.filter((message) => message.id !== pendingId));
      if (!body.startsWith("__ROOM_INVITE__")) {
        setMessageText(body);
      }
      setStatus(error.message);
      return;
    }
    
    if (data) {
      const savedMessage = data as ChatMessage;
      setMessages((current) => {
        const withoutPending = current.filter((message) => message.id !== pendingId);
        if (withoutPending.some((message) => message.id === savedMessage.id)) return withoutPending;
        return [...withoutPending, savedMessage].sort((a, b) => (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ));
      });
    }
  }

  async function sendRoomMessage(event: FormEvent) {
    event.preventDefault();
    if (!session || !activeRoom || !roomMessageText.trim()) return;
    markActivity();
    
    const body = roomMessageText.trim();
    const isEarly = roomMessages.length < 5;
    const problem = messageProblem(body, isEarly);
    if (problem) {
      setStatus(problem);
      setModerationAlert({ reason: problem });
      return;
    }

    setRoomMessageText("");
    
    if (!supabase) {
      const sent: ChatMessage = {
        id: makeId("room-msg"),
        chat_id: activeRoom.id,
        sender_id: session.id,
        body,
        created_at: new Date().toISOString(),
        read_at: null,
      };
      setRoomMessages((prev) => [...prev, sent]);
      return;
    }

    const { error } = await supabase.from("room_messages").insert({
      room_id: activeRoom.id,
      sender_id: session.id,
      body,
    });

    if (error) {
      setStatus(error.message);
      setRoomMessageText(body);
    }
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (!authUser || !session) {
      setStatus("Register to unlock room creation.");
      return;
    }
    
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = (formData.get("roomName") as string).trim();
    const description = (formData.get("roomDescription") as string).trim();
    
    if (name.length < 3) {
      setStatus("Room name is too short.");
      return;
    }

    if (!supabase) {
      const newRoom: Room = {
        id: makeId("room"),
        name,
        description,
        creator_id: session.id,
        is_premium: isPremium,
        max_participants: isPremium ? 1000 : 100,
        participant_count: 1,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (isPremium ? roomLimits.premium.expiryMs : roomLimits.registered.expiryMs)).toISOString(),
        category: "Custom",
      };
      setRooms((prev) => [newRoom, ...prev]);
      setActiveRoom(newRoom);
      setCreateRoomModalOpen(false);
      setStatus("Custom room created successfully!");
      return;
    }

    const { data, error } = await supabase.from("rooms").insert({
      name,
      description,
      creator_id: authUser.id,
      is_premium: isPremium,
      max_participants: isPremium ? 1000 : 100,
      expires_at: new Date(Date.now() + (isPremium ? roomLimits.premium.expiryMs : roomLimits.registered.expiryMs)).toISOString(),
      category: "Custom",
    }).select().single();

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data) {
      const room = data as Room;
      setRooms((prev) => [room, ...prev]);
      setActiveRoom(room);
      setCreateRoomModalOpen(false);
      setStatus("Custom room created successfully!");
    }
  }


  async function leaveChat(reason = "Chat ended. Messages were cleared.", expired = false) {
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
  }

  async function blockPartner() {
    if (!session || !activePartner) return;
    const blockedUserId = activePartner.id;
    setBlockedIds((current) => [...new Set([...current, activePartner.id])]);
    setChatHistory((current) => current.filter((item) => item.partner?.id !== blockedUserId));
    if (supabase && !isBotUser(activePartner.id)) {
      await supabase.from("blocks").insert({
        blocker_id: session.id,
        blocked_id: activePartner.id,
      });
    }
    await leaveChat("User blocked. You will not be matched with them again.");
  }

  async function reportPartner(category: string) {
    if (!session || !activePartner) return;
    if (supabase && !isBotUser(activePartner.id)) {
      await supabase.from("reports").insert({
        reporter_id: session.id,
        reported_id: activePartner.id,
        chat_id: chat?.id ?? null,
        category,
        notes: "Reported from MVP chat action.",
      });
    }
    setReportOpen(false);
    setStatus("Report received. Enforcement is progressive after review.");
  }

  async function handleInviteToRoom() {
    if (!activePartner || !chat || !session) return;
    
    const roomToInvite = activeRoom ?? (rooms.find(r => r.creator_id === session.id) || rooms[0]);
    if (!roomToInvite) {
      setStatus("No room available to invite to.");
      return;
    }

    const inviteData = {
      id: roomToInvite.id,
      name: roomToInvite.name,
      creator: session.username,
      members: roomToInvite.participant_count,
      max: roomToInvite.max_participants
    };

    const inviteBody = `__ROOM_INVITE__:${JSON.stringify(inviteData)}`;
    
    setStatus(`Inviting ${activePartner.username} to ${roomToInvite.name}...`);
    await performSendMessage(inviteBody);
    setStatus("Invite sent successfully.");
  }

  function toggleVibe(vibe: string) {
    setSelectedVibes((current) =>
      current.includes(vibe)
        ? current.filter((item) => item !== vibe)
        : [...current, vibe],
    );
  }

  function updateProfileField(field: keyof ProfileDraft, value: string) {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  }

  function requestAuth(view: AuthView, nextStatus = "") {
    if (!consentAccepted) {
      setPendingConsentAction(view);
      setConsentOpen(true);
      setStatus("Please agree to the OnChat rules before continuing.");
      return;
    }
    setAuthView(view);
    setAuthOpen(true);
    if (nextStatus) setStatus(nextStatus);
  }

  function showAuthNotice(mode: AccountMode) {
    setAccountMode(mode);
    if (mode === "registered") {
      requestAuth("register", "Create an account to claim your username permanently.");
      return;
    }
    requestAuth("login", "Log in to use your registered profile.");
  }

  async function saveProfilePreview() {
    if (session) {
      setSession((current) =>
        current
          ? {
              ...current,
              username: authUser ? username.trim() || current.username : current.username,
              age,
              gender: gender as Gender,
              country,
              state,
              vibe: selectedVibes[0] ?? current.vibe,
            }
          : current,
      );
    }
    window.localStorage.setItem("onchat.profileDraft", JSON.stringify(profileDraft));
    if (authUser) {
      await upsertRegisteredProfile(authUser);
      return;
    }
    setStatus("Profile preview saved on this device. Register to sync it.");
  }

  function tabTitle() {
    const titles: Record<Tab, string> = {
      online: "Online Users",
      random: "Random Chat",
      chat: "Chat",
      rooms: "Rooms",
      ai_chat: "AI Chat",
      games: "Games",
      my_chat: "My Chat",
      friends: "Friends",
      blocked: "Blocked Users",
      search: "Search",
      profile: "Profile",
      lobby: "Lobby",
      discover: "Discover",
      admin: "Admin",
      settings: "Settings",
      premium: "Premium",
    };
    return titles[tab];
  }

  function toggleTheme() {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }

  function acceptConsent() {
    window.localStorage.setItem("onchat.consentAccepted", "true");
    setConsentAccepted(true);
    setConsentRejected(false);
    setConsentOpen(false);
    setStatus("");
    const action = pendingConsentAction;
    setPendingConsentAction(null);
    if (action === "guest") {
      void enterGuestAfterConsent();
    } else if (action === "login" || action === "register") {
      setAuthView(action);
      setAuthOpen(true);
    }
  }

  function leaveConsent() {
    setConsentRejected(true);
    setConsentOpen(false);
    setPendingConsentAction(null);
    setStatus("You need to agree before entering OnChat.");
  }

  const ticWinner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ].find(([a, b, c]) => ticBoard[a] && ticBoard[a] === ticBoard[b] && ticBoard[a] === ticBoard[c]);
  const ticStatus = ticWinner
    ? `${ticBoard[ticWinner[0]]} wins`
    : ticBoard.every(Boolean)
      ? "Draw"
      : `${ticTurn}'s turn`;
  const memoryCards = ["Chat", "Safe", "Fast", "Friend", "Chat", "Safe", "Fast", "Friend"];

  function playTic(index: number) {
    if (ticBoard[index] || ticWinner) return;
    setTicBoard((current) => current.map((value, itemIndex) => (itemIndex === index ? ticTurn : value)));
    setTicTurn((current) => (current === "X" ? "O" : "X"));
  }

  function playRps(move: "Rock" | "Paper" | "Scissors") {
    const moves = ["Rock", "Paper", "Scissors"] as const;
    const opponent = moves[Math.floor(Math.random() * moves.length)];
    const wins =
      (move === "Rock" && opponent === "Scissors") ||
      (move === "Paper" && opponent === "Rock") ||
      (move === "Scissors" && opponent === "Paper");
    setRpsResult(move === opponent ? `Draw. Both picked ${move}.` : wins ? `You win. ${move} beats ${opponent}.` : `You lose. ${opponent} beats ${move}.`);
  }

  function flipMemory(index: number) {
    if (memoryMatched.includes(index) || memoryOpen.includes(index) || memoryOpen.length >= 2) return;
    const nextOpen = [...memoryOpen, index];
    setMemoryOpen(nextOpen);
    if (nextOpen.length === 2) {
      const [first, second] = nextOpen;
      if (memoryCards[first] === memoryCards[second]) {
        window.setTimeout(() => {
          setMemoryMatched((current) => [...current, first, second]);
          setMemoryOpen([]);
        }, 300);
      } else {
        window.setTimeout(() => setMemoryOpen([]), 700);
      }
    }
  }

  return (
    <main className={`appShell theme-${themeMode}`}>
      {!session && !authOpen && (
        <header className="topNav">
          <a className="brand" href="#top" aria-label="OnChat home">
            <BrandLogo />
          </a>
          <nav className="siteLinks" aria-label="Primary">
            <a href="#about">About</a>
            <a href="/safety">Safety</a>
            <a href="/promote">Advertise</a>
            <a href="/faq">FAQ</a>
          </nav>
          <div className="navActions">
            <button className="themeToggle iconOnly" onClick={toggleTheme} type="button" aria-label="Toggle light and dark mode">
              <SvgIcon name={themeMode === "dark" ? "sun" : "moon"} />
            </button>
            {authUser ? (
              <>
                <span className="authEmail">{authUser.email}</span>
                <button className="softButton" onClick={signOut} type="button">Sign Out</button>
              </>
            ) : (
              <>
                <button className="ghostLink" onClick={() => requestAuth("login")} type="button">Log In</button>
                <button className="softButton" onClick={() => showAuthNotice("registered")} type="button">Register</button>
              </>
            )}
          </div>
        </header>
      )}

      {consentOpen && !session && !authOpen ? (
        <div className="consentOverlay" role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <section className="consentModal card-premium">
            <h2 id="consent-title">By using OnChat, you agree to:</h2>
            <ul>
              <li><CheckCircle2 aria-hidden="true" />You are over the age of 18</li>
              <li><CheckCircle2 aria-hidden="true" />You've read and accepted our <a href="/terms" target="_blank" rel="noreferrer">Terms of Use</a></li>
              <li><CheckCircle2 aria-hidden="true" />You've read and accepted our <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a></li>
              <li><CheckCircle2 aria-hidden="true" />You've read and accepted our <a href="/safety" target="_blank" rel="noreferrer">Safety Guidelines</a></li>
            </ul>
            <div className="consentActions">
              <button className="btn-premium btn-primary" onClick={acceptConsent} type="button">Agree & Continue</button>
              <button className="quietAction" onClick={leaveConsent} type="button">Leave</button>
            </div>
          </section>
        </div>
      ) : null}

      {moderationAlert ? (
        <div className="moderationOverlay" role="dialog" aria-modal="true" aria-labelledby="moderation-title">
          <section className="moderationModal card-premium">
            <Ban aria-hidden="true" />
            <h2 id="moderation-title">Message not sent</h2>
            <p>
              This message may go against OnChat's <a href="/safety" target="_blank" rel="noreferrer">Safety Guidelines</a>.
              Please keep chats respectful and safe.
            </p>
            <small>{moderationAlert.reason}</small>
            <button className="btn-premium btn-primary" onClick={() => setModerationAlert(null)} type="button">Dismiss</button>
          </section>
        </div>
      ) : null}

      {authOpen && (
        <section className={`authPage ${authView}`} aria-label={`${authView} page`}>
          {authView === "login" ? (
            <>
              <header className="authTopNav">
                <button className="authBrand" onClick={() => setAuthOpen(false)} type="button">
                  <BrandLogo compact />
                </button>
                <div className="authNavRight">
                  <nav>
                    <button onClick={() => setAuthOpen(false)} type="button">Home</button>
                    <a href="/safety">Safety</a>
                  </nav>
                  <div className="authIconRow">
                    <SvgIcon name="bell" />
                    <SvgIcon name="user" />
                  </div>
                </div>
              </header>
              <main className="loginStage">
                <div className="loginShell">
                  <form className="loginFormPanel" onSubmit={submitAuth}>
                    <div className="authIntro">
                      <h1>Login</h1>
                      <p>Welcome back to OnChat. Please enter your details.</p>
                    </div>
                    <button className="googleButton" onClick={signInWithGoogle} type="button">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </button>
                    <div className="authDivider"><span>Or login with email</span></div>
                    <label className="authField">
                      <span>Email or username</span>
                      <input value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="Enter your email" type="text" autoComplete="email" />
                    </label>
                    <label className="authField">
                      <span>Password</span>
                      <div className="passwordWrap">
                        <input value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="••••••••" type={showAuthPassword ? "text" : "password"} autoComplete="current-password" />
                        <button onClick={() => setShowAuthPassword((current) => !current)} type="button" aria-label="Show password">
                          <SvgIcon name="eye" />
                        </button>
                      </div>
                    </label>
                    <div className="forgotRow">
                      <a href="#">Forgot Password?</a>
                    </div>
                    <button className="btn-premium btn-primary authPrimary" disabled={authLoading} type="submit">
                      {authLoading ? "PLEASE WAIT" : "LOGIN"}
                    </button>
                    <p className="authSwitchText">
                      Don't have an account?{" "}
                      <button onClick={() => setAuthView("register")} type="button">Register Now</button>
                    </p>
                    <p className="authStatus">{status}</p>
                  </form>
                  <aside className="loginHeroPanel">
                    <img alt="Chat application login illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuUZZs7ZPv-9VO-tEzMIVcJ_5bhplWGm6RU2w-aCbE-b7u6j8xo8l-1sBgA_E_R0wRX86-_jpcbpCune5A4LO4tmwX-VqDiyaf1DGTpAlm47AIH0_L6KbTsqxs5YyEvwVBzcJuhQL2h71yGyQm2AXOrIl8jIxjnrZINf7MPZaLhI0bpRtzp3i5Xh3fz0ax6o4xESIrzpUvnZ_nkbXGSAuejlagInpoGLbe4afYLGSYS03yuLm9Cxs9x79TGvh8DMBU101DblN6-5s" />
                    <div className="loginHeroShade" />
                    <div className="loginHeroContent">
                      <h2>Real conversations start faster</h2>
                      <div className="authSocialProof">
                        <div className="authAvatarStack">
                          <img alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB50H539wCu8Wjzv1SntRLD90_dbY5yTHmq5NTSqRzX9FI3JFqmXI4udBN_nQi232BUDUv46otRLWI3uX4-1AckJWapH1XTIGkzzln3Hrr10IV1SimnfGCcEiFkQdVPsP3aeUqP_m4ZdTCr5wpta6s_PZUdFdig0z6G4Ha-8xJC7QI-4QlhYwvIH131g3y0Rg2lBtqTlkwm9IVFPTIqLDzFXjOWIyt3K_mZ4rK9f1J7iYtAFCA7LbFez-Li6gjLtHeeX0bfj1oBXMs" />
                          <img alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcBteUYg4uRmG_EsSMDy2oOWoeesbzI48-gERFSSFnsp6zpcJklPg2jBpU9a17Vr3P1Kh97gj3hy1lTQ9hisIgTIeeXj3HaESSg9GL40HhzZuF0f-u9ti1Jkt9wZxYt0N8PTAOS93179hrNKiprnGdMV_HqzGa8X_YmMQ4SenIeIBh5hT6Ux7lk8Jd0zvY_Ll9RYyaZEwvG9WkQ7-uBohzDp-7BaGSRwBrNnL1dk_X0KDorqq9XaowzYMjW9e7t-0HRrG0AbhdoVk" />
                          <img alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_rXgTuYo0HZQSNeS4PwlC18wcuEk6cvfebH6Lomk6uHIYm2m8xJXBdNIvjJO6g0n0LrVX5Z0fui8hjeVbGeqdoqeHA9Z5O6ajdowJ1YijD6LRJoDd2JhT6ffTu2FeJW-jRp2eXU633DzvBIErTB2Ryzr-oKEMiF6SOGQ5_Boh8--jsQj3R_LjTanwpkXlYFaR0Y6j9ogCu6ok8CmRBwWGVC5NRIr6qpIwSEvhvV28O06xdiIgH4R1KrIYCvHZUbBvtTsBtpp8BwE" />
                        </div>
                        <div className="onlineProof"><span />People online now</div>
                      </div>
                    </div>
                  </aside>
                </div>
              </main>
            </>
          ) : (
            <main className="registerStage">
              <section className="registerFormPanel">
                <div className="registerInner">
                  <div className="authIntro">
                    <h1>Create your account</h1>
                    <p>Join the community and start chatting today.</p>
                  </div>
                  <button className="googleButton" onClick={signInWithGoogle} type="button">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Register with Google
                  </button>
                  <div className="authDivider"><span>Or continue with email</span></div>
                  <form className="registerForm" onSubmit={submitAuth}>
                    <label className="authField">
                      <span>Username</span>
                      <input value={authUsername} onChange={(event) => setAuthUsername(event.target.value)} placeholder="Choose a unique handle" type="text" autoComplete="username" />
                    </label>
                    <label className="authField">
                      <span>Email address</span>
                      <input value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="name@example.com" type="email" autoComplete="email" />
                    </label>
                    <div className="registerPasswordGrid">
                      <label className="authField">
                        <span>Password</span>
                        <input value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="••••••••" type="password" autoComplete="new-password" />
                      </label>
                      <label className="authField">
                        <span>Confirm password</span>
                        <input value={authConfirmPassword} onChange={(event) => setAuthConfirmPassword(event.target.value)} placeholder="••••••••" type="password" autoComplete="new-password" />
                      </label>
                    </div>
                    <button className="btn-premium btn-primary authPrimary" disabled={authLoading} type="submit">
                      {authLoading ? "Please wait" : "Register"}
                    </button>
                  </form>
                  <p className="authSwitchText">
                    Already have an account?{" "}
                    <button onClick={() => setAuthView("login")} type="button">Log In</button>
                  </p>
                  <p className="authStatus">{status}</p>
                </div>
              </section>
              <section className="registerHeroPanel">
                <img alt="" src="https://lh3.googleusercontent.com/aida/ADBb0ug25wANy7t_YddkcsBvw35cqzqLwsluIDZ9AK-VrEGfFG1FO6B1yhyD8dZVqMSn7UPyUWkxq7RuzhmyUZ3dcZsy9wnIQs1Iuprk3pPhRwig7P3C4C4518anT5fTGwlmYWrOhRaSnKKvprzikw7YOsq0f0MoUB3tU1mZRdjgo9JpfS-TMtA2piYeigiUXVU51uG4cjQKSGTYHfpAeKw8jzhXooim64r7c6hZJYfu1vRllu46UwRq_KujEgAQKE9QOuG8YP885rdS" />
                <div className="registerHeroShade" />
                <div className="registerHeroContent">
                  <div className="liveBadge"><span />People online now</div>
                  <h2>Claim your OnChat identity <span>and keep better connections</span></h2>
                  <p>Create an account to reserve your username, customize your profile, and unlock stronger connection tools as the platform grows.</p>
                  <div className="registerAvatarProof">
                    <div className="authAvatarStack">
                      <img alt="" src="https://lh3.googleusercontent.com/aida/ADBb0uiOkmiQvhTM6YdiUMTpL9cfzzKXklskIIz3wMqOfHs4KIzmHPzOZJQnHLtH2p4MwLV9LAp0cE1Gjp0Aj_FmSwtmuk5DFCD8skFa8fPwsZx7w-840yKvkg_GfuA0bvX_6feRnNrz2dBy7izmeQqfhEqNV-JeV082YpcqtOR7aILhcTOa218c0Pf3mA-3izP9qD3U5NwAGos8JKmEljXucVEe8q7l-ZZtzxvi-ZVqPIrc1bKMvejJTvZR_6SA9aCdZTnTjvfG9N4k_w" />
                      <img alt="" src="https://lh3.googleusercontent.com/aida/ADBb0ugHDdDNU9QYxrDTR7oP2ht2qGymhIQmIt_ip5zEIBclbKajlvx7c_aLdAO0LpGn8q7B4tk7vig8ZFSumeYU-IiBJ6OSHX67WwcP-29lZTD4SvhCdwQuuvEKGC30mT4orI0uk37rYUkvrTkt_wDrxTi0stadmYRyyOA68wuY-wAWnKuE9PetsBnhFHoQ-OCKrroeddUDZIAYtVfqsuhnxiDcAHnlMD3JKOYGD66q2NqJkMKoA9jAIh3yvjj81kCt-cq2ClL6Sexw" />
                      <img alt="" src="https://lh3.googleusercontent.com/aida/ADBb0uhQC7-AZCdpVu3c_xHOttlWf7jsmjfBfhpeOeLGsRc-nCd8yBdEcf0fWKfoETQ7A7rsYCe8uRx63mIZyEHbRbWSEGCebSvR0Zx5idBcbIIiaucvbCJxYymNim8FjtM-VNKAdYbKUXfrGdzKKc3u01y3yCwO5vzZqVm43Bl2GoBZtdoVWAQg58D-DASyVk5b5_41YYVDhTu-of85DQ314Yk4eQDOU9F7EigJMU0m63_TQJEM3hY_IEGCH8EU15HmYBNCdfX9_UnH" />
                      <span>+99</span>
                    </div>
                    <strong>Ready to chat</strong>
                  </div>
                </div>
                <div className="secureCard">
                  <span><SvgIcon name="shield" /></span>
                  <div>
                    <strong>Secure & Anonymous</strong>
                    <p>Encrypted end-to-end</p>
                  </div>
                </div>
              </section>
            </main>
          )}
          <footer className="authFooter">
            <span>© 2024 OnChat. Anonymous & Secure.</span>
            <nav>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/safety">Safety Guidelines</a>
              <a href="/cookies">Cookie Policy</a>
            </nav>
          </footer>
        </section>
      )}

      {!authOpen && (!session ? (
        <section className="landingGrid" id="top">
          <div className="heroCopy">
            <p className="eyebrow">Fast anonymous chat</p>
            <h1>
              Real Conversations
              <span>Start Here</span>
            </h1>
            <p>
              OnChat is a fast, anonymous way to meet people online without creating an account.
              Enter in seconds, browse who's online, or jump into a random chat - with cleaner
              controls, safer conversations, and no unnecessary setup.
            </p>
            <div className="trustList">
              <span><ShieldCheck aria-hidden="true" />Fast anonymous chat</span>
              <span><UsersRound aria-hidden="true" />People online now</span>
              <span><ShieldCheck aria-hidden="true" />Ready to chat</span>
            </div>
            <div className="proofBadge">
              <div className="proofThumb" />
              <div className="proofAvatars" aria-hidden="true">
                <img alt="" src={defaultAvatarUrl("man")} />
                <img alt="" src={defaultAvatarUrl("woman")} />
                <img alt="" src={defaultAvatarUrl("non_binary")} />
              </div>
              <span />
              <strong><b>People online now</b><small>Ready to chat</small></strong>
            </div>
          </div>

          <form className="entryCard card-premium" onSubmit={enterAsGuest}>
            <header className="entryHeader fieldFull">
              <h2>Start a conversation</h2>
              <p>Join thousands of people chatting anonymously right now.</p>
            </header>

            <div className="fieldFull">
              <label className="field inputWithIcon">
                <span className="srOnly">Username</span>
                <SvgIcon name="user" />
                <input
                  maxLength={25}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  value={username}
                />
              </label>
              {(status.toLowerCase().includes("username") || status.includes("letters") || status.includes("characters")) && (
                <p className="fieldError">{status}</p>
              )}
            </div>

            <div className="fieldFull">
              <span className="fieldLabel">Gender</span>
              <div className="genderGrid">
                {genders.map((item) => (
                  <button
                    className={`gender-tile ${item.value} ${gender === item.value ? "selected" : ""}`}
                    key={item.value}
                    onClick={() => setGender(item.value)}
                    type="button"
                  >
                    <GenderIcon gender={item.value} />
                    {item.label}
                  </button>
                ))}
              </div>
              {status.includes("gender") && <p className="fieldError">{status}</p>}
            </div>

            <section className="dropdownGrid fieldFull">
              <label className="field">
                <span>Age</span>
                <select value={age} onChange={(event) => setAge(Number(event.target.value))}>
                  {Array.from({ length: 72 }, (_, index) => index + 18).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Country</span>
                <select
                  value={country}
                  onChange={(event) => {
                    const nextCountry = event.target.value;
                    setCountry(nextCountry);
                    setState(firstStateForCountry(nextCountry));
                  }}
                >
                  {countryOptions.map((item) => (
                    <option key={item.isoCode} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>State / Region</span>
                <select required value={state} onChange={(event) => setState(event.target.value)}>
                  {availableStates.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </section>

            <div className="fieldFull">
              <span className="fieldLabel">My vibe today</span>
              <div className="vibeList">
                {vibeOptions.map((vibe) => (
                  <button
                    className={selectedVibes.includes(vibe) ? "active" : ""}
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    type="button"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-premium btn-primary fieldFull" type="submit">
              <SvgIcon name="send" />
              Start Chatting Now
            </button>
            <div className="secondaryActions fieldFull">
              <button onClick={() => requestAuth("login")} type="button">
                <SvgIcon name="login" />
                Log In
              </button>
              <button onClick={() => showAuthNotice("registered")} type="button">
                <SvgIcon name="register" />
                Register
              </button>
            </div>
            {status && !status.toLowerCase().includes("username") && !status.includes("letters") && !status.includes("characters") && !status.includes("gender") && (
              <p className="formStatus fieldFull">{status}</p>
            )}
          </form>

          <section className="featureCompare">
            <article>
              <h2>Registered users unlock more</h2>
              <div>
                {registeredFeatures.slice(0, 8).map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </article>
            <article>
              <h2>Guest limits</h2>
              <div>
                {guestLimitations.map((limit) => (
                  <span key={limit}>{limit}</span>
                ))}
              </div>
            </article>
          </section>

          <section className="landingExperience">
            <div className="sectionIntro">
              <h2>The ultimate chatting experience</h2>
              <p>Focusing on what matters most: real connections with zero friction.</p>
            </div>
            <ExperienceCards />
          </section>

          <footer className="landingFooter">
            <strong><BrandLogo compact /></strong>
            <nav aria-label="Footer">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/faq">FAQ</a>
              <a href="/safety">Safety Guidelines</a>
              <a href="/cookies">Cookie Policy</a>
              <a href="/promote">Advertise</a>
              <a href="/contact">Contact</a>
            </nav>
            <p>2024 OnChat. All rights reserved.</p>
          </footer>
        </section>
      ) : (
        <section className="appMain">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="mobileOverlay"
              />
            )}
          </AnimatePresence>

          <Sidebar 
            activeTab={tab}
            onTabChange={(t) => {
              setTab(t);
              setIsSidebarOpen(false);
            }}
            accountMode={accountMode}
            onLogout={logout}
            username={session.username}
            isPremium={isPremium}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          <div className="appContent">
            <header className="mobileHeader">
              <button 
                className="menuToggle" 
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <Menu />
              </button>
              <BrandLogo compact />
              <button className="themeToggle" onClick={toggleTheme}>
                <SvgIcon name={themeMode === "dark" ? "sun" : "moon"} />
              </button>
            </header>

            <div className="contentWrapper">
              <aside className="onlineSidebar">
                <div className="sidebarTitle">
                  <span>Online Users</span>
                </div>
                <div className="sidebarGenderSelector">
                  {(["any", "man", "woman", "non_binary"] as Array<"any" | Gender>).map((item) => (
                    <button
                      className={`${sidebarGender === item ? "active" : ""} filter-${item}`}
                      key={item}
                      onClick={() => setSidebarGender(item)}
                      type="button"
                    >
                      {item === "any" ? <UsersRound size={16} /> : <GenderIcon gender={item} className="w-4 h-4" />}
                      <span>{item === "any" ? "All" : genders.find((g) => g.value === item)?.label}</span>
                    </button>
                  ))}
                </div>
                <div className="sideUsers">
                  {onlineUsers.filter(u => sidebarGender === "any" || u.gender === sidebarGender).slice(0, 20).map((user) => (
                    <button className={`sideUser ${user.gender} card-premium`} key={user.id} onClick={() => startRandomChat(user)} type="button">
                      <img className={`avatar-premium ${user.gender}`} alt="" src={displayAvatarUrl(user)} />
                      <div className="sideInfo">
                        <strong>{user.username}</strong>
                        <span>{user.age} • {user.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

          <section className="workspace">

            {tab === "search" && (
              <div className="filters searchFilters">
                <div className="searchPanel">
                  <Search aria-hidden="true" />
                  <input autoFocus placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
                </div>
                <div className="segmented">
                  {["any", "man", "woman", "non_binary"].map((item) => (
                    <button
                      className={`${filterGender === item ? "active" : ""} filter-${item}`}
                      key={item}
                      onClick={() => setFilterGender(item as "any" | Gender)}
                      type="button"
                    >
                      {item === "any" ? (
                        <>
                          <UsersRound aria-hidden="true" />
                          All
                        </>
                      ) : (
                        <>
                          <GenderIcon gender={item as Gender} />
                          {genders.find((g) => g.value === item)?.label}
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <label>
                  <span>Age {minAge}-{maxAge}</span>
                  <div className="rangePair">
                    <input min="18" max="89" type="number" value={minAge} onChange={(event) => setMinAge(Number(event.target.value))} />
                    <input min="18" max="89" type="number" value={maxAge} onChange={(event) => setMaxAge(Number(event.target.value))} />
                  </div>
                </label>
                <label>
                  <span>Country</span>
                  <select
                    value={searchCountry}
                    onChange={(event) => {
                      const nextCountry = event.target.value;
                      setSearchCountry(nextCountry);
                      setSearchState(nextCountry === "any" ? "any" : firstStateForCountry(nextCountry));
                    }}
                  >
                    <option value="any">All countries</option>
                    {countryOptions.map((item) => (
                      <option key={item.isoCode} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>State / Region</span>
                  <select
                    disabled={searchCountry === "any"}
                    value={searchState}
                    onChange={(event) => setSearchState(event.target.value)}
                  >
                    <option value="any">All states</option>
                    {searchStates.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <div className="filterGroup vibeGroup">
                  <span>Vibe today</span>
                  <div className="vibePills">
                    <button
                      className={searchVibe === "any" ? "active" : ""}
                      onClick={() => setSearchVibe("any")}
                      type="button"
                    >
                      All
                    </button>
                    {vibeOptions.map((item) => (
                      <button
                        className={searchVibe === item ? "active" : ""}
                        key={item}
                        onClick={() => setSearchVibe(item)}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {tab === "games" ? (
              <div className="gamesPage">
                <section className="sectionIntro">
                  <p className="eyebrow">Lightweight extras</p>
                  <h2>Games</h2>
                  <p>Small browser games for quick breaks. They stay local and do not affect chat performance.</p>
                </section>
                <div className="gameTabs">
                  {gameOptions.map((game) => (
                    <button
                      className={activeGame === game.value ? "active" : ""}
                      key={game.value}
                      onClick={() => setActiveGame(game.value)}
                      type="button"
                    >
                      <Gamepad2 aria-hidden="true" />
                      <span>{game.label}</span>
                    </button>
                  ))}
                </div>
                <section className="gamePanel">
                  {activeGame === "dino" ? (
                    <div className="gameStage">
                      <h3>Dino Runner</h3>
                      <p>Tap jump to clear the next obstacle. This lightweight version keeps score locally.</p>
                      <div className="runnerTrack"><span style={{ left: `${Math.min(80, 12 + dinoScore * 3)}%` }} /></div>
                      <strong className="gameScore">Score: {dinoScore}</strong>
                      <button className="btn-premium btn-primary" onClick={() => setDinoScore((score) => score + 1)} type="button">Jump</button>
                    </div>
                  ) : activeGame === "tic_tac_toe" ? (
                    <div className="gameStage">
                      <h3>Tic Tac Toe</h3>
                      <p>{ticStatus}</p>
                      <div className="ticGrid">
                        {ticBoard.map((cell, index) => (
                          <button key={`tic-${index}`} onClick={() => playTic(index)} type="button">{cell || "-"}</button>
                        ))}
                      </div>
                      <button className="quietAction" onClick={() => { setTicBoard(Array(9).fill("")); setTicTurn("X"); }} type="button">Reset board</button>
                    </div>
                  ) : activeGame === "snake" ? (
                    <div className="gameStage">
                      <h3>Snake</h3>
                      <p>Grow the line while keeping it in bounds. This MVP uses tap scoring before canvas controls.</p>
                      <div className="snakeBoard">
                        {Array.from({ length: 24 }, (_, index) => <span className={index <= snakeScore % 24 ? "active" : ""} key={`snake-${index}`} />)}
                      </div>
                      <strong className="gameScore">Length: {snakeScore + 1}</strong>
                      <button className="btn-premium btn-primary" onClick={() => setSnakeScore((score) => score + 1)} type="button">Move</button>
                    </div>
                  ) : activeGame === "rps" ? (
                    <div className="gameStage">
                      <h3>Rock Paper Scissors</h3>
                      <p>{rpsResult}</p>
                      <div className="rpsButtons">
                        {(["Rock", "Paper", "Scissors"] as const).map((move) => (
                          <button key={move} onClick={() => playRps(move)} type="button">{move}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="gameStage">
                      <h3>Memory</h3>
                      <p>Flip two cards and match the pairs.</p>
                      <div className="memoryGrid">
                        {memoryCards.map((card, index) => {
                          const visible = memoryOpen.includes(index) || memoryMatched.includes(index);
                          return (
                            <button className={visible ? "active" : ""} key={`memory-${index}`} onClick={() => flipMemory(index)} type="button">
                              {visible ? card : "?"}
                            </button>
                          );
                        })}
                      </div>
                      <button className="quietAction" onClick={() => { setMemoryOpen([]); setMemoryMatched([]); }} type="button">Reset cards</button>
                    </div>
                  )}
                </section>
              </div>
            ) : tab === "ai_chat" ? (
              <div className="emptyPanel">
                <Bot aria-hidden="true" />
                <h3>AI Chat</h3>
                <p>AI chat will be added after the real 1-on-1 realtime experience is stable.</p>
                <button className="btn-premium btn-primary" onClick={() => setTab("online")} type="button">
                  Browse Online Users
                </button>
              </div>
            ) : tab === "profile" ? (
              <div className="profilePage">
                <section className="profileHeroCard">
                  <div className="avatarUpload">
                    <img alt="" src={currentAvatarSrc} />
                    <label>
                      <input
                        accept="image/png,image/jpeg"
                        disabled={!authUser || avatarUploading}
                        onChange={(event) => {
                          void uploadProfileAvatar(event.target.files?.[0] ?? null);
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <span>{avatarUploading ? "Uploading..." : authUser ? "Upload photo" : "Register to upload"}</span>
                    </label>
                  </div>
                  <div>
                    <p className="eyebrow">{authUser ? "Registered profile" : "Guest profile"}</p>
                    <h3>{authUser ? username || session.username : session.username}</h3>
                    <p className="profileIdentityLine">
                      <span>{age}</span>
                      <span className={`genderChip ${gender}`}>
                        {gender ? <GenderIcon gender={gender as Gender} /> : null}
                        {genders.find((item) => item.value === gender)?.label}
                      </span>
                      <span>{state || "State hidden"}, {country}</span>
                    </p>
                    <span>{profileDraft.statusMessage || "Available"}</span>
                  </div>
                  <div className="completionMeter">
                    <strong>{profileCompleteness}%</strong>
                    <span>profile complete</span>
                  </div>
                </section>

                <section className="profileGrid">
                  <article className="profilePanel wide profileDetailsPanel">
                    <div className="panelHeader">
                      <h3>Profile Details</h3>
                      <button className="btn-premium btn-primary" onClick={saveProfilePreview} type="button">Save details</button>
                    </div>
                    <div className="profileDetailsGrid">
                      <label className="field">
                        <span>Username</span>
                        <input
                          disabled={!authUser}
                          maxLength={25}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="Register to change username"
                          value={username}
                        />
                      </label>
                      <label className="field">
                        <span>Age</span>
                        <select value={age} onChange={(event) => setAge(Number(event.target.value))}>
                          {Array.from({ length: 72 }, (_, index) => index + 18).map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Country</span>
                        <select
                          value={country}
                          onChange={(event) => {
                            const nextCountry = event.target.value;
                            setCountry(nextCountry);
                            setState(firstStateForCountry(nextCountry));
                          }}
                        >
                          {countryOptions.map((item) => (
                            <option key={item.isoCode} value={item.name}>{item.name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>State / Region</span>
                        <select required value={state} onChange={(event) => setState(event.target.value)}>
                          {availableStates.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="profileGenderEdit" aria-label="Gender identity">
                      {genders.map((item) => (
                        <button
                          className={`gender-tile ${item.value} ${gender === item.value ? "selected" : ""}`}
                          key={item.value}
                          onClick={() => setGender(item.value)}
                          type="button"
                        >
                          <GenderIcon gender={item.value} />
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
                    <p className="helperText">Completing your profile improves visibility and helps better matches understand your vibe before chatting.</p>
                  </article>

                  <article className="profilePanel">
                    <div className="panelHeader">
                      <h3>Registered unlocks</h3>
                      <button onClick={authUser ? saveProfilePreview : () => showAuthNotice("registered")} type="button">
                        {authUser ? "Save" : "Register"}
                      </button>
                    </div>
                    <div className="pillCloud">
                      {registeredFeatures.map((feature) => (
                        <span key={feature}>{feature}</span>
                      ))}
                    </div>
                  </article>

                  <article className="profilePanel wide">
                    <div className="panelHeader">
                      <h3>More About Me</h3>
                      <button type="button">Report profile</button>
                    </div>
                    <div className="profileFields">
                      {moreAboutFields.map(([field, label]) => (
                        <label className="field iconField" key={field}>
                          <span><ProfileFieldIcon field={field} />{label}</span>
                          <select value={profileDraft[field]} onChange={(event) => updateProfileField(field, event.target.value)}>
                            <option value="">Optional</option>
                            {(moreAboutOptions[field] ?? []).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </article>
                </section>
              </div>
            ) : tab === "search" ? (
              <div className="searchResults">
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <button className={`userRow ${user.gender} card-premium`} key={user.id} onClick={() => startRandomChat(user)} type="button">
                      <img className={`avatar-premium ${user.gender}`} alt="" src={displayAvatarUrl(user)} />
                      <div className="userIdentity">
                        <strong className="userNameLine">
                          {user.username}
                        </strong>
                        <div className="userDetailsLine">
                          <GenderIcon gender={user.gender} />
                          <span>{user.age} • {user.state || "State hidden"}</span>
                        </div>
                      </div>
                      <div className="userRowMeta">
                        <span className="sideFlag">{countryFlag(user.country)}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="emptyPanel">
                    <Search aria-hidden="true" />
                    <h3>No matches yet</h3>
                    <p>Try a wider age range, talk to all genders, or clear location filters.</p>
                    <button
                      className="quietAction"
                      onClick={() => {
                        setQuery("");
                        setFilterGender("any");
                        setSearchCountry("any");
                        setSearchState("any");
                        setSearchVibe("any");
                        setMinAge(18);
                        setMaxAge(89);
                      }}
                      type="button"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            ) : tab === "online" ? (
              <div className="onlinePage">
                <section className="welcomeHero">
                  <UsersRound aria-hidden="true" />
                  <h3>Browse Online Community</h3>
                  <p>Discover real people online right now from all over the world.</p>
                </section>

                <div className="focusActions" style={{ marginBottom: "2rem" }}>
                  <button className="btn-premium btn-primary" onClick={() => startRandomChat()} type="button">
                    <Rocket aria-hidden="true" />
                    Start Random Chat
                  </button>
                  <button className="btn-premium btn-secondary" onClick={() => setTab("search")} type="button">
                    <Search aria-hidden="true" />
                    Detailed Search
                  </button>
                </div>

                <div className="searchResults">
                  {onlineUsers.filter(u => u.id !== session?.id && !blockedIds.includes(u.id)).length ? (
                    onlineUsers.filter(u => u.id !== session?.id && !blockedIds.includes(u.id)).map((user) => (
                      <button className={`userRow ${user.gender} card-premium`} key={user.id} onClick={() => startRandomChat(user)} type="button">
                        <img className={`avatar-premium ${user.gender}`} alt="" src={displayAvatarUrl(user)} />
                        <div className="userIdentity">
                          <strong className="userNameLine">
                            {user.username}
                          </strong>
                          <div className="userDetailsLine">
                            <GenderIcon gender={user.gender} />
                            <span>{user.age} • {user.state || "State hidden"}</span>
                          </div>
                        </div>
                        <div className="userRowMeta">
                          <span className="sideFlag">{countryFlag(user.country)}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="emptyState">
                      <h3>No one online matching criteria</h3>
                      <p>Check back later or try inviting your friends.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : tab === "my_chat" ? (
              chatHistory.length ? (
                <div className="historyList">
                  {chatHistory.map((item) => (
                    <article className="historyRow" key={item.chat.id}>
                      <img alt="" src={displayAvatarUrl(item.partner ?? session)} />
                      <div>
                        <strong className="userNameLine">
                          {item.partner?.username ?? "Unknown chat"}
                          <span className={`statusDot ${item.chat.status === "active" ? "active" : "waiting"}`} />
                        </strong>
                        <span>{item.lastMessage}</span>
                        <small>{item.messages.length} messages - {new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                      </div>
                      <button
                        onClick={() => {
                          setChat(item.chat);
                          setMessages(item.messages);
                          setChatStatus(item.chat.status === "active" ? "active" : "waiting");
                          setTab("random");
                        }}
                        type="button"
                      >
                        Open
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="emptyPanel">
                  <MessagesSquare aria-hidden="true" />
                  <h3>My Chat</h3>
                  <p>Active chats from this session will appear here until you log out or the session expires.</p>
                  <button className="btn-premium btn-primary" onClick={() => { setTab("random"); void startRandomChat(); }} type="button">
                    Start Random Chat
                  </button>
                </div>
              )
            ) : tab === "friends" ? (
              <div className="emptyPanel">
                <UserPlus aria-hidden="true" />
                <h3>Friends</h3>
                <p>Registered users will be able to save friends and reconnect from here.</p>
                <button className="btn-premium btn-primary" onClick={() => showAuthNotice("registered")} type="button">
                  Register to Unlock
                </button>
              </div>
            ) : tab === "rooms" ? (
              <div className="roomsPage">
                {activeRoom ? (
                  <div className="activeRoomView">
                    <div className="roomHeader">
                      <button className="btn-premium btn-ghost" style={{ gap: '8px' }} onClick={() => setActiveRoom(null)} type="button">
                        <Rocket style={{ transform: "rotate(-90deg)" }} /> Back to Rooms
                      </button>
                      <div className="roomInfo">
                        <h3>{activeRoom.name}</h3>
                        <p>{activeRoom.description}</p>
                      </div>
                      <div className="roomMeta">
                        <span><UsersRound /> {activeRoom.participant_count} / {activeRoom.max_participants}</span>
                        <button className="btn-premium btn-danger" onClick={() => setActiveRoom(null)} type="button">Leave Room</button>
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
                ) : (
                  <>
                    <section className="sectionIntro">
                      <div className="introHeader">
                        <div>
                          <p className="eyebrow">Public & Custom</p>
                          <h2>Chat Rooms</h2>
                          <p>Join a room to hang out with multiple people at once.</p>
                        </div>
                        <button className="btn-premium btn-primary createRoomBtn" onClick={() => setCreateRoomModalOpen(true)} type="button">
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
                  </>
                )}

                {createRoomModalOpen && (
                  <div className="modalOverlay" onClick={() => setCreateRoomModalOpen(false)}>
                    <div className="modalBody" onClick={(e) => e.stopPropagation()}>
                      <div className="modalHeader">
                        <h3>Create Custom Room</h3>
                        <button className="btn-premium btn-ghost" onClick={() => setCreateRoomModalOpen(false)}>×</button>
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
                              <button className="btn-premium btn-secondary" onClick={() => setCreateRoomModalOpen(false)} type="button">Cancel</button>
                              <button className="btn-premium btn-primary" type="submit">Create Room</button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : tab === "premium" ? (
              <div className="premiumPage">
                <section className="premiumHero">
                  <div className="premiumIcon"><Crown /></div>
                  <p className="eyebrow">Elevate your experience</p>
                  <h2>OnChat Premium</h2>
                  <p>Get exclusive features, higher limits, and support the community.</p>
                </section>

                <div className="premiumGrid">
                  <div className="premiumCard">
                    <h3>Enhanced Identity</h3>
                    <ul>
                      <li><CheckCircle2 /> Exclusive Golden Username</li>
                      <li><CheckCircle2 /> Premium Badge on Profile</li>
                      <li><CheckCircle2 /> Unlimited Username Changes</li>
                      <li><CheckCircle2 /> Priority in Search Results</li>
                    </ul>
                  </div>
                  <div className="premiumCard">
                    <h3>Room Power</h3>
                    <ul>
                      <li><CheckCircle2 /> Create up to 280 Custom Rooms</li>
                      <li><CheckCircle2 /> Rooms last for 30 days</li>
                      <li><CheckCircle2 /> Larger Room capacity (up to 1000)</li>
                      <li><CheckCircle2 /> Special 'Premium' Room tag</li>
                    </ul>
                  </div>
                  <div className="premiumCard">
                    <h3>Chat Extras</h3>
                    <ul>
                      <li><CheckCircle2 /> Send HD Images instantly</li>
                      <li><CheckCircle2 /> Full GIF Library access</li>
                      <li><CheckCircle2 /> custom chat bubble themes</li>
                      <li><CheckCircle2 /> Ad-free experience</li>
                    </ul>
                  </div>
                </div>

                <div className="premiumCTA">
                  <h3>Unlock Everything for $4.99/mo</h3>
                  <p>Cancel anytime. Support the future of anonymous chat.</p>
                  {!isPremium ? (
                    <button className="btn-premium btn-primary premiumBtn" onClick={() => {
                      setIsPremium(true);
                      setStatus("Premium activated! Welcome to the elite tier.");
                    }} type="button">
                      Get Premium Now
                    </button>
                  ) : (
                    <div className="premiumActiveNotice">
                      <Crown /> You are an active Premium member.
                    </div>
                  )}
                </div>
              </div>
            ) : tab === "blocked" ? (
              blockedUsers.length ? (
                <div className="blockedList">
                  {blockedUsers.map((user) => (
                    <article className={`blockedRow ${user.gender}`} key={user.id}>
                      <img alt="" src={displayAvatarUrl(user)} />
                      <div>
                        <strong>{user.username}</strong>
                        <span>{user.age} - {countryFlag(user.country)} {user.state ?? "State hidden"} - {userVibe(user)}</span>
                      </div>
                      <button onClick={() => setBlockedIds((current) => current.filter((id) => id !== user.id))} type="button">
                        Unblock
                      </button>
                    </article>
                  ))}
                  <button className="quietAction" onClick={() => setBlockedIds([])} type="button">
                    Clear Session Blocks
                  </button>
                </div>
              ) : (
                <div className="emptyPanel">
                  <Ban aria-hidden="true" />
                  <h3>Blocked Users</h3>
                  <p>Users you block during this session will appear here with an unblock option.</p>
                  <button className="quietAction" onClick={() => setTab("online")} type="button">
                    Browse Online Users
                  </button>
                </div>
              )
            ) : tab === "settings" ? (
              <div className="emptyPanel">
                <Settings aria-hidden="true" />
                <h3>Settings</h3>
                <p>Application settings will go here. You can toggle themes, adjust notification preferences, and manage your account.</p>
                <button className="secondaryButton" onClick={toggleTheme} type="button">
                  Toggle Theme ({themeMode})
                </button>
              </div>
            ) : tab !== "random" && tab !== "chat" && !chat ? (
              <div className="lobbyPage">
                <section className="welcomeBlock">
                  <h2>Welcome <span>{session.username}</span> among us!</h2>
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
                      <button className="btn-premium btn-primary" onClick={() => startRandomChat()} type="button">
                        <Rocket aria-hidden="true" />
                        Random Match
                      </button>
                      <button className="btn-premium btn-ghost" onClick={() => setTab("online")} type="button">
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
            ) : (
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
                    <button onClick={() => setReportOpen((open) => !open)} disabled={!activePartner} type="button">Report</button>
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
                        <div className={`messageBubble ${message.sender_id === session.id ? "mine" : ""} ${isInvite ? "invite" : ""}`} key={message.id}>
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
                              {message.sender_id !== session.id && (
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
                            {message.sender_id === session.id ? (message.read_at ? " \u2713\u2713" : " \u2713") : ""}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <form className="composer" onSubmit={sendMessage}>
                  <div className="emojiPicker" aria-label="Emoji picker">
                    {[0x1F642, 0x1F602, 0x1F44D, 0x1F525, 0x1F4AC, 0x2728].map((code) => String.fromCodePoint(code)).map((emoji) => (
                      <button key={emoji} onClick={() => setMessageText((value) => `${value}${emoji}`)} type="button">
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
            )}
            {(status || warning) && (
              <div className="toast">
                {warning ? <strong>{warning}</strong> : null}
                {status ? <span>{status}</span> : null}
                {!isSupabaseConfigured ? <span>Live Supabase connection is unavailable.</span> : null}
              </div>
            )}
            </section>
          </div>
        </div>
        <MobileNav activeTab={tab} onTabChange={setTab} />
      </section>
      ))}
    </main>
  );
}
