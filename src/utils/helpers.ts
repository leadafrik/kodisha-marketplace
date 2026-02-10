import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MainCategory } from '@/types';
import {
  StaysSubcategory,
  SpacesSubcategory,
  SportsSubcategory,
  EquipmentSubcategory,
} from '@/types';

/**
 * Combine Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to KES (Kenya Shilling)
 */
export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for relative display (e.g., "2 days ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(d);
}

/**
 * Get category label from enum
 */
export function getCategoryLabel(category: MainCategory | string): string {
  const categoryLabels: Record<string, string> = {
    [MainCategory.STAYS]: 'Stays',
    [MainCategory.SPACES]: 'Spaces & Venues',
    [MainCategory.SPORTS]: 'Sports',
    [MainCategory.EQUIPMENT]: 'Equipment Hire',
  };
  return categoryLabels[category] || 'Other';
}

/**
 * Get subcategory label
 */
export function getSubcategoryLabel(subcategory: string): string {
  const subcategoryLabels: Record<string, string> = {
    // Stays
    [StaysSubcategory.SHORT_TERM]: 'Short-Term Rental',
    [StaysSubcategory.LONG_TERM]: 'Long-Term Rental',
    [StaysSubcategory.SERVICED_APARTMENTS]: 'Serviced Apartments',
    [StaysSubcategory.VACATION_HOMES]: 'Vacation Homes',
    [StaysSubcategory.BEDSITTERS]: 'Bedsitters & Rooms',

    // Spaces
    [SpacesSubcategory.EVENT_VENUE]: 'Event Venue',
    [SpacesSubcategory.MEETING_ROOM]: 'Meeting Room',
    [SpacesSubcategory.STUDIO]: 'Studio Space',
    [SpacesSubcategory.COWORKING]: 'Coworking',
    [SpacesSubcategory.CLASSROOM]: 'Classroom',
    [SpacesSubcategory.KITCHEN_SPACE]: 'Commercial Kitchen',
    [SpacesSubcategory.STORAGE]: 'Storage Space',
    [SpacesSubcategory.PARKING]: 'Parking Space',

    // Sports
    [SportsSubcategory.FIELD_COURT]: 'Field & Court',
    [SportsSubcategory.EQUIPMENT]: 'Sports Equipment',
    [SportsSubcategory.GYM_EQUIPMENT]: 'Gym Equipment',
    [SportsSubcategory.TRAINER_SERVICE]: 'Trainer Service',

    // Equipment
    [EquipmentSubcategory.CAMERA_LENS]: 'Camera & Lenses',
    [EquipmentSubcategory.AUDIO_SYSTEM]: 'Audio System',
    [EquipmentSubcategory.LIGHTING]: 'Lighting Equipment',
    [EquipmentSubcategory.TENT_FURNITURE]: 'Tents & Furniture',
    [EquipmentSubcategory.GENERATOR]: 'Generators & Power',
    [EquipmentSubcategory.PROJECTOR]: 'Projectors',
    [EquipmentSubcategory.DRONE]: 'Drones',
    [EquipmentSubcategory.VEHICLE]: 'Vehicles',
    [EquipmentSubcategory.TOOLS]: 'Tools & Construction',
    [EquipmentSubcategory.PARTY_DECOR]: 'Party Decor',
  };
  return subcategoryLabels[subcategory] || subcategory;
}

/**
 * Get completeness score color
 */
export function getCompletenessColor(score: number): string {
  if (score < 30) return 'bg-red-100 text-red-800';
  if (score < 60) return 'bg-yellow-100 text-yellow-800';
  if (score < 90) return 'bg-blue-100 text-blue-800';
  return 'bg-green-100 text-green-800';
}

/**
 * Generate listing slug
 */
export function generateSlug(title: string, id: string): string {
  const slugTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `${slugTitle}-${id.slice(0, 8)}`;
}

/**
 * Extract ID from slug
 */
export function extractIdFromSlug(slug: string): string | null {
  const parts = slug.split('-');
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 8) return lastPart;
  }
  return null;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Kenyan phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format Kenyan phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1);
  }
  return '+254' + cleaned;
}

/**
 * Get trust score badge
 */
export function getTrustScoreBadge(score: number): { label: string; color: string } {
  if (score < 30) return { label: 'New', color: 'gray' };
  if (score < 60) return { label: 'Developing', color: 'yellow' };
  if (score < 85) return { label: 'Trusted', color: 'green' };
  return { label: 'Verified Trusted', color: 'blue' };
}

/**
 * Calculate listing completeness score
 */
export function calculateCompletenessScore(
  listing: Record<string, any>,
  category: MainCategory
): number {
  let completed = 0;
  let total = 0;

  // Common fields
  const commonFields = [
    'title',
    'description',
    'price_per_unit',
    'images',
    'county_id',
    'location_details',
  ];

  // Category-specific required fields
  const categoryFields: Record<MainCategory, string[]> = {
    [MainCategory.STAYS]: ['amenities', 'rules', 'cancellation_policy'],
    [MainCategory.SPACES]: ['amenities', 'rules', 'capacity'],
    [MainCategory.SPORTS]: ['rules', 'operating_hours'],
    [MainCategory.EQUIPMENT]: ['condition', 'delivery_options'],
  };

  const requiredFields = [...commonFields, ...(categoryFields[category] || [])];

  for (const field of requiredFields) {
    total++;
    const value = listing[field];
    if (
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : String(value).trim() !== '')
    ) {
      completed++;
    }
  }

  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * Mask phone number for display (unverified users)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return cleaned.slice(0, -4).replace(/./g, '*') + cleaned.slice(-4);
}

/**
 * Generate verification token
 */
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
