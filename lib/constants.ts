import { Gender } from "./ui-utils";
import { ProfileDraft, GameKey, GuestSession, Room } from "./types";
import { Country, State } from "country-state-city";

export const genders: Array<{ value: Gender; label: string }> = [
  { value: "man", label: "Man" },
  { value: "woman", label: "Woman" },
  { value: "non_binary", label: "Non-binary" },
];

export const vibeOptions = [
  "Gaming",
  "Music",
  "Memes",
  "Deep Talk",
  "Study",
  "Ideas",
  "Fun",
  "Casual",
  "Bored",
];

export const moreAboutFields = [
  ["lookingFor", "Looking for"],
  ["height", "Height"],
  ["weight", "Weight"],
  ["education", "Education"],
  ["profession", "Profession"],
  ["maritalStatus", "Marital Status"],
  ["zodiac", "Zodiac"],
  ["hair", "Hair"],
  ["bodyType", "Body type"],
  ["tattoos", "Tattoos"],
  ["religion", "Religion"],
  ["smoking", "Smoking habits"],
  ["drinking", "Drinking habits"],
] as const;

export const moreAboutOptions: Partial<Record<keyof ProfileDraft, string[]>> = {
  lookingFor: ["Friendship", "Random chat", "Deep talk", "Gaming friends", "Study buddy", "Language practice"],
  height: ["Prefer not to say", "Under 5 ft", "5 ft - 5 ft 5 in", "5 ft 6 in - 5 ft 11 in", "6 ft+"],
  weight: ["Prefer not to say", "Under 50 kg", "50-65 kg", "66-80 kg", "81-95 kg", "96 kg+"],
  education: ["High school", "College", "Graduate", "Postgraduate", "Self taught", "Prefer not to say"],
  profession: ["Student", "Engineer", "Designer", "Creator", "Healthcare", "Business", "Other"],
  maritalStatus: ["Single", "In a relationship", "Married", "Complicated", "Prefer not to say"],
  zodiac: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  hair: ["Black", "Brown", "Blonde", "Red", "Grey", "Other", "Prefer not to say"],
  bodyType: ["Slim", "Average", "Athletic", "Curvy", "Plus size", "Prefer not to say"],
  tattoos: ["No tattoos", "One tattoo", "A few tattoos", "Many tattoos", "Prefer not to say"],
  religion: ["Agnostic", "Atheist", "Buddhist", "Christian", "Hindu", "Muslim", "Sikh", "Spiritual", "Other", "Prefer not to say"],
  smoking: ["No", "Sometimes", "Yes", "Prefer not to say"],
  drinking: ["No", "Socially", "Yes", "Prefer not to say"],
};

