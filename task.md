# OnChat Project Checklist

- `[x]` **Priority 1: Mobile Layout & Stability**
    - `[x]` Implement `MobileNav` component
    - `[x]` Define missing dashboard layout CSS in `globals.css` (.appMain, .sideNav, etc.)
    - `[x]` Fix media query collisions for dark/light mode
    - `[x]` Ensure sidebar toggle works reliably on mobile
    - `[x]` Test layout transitions between mobile and desktop viewports
    - `[x]` Fix build errors related to "use client" and Supabase nullability
    - `[x]` Resolve AppContext property mismatches (blockedUsers, is_premium)
    - `[x]` Replace removed icons (Chrome -> Globe)

- `[x]` **Priority 2: Public & Legal Pages**
    - `[x]` Create `LegalLayout` component for consistent typography
    - `[x]` Implement `/terms` and `/privacy`
    - `[x]` Implement `/faq` and `/safety`
    - `[x]` Implement `/contact` and `/advertise`
    - `[x]` Update landing page footer with new links

- `[x]` **Priority 3: SEO & Design Polish**
    - `[x]` Add global SEO metadata to `layout.tsx`
    - `[x]` Implement specific metadata for rooms and public pages
    - `[x]` Audit color contrast for WCAG AA compliance
    - `[x]` Add smooth page transitions with Framer Motion
    - `[x]` Add global PC usability improvements (scrollbars, font smoothing)

- `[x]` **Priority 4: 1 on 1 Features**
    - `[x]` Online Users tab full-view
    - `[x]` Random Chat tab (Manual start, Matching logic)
    - `[x]` Search page `/app/search`
    - `[x]` My Chats / History `/app/my-chats`
    - `[x]` Favourites `/app/favorites`
    - `[x]` Profile & Settings pages

- `[x]` **Priority 5: Rooms & Premium**
    - `[x]` Rooms page `/app/rooms` (12 Pre-made rooms)
    - `[x]` Custom Rooms feature (Registered/Premium)
    - `[x]` Create Room Modal
    - `[x]` Room Chat Page `/app/rooms/[roomId]`
    - `[x]` Room Invite from Chat (Unlock after 15 messages)
    - `[x]` Premium page `/app/premium`

- `[x]` **Priority 6: Admin/Moderation Foundations**
    - `[x]` Create admin dashboard foundations (`/admin`)
    - `[x]` Reports, Users, Rooms management (Live data integration & Realtime)
    - `[x]` Moderation CRUD (Ignore/Investigate) & History Log
    - `[x]` Admin access routing logic & automated auth listener
    - `[x]` Dashboard polish with Framer Motion transitions

- `[x]` **Priority 7: Social Features & Connectivity**
    - `[x]` Friend Request/Accept/Remove logic in AppContext
    - `[x]` Recent Connections tracking on chat start
    - `[x]` Friends List component with pending/accepted tabs
    - `[x]` Profile Completeness progress indicator
    - `[x]` Integrated "Add Friend" in Chat Interface

- `[x]` **Priority 8: Social Enhancements & Safety (Finalized)**
    - `[x]` User Discovery Engine (Sparkles/Vibe matching)
    - `[x]` Notification Management (Queue + Clear All)
    - `[x]` Friends List Enhancements (Blocked Section)
    - `[x]` Admin Moderation Portal (Live Reports Hub)
    - `[x]` Standardized "Dark Tech" UI (CSS Variable Refinement)
    - `[x]` Fixed `AppContext` hydration/import errors
    - `[x]` Fixed `Sidebar` import compilation error

- `[x]` **Priority 9: Production Readiness & Hardening**
    - `[x]` Create SQL script for production hardening (RPCs, RLS)
    - `[x]` Refactor `AppContext.tsx` to use RPCs
    - `[x]` Fix SQL Type Mismatch (`uuid = text`) across all RPCs and RLS policies
    - `[x]` Consolidate `reports` table to `user_reports` and update Admin Dashboard
    - `[x]` Harden `friendships` RLS policies
    - `[x]` Verify `handle_new_auth_user` trigger for Google OAuth
    - `[x]` Setup Password Reset & Auth Email templates
    - `[x]` Final RLS security audit and schema consolidation
    - `[ ]` Connect to GitHub & Enable Vercel Auto-deploy
