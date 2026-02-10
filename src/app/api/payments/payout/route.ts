import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeMpesaService } from '@/lib/mpesa';
import { ApiResponse } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const mpesa = initializeMpesaService();

interface PayoutRequest {
  hostId: string;
  amount: number;
  description?: string;
}

/**
 * POST /api/payments/payout
 * Send earnings payout to host
 * Requires authentication and admin/internal access
 */
export async function POST(request: NextRequest) {
  try {
    const { hostId, amount, description } = (await request.json()) as PayoutRequest;

    // Validate input
    if (!hostId || !amount || amount <= 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid request parameters',
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

    // TODO: Check if user is admin or the host themselves

    // Get host info
    const { data: host, error: hostError } = await supabase
      .from('users')
      .select('phone_number, mpesa_phone')
      .eq('id', hostId)
      .single();

    if (hostError || !host) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Host not found',
          data: null,
        },
        { status: 404 }
      );
    }

    const hostPhone = host.mpesa_phone || host.phone_number;
    if (!hostPhone) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Host has no phone number on file',
          data: null,
        },
        { status: 400 }
      );
    }

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        host_id: hostId,
        amount,
        status: 'pending',
        description: description || 'Earnings Payout',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payoutError) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to create payout record',
          data: null,
        },
        { status: 500 }
      );
    }

    // Send M-Pesa B2C payment
    const payoutResult = await mpesa.sendPayoutToHost(
      hostPhone,
      amount,
      `Kodisha Earnings - ${description || 'Payout'}`
    );

    if (!payoutResult.success) {
      // Update payout status to failed
      await supabase
        .from('payouts')
        .update({
          status: 'failed',
          error_message: payoutResult.error,
        })
        .eq('id', payout.id);

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: payoutResult.error || 'Failed to process payout',
          data: null,
        },
        { status: 500 }
      );
    }

    // Update payout status to completed
    await supabase
      .from('payouts')
      .update({
        status: 'completed',
        mpesa_ref: payoutResult.responseCode,
        completed_at: new Date().toISOString(),
      })
      .eq('id', payout.id);

    return NextResponse.json<ApiResponse<{ payoutId: string }>>(
      {
        success: true,
        data: { payoutId: payout.id },
        message: `Payout of KES ${amount} sent to host`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payout error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Payout failed',
        data: null,
      },
      { status: 500 }
    );
  }
}
