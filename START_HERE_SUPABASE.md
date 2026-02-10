# 🎬 START HERE - Your Next 5 Steps

You're logged into Supabase with GitHub. Let's get your marketplace live!

---

## 📍 You Are Here

```
✅ GitHub logged in to Supabase
⏳ Next: Create your first Supabase project
```

---

## 🎯 Your 5-Step Action Plan

### **STEP 1: Create Project (2 min)**

In your browser (Supabase dashboard):
1. Click **"New Project"** (top right)
2. Name: `kodisha-marketplace`
3. Password: Create & **save it** (you'll need it later)
4. Region: Closest to you (e.g., `eu-west-1`)
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes while it builds...

---

### **STEP 2: Get API Keys (1 min)**

In Supabase, go to:
1. Click **Settings** (bottom left) → **API**
2. Look for:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** (under "Your API key")

3. **Copy both values somewhere safe** 📋

Example:
```
Project URL: https://abcdefgh.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **STEP 3: Create `.env.local` File (1 min)**

In **VS Code**:

1. Create new file: `.env.local` (in project root)
2. Paste:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Replace with YOUR actual values** from Step 2
4. Save: **Ctrl+S**

---

### **STEP 4: Create Database Tables (1 min)**

In Supabase:
1. Click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. **Copy-paste ALL the SQL** from below this section
4. Click **"Run"** (green button)
5. Wait for "Success" message ✅

---

### **STEP 5: Test It Works (2 min)**

In **VS Code Terminal**:
```bash
npm run dev
```

In **Browser**:
1. Go to http://localhost:3000/auth/signup
2. Fill in:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Name: `Test User`
3. Click **"Sign Up"**

**If you see "Account created!" → YOU'RE DONE! 🎉**

Check in Supabase:
- Go to **Authentication** → **Users**
- You should see `test@example.com` ✅

---

## 📋 SQL to Paste in Step 4

**Copy everything below and paste in Supabase SQL Editor:**

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

## ✅ Checklist

Track your progress:

```
□ Step 1: Supabase project created
□ Step 2: API keys copied
□ Step 3: .env.local created & saved
□ Step 4: SQL executed successfully
□ Step 5: Test signup works
□ BONUS: Check user in Supabase
```

---

## 🎉 What You Now Have

```
✅ Production database
✅ Real authentication
✅ User accounts
✅ Listings storage
✅ Booking system
✅ Messaging data
✅ Reviews database
✅ Security policies
✅ All ready to use!
```

---

## 🚀 After Setup: What to Test

After Step 5 succeeds:

### Test 1: Signup
```
Go: http://localhost:3000/auth/signup
Try: Signup with any email/password
Result: Should see "Account created!"
```

### Test 2: Login
```
Go: http://localhost:3000/auth/login
Try: Login with same email/password
Result: Should redirect to dashboard
```

### Test 3: Create Listing
```
Go: http://localhost:3000/listing/create
Fill: All fields (6-step form)
Submit: Should save to database
```

### Test 4: Browse
```
Go: http://localhost:3000/browse
See: Your created listing appears!
Search: Try searching by keyword
```

### Test 5: Booking
```
Click: Any listing → "Book Now"
Fill: Dates and guests
Submit: Should save booking
```

---

## 📚 More Documentation

After you complete setup, check out:

| Document | What's In It | Time |
|----------|-------------|------|
| SUPABASE_QUICK_START.md | Quick reference | 5 min |
| SUPABASE_SETUP.md | Full details | 15 min |
| SUPABASE_WORKFLOW.md | How everything flows | 10 min |
| FEATURE_IMPLEMENTATION.md | All features explained | 15 min |
| DEPLOYMENT_GUIDE.md | Deploy to production | 20 min |

---

## ❓ Need Help?

### Issue: Can't find Project URL
**Fix**: In Supabase → Settings → API (it's at the top)

### Issue: SQL didn't run
**Fix**: Try clicking Run again, check for error message

### Issue: Signup button doesn't work
**Fix**: Restart terminal: `npm run dev`

### Issue: Still stuck?
**Check**: SUPABASE_SETUP.md (full troubleshooting guide)

---

## ⏱️ Total Time: ~10 Minutes

- Create project: 2 min ⏳
- Get keys: 1 min
- Create .env.local: 1 min
- Add SQL: 1 min
- Test signup: 2 min
- Verify: 1 min
- **Total: ~10 min** 🎉

---

## 🎯 You're Ready!

**Go to:** https://supabase.com/dashboard

**Start with:** "New Project"

**Come back here** if you need any SQL or help!

Good luck! 🚀

