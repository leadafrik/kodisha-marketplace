import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { messagingService } from '@/lib/messaging';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Get conversations for the current user
 */
export async function GET(request: NextRequest) {
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

    // Get conversations
    const conversations = await messagingService.getConversations(session.user.id);

    // Enrich with user data
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv: any) => {
        // Get other user details
        const { data: otherUser } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', conv.other_user_id)
          .single();

        // Get listing details if exists
        let listing = null;
        if (conv.listing_id) {
          const { data: listingData } = await supabase
            .from('listings')
            .select('id, title')
            .eq('id', conv.listing_id)
            .single();
          listing = listingData;
        }

        return {
          ...conv,
          participant_name: otherUser?.full_name || 'User',
          participant_avatar: otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.id}`,
          listing_title: listing?.title,
        };
      })
    );

    return NextResponse.json(
      { conversations: enrichedConversations },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get conversations error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch conversations',
      },
      { status: 500 }
    );
  }
}
