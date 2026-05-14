-- SERVER-SIDE MODERATION TRIGGERS (STUB)
-- This script implements automated message filtering and flagging.

-- 1. EXTEND CHAT_MESSAGES SCHEMA
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS moderation_note TEXT;

-- 2. MODERATION LOGIC
CREATE OR REPLACE FUNCTION handle_message_moderation()
RETURNS TRIGGER AS $$
DECLARE
  v_banned_words TEXT[] := ARRAY['spam', 'scam', 'offensive_word_1', 'offensive_word_2']; -- STUB: Add real words here
  v_word TEXT;
  v_found_bad_word BOOLEAN := FALSE;
BEGIN
  -- Simple case-insensitive check for banned words
  FOREACH v_word IN ARRAY v_banned_words
  LOOP
    IF NEW.content ILIKE '%' || v_word || '%' THEN
      v_found_bad_word := TRUE;
      EXIT;
    END IF;
  END LOOP;

  IF v_found_bad_word THEN
    NEW.is_flagged := TRUE;
    NEW.moderation_note := 'Automatically flagged by system moderation trigger.';
    
    -- Auto-generate a report for admins to review
    INSERT INTO user_reports (reporter_id, reported_user_id, chat_id, reason, details)
    VALUES (
      'SYSTEM', 
      NEW.sender_id::TEXT, 
      NEW.chat_id::TEXT, 
      'Automated Flagging', 
      'Message contained banned content: ' || NEW.content
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TRIGGER REGISTRATION
DROP TRIGGER IF EXISTS tr_message_moderation ON chat_messages;
CREATE TRIGGER tr_message_moderation
BEFORE INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION handle_message_moderation();
