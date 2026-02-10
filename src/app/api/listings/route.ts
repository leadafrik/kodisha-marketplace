import { NextRequest, NextResponse } from 'next/server';
import { mockListings } from '@/data/mockListings';
import { ApiResponse, Listing } from '@/types/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sort') || 'recent';

    // Filter mock data
    let filtered = [...mockListings];

    if (search) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((l) => l.main_category === category);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price_per_unit - b.price_per_unit);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price_per_unit - a.price_per_unit);
    } else {
      // Default: recent listings first
      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    const response: ApiResponse<{
      listings: Listing[];
      total: number;
      page: number;
      totalPages: number;
    }> = {
      success: true,
      data: {
        listings: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      },
      message: 'Listings fetched successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch listings',
      data: null,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
