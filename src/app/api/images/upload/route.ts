import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { imageUploadService } from '@/lib/imageUpload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listingId') as string;
    const isPrimary = formData.get('isPrimary') === 'true';

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!listingId) {
      return NextResponse.json(
        { error: 'No listing ID provided' },
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

    // Get current image count
    const { count } = await supabase
      .from('listing_images')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listingId);

    const displayOrder = (count || 0) + 1;

    // Upload image
    const imageUrl = await imageUploadService.uploadImage({
      listingId,
      file,
      userId: session.user.id,
    });

    // Save metadata
    const image = await imageUploadService.saveImageMetadata(
      listingId,
      imageUrl,
      displayOrder,
      isPrimary || count === 0 // Make first image primary by default
    );

    return NextResponse.json(
      {
        success: true,
        image,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Upload failed',
      },
      { status: 500 }
    );
  }
}
