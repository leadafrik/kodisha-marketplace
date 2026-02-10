import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeMpesaService } from '@/lib/mpesa';
import { ApiResponse } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const mpesa = initializeMpesaService();

/**
 * POST /api/payments/initiate
 * Initiate M-Pesa payment for booking
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, phoneNumber, bookingId, description } = await request.json();

    // Validate input
    if (!amount || !phoneNumber || !bookingId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields',
          data: null,
        },
        { status: 400 }
      );
    }

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Unauthorized',
          data: null,
        },
        { status: 401 }
      );
    }

    // Create transaction record
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert({
        user_id: session.user.id,
        amount,
        phone_number: phoneNumber,
        booking_id: bookingId,
        status: 'pending',
        description: description || 'Booking payment',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to create transaction',
          data: null,
        },
        { status: 500 }
      );
    }

    // Initiate M-Pesa payment
    const paymentResult = await mpesa.initiateStkPush({
      amount,
      phoneNumber,
      accountReference: bookingId,
      description: description || 'Kodisha Booking',
      orderId: transaction.id,
      userId: session.user.id,
    });

    if (!paymentResult.success) {
      // Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'failed', error_message: paymentResult.error })
        .eq('id', transaction.id);

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: paymentResult.error || 'Failed to initiate payment',
          data: null,
        },
        { status: 500 }
      );
    }

    // Update transaction with checkout request ID
    await supabase
      .from('transactions')
      .update({
        mpesa_checkout_id: paymentResult.checkoutRequestID,
        mpesa_request_id: transaction.id,
      })
      .eq('id', transaction.id);

    return NextResponse.json<ApiResponse<{ transactionId: string; checkoutRequestId: string }>>(
      {
        success: true,
        data: {
          transactionId: transaction.id,
          checkoutRequestId: paymentResult.checkoutRequestID || '',
        },
        message: 'Payment initiated. Please complete on your phone.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed',
        data: null,
      },
      { status: 500 }
    );
  }
}
