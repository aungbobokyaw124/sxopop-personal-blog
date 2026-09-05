# SXOPOP Personal Blog

SXOPOP Intelligent Hub — ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်.

A responsive personal blog built with React, Vite, Tailwind CSS, React Router and Supabase.

## Features

- Public homepage with published posts
- Individual article pages
- Supabase email/password authentication
- WordPress-style `/admin` dashboard
- Create, edit and delete posts
- Draft, published and archived status
- Automatic slug and excerpt generation
- Loading, empty and error states
- Responsive mobile and desktop UI
- Noto Sans Myanmar support

## Environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Never expose a Supabase service-role or secret key in a Vite frontend.

## Supabase

The app expects a `posts` table containing: `id`, `user_id`, `title`, `slug`, `content`, `excerpt`, `status`, `created_at`, and `updated_at`.

`status` must support `draft`, `published`, and `archived`.

Required RLS model:

- Anyone can read rows where `status = 'published'`.
- Authenticated users can read their own posts.
- Authenticated users can insert, update and delete only rows where `user_id = auth.uid()`.
- Enable RLS on the table.

The existing SXOPOP Supabase project already contains `posts` and `profiles`; review its current schema and policies rather than duplicating them.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting provider's environment variables before deploying.

## Routes

- `/` — public blog
- `/post/:slug` — published article
- `/admin` — login and dashboard

## Brand

Primary color: `#4F46E5`

Tagline: Intelligent Hub

Myanmar tagline: ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်
