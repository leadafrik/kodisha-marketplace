# 📖 Complete Supabase Setup Guide - You Asked, Here's Everything!

## 🎯 Where You Are

✅ Logged into Supabase with GitHub  
📍 Ready to set up your marketplace database  
⏭️ 5 simple steps ahead

---

## 📚 Choose Your Learning Style

### ⚡ **TL;DR** (5 minutes)
→ Read: **START_HERE_SUPABASE.md**
- 5 quick steps
- SQL code to paste
- That's it!

### 📋 **Step-by-Step** (15 minutes)
→ Read: **SUPABASE_QUICK_START.md**
- Detailed instructions
- What to click
- Why it matters

### 📖 **Complete Guide** (20 minutes)
→ Read: **SUPABASE_SETUP.md**
- Full explanations
- Troubleshooting
- Deep dives

### 🎓 **Visual Learner** (10 minutes)
→ Read: **SUPABASE_WORKFLOW.md**
- Flowcharts & diagrams
- How everything connects
- Complete overview

---

## 🚀 The Absolute Quickest Path

### You have 5 minutes? Do this:

```
1. Go to: https://supabase.com/dashboard
   Click: "New Project"
   Name: kodisha-marketplace
   Password: [create & save]
   Region: Closest to you
   ⏳ Wait 2-3 minutes

2. Settings → API
   Copy: Project URL
   Copy: anon public key

3. In VS Code, create .env.local:
   NEXT_PUBLIC_SUPABASE_URL=[Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
   Save: Ctrl+S

4. In Supabase → SQL Editor → New Query
   Paste: Full SQL from START_HERE_SUPABASE.md
   Run: Green button
   ✅ Success message

5. In Terminal: npm run dev
   Go to: http://localhost:3000/auth/signup
   Try: test@example.com / TestPass123!
   Success: "Account created!" ✅
```

**Total: ~10 minutes**

---

## 🔍 What to Copy & Paste

### From Supabase Settings → API:

```
Look for these two:

┌──────────────────────────────────────┐
│ Project URL                          │
│ https://abcdefgh.supabase.co        │  ← COPY THIS
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Your API key (anon public)           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│  ← COPY THIS
└──────────────────────────────────────┘
```

### Into Your .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Your Complete Setup Checklist

Print this or save it:

```
□ Go to supabase.com/dashboard
□ Click "New Project"
□ Name: kodisha-marketplace
□ Set password (SAVE IT)
□ Choose region
□ Wait 2-3 minutes for creation

□ Go to Settings → API
□ Copy Project URL
□ Copy anon public key
□ Keep them safe

□ Create .env.local file
□ Add NEXT_PUBLIC_SUPABASE_URL=...
□ Add NEXT_PUBLIC_SUPABASE_ANON_KEY=...
□ Save file (Ctrl+S)

□ Go to SQL Editor
□ Click "New Query"
□ Copy-paste SQL (from START_HERE_SUPABASE.md)
□ Click "Run"
□ Wait for success ✅

□ In Terminal: npm run dev
□ Go to http://localhost:3000/auth/signup
□ Try signup: test@example.com / TestPass123!
□ See "Account created!" message ✅

□ Check Supabase → Authentication → Users
□ See test@example.com in list ✅

DONE! 🎉
```

---

## 🎬 Step-by-Step Screenshots & Instructions

### Step 1A: Supabase Dashboard
```
You land on this page after logging in

┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│                                         │
│  [New Project] ← CLICK HERE            │
│                                         │
│  Recent projects (if any)               │
└─────────────────────────────────────────┘
```

### Step 1B: Create Project Form
```
┌─────────────────────────────────────────┐
│  Create a new project                   │
│                                         │
│  Project name: kodisha-marketplace      │
│  Database password: ••••••••••• (SAVE!) │
│  Region: eu-west-1 (or closest)        │
│  [Create new project]                   │
└─────────────────────────────────────────┘
```

### Step 1C: Wait Screen
```
⏳ Creating your project...
   (This takes 2-3 minutes)
```

### Step 2: Get Credentials
```
In Supabase, go to:
Settings (bottom left) → API

You'll see a page like:
┌─────────────────────────────────┐
│  API Settings                   │
│                                 │
│  Project URL                    │
│  https://xxx.supabase.co        │ ← COPY
│                                 │
│  Your API key                   │
│  anon (public)                  │
│  eyJhbGc... (long string)       │ ← COPY
│                                 │
│  service_role (secret - HIDE!)  │
│  [don't use this one]           │
└─────────────────────────────────┘
```

### Step 3: Create .env.local
```
In VS Code:

Right-click project root
→ New File
→ Name it: .env.local

Paste:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

Save: Ctrl+S ✅
```

### Step 4: Add Tables to Database
```
In Supabase:

Left sidebar → SQL Editor
→ [New Query]

Paste the FULL SQL (next section)

Click: [Run] (green button)

Wait for: "Success" message ✅
```

### Step 5: Test It
```
In Terminal:
npm run dev

In Browser:
http://localhost:3000/auth/signup

Fill:
- Email: test@example.com
- Password: TestPassword123!

Click: Sign Up

See: "Account created!" ✅
```

---

## 🗄️ SQL Code (To Paste in Step 4)

**Copy EVERYTHING below** and paste into Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  profile_image_url TEXT,
  bio TEXT,
  verification_status TEXT DEFAULT 'unverified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  main_category TEXT NOT NULL,
  subcategory TEXT,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  price_currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'active',
  county_id INTEGER,
  ward_id INTEGER,
  location_details TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  rules TEXT[] DEFAULT ARRAY[]::TEXT[],
  completeness_score INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  guest_id UUID REFERENCES users(id) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests_count INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL,
  host_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON listings FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update their own listings" ON listings FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Bookings are viewable by guest or host" ON bookings FOR SELECT USING (
  auth.uid() = guest_id OR auth.uid() = (SELECT host_id FROM listings WHERE id = listing_id)
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "Messages are viewable by sender or recipient" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create performance indexes
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_category ON listings(main_category);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
```

---

## ✅ Success Signs

After Step 5, you should see:

✅ App running at http://localhost:3000  
✅ Can visit /auth/signup  
✅ Form lets you enter email/password  
✅ Signup button works  
✅ See "Account created!" message  
✅ Now can login and create listings  
✅ User appears in Supabase dashboard  

---

## 📚 All Guides Available

| Document | Purpose | Time |
|----------|---------|------|
| START_HERE_SUPABASE.md | Do this first | 5 min |
| SUPABASE_QUICK_START.md | Quick reference | 5 min |
| SUPABASE_SETUP.md | Full instructions | 20 min |
| SUPABASE_WORKFLOW.md | Visual diagrams | 10 min |
| .env.local.template | Copy-paste template | 1 min |

---

## 🆘 Issues?

**Can't find credentials?**
- Supabase → Settings (bottom left) → API
- They're at the top of that page

**SQL didn't work?**
- Try running it again
- Check for red error messages
- Copy full SQL from START_HERE_SUPABASE.md

**App still using mock data?**
- Restart: npm run dev (stop & start)
- Check .env.local is saved
- Make sure values are correct

**More help?**
- SUPABASE_SETUP.md has troubleshooting
- Or check Supabase docs: supabase.com/docs

---

## 🎯 You've Got This!

**Next action:**
1. Open: https://supabase.com/dashboard
2. Click: "New Project"
3. Follow the 5 steps above
4. Come back when you see "Account created!" ✅

**Estimated time: 10 minutes**

**Result: Production-ready marketplace with real database!** 🚀

