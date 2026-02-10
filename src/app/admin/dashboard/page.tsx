'use client';

import { FC, useState, useEffect } from 'react';
import { Flag, Trash2, CheckCircle, XCircle, AlertTriangle, Loader, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FlaggedListing {
  id: string;
  title: string;
  status: string;
  host_id: string;
  host_email: string;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  flag_reason?: string;
  flag_count: number;
}

interface AdminStats {
  totalListings: number;
  flaggedListings: number;
  approvedToday: number;
  removedToday: number;
}

const AdminDashboardPage: FC = () => {
  const [listings, setListings] = useState<FlaggedListing[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalListings: 0,
    flaggedListings: 0,
    approvedToday: 0,
    removedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'flagged' | 'all' | 'suspicious'>('flagged');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // TODO: Replace with actual admin check from users table
      setIsAdmin(true); // For now, assume admin for demo
    };
    checkAdmin();
  }, []);

  // Fetch flagged listings
  useEffect(() => {
    if (!isAdmin) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('listings')
          .select(`id, title, status, host_id, views_count, inquiries_count, created_at`);

        // Filter by status
        if (filter === 'flagged') {
          query = query.eq('status', 'flagged');
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Format listings with flag count
        const formattedListings = (data || []).map((listing: any) => ({
          ...listing,
          host_email: 'host@example.com', // TODO: Join with users table
          flag_count: Math.floor(Math.random() * 5) + 1, // Mock flag count
          flag_reason: 'Inappropriate content',
        }));

        setListings(formattedListings);

        // Calculate stats
        setStats({
          totalListings: data?.length || 0,
          flaggedListings: formattedListings.filter((l) => l.status === 'flagged').length,
          approvedToday: Math.floor(Math.random() * 10) + 2,
          removedToday: Math.floor(Math.random() * 5),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isAdmin, filter]);

  const handleApproveListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', listingId);

      if (error) throw error;

      setListings(listings.filter((l) => l.id !== listingId));
      setStats({ ...stats, flaggedListings: Math.max(0, stats.flaggedListings - 1) });
    } catch (err) {
      console.error('Error approving listing:', err);
    }
  };

  const handleRemoveListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to permanently remove this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      setListings(listings.filter((l) => l.id !== listingId));
      setStats({ ...stats, flaggedListings: Math.max(0, stats.flaggedListings - 1) });
    } catch (err) {
      console.error('Error removing listing:', err);
    }
  };

  const handleWarningUser = async (hostId: string) => {
    // TODO: Create warning system
    console.log('Warning user:', hostId);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Moderation Dashboard</h1>
          <p className="text-gray-600">Review and moderate marketplace listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Listings</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalListings}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Flagged</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.flaggedListings}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Approved Today</p>
            <h3 className="text-3xl font-bold text-green-600">{stats.approvedToday}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Removed Today</p>
            <h3 className="text-3xl font-bold text-orange-600">{stats.removedToday}</h3>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="flagged">Flagged Only</option>
              <option value="all">All Listings</option>
              <option value="suspicious">Suspicious Activity</option>
            </select>

            {/* Action Button */}
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              Generate Report
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error: {error}
          </div>
        )}

        {/* Listings Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Moderation Queue</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-red-600" size={32} />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-900 text-lg font-semibold">All Clear!</p>
              <p className="text-gray-600">No flagged listings to review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Host</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Flags</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listings
                    .filter((l) =>
                      searchQuery === '' ||
                      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      l.host_email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{listing.title}</p>
                            <p className="text-sm text-gray-600">ID: {listing.id.substring(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{listing.host_email}</p>
                            <p className="text-sm text-gray-600">Views: {listing.views_count}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Flag className="w-5 h-5 text-red-500" />
                            <span className="font-bold text-red-600">{listing.flag_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{listing.flag_reason}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveListing(listing.id)}
                              className="p-2 hover:bg-green-50 rounded-lg transition"
                              title="Approve Listing"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleWarningUser(listing.host_id)}
                              className="p-2 hover:bg-yellow-50 rounded-lg transition"
                              title="Warn User"
                            >
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </button>
                            <button
                              onClick={() => handleRemoveListing(listing.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Remove Listing"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
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

        {/* Recent Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Moderation Actions</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Listing {i} - Action taken</p>
                  <p className="text-sm text-gray-600">{i} hours ago by admin@kodisha.com</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  i % 2 === 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {i % 2 === 0 ? 'Approved' : 'Removed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
