# OnChat Rebuild Status

## Done

- Archived the previous site into `legacy/`.
- Rebuilt the active project as a fresh Next.js app.
- Installed `@supabase/supabase-js`.
- Added `.env.local.example` for Supabase project `uhatzonqflkqorgdexht`.
- Added `supabase/schema.sql` for guest sessions, live users, chats, messages, reports, blocks, realtime publication, and inactivity expiry.
- Added `supabase/patch_started_at.sql` for existing databases created before `chats.started_at` was added.
- Added `supabase/patch_registered_profiles.sql` for registered profiles, friends, recent connections, and profile reports.
- Added Vercel cost-control upgrade:
  - PWA manifest.
  - Service-worker app shell/static asset cache.
  - `robots.txt` crawler blocking.
  - `noindex, nofollow` metadata.
  - CDN cache headers.
  - Vercel Image Optimization disabled.
  - Cost-control architecture notes in `COST_CONTROL.md`.
- Added custom registered profile avatar uploads:
  - PNG/JPEG only.
  - 2 MB client-side max.
  - Direct browser upload to Supabase Storage bucket `OnChat Profile`.
  - Public avatar URL saved on `registered_profiles.avatar_url`.
  - Storage policy patch in `supabase/patch_profile_storage_policies.sql`.
- Added UI/theme upgrade:
  - Manual light/dark toggle with saved preference.
  - Dark orange/peach landing style and light blue/orange style.
  - Dotted-grid background.
  - Updated landing trust icons, proof badge, experience cards, and footer.
  - Started app dashboard with top navigation, online user sidebar, welcome lobby, action card, room tiles, and footer links.
- Built a real client MVP shell:
  - Original OnChat landing copy with `Real Conversations Start Here`, not Chatib-style wording.
  - Agreement/consent popup before entry with links to Terms, Privacy, and Safety.
  - Guest entry form.
  - Username validation and cached username reuse.
  - Age range from 18 to 89.
  - Gender identity choices: Man, Woman, Non-binary.
  - Vibe selection.
  - Browser-based light/dark theme.
  - Polished dark-mode chat frame with higher contrast input, bubbles, tabs, headers, and hover states.
  - Online Users as the default experience.
  - Top-level sections for 1 on 1 Chat, Rooms, AI Chat, and Games.
  - 1-on-1 subnavigation for Online Users, Random Chat, Search, My Chat, Friends, and Blocked Users.
  - Rooms placeholder for post-MVP room creation/discovery.
  - Search tab that reveals the Search input only when needed.
  - Dedicated Search page for filters and results, keeping Random Chat free of inline gender/age filter rows.
  - Compact fixed top navigation with no desktop horizontal scrollbar.
  - Online Users sidebar as the main discovery rail with a compact gender selector replacing the old filter icon.
  - Viewport-fit chat layout with fixed chat header, internal message scrolling, fixed input bar, and auto-scroll after sent/received messages.
  - Next Random User action lives inside the active random-chat header instead of large page headers.
  - Realtime incoming-chat subscriptions so a real user who is selected by another user receives the active chat without refreshing.
  - Optimistic real-message sending with Supabase persistence and realtime refresh, separate from demo/bot reply simulation.
  - Compact online user rows with category avatar, username, online dot after the username, age, country flag, state, gender indicator, vibe line, and favourite action.
  - Advanced filters for username/search, age range, gender, and location.
  - 1-on-1 chat UI with dynamic gender-accented header, timestamps, read ticks, emoji picker, skip, block, report, leave actions, and auto-scroll.
  - Session-only My Chat history that persists during the current session and clears on logout or expiry.
  - Blocked Users section with unblock and clear-session-blocks actions.
  - Link blocking and stricter early-message safety checks.
  - 8-minute inactivity warning and 10-minute chat expiry handling.
  - Supabase public anon-key fallback plus explicit env variable support to avoid accidental demo-mode deployments.
  - Registered-user feature preview and Profile tab.
  - Editable profile preview with category avatar, gender/age/country/state editing, status, bio, dropdown-based optional personal details, profile completeness, and profile report action.
  - Profile dropdown with Edit Profile and Logout.
  - Supabase email/password login and registration.
  - Registered profile save/load through `registered_profiles`.
  - Added `supabase/patch_registered_profiles_hair.sql` for existing registered-profile tables.
  - Added original Terms, Privacy, Safety, Cookie Policy, FAQ, and Promote pages.
  - Added `/contact` with support reason dropdown, CAPTCHA, Send/Clear actions, support card, and footer legal links.
  - Added Games section with Dino Runner, Tic Tac Toe, Snake, Rock Paper Scissors, and Memory placeholders/interactions.
  - Replaced "Anyone" terminology with "All" universally across discovery tools and dropdowns.
  - Restructured sidebar gender selector into a symmetric 2x2 grid and refined search filter alignments.
  - Implemented dynamic gender-specific glowing box-shadows on active filter buttons.
  - Moved form validation warnings (Username, Gender) to render inline directly beneath their respective input fields.
  - Resolved Vercel deployment blockers by enforcing strict TypeScript casting and validation for the `Gender` state.
