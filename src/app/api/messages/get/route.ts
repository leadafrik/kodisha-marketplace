import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { messagingService } from '@/lib/messaging';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Get messages for a conversation
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

    // Get conversation ID from query
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
        { status: 400 }
      );
    }

    // Verify user is in conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (!conversation.participant_ids.includes(session.user.id)) {
      return NextResponse.json(
        { error: 'Not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await messagingService.getMessages(conversationId);

    // Enrich with sender data
    const enrichedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        const { data: sender } = await supabase
          .from('users')
          .select('id, full_name, avatar_url')
          .eq('id', msg.sender_id)
          .single();

        return {
          ...msg,
          sender_name: sender?.full_name || 'User',
          sender_avatar: sender?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_id}`,
        };
      })
    );

    return NextResponse.json(
      { messages: enrichedMessages },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get messages error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}
