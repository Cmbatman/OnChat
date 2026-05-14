# OnChat

OnChat is being rebuilt from scratch as a real-time anonymous 1-on-1 chat app.

The previous implementation has been archived under `legacy/`.

## Current MVP

- Next.js App Router frontend.
- Reddit-inspired light UI with browser-based dark mode and blue/indigo primary actions.
- Vercel-cost-conscious static shell with PWA/service-worker caching.
- Guest entry with username, gender identity, age, country, state, and vibe.
- Supabase-ready guest sessions, online user list, random matching, messages, reports, and blocks.
- Consent popup before entry with adult-only, terms, privacy, and safety acknowledgements.
- Registered profile foundation with friends, recent connections, profile reports, and optional profile details.
- Profile tab preview with editable identity, status, bio, profile completeness, dropdown-based More About Me fields, and registered-user benefits.
- Category-based default avatars for Man, Woman, and Non-binary users across landing, lists, chat, and profile views.
- Session-only My Chat history that clears on logout or inactivity expiry.
- Rooms tab placeholder for the post-MVP rooms system.
- Blocked Users list with session unblock support.
- Profile dropdown with Edit Profile and Logout.
- Search is its own top navigation tab and owns all discovery filters: username, gender, age range, country, state, vibe, and Talk to Anyone.
- Random Chat is conversation-only. It must not show inline gender or age filter rows.
- Top-level product sections are `1 on 1 Chat`, `Rooms`, `AI Chat`, and `Games`; the 1-on-1 area contains Online Users, Random Chat, Search, My Chat, Friends, and Blocked Users.
- Lightweight browser games are available in the Games section without touching chat performance.
- Contact page added at `/contact` with name, email, reason, message, CAPTCHA, Send/Clear actions, support messaging, and footer policy links.
- The app shell uses a fixed-height top nav plus a viewport-fit chat workspace. Sidebar and message bodies scroll internally instead of pushing the whole page.
- Real user chats use Supabase `chats` and `chat_messages` realtime channels. Bot/demo replies are kept separate from live user-to-user messaging.
- Original public pages: Terms, Privacy, Safety, Cookie Policy, FAQ, and Promote.
- Supabase email/password authentication.
- Registered profile save/load for authenticated users.
- Registered users can upload PNG/JPEG profile pictures through Supabase Storage.
- Supabase client reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, with a public anon-key fallback for the configured OnChat project so Vercel does not silently fall into demo mode.

See `COST_CONTROL.md` for the Vercel cost-minimizing architecture rules.

## UI/Product Rules

- OnChat must not look like a Chatib clone. Copy uses OnChat language, including `Real Conversations Start Here`.
- App navigation is split into top-level product tabs (`1 on 1 Chat`, `Rooms`, `AI Chat`, `Games`) and a compact 1-on-1 subnav (`Online Users`, `Random Chat`, `Search`, `My Chat`, `Friends`, `Blocked Users`), followed by online count, theme toggle, and Profile.
- Online Users is the default app experience.
- Random Chat should open directly into the current chat frame with chat header, messages, actions, Next Random User, Skip, Block, Report, Leave Chat, and input. Use the Search tab for filters.
- Guest My Chat history is temporary and must clear on logout, session end, or inactivity expiry.
- Guests cannot change username after entry. Registered users can later claim and change usernames.
- Non-binary icons use the custom purple non-binary symbol, while Man and Woman use male/female symbols.
- Default avatars are category-based and consistent until a registered user uploads a custom avatar.
- Public CTAs and send actions use blue/indigo. Orange is a brand accent, not the default primary action.
- The consent popup appears only after a user tries to start chatting, log in, or register. It must not block the landing page on first load.
- Feature cards, footer, auth pages, chat, profile, search, empty states, and legal pages must render with proper light/dark contrast.
- Gender accents use stronger colors: Man blue, Woman rose/pink, Non-binary purple. Chat/workspace headers use a full subtle gender-tinted surface, not only a thin line.
- Remove fake growth metrics. Use live-state language such as `People online now`, `Ready to chat`, feature highlights, and safety messaging.
- Sidebar Online Users is the main discovery rail and uses its own compact gender selector instead of a floating filter icon.
- Alert and moderation dialogs use the standardized `Message not sent` pattern with a Safety Guidelines link.

## Local Setup

```bash
npm install
npm run dev
npm run build
```

## Supabase Setup

1. Copy `.env.local.example` to `.env.local`.
2. Add the public anon key for project `uhatzonqflkqorgdexht` when running your own environment.
3. Open Supabase SQL Editor and run `supabase/schema.sql`.
4. Restart `npm run dev`.

The Supabase URL is already set to:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://uhatzonqflkqorgdexht.supabase.co
```

The app includes a public fallback for the current OnChat Supabase project, but production should still set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel/GitHub so deploys are explicit.

For custom profile pictures, set:

```bash
NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET=OnChat Profile
```

Then run `supabase/patch_profile_storage_policies.sql` in Supabase SQL Editor so authenticated users can upload to their own folder.

If your registered profile tables were created before the Hair field was added, also run:

```sql
supabase/patch_registered_profiles_hair.sql
```
