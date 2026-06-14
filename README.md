# AlgoVault — DSA Tracker

> Track problems · Identify weak areas · Revise smarter

Full-stack Next.js 15 app with MongoDB, NextAuth, and a dark indigo/violet UI.

---

## Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Framework    | Next.js 15 (App Router)       |
| Language     | TypeScript 5                  |
| Styling      | Tailwind CSS 3                |
| Icons        | lucide-react                  |
| Auth         | NextAuth.js v4 (Credentials)  |
| Database     | MongoDB + Mongoose            |
| Passwords    | bcryptjs (12 salt rounds)     |
| Font         | Inter (Google Fonts)          |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Then fill in your values:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/dsa-tracker
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start the dev server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## MongoDB Setup (free tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free cluster
2. Database Access → create a user with read/write access
3. Network Access → allow your IP (or `0.0.0.0/0` for dev)
4. Connect → Drivers → copy the connection string into `MONGODB_URI`

---

## Project Structure

```
dsa-tracker/
│
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # NextAuth signIn('credentials')
│   │   └── signup/page.tsx         # Calls /api/auth/signup then signIn
│   │
│   ├── (app)/
│   │   ├── layout.tsx              # Sidebar + Navbar shell, mobile drawer
│   │   ├── loading.tsx             # Suspense skeleton for app routes
│   │   ├── dashboard/page.tsx      # Stats, weak areas, recent problems
│   │   └── problems/page.tsx       # CRUD problem bank with filters
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler (GET + POST)
│   │   │   └── signup/route.ts          # POST – create user account
│   │   ├── problems/
│   │   │   ├── route.ts                 # GET all / POST new
│   │   │   └── [id]/route.ts            # GET one / PUT / DELETE
│   │   └── user/route.ts                # GET current user profile
│   │
│   ├── error.tsx                   # Global error boundary
│   ├── not-found.tsx               # Custom 404 page
│   ├── globals.css                 # CSS tokens, animations, utilities
│   ├── layout.tsx                  # Root HTML + SessionProvider
│   └── page.tsx                    # Public landing page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Hamburger + wired search bar
│   │   └── Sidebar.tsx             # Fixed desktop / drawer mobile
│   ├── dashboard/
│   │   └── StatCard.tsx            # KPI metric tile
│   ├── problems/
│   │   ├── ProblemCard.tsx         # Card + list-row variants
│   │   ├── ProblemForm.tsx         # Add/Edit modal with server error
│   │   └── FilterBar.tsx           # Search + 3 dropdown filters
│   ├── providers/
│   │   └── SessionProvider.tsx     # Client wrapper for NextAuth
│   └── ui/
│       ├── Badge.tsx               # Reusable chip/label
│       └── LoadingSkeleton.tsx     # Shimmer skeletons for cards/rows
│
├── context/
│   └── ProblemsContext.tsx         # CRUD via real API + client filtering
│
├── lib/
│   ├── mongoose.ts                 # DB connection singleton
│   ├── auth.ts                     # NextAuth authOptions
│   └── api-helpers.ts              # apiSuccess / apiError helpers
│
├── middleware.ts                   # Protects /dashboard, /problems, /api/*
├── models/
│   ├── User.ts                     # Mongoose User schema
│   └── Problem.ts                  # Mongoose Problem schema (userId scoped)
│
├── types/
│   ├── index.ts                    # Problem, FilterState, etc.
│   └── next-auth.d.ts              # Augments session with user.id
│
└── .env.local.example              # Environment variable template
```

---

## API Reference

### Auth

| Method | Route                  | Description           | Auth |
|--------|------------------------|-----------------------|------|
| POST   | `/api/auth/signup`     | Create user account   | ❌   |
| POST   | `/api/auth/signin`     | NextAuth sign-in      | ❌   |
| GET    | `/api/auth/session`    | Current session       | ❌   |
| POST   | `/api/auth/signout`    | Sign out              | ✅   |

### Problems

| Method | Route                  | Description           | Auth |
|--------|------------------------|-----------------------|------|
| GET    | `/api/problems`        | List user's problems  | ✅   |
| POST   | `/api/problems`        | Create a problem      | ✅   |
| GET    | `/api/problems/:id`    | Get a single problem  | ✅   |
| PUT    | `/api/problems/:id`    | Update a problem      | ✅   |
| DELETE | `/api/problems/:id`    | Delete a problem      | ✅   |

### User

| Method | Route       | Description           | Auth |
|--------|-------------|-----------------------|------|
| GET    | `/api/user` | Get current profile   | ✅   |

---

## Auth Flow

```
Signup:  POST /api/auth/signup → bcrypt hash → save User → signIn('credentials')
Login:   signIn('credentials') → authorize() → bcrypt.compare → JWT token
Session: JWT stored in httpOnly cookie → getServerSession() in API routes
Guard:   middleware.ts redirects unauthenticated users to /login
```

---

## Adding OAuth (Google / GitHub)

In `lib/auth.ts`, uncomment and configure:

```ts
import GoogleProvider from 'next-auth/providers/google';

providers: [
  GoogleProvider({
    clientId:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... existing credentials provider
]
```

Add credentials to `.env.local`:
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Colour Reference

| Token       | Hex       | Usage             |
|-------------|-----------|-------------------|
| bg-primary  | `#070B14` | Page background   |
| bg-card     | `#131A2B` | Card surfaces     |
| primary     | `#6366F1` | Indigo accent     |
| secondary   | `#8B5CF6` | Purple accent     |
| text-1      | `#F1F5F9` | Primary text      |
| text-2      | `#94A3B8` | Secondary text    |
| easy        | `#22C55E` | Easy difficulty   |
| medium      | `#F59E0B` | Medium difficulty |
| hard        | `#EF4444` | Hard difficulty   |

---

Built for developers who study with intention. 🚀