import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send message notification email
 * Called after a new message is sent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Missing messageId' },
        { status: 400 }
      );
    }

    // Get message info
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Get sender info
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', message.sender_id)
      .single();

    if (senderError || !sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Get recipient info
    const { data: recipient, error: recipientError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', message.recipient_id)
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    const messageLink = `${process.env.NEXT_PUBLIC_APP_URL}/messages?conversation=${message.conversation_id}`;
    const preview = message.content.substring(0, 150);

    // Send notification
    await emailService.sendMessageNotification(
      recipient.email,
      recipient.full_name,
      sender.full_name,
      preview,
      messageLink
    );

    return NextResponse.json(
      { success: true, message: 'Message notification sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email send error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to send email',
      },
      { status: 500 }
    );
  }
}
