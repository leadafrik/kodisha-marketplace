-- Kodisha Marketplace - Supabase Database Schema
-- This file documents the required database setup

-- Enable UUID and ENUM extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============= ENUMS =============

-- Verification status enum
CREATE TYPE verification_status AS ENUM (
  'unverified',
  'email_verified',
  'phone_verified',
  'id_verified',
  'business_verified'
);

-- User role enum
CREATE TYPE user_role AS ENUM ('guest', 'host', 'admin', 'moderator');

-- Listing status enum
CREATE TYPE listing_status AS ENUM (
  'draft',
  'active',
  'inactive',
  'flagged',
  'removed',
  'archived'
);

-- Inquiry status enum
CREATE TYPE inquiry_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Payment method enum
CREATE TYPE payment_method AS ENUM ('mpesa', 'card', 'bank_transfer', 'wallet');

-- Flag reason enum
CREATE TYPE flag_reason AS ENUM (
  'inappropriate_content',
  'fraud_suspicion',
  'duplicate_listing',
  'contact_violation',
  'price_outlier',
  'scam_report',
  'other'
);

-- ============= TABLES =============

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone_number TEXT,
  bio TEXT,
  county_id INTEGER,
  verification_status verification_status DEFAULT 'unverified',
  verified_at TIMESTAMP,
  role user_role DEFAULT 'guest',
  trust_score DECIMAL(3,2) DEFAULT 0,
  listings_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles extension
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  google_id TEXT,
  facebook_id TEXT,
  social_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Counties reference table
CREATE TABLE IF NOT EXISTS counties (
  code INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  main_category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price_per_unit DECIMAL(12,2) NOT NULL,
  price_currency TEXT DEFAULT 'KES',
  status listing_status DEFAULT 'draft',
  county_id INTEGER REFERENCES counties(code),
  ward_id INTEGER,
  location_details TEXT,
  amenities TEXT[],
  rules TEXT[],
  cancellation_policy TEXT,
  deposit_required DECIMAL(12,2),
  availability_status TEXT DEFAULT 'available',
  completeness_score INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'inactive', 'flagged', 'removed', 'archived')),
  CONSTRAINT valid_category CHECK (main_category IN ('stays', 'spaces', 'sports', 'equipment'))
);

-- Listing images
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listing completeness tracking
CREATE TABLE IF NOT EXISTS listing_completeness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE UNIQUE,
  total_fields INTEGER NOT NULL,
  completed_fields INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL,
  missing_fields JSONB,
  last_calculated TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_percentage CHECK (score_percentage >= 0 AND score_percentage <= 100)
);

-- Inquiries/Booking requests
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  quantity INTEGER,
  total_amount DECIMAL(12,2),
  status inquiry_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Conversations (for messaging)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  participant_ids UUID[] NOT NULL,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT two_participants CHECK (array_length(participant_ids, 1) = 2)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (type IN ('credit', 'debit'))
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  mpesa_reference TEXT,
  mpesa_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Flagged listings (admin)
CREATE TABLE IF NOT EXISTS flagged_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason flag_reason NOT NULL,
  description TEXT,
  action_taken TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'reviewed', 'resolved'))
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_entity_type CHECK (entity_type IN ('listing', 'user', 'payment', 'review'))
);

-- ============= INDEXES =============

-- Performance indexes
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_county_id ON listings(county_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_main_category ON listings(main_category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification ON users(verification_status);

CREATE INDEX idx_inquiries_listing_id ON inquiries(listing_id);
CREATE INDEX idx_inquiries_guest_id ON inquiries(guest_id);
CREATE INDEX idx_inquiries_host_id ON inquiries(host_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);

CREATE INDEX idx_conversations_participant_ids ON conversations USING GIN(participant_ids);

CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);

CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

CREATE INDEX idx_flagged_listings_listing_id ON flagged_listings(listing_id);
CREATE INDEX idx_flagged_listings_status ON flagged_listings(status);

-- ============= VIEWS =============

-- Active listings view
CREATE OR REPLACE VIEW active_listings AS
SELECT l.* FROM listings l
WHERE l.status = 'active' AND l.published_at IS NOT NULL
ORDER BY l.published_at DESC;

-- Host stats view
CREATE OR REPLACE VIEW host_stats AS
SELECT
  l.host_id,
  COUNT(DISTINCT l.id) as total_listings,
  COUNT(DISTINCT i.id) as total_inquiries,
  AVG(r.rating) as average_rating,
  COUNT(DISTINCT r.id) as review_count
FROM listings l
LEFT JOIN inquiries i ON l.id = i.listing_id
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.host_id;

-- ============= SECURITY (RLS) =============

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies should be added via application/migrations
-- This schema file is for reference

-- ============= COMMENTS =============

COMMENT ON TABLE users IS 'Extended user profiles linked to Supabase auth';
COMMENT ON TABLE listings IS 'Marketplace listings for stays, spaces, sports, and equipment';
COMMENT ON TABLE conversations IS 'Real-time messaging conversations between users';
COMMENT ON TABLE flagged_listings IS 'Admin moderation: flagged listings for review';
COMMENT ON COLUMN users.trust_score IS 'Decimal from 0.0 to 1.0 based on verification and behavior';
COMMENT ON COLUMN listings.completeness_score IS 'Integer 0-100 representing listing profile completion';
