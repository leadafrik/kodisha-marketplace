# ⚡ Supabase Setup - Quick Steps (5 Minutes)

## You're Already Logged In with GitHub ✅

Now follow these 5 quick steps:

---

## 📋 Step 1: Create Project (2 min)

**In Supabase Dashboard:**
```
1. Click "New Project" (top right)
2. Name: kodisha-marketplace
3. Password: [Create strong password - save it!]
4. Region: eu-west-1 (or closest to you)
5. Click "Create new project"
⏳ Wait 2-3 minutes...
```

---

## 🔑 Step 2: Get Credentials (1 min)

**Settings → API:**
```
Copy these two values:
┌─────────────────────────────────────┐
│ Project URL                         │
│ https://xxxxx.supabase.co          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ anon public (under "Your API key")  │
│ eyJhbGc...                          │
└─────────────────────────────────────┘
```

---

## 📝 Step 3: Save to `.env.local` (1 min)

**In VS Code:**

Create/edit `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **Replace with YOUR actual values from Step 2**

Save file (Ctrl+S)

---

## 🗄️ Step 4: Create Database Tables (1 min)

**SQL Editor → New Query:**

Copy-paste this ENTIRE SQL block (you'll see it below in Step 4 SQL):

Then click **"Run"** (green button)

✅ Wait for "Success" message

---

## 🧪 Step 5: Test It (Instant)

**In VS Code Terminal:**

```bash
npm run dev
```

**In Browser:**

Go to http://localhost:3000/auth/signup

Try signing up with:
```
Email: test@example.com
Password: TestPassword123!
```

**If successful**: You see "Account created!" ✅

---

## 🔍 Verify in Supabase

**Check your new user:**

1. Supabase Dashboard
2. Authentication → Users
3. Should see: `test@example.com`

✅ **You're done!**

---

## 📑 SQL Code for Step 4

Copy ALL of this and paste in SQL Editor:

```sql
-- Create users table (extends Supabase auth)
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create indexes for performance
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_category ON listings(main_category);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
```

---

## ✅ Done!

Your app now has:
- ✅ Real authentication
- ✅ Real database
- ✅ Real user accounts
- ✅ Real listings
- ✅ Real bookings
- ✅ All features working!

**Everything is automatically wired up. No code changes needed!**

---

## 📚 Need More Info?

- Full setup guide: `SUPABASE_SETUP.md`
- Features guide: `FEATURE_IMPLEMENTATION.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Quick reference: `QUICK_REFERENCE.md`

