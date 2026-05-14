-- Unified Reporting Table (user_reports)
-- Supports both guest sessions (guest-xxxx) and registered users (UUID).

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
DROP POLICY IF EXISTS "Anyone can create reports" ON public.user_reports;
CREATE POLICY "Anyone can create reports" ON public.user_reports 
FOR INSERT WITH CHECK (true);

-- Only admins can view and manage reports
-- Uses the is_admin() helper defined in production_hardening.sql
DROP POLICY IF EXISTS "Admins can view all reports" ON public.user_reports;
CREATE POLICY "Admins can view all reports" ON public.user_reports 
FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update reports" ON public.user_reports;
CREATE POLICY "Admins can update reports" ON public.user_reports 
FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete reports" ON public.user_reports;
CREATE POLICY "Admins can delete reports" ON public.user_reports 
FOR DELETE USING (is_admin());
