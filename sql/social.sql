-- Friendship table
DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Recent connections table
DROP TABLE IF EXISTS recent_connections CASCADE;
CREATE TABLE IF NOT EXISTS recent_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_met_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, connected_user_id)
);

-- RLS for friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Allow users to see friendships where they are either user_id or friend_id
DROP POLICY IF EXISTS "Users can view their own friendships" ON friendships;
CREATE POLICY "Users can view their own friendships"
ON friendships FOR SELECT
USING (auth.uid()::TEXT = user_id::TEXT OR auth.uid()::TEXT = friend_id::TEXT);

-- Allow users to initiate friendship requests
DROP POLICY IF EXISTS "Users can insert friendship requests" ON friendships;
CREATE POLICY "Users can insert friendship requests"
ON friendships FOR INSERT
WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Allow users to update friendship status (accepting/blocking)
DROP POLICY IF EXISTS "Users can update their own friendships" ON friendships;
CREATE POLICY "Users can update their own friendships"
ON friendships FOR UPDATE
USING (auth.uid()::TEXT = user_id::TEXT OR auth.uid()::TEXT = friend_id::TEXT);

-- Allow users to remove friends
DROP POLICY IF EXISTS "Users can delete their own friendships" ON friendships;
CREATE POLICY "Users can delete their own friendships"
ON friendships FOR DELETE
USING (auth.uid()::TEXT = user_id::TEXT OR auth.uid()::TEXT = friend_id::TEXT);

-- RLS for recent_connections
ALTER TABLE recent_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own recent connections" ON recent_connections;
CREATE POLICY "Users can view their own recent connections"
ON recent_connections FOR SELECT
USING (auth.uid()::TEXT = user_id::TEXT);

DROP POLICY IF EXISTS "Users can insert their own recent connections" ON recent_connections;
CREATE POLICY "Users can insert their own recent connections"
ON recent_connections FOR INSERT
WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

DROP POLICY IF EXISTS "Users can update their own recent connections" ON recent_connections;
CREATE POLICY "Users can update their own recent connections"
ON recent_connections FOR UPDATE
USING (auth.uid()::TEXT = user_id::TEXT);
