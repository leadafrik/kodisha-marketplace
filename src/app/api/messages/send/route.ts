import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { messagingService } from '@/lib/messaging';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send a message
 */
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

    const body = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Missing conversationId or content' },
        { status: 400 }
      );
    }

    // Get conversation to verify user is participant
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

    // Verify user is in conversation
    if (!conversation.participant_ids.includes(session.user.id)) {
      return NextResponse.json(
        { error: 'Not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Send message
    const message = await messagingService.sendMessage(
      conversationId,
      session.user.id,
      content
    );

    // Get recipient ID
    const recipientId = conversation.participant_ids.find(
      (id: string) => id !== session.user.id
    );

    // Send notification email in background (don't wait for it)
    try {
      if (recipientId) {
        // Get sender and recipient info
        const { data: sender } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        const { data: recipient } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', recipientId)
          .single();

        if (sender && recipient) {
          // Send email notification
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/message-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messageId: message.id,
            }),
          }).catch((err) => console.error('Email notification error:', err));
        }
      }
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr);
      // Don't fail the message send if email fails
    }

    return NextResponse.json(
      { success: true, message },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Message send error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
