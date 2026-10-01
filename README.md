# Dog Costume Contest Platform

Production-ready event app for dog costume contests: registration, round-based contest display, finalist voting, and an admin dashboard.

Built with Next.js 15 (App Router), TypeScript, Tailwind, shadcn-style UI, Prisma, and Supabase (Auth, Storage, PostgreSQL).

## Why not Jotform alone?

Jotform Apps work well for a simple signup form. This event also needs:

- Sequential contestant IDs (`DOG-001`, `DOG-002`, …) without duplicates
- Automatic rounds of 10 with display order
- Admin-controlled round visibility and a separate “voting open” switch
- Finalist-only voting across **five** categories with **one vote per category per device**
- Admin-only live results (hidden from the public)

This project implements those rules in the database and server actions.

## Architecture

- **Public site** — `/register`, `/contest`, `/vote`
- **Admin dashboard** — `/admin` (Supabase Auth + `ADMIN_EMAILS` allowlist)
- **Next.js server actions** for register, vote, and admin mutations
- **Prisma** talks to Postgres (Supabase). Contestant IDs come from an atomic `dog_counters` increment
- **Photos** upload through the service role into the `dog-photos` bucket
- **Votes** are keyed by an HttpOnly `contest_voter_id` cookie plus a unique `(category, voter)` constraint so results stay private

## Folder structure

```
src/app/(public)/     Home, register, contest, vote
src/app/admin/        Login + dashboard (dogs, finalists, rounds, results)
src/actions/          Server actions
src/components/       UI, forms, admin tables
src/lib/              Prisma, Supabase, validation, numbering
prisma/               Schema, migration, seed
supabase/rls.sql      Row Level Security + storage policies
```

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` (pooler, port 6543, `?pgbouncer=true`)
   - `DIRECT_URL` (direct or session pooler, port 5432)
   - `ADMIN_EMAILS` (your admin login email)
3. In Supabase Storage, create a public bucket named `dog-photos`.
4. In Authentication → Users, create the admin user with that email.
5. Apply schema and seed:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

6. Optional: run `supabase/rls.sql` in the SQL editor, then:

```sql
ALTER DATABASE postgres SET app.admin_emails = 'you@example.com';
```

7. Start the app:

```bash
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Event-day flow

1. Attendees register at `/register`.
2. Admin opens the current round at `/admin/rounds` — `/contest` shows only that round.
3. Admin marks finalists at `/admin/finalists`.
4. Admin opens voting (dashboard or rounds page).
5. Audience votes at `/vote` — one dog per category, phone-friendly.
6. Admin reads winners at `/admin/results` (not shown to the public).

## Numbering

Dogs 1–10 → Round 1. Dog 15 → `DOG-015`, round 2, display order 5.

`roundNumber = Math.floor((sequence - 1) / 10) + 1`  
`displayOrder = ((sequence - 1) % 10) + 1`
