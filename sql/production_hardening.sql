-- ONCHAT PRODUCTION HARDENING & SECURITY PATTERNS
-- This script implements server-side logic for matching and discovery to prevent client-side exploitation.

-- 1. HELPER: Admin Check
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'axel@onchat.app' OR 
    auth.jwt() ->> 'email' LIKE '%admin@onchat.app' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. SECURE MATCHING RPC
-- Function to find a random online user and start a chat safely
CREATE OR REPLACE FUNCTION match_random_user(
  p_requester_id TEXT,
  p_filter_gender TEXT DEFAULT 'any',
  p_min_age INT DEFAULT 18,
  p_max_age INT DEFAULT 99
)
RETURNS TABLE (
  id UUID,
  user_a TEXT,
  user_b TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_matched_id TEXT;
  v_chat_id UUID;
  v_requester_uuid UUID;
BEGIN
  -- Try to parse requester_id as UUID if possible (for block checks)
  BEGIN
    v_requester_uuid := CAST(p_requester_id AS UUID);
  EXCEPTION WHEN OTHERS THEN
    v_requester_uuid := NULL;
  END;

  -- Find a candidate from guest_sessions first (most active for random chat)
  SELECT gs.id::TEXT
  INTO v_matched_id
  FROM guest_sessions gs
  WHERE gs.status = 'online'
    AND gs.id::TEXT != p_requester_id
    AND (p_filter_gender = 'any' OR gs.gender = p_filter_gender)
    AND gs.age BETWEEN p_min_age AND p_max_age
    -- Respect blocks if requester is registered
    AND (v_requester_uuid IS NULL OR gs.id::TEXT NOT IN (
      SELECT friend_id::TEXT FROM friendships WHERE user_id = v_requester_uuid AND status = 'blocked'
      UNION
      SELECT user_id::TEXT FROM friendships WHERE friend_id = v_requester_uuid AND status = 'blocked'
    ))
  ORDER BY RANDOM()
  LIMIT 1;

  -- If no guest found, try registered_profiles
  IF v_matched_id IS NULL THEN
    SELECT rp.user_id::TEXT
    INTO v_matched_id
    FROM registered_profiles rp
    WHERE rp.user_id::TEXT != p_requester_id
      AND (p_filter_gender = 'any' OR rp.gender = p_filter_gender)
      AND rp.age BETWEEN p_min_age AND p_max_age
      -- Respect blocks
      AND (v_requester_uuid IS NULL OR rp.user_id::TEXT NOT IN (
        SELECT friend_id::TEXT FROM friendships WHERE user_id = v_requester_uuid AND status = 'blocked'
        UNION
        SELECT user_id::TEXT FROM friendships WHERE friend_id = v_requester_uuid AND status = 'blocked'
      ))
    ORDER BY RANDOM()
    LIMIT 1;
  END IF;

  -- If a partner is found, create the chat
  IF v_matched_id IS NOT NULL THEN
    INSERT INTO chats (user_a, user_b, status)
    VALUES (p_requester_id, v_matched_id, 'active')
    RETURNING chats.id INTO v_chat_id;

    -- Proper return query
    RETURN QUERY 
    SELECT c.id, c.user_a, c.user_b, c.status, c.created_at
    FROM chats c
    WHERE c.id = v_chat_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. SECURE DISCOVERY RPC
-- Efficiently get discovery profiles without leaking block lists to the client
CREATE OR REPLACE FUNCTION get_discover_profiles(
  p_requester_id TEXT, -- Use TEXT to allow both UUID and guest IDs
  p_limit INT DEFAULT 10
)
RETURNS SETOF registered_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM registered_profiles
  WHERE user_id::TEXT != p_requester_id
    AND user_id::TEXT NOT IN (
      -- Exclude friends and blocked
      SELECT friend_id::TEXT FROM friendships WHERE user_id::TEXT = p_requester_id
      UNION
      SELECT user_id::TEXT FROM friendships WHERE friend_id::TEXT = p_requester_id
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. CONSOLIDATED REPORTS TABLE (user_reports)
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id TEXT NOT NULL, -- Can be guest-xxxx or auth UUID
    reported_user_id TEXT NOT NULL,
    chat_id TEXT,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to report
DROP POLICY IF EXISTS "Anyone can report" ON public.user_reports;
CREATE POLICY "Anyone can report" ON public.user_reports 
FOR INSERT WITH CHECK (true);

-- Only admins can view and manage reports
DROP POLICY IF EXISTS "Admins can view all reports" ON public.user_reports;
CREATE POLICY "Admins can view all reports" ON public.user_reports 
FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update reports" ON public.user_reports;
CREATE POLICY "Admins can update reports" ON public.user_reports 
FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete reports" ON public.user_reports;
CREATE POLICY "Admins can delete reports" ON public.user_reports 
FOR DELETE USING (is_admin());


-- 5. CORE TABLES RLS
-- registered_profiles
ALTER TABLE registered_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view profiles" ON registered_profiles;
CREATE POLICY "Anyone can view profiles" ON registered_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON registered_profiles;
CREATE POLICY "Users can insert their own profile" ON registered_profiles 
FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

DROP POLICY IF EXISTS "Users can update their own profile" ON registered_profiles;
CREATE POLICY "Users can update their own profile" ON registered_profiles 
FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT OR is_admin());

-- guest_sessions
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view guest sessions" ON guest_sessions;
CREATE POLICY "Anyone can view guest sessions" ON guest_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert guest sessions" ON guest_sessions;
CREATE POLICY "Anyone can insert guest sessions" ON guest_sessions FOR INSERT WITH CHECK (true);

-- Note: Guest update is currently permissive to allow status updates from client.
-- In a more hardened setup, we would use a private token/cookie.
DROP POLICY IF EXISTS "Guests can update their own session" ON guest_sessions;
CREATE POLICY "Guests can update their own session" ON guest_sessions 
FOR UPDATE USING (true); 


-- 6. CHATS & MESSAGES HARDENING
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Only members or admins can view chats
DROP POLICY IF EXISTS "Members can view chats" ON chats;
CREATE POLICY "Members can view chats" ON chats 
FOR SELECT USING (
  user_a::TEXT = auth.uid()::TEXT OR 
  user_b::TEXT = auth.uid()::TEXT OR 
  user_a::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT OR 
  user_b::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT OR
  is_admin()
);

-- Only chat members can view messages
DROP POLICY IF EXISTS "Chat members can view messages" ON chat_messages;
CREATE POLICY "Chat members can view messages" ON chat_messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id::TEXT = chat_messages.chat_id::TEXT 
    AND (
      chats.user_a::TEXT = auth.uid()::TEXT OR 
      chats.user_b::TEXT = auth.uid()::TEXT OR 
      chats.user_a::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT OR 
      chats.user_b::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT OR
      is_admin()
    )
  )
);

-- Users can only insert messages to chats they belong to
DROP POLICY IF EXISTS "Users can send messages to their chats" ON chat_messages;
CREATE POLICY "Users can send messages to their chats" ON chat_messages 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id::TEXT = chat_messages.chat_id::TEXT 
    AND (
      chats.user_a::TEXT = auth.uid()::TEXT OR 
      chats.user_b::TEXT = auth.uid()::TEXT OR
      chats.user_a::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT OR 
      chats.user_b::TEXT = (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT
    )
  )
);

-- 7. FRIENDSHIPS HARDENING
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own friendships" ON friendships;
CREATE POLICY "Users can view their own friendships" ON friendships
FOR SELECT USING (
  user_id::TEXT = auth.uid()::TEXT OR 
  friend_id::TEXT = auth.uid()::TEXT OR
  is_admin()
);

DROP POLICY IF EXISTS "Users can manage their own friendships" ON friendships;
CREATE POLICY "Users can manage their own friendships" ON friendships
FOR ALL USING (
  user_id::TEXT = auth.uid()::TEXT OR 
  is_admin()
);
