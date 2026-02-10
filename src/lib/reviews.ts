/**
 * Reviews & Ratings System
 * Handles review submission, display, and calculations
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  rating: number;
  text: string;
  verified_booking: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentageRecommended: number;
}

/**
 * Submit a new review
 */
export const submitReview = async (
  listingId: string,
  userId: string,
  rating: number,
  text: string,
  bookingId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!listingId || !userId || !rating || !text) {
      return { success: false, error: 'Missing required fields' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    if (text.trim().length < 10) {
      return { success: false, error: 'Review must be at least 10 characters' };
    }

    // Get reviewer info
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        listing_id: listingId,
        reviewer_id: userId,
        reviewer_name: user?.user?.email || 'Anonymous',
        rating,
        text: text.trim(),
        verified_booking: !!bookingId,
        helpful_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Update listing average rating
    await updateListingRating(listingId);

    return { success: true };
  } catch (err) {
    console.error('Error submitting review:', err);
    return { success: false, error: 'Failed to submit review' };
  }
};

/**
 * Get reviews for a listing
 */
export const getListingReviews = async (
  listingId: string,
  limit = 10,
  offset = 0
): Promise<{ reviews: Review[]; total: number }> => {
  try {
    const { count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listingId);

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      reviews: reviews || [],
      total: count || 0,
    };
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return { reviews: [], total: 0 };
  }
};

/**
 * Get review statistics for a listing
 */
export const getReviewStats = async (listingId: string): Promise<ReviewStats> => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('listing_id', listingId);

    if (error) throw error;

    const reviewList = reviews || [];
    const totalReviews = reviewList.length;

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentageRecommended: 0,
      };
    }

    // Calculate distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    let recommendedCount = 0;

    reviewList.forEach((review: any) => {
      totalRating += review.rating;
      distribution[review.rating as keyof typeof distribution]++;
      if (review.rating >= 4) recommendedCount++;
    });

    return {
      averageRating: parseFloat((totalRating / totalReviews).toFixed(1)),
      totalReviews,
      ratingDistribution: distribution as any,
      percentageRecommended: Math.round((recommendedCount / totalReviews) * 100),
    };
  } catch (err) {
    console.error('Error getting review stats:', err);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentageRecommended: 0,
    };
  }
};

/**
 * Update listing average rating
 */
const updateListingRating = async (listingId: string) => {
  try {
    const stats = await getReviewStats(listingId);

    await supabase
      .from('listings')
      .update({ 
        average_rating: stats.averageRating,
        review_count: stats.totalReviews
      })
      .eq('id', listingId);
  } catch (err) {
    console.error('Error updating listing rating:', err);
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (reviewId: string) => {
  try {
    const { data: review } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (review) {
      await supabase
        .from('reviews')
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq('id', reviewId);
    }
  } catch (err) {
    console.error('Error marking review helpful:', err);
  }
};

/**
 * Delete a review (by owner or admin)
 */
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting review:', err);
    return false;
  }
};

/**
 * Get user reviews
 */
export const getUserReviews = async (userId: string) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return reviews || [];
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    return [];
  }
};
