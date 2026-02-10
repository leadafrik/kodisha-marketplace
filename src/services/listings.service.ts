/**
 * Listings Service
 * Business logic for listing operations
 */
import { Listing, ListingCompletenessSummary, ListingStatus, MainCategory, SearchFilters } from '@/types';
import { calculateCompletenessScore } from '@/utils/helpers';
import { getCategoryConfig } from '@/data/categories';

/**
 * Calculate listing completeness for a given listing
 */
export function calculateListingCompleteness(
  listing: Record<string, any>,
  category: MainCategory
): ListingCompletenessSummary {
  const config = getCategoryConfig(category);
  if (!config) {
    throw new Error(`Unknown category: ${category}`);
  }

  const requiredFields = config.requiredFields;
  let completedFields = 0;

  const missingFields = requiredFields.map(field => {
    const value = listing[field];
    const isCompleted =
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : String(value).trim() !== '');

    if (isCompleted) completedFields++;

    return {
      field,
      required: true,
      completed: isCompleted,
      category,
    };
  });

  const scorePercentage =
    requiredFields.length > 0 ? Math.round((completedFields / requiredFields.length) * 100) : 0;

  return {
    listing_id: listing.id,
    total_fields: requiredFields.length,
    completed_fields: completedFields,
    score_percentage: scorePercentage,
    missing_fields: missingFields.filter(f => !f.completed),
  };
}

/**
 * Validate listing data before creation/update
 */
export function validateListingData(
  data: Record<string, any>,
  category: MainCategory,
  isUpdate: boolean = false
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getCategoryConfig(category);

  if (!config) {
    errors.push('Invalid category');
    return { valid: false, errors };
  }

  // Validate required fields
  if (!isUpdate) {
    if (!data.title?.trim()) errors.push('Title is required');
    if (!data.description?.trim()) errors.push('Description is required');
    if (data.price_per_unit === undefined || data.price_per_unit < config.minPrice) {
      errors.push(`Price must be at least KES ${config.minPrice}`);
    }
    if (!data.county_id) errors.push('County is required');
    if (!data.subcategory) errors.push('Subcategory is required');
  }

  // Validate title length
  if (data.title && data.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }

  // Validate description length
  if (data.description && data.description.length > 5000) {
    errors.push('Description must be 5000 characters or less');
  }

  // Validate price
  if (data.price_per_unit && data.price_per_unit < 0) {
    errors.push('Price cannot be negative');
  }

  // Validate images exist if provided
  if (data.images && Array.isArray(data.images)) {
    if (data.images.length < config.requiredImages) {
      errors.push(`At least ${config.requiredImages} images required`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Build search query with filters
 */
export function buildSearchQuery(
  filters: SearchFilters
): { query: Record<string, any>; limit: number; offset: number } {
  const query: Record<string, any> = {
    status: ListingStatus.ACTIVE,
  };

  if (filters.mainCategory) {
    query.main_category = filters.mainCategory;
  }

  if (filters.subcategory) {
    query.subcategory = filters.subcategory;
  }

  if (filters.countyId) {
    query.county_id = filters.countyId;
  }

  if (filters.verifiedOnly) {
    query.verified_hosts_only = true;
  }

  const limit = filters.limit || 20;
  const page = filters.page || 1;
  const offset = (page - 1) * limit;

  return { query, limit, offset };
}

/**
 * Get sort column and direction
 */
export function getSortConfig(
  sortBy?: string
): { column: string; direction: 'asc' | 'desc' } {
  switch (sortBy) {
    case 'recent':
      return { column: 'created_at', direction: 'desc' };
    case 'popular':
      return { column: 'views_count', direction: 'desc' };
    case 'price_asc':
      return { column: 'price_per_unit', direction: 'asc' };
    case 'price_desc':
      return { column: 'price_per_unit', direction: 'desc' };
    case 'rating':
      return { column: 'rating', direction: 'desc' };
    default:
      return { column: 'created_at', direction: 'desc' };
  }
}

/**
 * Generate listing slug
 */
export function generateListingSlug(title: string, id: string): string {
  const slugTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `${slugTitle}-${id.slice(0, 8)}`;
}

/**
 * Calculate trust signals for a listing
 */
export function calculateListingTrustSignals(listing: Listing & { host?: any }): {
  trustLevel: 'low' | 'medium' | 'high';
  signals: string[];
} {
  const signals: string[] = [];

  // Host verification
  if (listing.host?.verification_status === 'id_verified') {
    signals.push('Verified host');
  } else if (listing.host?.verification_status === 'email_verified') {
    signals.push('Email verified');
  }

  // Completeness
  if (listing.completeness_score >= 90) {
    signals.push('Complete profile');
  }

  // Reviews/Rating
  if (listing.host?.reviews_count > 0) {
    signals.push(`${listing.host.reviews_count} reviews`);
  }

  // High views
  if (listing.views_count > 100) {
    signals.push('Popular listing');
  }

  // Determine trust level
  let trustLevel: 'low' | 'medium' | 'high' = 'low';
  if (signals.length >= 3) trustLevel = 'high';
  else if (signals.length >= 1) trustLevel = 'medium';

  return { trustLevel, signals };
}
