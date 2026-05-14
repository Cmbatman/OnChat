import React from "react";
import { User, Users, UserPlus, UserMinus, UserX } from "lucide-react";
import { 
  countryOptions, 
  bannedUsernameWords, 
  linkPattern, 
  sexualTerms, 
  offensiveTerms,
  botUsers
} from "@/lib/constants";
import { Gender, GuestSession, RegisteredProfileRow, ProfileDraft } from "@/lib/types";

export function defaultAvatarUrl(gender: Gender): string {
  if (gender === "man") return "https://lh3.googleusercontent.com/aida-public/AB6AXuB_rXgTuYo0HZQSNeS4PwlC18wcuEk6cvfebH6Lomk6uHIYm2m8xJXBdNIvjJO6g0n0LrVX5Z0fui8hjeVbGeqdoqeHA9Z5O6ajdowJ1YijD6LRJoDd2JhT6ffTu2FeJW-jRp2eXU633DzvBIErTB2Ryzr-oKEMiF6SOGQ5_Boh8--jsQj3R_LjTanwpkXlYFaR0Y6j9ogCu6ok8CmRBwWGVC5NRIr6qpIwSEvhvV28O06xdiIgH4R1KrIYCvHZUbBvtTsBtpp8BwE";
  if (gender === "woman") return "https://lh3.googleusercontent.com/aida-public/AB6AXuCcBteUYg4uRmG_EsSMDy2oOWoeesbzI48-gERFSSFnsp6zpcJklPg2jBpU9a17Vr3P1Kh97gj3hy1lTQ9hisIgTIeeXj3HaESSg9GL40HhzZuF0f-u9ti1Jkt9wZxYt0N8PTAOS93179hrNKiprnGdMV_HqzGa8X_YmMQ4SenIeIBh5hT6Ux7lk8Jd0zvY_Ll9RYyaZEwvG9WkQ7-uBohzDp-7BaGSRwBrNnL1dk_X0KDorqq9XaowzYMjW9e7t-0HRrG0AbhdoVk";
  return "https://lh3.googleusercontent.com/aida-public/AB6AXuB50H539wCu8Wjzv1SntRLD90_dbY5yTHmq5NTSqRzX9FI3JFqmXI4udBN_nQi232BUDUv46otRLWI3uX4-1AckJWapH1XTIGkzzln3Hrr10IV1SimnfGCcEiFkQdVPsP3aeUqP_m4ZdTCr5wpta6s_PZUdFdig0z6G4Ha-8xJC7QI-4QlhYwvIH131g3y0Rg2lBtqTlkwm9IVFPTIqLDzFXjOWIyt3K_mZ4rK9f1J7iYtAFCA7LbFez-Li6gjLtHeeX0bfj1oBXMs";
}

export function displayAvatarUrl(user: any): string {
  if (!user) return defaultAvatarUrl("man");
  const avatarUrl = user.avatar_url || user.avatar_seed;
  if (avatarUrl) return avatarUrl;
  return defaultAvatarUrl(user.gender as Gender);
}

export function countryFlag(country?: string | null) {
  if (!country) return "🏳️";
  const matched = countryOptions.find((c) => c.name === country);
  if (!matched) return "🏳️";
  return (
    <img
      src={`https://flagcdn.com/w40/${matched.isoCode.toLowerCase()}.png`}
      alt={country}
      style={{ display: "inline-block", verticalAlign: "middle", width: "1.2em", height: "auto" }}
    />
  );
}

export function isUsernameValid(username: string) {
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

export function messageProblem(body: string, isEarlyMessage: boolean) {
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

export function mergeOnlineUsers(realUsers: GuestSession[], currentSession?: GuestSession | null) {
  const seen = new Set(realUsers.map((user) => user.id));
  const bots = botUsers.filter((bot) => bot.id !== currentSession?.id && !seen.has(bot.id));
  return [...realUsers, ...bots];
}

export function profileDraftFromRow(row: RegisteredProfileRow): ProfileDraft {
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

export function userVibe(user: any): string {
  if (user.vibe) return user.vibe;
  if (!user.vibes || user.vibes.length === 0) return "Just Chatting";
  return user.vibes[0];
}

export function isBotUser(userId: string | null): boolean {
  if (!userId) return false;
  return userId.startsWith("bot-");
}

export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}
