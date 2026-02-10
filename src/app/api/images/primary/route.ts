import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { imageUploadService } from '@/lib/imageUpload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageId, listingId } = body;

    if (!imageId || !listingId) {
      return NextResponse.json(
        { error: 'Missing imageId or listingId' },
        { status: 400 }
      );
    }

    // Verify user owns this listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id')
      .eq('id', listingId)
      .eq('user_id', session.user.id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found or unauthorized' },
        { status: 403 }
      );
    }

    // Verify image belongs to listing
    const { data: image, error: imageError } = await supabase
      .from('listing_images')
      .select('id')
      .eq('id', imageId)
      .eq('listing_id', listingId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Set as primary
    await imageUploadService.setPrimaryImage(listingId, imageId);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Set primary error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Operation failed',
      },
      { status: 500 }
    );
  }
}
