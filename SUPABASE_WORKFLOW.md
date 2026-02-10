# 🎯 Supabase Setup - Visual Workflow

## The 5-Minute Setup Flow

```
┌─────────────────────────────────────────────────┐
│  STEP 1: Create Supabase Project                │
│  ✓ Visit supabase.com/dashboard                │
│  ✓ Click "New Project"                         │
│  ✓ Name: kodisha-marketplace                   │
│  ✓ Set password (save it!)                     │
│  ✓ Choose region (eu-west-1)                   │
│  ⏳ Wait 2-3 minutes                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 2: Get Your Credentials                   │
│  ✓ Settings → API                              │
│  ✓ Copy: Project URL                           │
│  ✓ Copy: anon public key                       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 3: Update .env.local                      │
│  ✓ Create file: .env.local                     │
│  ✓ Add NEXT_PUBLIC_SUPABASE_URL                │
│  ✓ Add NEXT_PUBLIC_SUPABASE_ANON_KEY           │
│  ✓ Save file                                   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 4: Create Database Tables                 │
│  ✓ SQL Editor → New Query                      │
│  ✓ Paste SQL (users, listings, bookings, etc)  │
│  ✓ Click Run                                   │
│  ✓ Wait for success                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 5: Test Connection                        │
│  ✓ Run: npm run dev                            │
│  ✓ Go to: /auth/signup                         │
│  ✓ Try signing up                              │
│  ✓ Check Supabase → Users                      │
│  ✅ SUCCESS!                                    │
└─────────────────────────────────────────────────┘
```

---

## 📍 Where to Find Everything

```
Supabase Dashboard
├── Settings → API
│   ├── Project URL (needed for .env.local)
│   └── anon public key (needed for .env.local)
├── SQL Editor
│   └── Run database table creation SQL
├── Authentication → Users
│   └── See your test user here
└── Authentication → Providers
    └── Email should be enabled
```

---

## 📋 Checklist Format

### Before Starting
- [ ] Logged into Supabase with GitHub
- [ ] Know your closest region

### During Setup
- [ ] Step 1: Project created (2 min)
- [ ] Step 2: Credentials copied
- [ ] Step 3: .env.local updated
- [ ] Step 4: Database tables created
- [ ] Step 5: Signup test successful

### After Setup
- [ ] App running at localhost:3000
- [ ] Can signup at /auth/signup
- [ ] Can login at /auth/login
- [ ] User appears in Supabase
- [ ] Can create listings
- [ ] Can make bookings

---

## 🔄 Complete Workflow Example

### What Happens When User Signs Up:

```
User fills signup form
         ↓
Clicks "Sign Up"
         ↓
App sends to Supabase Auth
         ↓
Supabase creates user in auth.users table
         ↓
App creates user profile in public.users table
         ↓
Session created & stored
         ↓
User redirected to /host/dashboard
         ↓
✅ User is now logged in!
```

### What Happens When User Creates Listing:

```
User fills listing form
         ↓
Clicks "Publish Listing"
         ↓
App checks session (middleware.ts)
         ↓
Session valid? → Continue
Session invalid? → Redirect to /auth/login
         ↓
App sends listing to API (/api/listings)
         ↓
API sends to Supabase database
         ↓
Supabase inserts into listings table
         ↓
Returns listing_id
         ↓
✅ Listing created!
```

### What Happens When User Browses:

```
User visits /browse
         ↓
App calls API (/api/listings)
         ↓
API fetches from Supabase database
         ↓
Returns: listings array
         ↓
Page displays listings with:
- Search
- Filter by category
- Sort options
- Pagination
         ↓
✅ Browse works!
```

---

## 🗂️ Database Structure

```
Supabase Project (kodisha-marketplace)
│
├── auth.users (Supabase built-in)
│   └── Used for authentication
│
├── public.users (Your profile extension)
│   ├── id (FK to auth.users)
│   ├── email
│   ├── full_name
│   ├── phone_number
│   └── ... profile data
│
├── public.listings
│   ├── id (UUID)
│   ├── host_id (FK to users)
│   ├── title
│   ├── description
│   ├── price_per_unit
│   └── ... listing data
│
├── public.bookings
│   ├── id (UUID)
│   ├── listing_id (FK)
│   ├── guest_id (FK)
│   ├── check_in_date
│   ├── check_out_date
│   └── ... booking data
│
├── public.messages
│   ├── id (UUID)
│   ├── sender_id (FK)
│   ├── recipient_id (FK)
│   ├── content
│   └── created_at
│
└── public.reviews
    ├── id (UUID)
    ├── listing_id (FK)
    ├── reviewer_id (FK)
    ├── rating (1-5)
    └── comment
```

