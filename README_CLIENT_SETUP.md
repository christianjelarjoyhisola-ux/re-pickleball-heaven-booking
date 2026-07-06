# R&E PICKLEBALL HAVEN Booking System

This repository is the standalone booking system for R&E PICKLEBALL HAVEN. It must use its own GitHub repository, Supabase project, Cloudflare Pages project, domain, payment credentials, email sender, Telegram bot/chat, and admin accounts.

## Setup

1. Create a new Supabase project for R&E PICKLEBALL HAVEN.
2. Run `SETUP_NEW_SUPABASE.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in the R&E Supabase service role, account, email, Telegram, and payment values.
4. Fill in `env.js` with the R&E Supabase URL and anon key for the browser app.
5. Run `node setup-db.js` if you prefer the script-based database setup flow.
6. Run `node create-accounts.js` after setting strong temporary passwords in `.env.local`.
7. Deploy Supabase Edge Functions from the R&E Supabase project and set function secrets from `.env.local`.
8. Create a new Cloudflare Pages project connected only to the new R&E GitHub repository.
9. Add the R&E custom domain and update `_worker.js` if the canonical domain changes.
10. Run `npm test` before every deployment to check that previous-client references are not present.

## Local Demo Mode

Open the site on localhost with `?localData=1` to test using browser-only demo data:

```text
http://localhost:8788/?localData=1
```

Use `?remoteData=1` to return to the configured Supabase project.

## Required Separation

Do not reuse another court owner's GitHub remotes, Supabase projects, service role keys, anon keys, Cloudflare Pages projects, domains, payment accounts, receipt storage, Telegram credentials, email sender credentials, or admin users.
