'use client';

import { FC, useState, useEffect } from 'react';
import { Star, Send, Loader } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { getListingReviews, getReviewStats, submitReview, markReviewHelpful, Review, ReviewStats } from '@/lib/reviews';

interface ReviewsSectionProps {
  listingId: string;
  userId?: string;
  isHost?: boolean;
}

const ReviewsSection: FC<ReviewsSectionProps> = ({ listingId, userId, isHost }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentageRecommended: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
  });

  // Load reviews and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          getListingReviews(listingId, 10, 0),
          getReviewStats(listingId),
        ]);

        setReviews(reviewsData.reviews);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [listingId]);

  const handleSubmitReview = async () => {
    if (!userId) {
      setError('You must be logged in to leave a review');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitReview(
        listingId,
        userId,
        formData.rating,
        formData.text
      );

      if (!result.success) {
        setError(result.error || 'Failed to submit review');
        return;
      }

      // Reset form and reload
      setFormData({ rating: 5, text: '' });
      setShowForm(false);

      // Reload reviews
      const [reviewsData, statsData] = await Promise.all([
        getListingReviews(listingId, 10, 0),
        getReviewStats(listingId),
      ]);

      setReviews(reviewsData.reviews);
      setStats(statsData);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Guest Reviews</h2>

      {/* Stats Section */}
      {stats.totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Summary */}
          <div>
            <div className="flex items-baseline space-x-3 mb-4">
              <h3 className="text-5xl font-bold text-gray-900">{stats.averageRating}</h3>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-1">{stats.percentageRecommended}% of guests recommend this listing</p>
            <p className="text-sm text-gray-500">Based on {stats.totalReviews} reviews</p>
          </div>

          {/* Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: stats.totalReviews > 0
                        ? `${(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}%`
                        : 0,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {userId && !isHost && (
        <>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2"
            >
              <Star size={20} />
              <span>Write a Review</span>
            </button>
          )}

          {/* Review Form */}
          {showForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Rating Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFormData({ ...formData, rating })}
                      className="p-2 hover:scale-110 transition"
                    >
                      <Star
                        size={28}
                        className={
                          rating <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Share your honest experience with other guests..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.text.length}/500 characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || formData.text.length < 10}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ rating: 5, text: '' });
                    setError(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No reviews yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={markReviewHelpful}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {reviews.length > 0 && reviews.length < stats.totalReviews && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
