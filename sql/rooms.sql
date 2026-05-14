-- ONCHAT ROOMS & MESSAGES SCHEMA
-- Implements Priority 3: Public & Custom Rooms

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for pre-made rooms
    category TEXT DEFAULT 'General',
    is_premium BOOLEAN DEFAULT FALSE,
    max_participants INT DEFAULT 20,
    participant_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for pre-made rooms
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Room Messages Table
CREATE TABLE IF NOT EXISTS public.room_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL, -- Can be guest-xxxx or auth UUID
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Room Participants (Optional, for tracking who is where)
-- For now, we'll keep it simple and just use participant_count in the rooms table.

-- 4. RLS for Rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Registered users can create rooms" ON public.rooms;
CREATE POLICY "Registered users can create rooms" ON public.rooms 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Creators can update their own rooms" ON public.rooms;
CREATE POLICY "Creators can update their own rooms" ON public.rooms 
FOR UPDATE USING (auth.uid() = creator_id OR is_admin());

DROP POLICY IF EXISTS "Creators can delete their own rooms" ON public.rooms;
CREATE POLICY "Creators can delete their own rooms" ON public.rooms 
FOR DELETE USING (auth.uid() = creator_id OR is_admin());

-- 5. RLS for Room Messages
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view room messages" ON public.room_messages;
CREATE POLICY "Anyone can view room messages" ON public.room_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can send room messages" ON public.room_messages;
CREATE POLICY "Anyone can send room messages" ON public.room_messages FOR INSERT WITH CHECK (true);

-- 6. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_room_messages_room_id ON public.room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_expires_at ON public.rooms(expires_at);
