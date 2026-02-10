'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Star, Share2, Heart, Clock, CheckCircle, Flag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';

const ListingDetailPage: FC = () => {
  const listing = {
    id: '1',
    title: 'Beautiful Modern Studio in Westlands',
    description: 'Spacious, fully furnished studio with AC, WiFi, and gym access. Perfect for short-term stays in Nairobi.',
    category: 'Stays',
    subcategory: 'Short-term',
    county: 'Nairobi',
    ward: 'Westlands',
    price: 3500,
    price_period: 'night',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    ],
    rating: 4.8,
    reviews_count: 24,
    host: {
      id: 'host1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      verification: 'verified',
      joined: 'Jan 2024',
      listings_count: 3,
      response_time: '< 1 hour',
    },
    amenities: ['WiFi', 'AC', 'Kitchen', 'Gym', 'Security', 'Parking', 'Hot Water', 'Workspace'],
    rules: ['No smoking', 'No pets', 'Quiet hours after 10 PM'],
    availability: 'Available now',
    cancellation_policy: 'Free cancellation up to 7 days before arrival',
  };

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/browse" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          ← Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                  {listing.category}
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="p-4 bg-white flex gap-3 overflow-x-auto">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === selectedImage ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Rating */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold text-gray-900">{listing.rating}</span>
                  <span className="text-gray-600 ml-1">({listing.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.county}, {listing.ward}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
              <ul className="space-y-2">
                {listing.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">John Doe</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Great place! Very clean and well-maintained. The host was very responsive and helpful.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 sticky top-20">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(listing.price)}
                  <span className="text-lg text-gray-600 font-normal">/{listing.price_period}</span>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{listing.availability}</span>
              </div>

              {/* CTA Buttons */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition mb-3">
                Message Host
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>

              {/* Sharing */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>

            {/* Host Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{listing.host.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Verified Host</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium text-gray-900">{listing.host.joined}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listings</span>
                  <span className="font-medium text-gray-900">{listing.host.listings_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium text-gray-900">{listing.host.response_time}</span>
                </div>
              </div>

              <button className="w-full mt-4 border-2 border-blue-600 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
