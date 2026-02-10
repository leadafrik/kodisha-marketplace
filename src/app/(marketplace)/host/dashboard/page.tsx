'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, MessageCircle, Eye, Star, MoreVertical, Edit, Trash2, ToggleRight } from 'lucide-react';

const HostDashboardPage: FC = () => {
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'Beautiful Modern Studio in Westlands',
      status: 'published',
      views: 234,
      inquiries: 12,
      rating: 4.8,
      price: 3500,
      active: true,
    },
    {
      id: '2',
      title: 'Professional Meeting Space - CBD',
      status: 'published',
      views: 156,
      inquiries: 8,
      rating: 4.9,
      price: 5000,
      active: true,
    },
    {
      id: '3',
      title: 'Soccer Field - Ruiru',
      status: 'draft',
      views: 0,
      inquiries: 0,
      rating: null,
      price: 5000,
      active: false,
    },
  ]);

  const stats = [
    { label: 'Total Listings', value: '3', trend: '+1' },
    { label: 'Total Views', value: '390', trend: '+45' },
    { label: 'Inquiries', value: '20', trend: '+3' },
    { label: 'Avg Rating', value: '4.85', trend: '↑' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your listings and inquiries</p>
          </div>
          <Link
            href="/listing/create"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            <span>New Listing</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Your Listings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inquiries</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/listing/${listing.id}`} className="font-medium text-blue-600 hover:underline">
                        {listing.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-1 text-gray-900 font-medium">
                      <Eye size={16} className="text-gray-400" />
                      <span>{listing.views}</span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-1 text-gray-900 font-medium">
                      <MessageCircle size={16} className="text-gray-400" />
                      <span>{listing.inquiries}</span>
                    </td>
                    <td className="px-6 py-4">
                      {listing.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-gray-900">{listing.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Toggle Active">
                          <ToggleRight className={`w-5 h-5 ${listing.active ? 'text-green-600' : 'text-gray-400'}`} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Edit">
                          <Edit className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Inquiries</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-gray-900">User {i} inquired about Beautiful Modern Studio</p>
                  <p className="text-sm text-gray-600">{i} hours ago</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboardPage;
