import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { imageUploadService } from '@/lib/imageUpload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(request: NextRequest) {
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

    // Get image ID and listing ID from query params
    const searchParams = request.nextUrl.searchParams;
    const imageId = searchParams.get('imageId');
    const listingId = searchParams.get('listingId');

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

    // Get image details
    const { data: image, error: imageError } = await supabase
      .from('listing_images')
      .select('*')
      .eq('id', imageId)
      .eq('listing_id', listingId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete image
    await imageUploadService.deleteImage(imageId, image.image_url);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Delete failed',
      },
      { status: 500 }
    );
  }
}