- Implemented Admin Moderation Dashboard (`/admin`):
  - Real-time moderation log with Supabase subscription.
  - User and Room management foundations.
  - Live statistics for users, rooms, and reports.
  - Framer Motion transitions and "Emerald" brand styling.
  - Global page transitions and WCAG contrast improvements.
- **Production Security & Hardening**:
  - Resolved `uuid = text` type mismatch across all database functions and RLS policies.
  - Consolidated reporting into a unified `user_reports` table.
  - Synchronized Admin Dashboard with the new reporting schema.
  - Hardened RLS for `friendships`, `chats`, `chat_messages`, and `registered_profiles`.
  - Implemented `handle_new_auth_user` trigger for automated Google OAuth profile provisioning.

## Active Phase: 10 - Final Verification & Launch
- [x] Migrated matching and discovery logic to secure Supabase RPCs
- [x] Implemented strict RLS for all tables
- [x] Standardized user reporting with `user_reports`
- [x] Resolved SQL Type Mismatch (`uuid = text`) across all policies
- [x] Updated Admin Dashboard to unified moderation schema
- [ ] Final end-to-end verification of Google OAuth (GCP Console configuration required)
- [ ] Connect to GitHub & Vercel Auto-deploy

## Required Before Live Supabase Testing

- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` or Vercel for explicit configuration. The app also includes a public fallback for the current OnChat Supabase project.
- Run `supabase/schema.sql` in the Supabase SQL Editor.
- Restart the local dev server.

## Latest UI Rules

- Consent appears only after Start Chatting Now, Log In, or Register.
- Primary actions use blue/indigo. Orange remains a brand accent.
- Light mode must use light cards and dark readable text; dark mode must use true dark surfaces with readable borders, inputs, modals, sidebars, and message bubbles.
- Online user rows use category avatars, username plus spaced online dot, age, country/state, vibe, gender icon, and favourite action.
- Random Chat must stay conversation-focused. All filtering belongs in the Search tab.
- Active chat pages should use `100vh` app layout rules: fixed top nav, fixed sidebar/workspace height, internal scroll for message bodies and user lists.
- Sidebar Online Users rows must keep avatar, username plus spaced online dot, age, flag/country/state, vibe, gender icon, and favourite aligned in a compact 2-line layout.
- Message blocking should show a top-level/modal warning titled `Message not sent` and link to Safety Guidelines.
- Contact/support, Games, legal pages, auth pages, profile, search, and chat shell must all support readable light and dark themes.
- Gender accents are stronger: Man blue, Woman rose/pink, Non-binary purple. Workspace and chat headers use a subtle full-surface accent by selected user gender.
- Fake metrics are not allowed; use live-state or product-language copy instead.
- The official non-binary symbol is used anywhere gender identity icons appear.

## Still To Do

- Final end-to-end verification of Google OAuth (GCP Console configuration required).
- Implement real-time reconnect/status syncing for registered users.
- Add real rooms after the 1-on-1 MVP is stable.
- Add GIF sending, custom message font controls, and image unlock rules for registered users.
- Connect the rebuilt project back to GitHub and enable Vercel auto-deployments.
