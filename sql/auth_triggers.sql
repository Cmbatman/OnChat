-- AUTOMATIC PROFILE CREATION TRIGGER
-- This script ensures that every user in auth.users has a corresponding record in public.registered_profiles.
-- This is critical for Google OAuth users who don't go through the manual registration form.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.registered_profiles (
    user_id, 
    username, 
    email, 
    avatar_url,
    age,
    gender,
    country
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', 'User_' || substr(NEW.id::text, 1, 8)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    18, -- Default age
    'man', -- Default gender (user can change later)
    'United States' -- Default country
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
