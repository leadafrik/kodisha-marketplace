'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, MessageCircle, Eye, Star, MoreVertical, Edit, Trash2, ToggleRight, Loader, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HostListing {
  id: string;
  title: string;
  status: string;
  views_count: number;
  inquiries_count: number;
  rating?: number;
  price_per_unit: number;
  completeness_score: number;
}

interface HostStats {
  totalListings: number;
  totalViews: number;
  totalInquiries: number;
  avgRating: number;
}

const HostDashboardPage: FC = () => {
  const [listings, setListings] = useState<HostListing[]>([]);
  const [stats, setStats] = useState<HostStats>({
    totalListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const { data: hostListings, error: listingsError } = await supabase
          .from('listings')
          .select('id, title, status, views_count, inquiries_count, price_per_unit, completeness_score')
          .eq('host_id', userId)
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;

        setListings(hostListings || []);

        // Calculate stats
        const totalListings = hostListings?.length || 0;
        const totalViews = hostListings?.reduce((sum, l) => sum + (l.views_count || 0), 0) || 0;
        const totalInquiries = hostListings?.reduce((sum, l) => sum + (l.inquiries_count || 0), 0) || 0;

        setStats({
          totalListings,
          totalViews,
          totalInquiries,
          avgRating: 4.8, // TODO: Calculate from reviews table
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  const handleToggleActive = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(listings.map(l => 
        l.id === listingId ? { ...l, status: newStatus } : l
      ));
    } catch (err) {
      console.error('Error updating listing:', err);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      setListings(listings.filter(l => l.id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const dashboardStats = [
    { label: 'Total Listings', value: stats.totalListings, trend: '+1' },
    { label: 'Total Views', value: stats.totalViews, trend: '+45' },
    { label: 'Inquiries', value: stats.totalInquiries, trend: '+3' },
    { label: 'Avg Rating', value: stats.avgRating.toFixed(2), trend: '↑' },
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

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, idx) => (
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No listings yet</p>
              <Link
                href="/listing/create"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
              >
                <Plus size={20} />
                <span>Create Your First Listing</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Completeness</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inquiries</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
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
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${listing.completeness_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{listing.completeness_score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-1 text-gray-900 font-medium">
                        <Eye size={16} className="text-gray-400" />
                        <span>{listing.views_count || 0}</span>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-1 text-gray-900 font-medium">
                        <MessageCircle size={16} className="text-gray-400" />
                        <span>{listing.inquiries_count || 0}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        KES {listing.price_per_unit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(listing.id, listing.status)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Toggle Active"
                          >
                            <ToggleRight className={`w-5 h-5 ${listing.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                          </button>
                          <Link
                            href={`/listing/${listing.id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5 text-gray-400" />
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Inquiries</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-gray-900">User {i} inquired about your listing</p>
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
