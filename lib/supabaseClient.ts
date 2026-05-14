import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://uhatzonqflkqorgdexht.supabase.co";
const fallbackSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoYXR6b25xZmxrcW9yZ2RleGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTE2MzAsImV4cCI6MjA5MzcyNzYzMH0.zBmAqqsz2T83R4k2rQsQLs5rH6zYGsThku7Ty3htbVc";

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  configuredSupabaseUrl && !configuredSupabaseUrl.includes("replace-with")
    ? configuredSupabaseUrl
    : fallbackSupabaseUrl;
const supabaseAnonKey =
  configuredSupabaseAnonKey && !configuredSupabaseAnonKey.includes("replace-with")
    ? configuredSupabaseAnonKey
    : fallbackSupabaseAnonKey;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey?.includes("replace-with");

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      realtime: {
        params: {
          eventsPerSecond: 8,
        },
      },
    })
  : null;
