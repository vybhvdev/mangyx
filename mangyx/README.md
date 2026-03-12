# Mangyx

A minimal, editorial manga reading site built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and the MangaDex public API.

---

## Setup in Termux

### 1. Install Node.js
```bash
pkg update && pkg upgrade
pkg install nodejs-lts
node -v   # should be 18+
```

### 2. Install dependencies
```bash
cd mangyx
npm install
```

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` in Acode and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase API settings
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase API settings (keep secret)
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` in Termux to generate one
- `NEXTAUTH_URL` — `http://localhost:3000`

### 4. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**

### 5. Run dev server
```bash
npm run dev
```
Open `http://localhost:3000` in your Android browser.

### 6. Build for production
```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Home — popular + recently updated
│   ├── browse/
│   │   ├── page.tsx           # Browse + search (server)
│   │   └── BrowseClient.tsx   # Search bar + genre filters (client)
│   ├── manga/[id]/
│   │   └── page.tsx           # Manga detail + chapter list
│   ├── reader/[chapterId]/
│   │   ├── page.tsx           # Fetches pages server-side
│   │   └── ReaderClient.tsx   # Full-screen reader UI (client)
│   ├── library/
│   │   └── page.tsx           # Bookmarked manga (requires auth)
│   ├── auth/
│   │   ├── signin/            # Sign in page + form
│   │   └── signup/            # Sign up page + form
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handler
│       ├── auth/register/     # POST — create user
│       └── bookmarks/         # POST/DELETE — manage bookmarks
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/
│       ├── MangaCard.tsx
│       └── BookmarkButton.tsx
├── lib/
│   ├── mangadex.ts            # MangaDex API client
│   ├── supabase.ts            # Supabase clients
│   ├── auth.ts                # NextAuth config
│   └── utils.ts               # Shared helpers
└── types/index.ts             # TypeScript types
```

---

## Notes
- MangaDex API is public, no key needed. Fetches are cached with `next: { revalidate: 300 }`.
- Auth uses credentials (email + bcrypt password), stored in your own Supabase `users` table — not Supabase Auth.
- Library requires a signed-in session and redirects to `/auth/signin` if not authenticated.
