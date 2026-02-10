/**
 * Core type definitions for Kodisha Marketplace
 * All types are strictly typed with enums for consistency and validation
 */

// ============= LOCATION TYPES =============
export interface County {
  code: number;
  name: string;
  constituencies: Constituency[];
}

export interface Constituency {
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  name: string;
}

// ============= CATEGORY TYPES =============
export enum MainCategory {
  STAYS = 'stays',
  SPACES = 'spaces',
  SPORTS = 'sports',
  EQUIPMENT = 'equipment',
}

export enum StaysSubcategory {
  SHORT_TERM = 'short_term',
  LONG_TERM = 'long_term',
  SERVICED_APARTMENTS = 'serviced_apartments',
  VACATION_HOMES = 'vacation_homes',
  BEDSITTERS = 'bedsitters',
}

export enum SpacesSubcategory {
  EVENT_VENUE = 'event_venue',
  MEETING_ROOM = 'meeting_room',
  STUDIO = 'studio',
  COWORKING = 'coworking',
  CLASSROOM = 'classroom',
  KITCHEN_SPACE = 'kitchen_space',
  STORAGE = 'storage',
  PARKING = 'parking',
}

export enum SportsSubcategory {
  FIELD_COURT = 'field_court',
  EQUIPMENT = 'equipment',
  GYM_EQUIPMENT = 'gym_equipment',
  TRAINER_SERVICE = 'trainer_service',
}

export enum EquipmentSubcategory {
  CAMERA_LENS = 'camera_lens',
  AUDIO_SYSTEM = 'audio_system',
  LIGHTING = 'lighting',
  TENT_FURNITURE = 'tent_furniture',
  GENERATOR = 'generator',
  PROJECTOR = 'projector',
  DRONE = 'drone',
  VEHICLE = 'vehicle',
  TOOLS = 'tools',
  PARTY_DECOR = 'party_decor',
}

// ============= VERIFICATION TYPES =============
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  PHONE_VERIFIED = 'phone_verified',
  ID_VERIFIED = 'id_verified',
  BUSINESS_VERIFIED = 'business_verified',
}

export enum UserRole {
  GUEST = 'guest',
  HOST = 'host',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// ============= USER TYPES =============
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone_number?: string;
  bio?: string;
  county_id?: number;
  verification_status: VerificationStatus;
  verified_at?: string;
  role: UserRole;
  trust_score: number;
  listings_count: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  social_accounts?: {
    google_id?: string;
    facebook_id?: string;
  };
}

// ============= LISTING TYPES =============
export enum ListingStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FLAGGED = 'flagged',
  REMOVED = 'removed',
  ARCHIVED = 'archived',
}

export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  main_category: MainCategory;
  subcategory: string;
  price_per_unit: number;
  price_currency: string;
  status: ListingStatus;
  county_id: number;
  ward_id?: number;
  location_details?: string;
  images: string[];
  thumbnail_image?: string;
  amenities?: string[];
  rules?: string[];
  cancellation_policy?: string;
  deposit_required?: number;
  availability_status: 'available' | 'unavailable' | 'limited';
  completeness_score: number;
  featured: boolean;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ListingCompletenessField {
  field: string;
  required: boolean;
  completed: boolean;
  category: MainCategory;
}

export interface ListingCompletenessSummary {
  listing_id: string;
  total_fields: number;
  completed_fields: number;
  score_percentage: number;
  missing_fields: ListingCompletenessField[];
}

// ============= BOOKING/INQUIRY TYPES =============
export enum InquiryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export interface Inquiry {
  id: string;
  listing_id: string;
  guest_id: string;
  host_id: string;
  start_date?: string;
  end_date?: string;
  quantity?: number;
  total_amount?: number;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

// ============= MESSAGING TYPES =============
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_url: string;
  file_type: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  participant_ids: [string, string]; // [host_id, guest_id]
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

// ============= REVIEW TYPES =============
export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  host_id: string;
  rating: number;
  title: string;
  content: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// ============= PAYMENT TYPES =============
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  MPESA = 'mpesa',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

export interface Payment {
  id: string;
  inquiry_id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  mpesa_reference?: string;
  mpesa_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

// ============= ADMIN TYPES =============
export enum FlagReason {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  FRAUD_SUSPICION = 'fraud_suspicion',
  DUPLICATE_LISTING = 'duplicate_listing',
  CONTACT_VIOLATION = 'contact_violation',
  PRICE_OUTLIER = 'price_outlier',
  SCAM_REPORT = 'scam_report',
  OTHER = 'other',
}

export interface FlaggedListing {
  id: string;
  listing_id: string;
  reported_by: string;
  reason: FlagReason;
  description: string;
  action_taken?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: 'listing' | 'user' | 'payment' | 'review';
  entity_id: string;
  details: Record<string, any>;
  created_at: string;
}

// ============= SEARCH & FILTER TYPES =============
export interface SearchFilters {
  mainCategory?: MainCategory;
  subcategory?: string;
  countyId?: number;
  wardId?: number;
  priceMin?: number;
  priceMax?: number;
  verifiedOnly?: boolean;
  sortBy?: 'recent' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  listings: Listing[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_more: boolean;
}
