-- Registered Profiles Table Schema
-- This table stores extended profile data for authenticated users.

CREATE TABLE IF NOT EXISTS public.registered_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    age INT DEFAULT 18,
    gender TEXT,
    country TEXT,
    state TEXT,
    avatar_url TEXT,
    status_message TEXT DEFAULT 'Available',
    bio TEXT,
    looking_for TEXT,
    height TEXT,
    weight TEXT,
    education TEXT,
    profession TEXT,
    marital_status TEXT,
    zodiac TEXT,
    hair TEXT,
    body_type TEXT,
    tattoos TEXT,
    religion TEXT,
    smoking_habits TEXT,
    drinking_habits TEXT,
    profile_completeness INT DEFAULT 0,
    priority_score INT DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.registered_profiles ENABLE ROW LEVEL SECURITY;

-- Policies are consolidated in production_hardening.sql, but we'll include base ones here
DROP POLICY IF EXISTS "Anyone can view profiles" ON registered_profiles;
CREATE POLICY "Anyone can view profiles" ON registered_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON registered_profiles;
CREATE POLICY "Users can insert their own profile" ON registered_profiles 
FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

DROP POLICY IF EXISTS "Users can update their own profile" ON registered_profiles;
CREATE POLICY "Users can update their own profile" ON registered_profiles 
FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);
