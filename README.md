# Smart Bookmark

A small app to save and manage your links. Sign in with Google, add bookmarks with a URL and title, and they stay private to you. Open the app in two tabs—add something in one, and it shows up in the other without refreshing. No email/password, just Google.

**Live demo:** [https://smart-bookmark-app-six.vercel.app/](https://smart-bookmark-app-six.vercel.app/)

---

## What it does

- **Sign in with Google** — No signup form; you use your Google account only.
- **Add bookmarks** — Paste a URL, give it a title, and it’s saved.
- **Private to you** — Your list is yours only; nobody else can see it.
- **Live across tabs** — Add or delete in one tab and the list updates in your other tabs.
- **Delete when you want** — Each bookmark has a delete button.

Built with **Next.js** (App Router), **Supabase** (auth, database, and realtime), and **Tailwind CSS**. You can run it locally or deploy it on Vercel.

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then:

1. **Turn on Google login**  
   Go to **Authentication → Providers**, enable **Google**, and add your OAuth client ID and secret from [Google Cloud Console](https://console.cloud.google.com/). In Google, set the authorized redirect URI to:  
   `https://<your-project-ref>.supabase.co/auth/v1/callback`.

2. **Configure URLs**  
   In **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` for local dev (or your Vercel URL later).
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` and, when you deploy, your production URL (e.g. `https://your-app.vercel.app/auth/callback`).

3. **Create the database**  
   In the **SQL Editor**, run everything in  
   `supabase/migrations/20250213000000_create_bookmarks.sql`.  
   If the table already exists, run `supabase/migrations/20250213000001_ensure_bookmarks_trigger_and_policies.sql` instead so the trigger and policies are in place.

4. **Realtime**  
   In **Database → Replication**, make sure the `bookmarks` table is enabled for Realtime (the first migration adds it to the publication).

### 3. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

You need:

- **NEXT_PUBLIC_SUPABASE_URL** — From Supabase: **Settings → API** (Project URL).
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** — From the same page (anon/public key).
- **NEXT_PUBLIC_SITE_URL** — `http://localhost:3000` for local; your full Vercel URL (e.g. `https://smart-bookmark-app.vercel.app`) for production.

### 4. Run it locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click “Sign in with Google,” and start adding bookmarks.

### 5. Deploy on Vercel

Push the repo to GitHub, import the project in Vercel, and add the same environment variables in the project settings. Set **NEXT_PUBLIC_SITE_URL** to your Vercel URL. In Supabase, add that URL (and `https://your-app.vercel.app/auth/callback`) to **Redirect URLs** so Google login works in production.

---

## Things I ran into (and how I fixed them)

**Realtime not updating in the other tab**  
The list only updated in the tab where I added a bookmark. Fix: the `bookmarks` table has to be in Supabase’s Realtime publication. The migration does that with `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks`. I double-checked under **Database → Replication** that the table is enabled.

**Inserts failing with RLS**  
The client doesn’t send `user_id`, but RLS expects it. Fix: a `BEFORE INSERT` trigger that sets `user_id = auth.uid()`. The app only sends `url` and `title`; the trigger ties the row to the signed-in user so RLS is happy and the client can’t fake another user.

**Google redirect wrong or broken in production**  
After Google sign-in, redirects sometimes went to the wrong place or broke on Vercel. Fix: one callback route (`/auth/callback`) with a `next` query param for where to send the user (e.g. `/dashboard`). I made sure **Site URL** and **Redirect URLs** in Supabase included both localhost and the production URL so OAuth works in dev and prod.

**Session / cookies not refreshing**  
Sometimes the session didn’t persist or felt “logged out” because cookies weren’t updated. Fix: in the Next.js middleware, the Supabase cookie handler’s `setAll` has to write to the **response** cookies (`response.cookies.set(...)`), not just the request. That way the refreshed session is sent back to the browser.

**Sign out sending me to localhost on production**  
After signing out on the deployed app, I’d end up on localhost. Fix: the sign-out route now uses the request’s own origin for the redirect URL instead of relying on a single env var, so you always get sent back to the site you’re on.

---

## License

MIT
