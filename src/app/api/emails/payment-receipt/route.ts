import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send payment receipt email
 * Called after payment is completed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transactionId' },
        { status: 400 }
      );
    }

    // Get transaction with booking info
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select(
        `
        *,
        booking:booking_id (
          id,
          guest_id,
          listing_id
        )
      `
      )
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get guest info
    const { data: guest, error: guestError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', transaction.booking.guest_id)
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Get listing info
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title')
      .eq('id', transaction.booking.listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const emailData = {
      bookingId: transaction.booking.id,
      guestName: guest.full_name,
      guestEmail: guest.email,
      amount: transaction.amount,
      mpesaRef: transaction.mpesa_ref || 'Pending',
      listingTitle: listing.title,
      paymentDate: transaction.created_at,
    };

    // Send receipt
    await emailService.sendPaymentReceipt(emailData);

    return NextResponse.json(
      { success: true, message: 'Payment receipt sent' },
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
