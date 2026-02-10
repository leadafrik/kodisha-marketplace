'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Sliders, Search, ChevronDown, Grid, Map, Loader } from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { Listing, ListingStatus } from '@/types';

const BrowsePage: FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    county: 'all',
    priceMin: 0,
    priceMax: 1000000,
    verification: 'all',
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          sort: sortBy,
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`/api/listings?${params}`);
        const data = await response.json();

        if (data.success) {
          setListings(data.data.listings);
          setTotalPages(data.data.totalPages);
          setTotalListings(data.data.total);
        } else {
          setError(data.error || 'Failed to fetch listings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, sortBy, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Original mock data is no longer needed
  const mockListings: Listing[] = [
    {
      id: '1',
      title: 'Beautiful Modern Studio in Westlands',
      description: 'Spacious, fully furnished studio with AC, WiFi, and gym access',
      main_category: 'stays' as any,
      subcategory: 'short-term',
      host_id: 'host1',
      price_per_unit: 3500,
      price_currency: 'KES',
      county_id: 1,
      status: ListingStatus.ACTIVE,
      availability_status: 'available',
      completeness_score: 95,
      featured: true,
      views_count: 234,
      inquiries_count: 12,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Professional Meeting Space - CBD',
      description: 'Fully equipped conference room for up to 20 people',
      main_category: 'spaces' as any,
      subcategory: 'meetings',
      host_id: 'host2',
      price_per_unit: 5000,
      price_currency: 'KES',
      county_id: 1,
      status: ListingStatus.ACTIVE,
      availability_status: 'available',
      completeness_score: 98,
      featured: false,
      views_count: 156,
      inquiries_count: 8,
      images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=500'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Professional Video Camera - Sony A7',
      description: 'High-quality 4K video camera with 3 lenses included',
      main_category: 'equipment' as any,
      subcategory: 'cameras',
      host_id: 'host3',
      price_per_unit: 2000,
      price_currency: 'KES',
      county_id: 1,
      status: ListingStatus.ACTIVE,
      availability_status: 'available',
      completeness_score: 78,
      featured: false,
      views_count: 89,
      inquiries_count: 3,
      images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Football Pitch - Ruiru Sports Complex',
      description: 'Full-size regulation football field with lights',
      main_category: 'sports' as any,
      subcategory: 'fields',
      host_id: 'host4',
      price_per_unit: 5000,
      price_currency: 'KES',
      county_id: 2,
      status: ListingStatus.ACTIVE,
      availability_status: 'available',
      completeness_score: 85,
      featured: true,
      views_count: 412,
      inquiries_count: 24,
      images: ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const counties = [
    'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Kisumu', 'Dar es Salaam'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Listings</h1>
          <p className="text-gray-600">Find everything you need across Kenya</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* County Filter */}
            <select
              value={filters.county}
              onChange={(e) => setFilters({ ...filters, county: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Counties</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <Sliders size={18} />
              <span>Advanced Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Map size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            Showing {listings.length} of {totalListings} results
          </p>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              Error loading listings: {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === 'grid' && (
            <>
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No listings found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Map View Placeholder */}
          {!loading && viewMode === 'map' && (
            <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-2">Map View Coming Soon</p>
                <p className="text-gray-500 text-sm">Map integration will show all listings geographically</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