---

## 🔐 Security: Row Level Security (RLS)

**What RLS does:**

```
User A can only see:
✅ Public listings (everyone can view)
✅ Their own bookings
✅ Messages sent to/from them
❌ Other user's private data
❌ Unapproved listings

User B (host) can only:
✅ See their own listings
✅ See bookings for their listings
✅ Create new listings
❌ See other host's listings
❌ Delete other people's bookings
```

**Already configured in SQL!** ✅

---

## 🚀 After Setup - What You Can Do

### Test Full User Journey:

1. **Signup** (create account)
   ```
   Go: http://localhost:3000/auth/signup
   Email: test@example.com
   Password: TestPass123!
   ```

2. **Create Listing** (as host)
   ```
   Go: http://localhost:3000/listing/create
   Fill: Title, description, price, images, etc
   Save: Listing appears in database
   ```

3. **Browse** (as guest)
   ```
   Go: http://localhost:3000/browse
   Search: Try searching
   Filter: By category
   View: Click listing details
   ```

4. **Make Booking** (as guest)
   ```
   Go: Any listing detail page
   Click: "Book Now"
   Select: Dates and guests
   Submit: Booking appears in database
   ```

5. **Message** (as either)
   ```
   Go: http://localhost:3000/messages
   Send: Test messages
   See: Messages in database
   ```

### Monitor in Supabase:

- **Users**: See who signed up
- **Listings**: See all created listings
- **Bookings**: See all reservations
- **Messages**: See all conversations
- **Real-time**: See changes happen live!

---

## ⚠️ Common Issues & Fixes

### "Cannot find module" after updating .env.local
**Fix**: Restart dev server
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

### Sign up button doesn't work
**Fix**: Check Email provider is enabled
- Supabase → Authentication → Providers
- Email toggle should be ON ✅

### Can't see my signup in Supabase
**Fix**: Refresh page
- Supabase → Authentication → Users
- Click refresh icon

### Database tables don't exist
**Fix**: Re-run SQL
- Copy full SQL from SUPABASE_QUICK_START.md
- Paste in SQL Editor
- Run again

### RLS blocking everything
**Fix**: Policies are already created
- They should work automatically
- If not, re-run the policy SQL

---

## 📚 Complete Guide Reference

| Need | File | Time |
|------|------|------|
| Quick setup | SUPABASE_QUICK_START.md | 5 min |
| Full guide | SUPABASE_SETUP.md | 15 min |
| Features | FEATURE_IMPLEMENTATION.md | 10 min |
| Deploy | DEPLOYMENT_GUIDE.md | 20 min |

---

## 🎓 Learning Path

1. **5 min**: Read this file
2. **5 min**: Do SUPABASE_QUICK_START.md steps
3. **5 min**: Test signup at /auth/signup
4. **10 min**: Create test listing
5. **5 min**: Browse listings
6. **Enjoy**: Your marketplace is live! 🎉

---

## ✅ Success Indicators

After setup, you should see:

```
✅ App runs at localhost:3000
✅ Can visit /auth/signup
✅ Can fill signup form
✅ Click signup button
✅ See "Account created!" message
✅ Can now login
✅ Can create listings
✅ Listings appear at /browse
✅ Users appear in Supabase dashboard
✅ Everything works!
```

---

## 🎯 Next Steps After Setup

1. **Deploy to Vercel** (5 min)
   - Push to GitHub
   - Connect to Vercel
   - Add same .env vars
   - Deploy!

2. **Setup Google OAuth** (15 min)
   - Get Google credentials
   - Add to Supabase
   - Enable on login page

3. **Add Payments** (Optional)
   - Stripe for CC
   - M-Pesa for mobile
   - Add to Supabase

4. **Real-time Features** (Optional)
   - Live messaging updates
   - Real-time notifications
   - Live listing updates

---

**Ready? Start with SUPABASE_QUICK_START.md! 🚀**

