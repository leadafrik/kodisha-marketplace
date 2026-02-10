import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  mpesaRef?: string;
  errorMessage?: string;
}

/**
 * GET /api/payments/status?transactionId=xxx
 * Get payment status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing transactionId',
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

    // Fetch transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Transaction not found',
          data: null,
        },
        { status: 404 }
      );
    }

    const paymentStatus: PaymentStatus = {
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      mpesaRef: transaction.mpesa_ref,
      errorMessage: transaction.error_message,
    };

    return NextResponse.json<ApiResponse<PaymentStatus>>(
      {
        success: true,
        data: paymentStatus,
        message: `Payment status: ${transaction.status}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment status',
        data: null,
      },
      { status: 500 }
    );
  }
}
