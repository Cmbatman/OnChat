# OnChat Vercel Cost Control

## Goal

Keep Vercel usage low at high DAU by using Vercel only for the static app shell.

## Architecture

```txt
Browser
  -> Vercel: static app shell, JS, CSS, manifest, service worker
  -> Supabase: auth, database, realtime chat, online users, profiles, reports
```

## Implemented

- No Vercel API routes for chat.
- No middleware.
- Supabase Auth is called directly from the browser.
- Supabase Realtime and database are called directly from the browser.
- My Chat history for guests is session-only client state and is cleared on logout or inactivity expiry.
- Search UI is client-side and only opens when the user taps Search, so it does not add Vercel request volume.
- Consent state, theme preference, and guest chat history use browser storage/state instead of Vercel functions.
- Terms, Privacy, Safety, Cookie, FAQ, and Promote pages are static App Router pages.
- `public/sw.js` caches the app shell and static assets for repeat visits.
- `public/manifest.webmanifest` enables PWA-style install/open behavior.
- `public/robots.txt` blocks crawlers from indexing the app.
- Page metadata uses `noindex, nofollow`.
- `next.config.ts` adds CDN caching headers for the static shell, manifest, robots file, and icons.
- Vercel Image Optimization is disabled in config to avoid accidental image-optimization usage.

## Rules For Future Features

- Do not add Vercel API routes for chat, presence, profiles, reports, or matching.
- Prefer Supabase RPC for server-side rules that must be enforced.
- Do not add Vercel Middleware unless there is a clear security need.
- Do not enable Vercel Web Analytics or Speed Insights until traffic and budget are reviewed.
- Store user uploads in Supabase Storage or another object store, not Vercel Blob by default.
- Avoid Next `<Image />` optimization for user avatars and chat images unless pricing is reviewed.
- Keep the landing/app shell static and client-driven.
- Keep public content pages static unless a feature truly needs dynamic server logic.
- Keep demo/bot replies in the browser unless moderation or anti-abuse rules require Supabase RPC.

## Expected Cost Shape

At 10,000 DAU, repeat visitors should mostly use browser/service-worker cache for app assets. Live chat traffic should go to Supabase, not Vercel.