export const countryOptions = Country.getAllCountries()
  .map((item) => ({ name: item.name, isoCode: item.isoCode }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const defaultCountryName =
  countryOptions.find((item) => item.name === "United States")?.name ??
  countryOptions[0]?.name ??
  "United States";

export function statesForCountry(countryName: string) {
  const countryOption =
    countryOptions.find((item) => item.name === countryName) ?? countryOptions[0];
  if (!countryOption) return ["Not specified"];

  const states = State.getStatesOfCountry(countryOption.isoCode)
    .map((item) => item.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return states.length ? states : ["Not specified"];
}

export function firstStateForCountry(countryName: string) {
  return statesForCountry(countryName)[0] ?? "Not specified";
}

export const botUsers: GuestSession[] = [
  ["bot-maya", "Maya Carter", 24, "woman", "United States", "California"],
  ["bot-ethan", "Ethan Brooks", 27, "man", "United States", "New York"],
  ["bot-aisha", "Aisha Khan", 22, "woman", "India", "Maharashtra"],
  ["bot-ryan", "Ryan Mitchell", 31, "man", "Canada", "Ontario"],
  ["bot-sofia", "Sofia Rivera", 26, "woman", "Mexico", "Jalisco"],
  ["bot-liam", "Liam Foster", 29, "man", "United Kingdom", "England"],
  ["bot-emma", "Emma Wilson", 23, "woman", "Australia", "Victoria"],
  ["bot-noah", "Noah Bennett", 34, "man", "Germany", "Bavaria"],
  ["bot-olivia", "Olivia Martin", 28, "woman", "France", "Ile-de-France"],
  ["bot-lucas", "Lucas Silva", 25, "man", "Brazil", "Sao Paulo"],
  ["bot-ava", "Ava Thompson", 30, "woman", "United States", "Texas"],
  ["bot-mason", "Mason Clark", 21, "man", "Canada", "British Columbia"],
  ["bot-isabella", "Isabella Rossi", 32, "woman", "Australia", "New South Wales"],
  ["bot-james", "James Walker", 36, "man", "United Kingdom", "Scotland"],
  ["bot-mia", "Mia Anderson", 20, "woman", "United States", "Florida"],
  ["bot-ben", "Benjamin Lee", 33, "man", "South Korea", "Seoul"],
  ["bot-charlotte", "Charlotte King", 27, "woman", "Germany", "Berlin"],
  ["bot-harper", "Harper Morgan", 29, "non_binary", "United States", "Washington"],
  ["bot-daniel", "Daniel Evans", 24, "man", "India", "Karnataka"],
  ["bot-amelia", "Amelia Scott", 35, "woman", "United Kingdom", "Wales"],
  ["bot-jack", "Jack Turner", 23, "man", "Australia", "Queensland"],
  ["bot-zara", "Zara Ahmed", 26, "woman", "United Arab Emirates", "Dubai"],
  ["bot-owen", "Owen Hughes", 38, "man", "Canada", "Alberta"],
  ["bot-nora", "Nora Patel", 25, "woman", "India", "Delhi"],
  ["bot-riley", "Riley Stone", 28, "non_binary", "United States", "Oregon"],
].map(([id, username, age, gender, country, state], index) => ({
  id: id as string,
  username: username as string,
  age: age as number,
  gender: gender as Gender,
  country: country as string,
  state: state as string,
  avatar_seed: id as string,
  status: "online",
  vibe: vibeOptions[index % vibeOptions.length],
}));

export const botReplies = [
  "Hey, nice to meet you.",
  "That sounds interesting. Tell me more.",
  "I am testing the chat with you right now.",
  "Cool. What are you up to today?",
  "Nice vibe. I am here if you want to keep chatting.",
  "That makes sense. Random chats can be fun.",
  "Got it. How has your day been so far?",
];

export const registeredFeatures = [
  "Animated GIFs in chat",
  "Claim and permanently reserve usernames",
  "Change username anytime",
  "Customize message font color and font size",
  "Add friends and favourites",
  "Reconnect with recent users",
  "Priority online placement",
  "Faster random matching",
  "Advanced filters",
  "Custom avatar upload",
  "Short bio and status",
  "Trusted user badges",
  "Higher image limits",
  "Better blocking controls",
];

export const guestLimitations = [
  "Temporary username only",
  "No permanent friends list",
  "No reconnect system",
  "Limited customization",
  "Lower priority matching",
  "Session-based identity only",
];

export const gameOptions: Array<{ value: GameKey; label: string; description: string }> = [
  { value: "dino", label: "Dino Runner", description: "Tap jump, avoid the next obstacle, and build a quick streak." },
  { value: "tic_tac_toe", label: "Tic Tac Toe", description: "Classic X and O, lightweight and instant." },
  { value: "snake", label: "Snake", description: "Grow the line without hitting the edge." },
  { value: "rps", label: "Rock Paper Scissors", description: "Fast tap game for tiny breaks between chats." },
  { value: "memory", label: "Memory", description: "Flip cards and match the pairs." },
];

export const bannedUsernameWords = ["admin", "moderator", "support", "onchat", "sex", "nude"];
export const sexualTerms = ["sex", "nude", "nudes", "horny", "xxx", "porn"];
export const offensiveTerms = ["fuck", "shit", "bitch", "slut", "whore"];
export const linkPattern = /(https?:\/\/|www\.|\.com|\.net|\.org|\.io|\.gg|\.me)/i;

export const preMadeRooms: Room[] = [
  { id: "00000000-0000-0000-0000-000000000001", name: "General Chat", description: "The main room for everyone to hang out.", creator_id: null, is_premium: false, max_participants: 500, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "General" },
  { id: "00000000-0000-0000-0000-000000000002", name: "India Chat", description: "A space for the Indian community to connect.", creator_id: null, is_premium: false, max_participants: 300, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Regional" },
  { id: "00000000-0000-0000-0000-000000000003", name: "Singles Chat", description: "Meet new people and find your spark.", creator_id: null, is_premium: false, max_participants: 200, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Social" },
  { id: "00000000-0000-0000-0000-000000000004", name: "USA Chat", description: "Chat with people from the United States.", creator_id: null, is_premium: false, max_participants: 250, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Regional" },
  { id: "00000000-0000-0000-0000-000000000005", name: "Europe Chat", description: "Connect with people across Europe.", creator_id: null, is_premium: false, max_participants: 250, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Regional" },
  { id: "00000000-0000-0000-0000-000000000006", name: "Asia Chat", description: "Connect with people across Asia.", creator_id: null, is_premium: false, max_participants: 250, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Regional" },
  { id: "00000000-0000-0000-0000-000000000007", name: "Gaming Chat", description: "Discuss games, find teammates, and share clips.", creator_id: null, is_premium: false, max_participants: 300, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Interests" },
  { id: "00000000-0000-0000-0000-000000000008", name: "Study Chat", description: "A quiet space to study together and share notes.", creator_id: null, is_premium: false, max_participants: 200, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Interests" },
  { id: "00000000-0000-0000-0000-000000000009", name: "Movies Chat", description: "Discuss the latest movies, series, and reviews.", creator_id: null, is_premium: false, max_participants: 200, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Interests" },
  { id: "00000000-0000-0000-0000-000000000010", name: "Sports Chat", description: "Discuss live matches, teams, and scores.", creator_id: null, is_premium: false, max_participants: 250, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Interests" },
  { id: "00000000-0000-0000-0000-000000000011", name: "Deep Talk Chat", description: "Intellectual discussions and meaningful conversations.", creator_id: null, is_premium: false, max_participants: 150, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Social" },
  { id: "00000000-0000-0000-0000-000000000012", name: "Fun Chat", description: "Jokes, memes, and casual fun.", creator_id: null, is_premium: false, max_participants: 250, participant_count: 0, created_at: new Date().toISOString(), expires_at: null, category: "Social" },
];

export const roomLimits = {
  registered: {
    maxRooms: 10,
    expiryMs: 24 * 60 * 60 * 1000, // 1 day
  },
  premium: {
    maxRooms: 280,
    expiryMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};
