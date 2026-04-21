 Day 17 — Supabase Integration & PostgreSQL

> **Linkific Frontend Internship** | Built by Golu Sen

A full-featured React application demonstrating Supabase backend integration — Authentication, PostgreSQL CRUD, Real-time subscriptions, File Storage, and Row Level Security.

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Authentication** | Email/Password, Magic Link, Google OAuth, GitHub OAuth |
| **PostgreSQL CRUD** | Insert, Select, Update, Delete with filters |
| **Real-time Chat** | Live subscriptions via postgres_changes |
| **File Storage** | Upload, download, delete with public/private buckets |
| **Row Level Security** | SQL policies enforcing per-user data access |

---

## 📁 Project Structure

```
day17-supabase/
├── src/
│   ├── lib/
│   │   ├── supabase.js          # Supabase client initialization
│   │   └── AuthContext.jsx      # Global auth state (Context API)
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx     # Sign In / Sign Up / Magic Link / OAuth
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx    # Main layout + tab navigation
│   │   │   └── RLSInfo.jsx      # RLS policies reference & SQL viewer
│   │   ├── database/
│   │   │   └── NotesDB.jsx      # Full CRUD: insert, select, update, delete
│   │   ├── realtime/
│   │   │   └── RealtimeChat.jsx # Real-time chat with postgres_changes
│   │   └── storage/
│   │       └── FileStorage.jsx  # Upload, list, download, delete files
│   ├── styles/
│   │   └── global.css           # Clean, minimal design system
│   ├── App.jsx                  # Root component with auth routing
│   └── main.jsx                 # React entry point
├── supabase-setup.sql           # Run this in Supabase SQL Editor
├── FIREBASE_VS_SUPABASE.md      # Full comparison document
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1 — Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project** → fill in name, database password, region
3. Wait ~2 minutes for project to initialize

### Step 2 — Get API Keys
1. In your project → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key

### Step 3 — Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 4 — Run Database Setup SQL
1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase-setup.sql`
3. Click **Run** (RLS tables + policies will be created)

### Step 5 — Create Storage Bucket
1. Supabase Dashboard → **Storage** → **New Bucket**
2. Name: `user-uploads`
3. Public: ✅ (for this demo)
4. Add storage policies (from `supabase-setup.sql` comments)

### Step 6 — Configure OAuth (Optional)
**For Google:**
1. Supabase Dashboard → **Authentication** → **Providers** → Google
2. Enable + add Client ID & Secret from [Google Cloud Console](https://console.cloud.google.com)
3. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

**For GitHub:**
1. GitHub → Settings → Developer settings → OAuth Apps → New
2. Homepage URL: `http://localhost:5173`
3. Callback URL: `https://your-project.supabase.co/auth/v1/callback`

### Step 7 — Install & Run
```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🔑 Key Concepts Learned

### Supabase Client
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### Authentication
```javascript
// Sign Up
await supabase.auth.signUp({ email, password })

// Sign In
await supabase.auth.signInWithPassword({ email, password })

// Magic Link (passwordless)
await supabase.auth.signInWithOtp({ email })

// OAuth
await supabase.auth.signInWithOAuth({ provider: 'google' })

// Sign Out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

### Database Operations (CRUD)
```javascript
// SELECT all
const { data } = await supabase.from('notes').select('*')

// SELECT with filter + order + limit
const { data } = await supabase
  .from('notes')
  .select('*')
  .eq('user_id', userId)     // WHERE user_id = userId
  .gt('created_at', date)    // WHERE created_at > date
  .order('created_at', { ascending: false })
  .limit(20)

// INSERT
const { data, error } = await supabase
  .from('notes')
  .insert({ title: 'Hello', content: 'World', user_id: user.id })

// UPDATE
const { data, error } = await supabase
  .from('notes')
  .update({ title: 'Updated' })
  .eq('id', noteId)

// DELETE
const { error } = await supabase
  .from('notes')
  .delete()
  .eq('id', noteId)
```

### Real-time Subscriptions
```javascript
const channel = supabase
  .channel('my-channel')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New row:', payload.new)
    }
  )
  .subscribe()

// Cleanup
supabase.removeChannel(channel)
```

### File Storage
```javascript
// Upload
await supabase.storage.from('bucket-name').upload(filePath, file)

// Get Public URL
const { data } = supabase.storage.from('bucket-name').getPublicUrl(filePath)

// Download
const { data } = await supabase.storage.from('bucket-name').download(filePath)

// Delete
await supabase.storage.from('bucket-name').remove([filePath])

// Signed URL (for private buckets)
const { data } = await supabase.storage
  .from('bucket-name')
  .createSignedUrl(filePath, 3600) // expires in 1 hour
```

### Row Level Security (RLS)
```sql
-- Enable RLS on a table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow users to only see their own rows
CREATE POLICY "own data only"
ON notes FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📊 Firebase vs Supabase Summary

| | Firebase | Supabase |
|---|---|---|
| Database | NoSQL (Firestore) | SQL (PostgreSQL) |
| Real-time | Always-on | Explicit subscription |
| Security | Rules DSL | SQL (RLS) |
| Open Source | ❌ | ✅ |
| Self-host | ❌ | ✅ |

See full comparison: [`FIREBASE_VS_SUPABASE.md`](./FIREBASE_VS_SUPABASE.md)

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **@supabase/supabase-js** v2
- **React Context API** (auth state)
- **PostgreSQL** (via Supabase)
- **Supabase Storage** (S3-compatible)
- **Supabase Realtime** (WebSockets)

---

## 📝 Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> ⚠️ **Never commit `.env` to GitHub!** It's in `.gitignore` already.

---

*Day 17 | Linkific Frontend Internship | Golu Sen*
