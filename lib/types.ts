import { Gender } from "./ui-utils";
export type { Gender };

export type Tab =
  | "lobby"
  | "online"
  | "random"
  | "chat"
  | "rooms"
  | "ai_chat"
  | "games"
  | "my_chat"
  | "friends"
  | "discover"
  | "blocked"
  | "admin"
  | "search"
  | "settings"
  | "premium"
  | "profile";

export type ChatStatus = "idle" | "waiting" | "active";
export type AccountMode = "guest" | "registered";
export type AuthView = "login" | "register";
export type ThemeMode = "light" | "dark";
export type GameKey = "dino" | "tic_tac_toe" | "snake" | "rps" | "memory";

export type GuestSession = {
  id: string;
  username: string;
  age: number;
  gender: Gender;
  country: string;
  state: string | null;
  avatar_seed: string;
  status?: string;
  vibe?: string;
  last_seen_at?: string;
};

export type Chat = {
  id: string;
  user_a: string;
  user_b: string | null;
  status: string;
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export type ChatHistoryItem = {
  chat: Chat;
  partner: GuestSession | null;
  messages: ChatMessage[];
  lastMessage: string;
  updatedAt: string;
};

export type ProfileDraft = {
  statusMessage: string;
  bio: string;
  lookingFor: string;
  height: string;
  weight: string;
  education: string;
  profession: string;
  maritalStatus: string;
  zodiac: string;
  hair: string;
  bodyType: string;
  tattoos: string;
  religion: string;
  smoking: string;
  drinking: string;
};

export type RegisteredProfileRow = {
  user_id: string;
  username: string;
  age: number | null;
  gender: Gender | null;
  country: string | null;
  state: string | null;
  avatar_url: string | null;
  status_message: string | null;
  bio: string | null;
  looking_for: string | null;
  height: string | null;
  weight: string | null;
  education: string | null;
  profession: string | null;
  marital_status: string | null;
  zodiac: string | null;
  hair: string | null;
  body_type: string | null;
  tattoos: string | null;
  religion: string | null;
  smoking_habits: string | null;
  drinking_habits: string | null;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  creator_id: string | null; // null for system/pre-made rooms
  is_premium: boolean;
  max_participants: number;
  participant_count: number;
  created_at: string;
  expires_at: string | null;
  category: string;
};

export type RoomParticipant = {
  room_id: string;
  user_id: string;
  joined_at: string;
};

export type FriendshipStatus = "pending" | "accepted" | "blocked";

export type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
  // Join fields for profile data
  friend_profile?: RegisteredProfileRow;
  user_profile?: RegisteredProfileRow;
};

export type RecentConnection = {
  id: string;
  user_id: string;
  connected_user_id: string;
  last_met_at: string;
  // Join fields for profile data
  profile?: RegisteredProfileRow;
};

export interface AppNotification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'system';
  message: string;
  payload?: any;
  read: boolean;
  created_at: string;
}

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'ignored';
  created_at: string;
}
