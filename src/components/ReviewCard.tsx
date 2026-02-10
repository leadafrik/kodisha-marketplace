'use client';

import { FC, useState } from 'react';
import { Star, ThumbsUp, Trash2, User } from 'lucide-react';
import { Review } from '@/lib/reviews';

interface ReviewCardProps {
  review: Review;
  canDelete?: boolean;
  onDelete?: (reviewId: string) => void;
  onHelpful?: (reviewId: string) => void;
}

const ReviewCard: FC<ReviewCardProps> = ({ review, canDelete, onDelete, onHelpful }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      setHelpfulCount(helpfulCount + 1);
      onHelpful?.(review.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {review.reviewer_name?.[0]?.toUpperCase() || <User size={20} />}
          </div>

          {/* Reviewer Info */}
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">{review.reviewer_name}</p>
              {review.verified_booking && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Verified Booking
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{formatDate(review.created_at)}</p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete?.(review.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
            title="Delete Review"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 font-semibold text-gray-900">{review.rating}.0</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>

      {/* Helpful */}
      <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleHelpful}
          disabled={isHelpful}
          className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-lg transition ${
            isHelpful
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp size={16} className={isHelpful ? 'fill-current' : ''} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
