import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MpesaCallback } from '@/lib/mpesa';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/payments/callback
 * M-Pesa callback handler for payment updates
 * This is called by M-Pesa after payment attempt
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MpesaCallback;

    const { stkCallback } = body.Body;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Log callback for debugging
    console.log('M-Pesa Callback:', {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      Timestamp: new Date().toISOString(),
    });

    // Extract payment details from callback
    let mpesaRef = '';
    let amount = 0;
    let phoneNumber = '';

    if (CallbackMetadata?.Item) {
      const items = CallbackMetadata.Item;
      for (const item of items) {
        if (item.Name === 'MpesaReceiptNumber') {
          mpesaRef = String(item.Value);
        }
        if (item.Name === 'Amount') {
          amount = Number(item.Value);
        }
        if (item.Name === 'PhoneNumber') {
          phoneNumber = String(item.Value);
        }
      }
    }

    // ResultCode 0 = successful payment
    const isSuccess = ResultCode === 0;

    // Update transaction in database
    const { data: transaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        status: isSuccess ? 'completed' : 'failed',
        mpesa_ref: mpesaRef,
        error_message: isSuccess ? null : ResultDesc,
        completed_at: isSuccess ? new Date().toISOString() : null,
      })
      .eq('mpesa_checkout_id', CheckoutRequestID)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    // If payment successful, update booking status
    if (isSuccess && transaction) {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
        })
        .eq('id', transaction.booking_id);

      if (bookingError) {
        console.error('Error updating booking:', bookingError);
      }

      // TODO: Send confirmation email to guest
      // TODO: Send notification to host
    }

    // Return success response to M-Pesa
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: 'Callback received successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Callback processing error:', error);

    // Return error but don't fail - M-Pesa will retry
    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: 'Error processing callback',
      },
      { status: 200 }
    );
  }
}
