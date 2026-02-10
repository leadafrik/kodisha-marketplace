'use client';

import { FC } from 'react';
import Link from 'next/link';
import { MapPin, Star, Heart, Share2, CheckCircle } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import Image from 'next/image';

interface ListingCardProps {
  listing: Listing;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

const ListingCard: FC<ListingCardProps> = ({ listing, onFavorite, isFavorited = false }) => {
  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
            {listing.subcategory}
          </div>

          {/* Verification Badge */}
          {listing.featured && (
            <div className="absolute top-3 right-3 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <CheckCircle size={12} />
              <span>Featured</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.();
            }}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur transition-all ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center space-x-1 text-gray-600 text-sm mt-2">
            <MapPin size={16} className="flex-shrink-0 text-blue-500" />
            <span className="truncate">{listing.subcategory}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {listing.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({listing.inquiries_count} inquiries)</span>
          </div>

          {/* Price and CTA */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(listing.price_per_unit)}
              </p>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
