import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send host payout notification
 * Called after payout is processed
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin
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
    const { payoutId } = body;

    if (!payoutId) {
      return NextResponse.json(
        { error: 'Missing payoutId' },
        { status: 400 }
      );
    }

    // Get payout info
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .select('*')
      .eq('id', payoutId)
      .single();

    if (payoutError || !payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      );
    }

    // Get host info
    const { data: host, error: hostError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', payout.host_id)
      .single();

    if (hostError || !host) {
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      );
    }

    const emailData = {
      hostName: host.full_name,
      hostEmail: host.email,
      amount: payout.amount,
      bookingId: payout.booking_id,
      mpesaRef: payout.mpesa_ref,
    };

    // Send notification
    await emailService.sendPayoutNotification(emailData);

    return NextResponse.json(
      { success: true, message: 'Payout notification sent' },
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
