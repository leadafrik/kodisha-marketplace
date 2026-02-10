# 🚀 Supabase Setup Guide for Kodisha Marketplace

## Step 1: Create a New Project

### In Supabase Dashboard:
1. Click **"New Project"** (top right)
2. Select your organization (or create one)
3. **Project Name**: `kodisha-marketplace`
4. **Database Password**: Create a strong password (you'll need this!)
5. **Region**: Select closest to your users (e.g., `eu-west-1` for Europe, `us-east-1` for USA)
6. Click **"Create new project"** and wait (2-3 minutes)

**Note**: Save your database password somewhere safe - you'll need it!

---

## Step 2: Get Your API Credentials

Once project is created:

1. Go to **Settings** (bottom left) → **API**
2. You'll see:
   - `Project URL` - Copy this
   - `anon public` - Copy this (under "Your API key")

3. These are your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

---

## Step 3: Add Environment Variables

### In VS Code:

1. Open `.env.local` in your project root (create if doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with YOUR actual values from Step 2**

3. Save the file

---

## Step 4: Create Database Tables

### Go to Supabase SQL Editor:

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy and paste ALL of the SQL below:

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
-- Users can view all users
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Listings are viewable by everyone
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);

-- Users can create listings
CREATE POLICY "Users can create listings" ON listings FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings" ON listings FOR UPDATE USING (auth.uid() = host_id);

-- Bookings are viewable by guest or host
CREATE POLICY "Bookings are viewable by guest or host" ON bookings FOR SELECT USING (
  auth.uid() = guest_id OR auth.uid() = (SELECT host_id FROM listings WHERE id = listing_id)
);

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Messages are viewable by sender or recipient
CREATE POLICY "Messages are viewable by sender or recipient" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

-- Users can create messages
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews are viewable by everyone
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create indexes for performance
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_category ON listings(main_category);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
```

4. Click **"Run"** (green button)
5. Wait for success message

---

## Step 5: Set Up Authentication

### Enable Email Authentication:

1. Go to **Authentication** (left sidebar) → **Providers**
2. Find **"Email"** - make sure it's **enabled** (toggle on)
3. Go to **Settings** (in Authentication section)
4. Scroll down to **Email Templates**
5. All templates should be pre-configured ✅

### Enable OAuth (Google, GitHub, etc.) - Optional:

1. In **Providers**, click on **"Google"**
2. To use Google OAuth:
   - Get Google credentials from https://console.cloud.google.com
   - Add them in the Google provider settings
   - Save

**For now, Email auth is enough to get started!**

---

## Step 6: Test Connection

### In VS Code Terminal:

```bash
npm run dev
```

### Try to Sign Up:

1. Go to http://localhost:3000/auth/signup
2. Fill in:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Name: `Test User`
3. Click "Sign Up"

**If successful**: You'll see a confirmation message! 🎉

### Verify in Supabase:

1. Go to **Authentication** → **Users**
2. You should see your test user listed!

---

## Step 7: Add Sample Data (Optional)

### Go to SQL Editor in Supabase:

1. Click **"New Query"**
2. Paste this SQL to add test listings:

```sql
-- First, get your user ID from the users table
-- Replace 'user-id-here' with an actual user ID from your auth.users table

INSERT INTO listings (host_id, title, description, main_category, subcategory, price_per_unit, location_details, amenities, rules, featured, status)
VALUES 
  ('user-id-here', 'Cozy Studio in Westlands', 'Beautiful studio with WiFi and parking', 'stays', 'Studio', 3500, 'Westlands, Nairobi', ARRAY['WiFi', 'Parking', 'Kitchen'], ARRAY['No smoking'], true, 'active'),
  ('user-id-here', 'Modern Conference Room - CBD', 'Professional meeting space with projector', 'spaces', 'Conference Room', 5000, 'CBD, Nairobi', ARRAY['Projector', 'WiFi'], ARRAY['Business hours'], true, 'active'),
  ('user-id-here', 'Professional Video Camera 4K', 'High-end camera with lenses', 'equipment', 'Camera', 8000, 'Kilimani, Nairobi', ARRAY['Lenses', 'Tripod'], ARRAY['Handle with care'], false, 'active'),
  ('user-id-here', 'Professional Football Pitch', 'Floodlit pitch with facilities', 'sports', 'Football Field', 4000, 'Mombasa Road, Nairobi', ARRAY['Floodlights', 'Changing Rooms'], ARRAY['Book in advance'], true, 'active');
```

**Important**: Replace `'user-id-here'` with your actual user ID from the users table!

3. Click **"Run"**

---

## Step 8: Update Your App

### The app should now work with real data!

**What happens automatically**:
- ✅ Login/Signup uses real Supabase auth
- ✅ Protected routes check real sessions
- ✅ Listings fetch from real database
- ✅ Bookings save to real database
- ✅ Messages use real messaging
- ✅ No code changes needed!

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API credentials copied
- [ ] `.env.local` updated with credentials
- [ ] Database tables created via SQL
- [ ] Email auth enabled
- [ ] Test signup works
- [ ] Test user appears in Supabase
- [ ] App shows real database data

---

## 🧪 Testing Features

### Test User Creation:
```
Email: your-email@example.com
Password: TestPass123!
```

### Test Login:
- Go to `/auth/login`
- Use same email/password
- Should redirect to `/host/dashboard`

### Test Listings:
- Go to `/browse`
- Should show listings from your database
- Search/filter should work

### Test Create Listing:
- Go to `/listing/create` (after login)
- Fill in form and submit
- Check Supabase → listings table

### Test Booking:
- Click listing → "Book Now"
- Fill in dates and submit
- Check Supabase → bookings table

---

## 🔧 Useful Supabase URLs

| Action | URL |
|--------|-----|
| Dashboard | https://supabase.com/dashboard |
| Project Settings | https://supabase.com/dashboard/project/[project-id]/settings |
| Database | https://supabase.com/dashboard/project/[project-id]/editor |
| Users | https://supabase.com/dashboard/project/[project-id]/auth/users |
| SQL Editor | https://supabase.com/dashboard/project/[project-id]/sql |

---

## 🆘 Troubleshooting

### Issue: "Cannot find module" error
**Solution**: Restart dev server after adding `.env.local`
```bash
npm run dev
```

### Issue: Sign up returns error
**Solution**: Check Supabase email provider is enabled
- Go to Authentication → Providers
- Make sure Email is toggled ON

### Issue: "Auth.uid() is NULL"
**Solution**: You need to be logged in to use that policy
- Try signing up first at `/auth/signup`

### Issue: Tables don't exist
**Solution**: Run SQL again in SQL Editor
- Copy the full SQL from Step 4
- Run in SQL Editor

### Issue: RLS blocking all requests
**Solution**: Make sure policies are correct
- Check Row Level Security in Tables
- Run policies SQL from Step 4

---

## 📚 Next Steps

1. ✅ Keep using the app with real Supabase data
2. ✅ Deploy to Vercel/Netlify (add same env vars)
3. ✅ Set up OAuth (optional but recommended)
4. ✅ Add payment processing (Stripe/M-Pesa)
5. ✅ Set up real-time messaging (Supabase realtime)

---

## 🎉 Summary

You now have:
- ✅ Supabase project running
- ✅ Database with 5 tables
- ✅ Authentication configured
- ✅ Your app connected to real data
- ✅ All features working!

**Your marketplace is now fully operational with a production-grade backend!**

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Our Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Your Feature Guide**: See `FEATURE_IMPLEMENTATION.md`

