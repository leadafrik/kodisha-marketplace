import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send booking confirmation emails
 * Called after booking is created
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      );
    }

    // Get booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        guest:guest_id (id, email, full_name),
        listing:listing_id (id, title, county, ward)
      `
      )
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get host info
    const { data: host, error: hostError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', booking.listing.user_id)
      .single();

    if (hostError || !host) {
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      );
    }

    // Format dates
    const checkInDate = new Date(booking.check_in_date).toISOString();
    const checkOutDate = new Date(booking.check_out_date).toISOString();
    const bookingLink = `${process.env.NEXT_PUBLIC_APP_URL}/booking/${bookingId}`;

    const emailData = {
      bookingId,
      listingTitle: booking.listing.title,
      guestName: booking.guest.full_name,
      guestEmail: booking.guest.email,
      hostName: host.full_name,
      hostEmail: host.email,
      checkInDate,
      checkOutDate,
      totalPrice: booking.total_price,
      location: `${booking.listing.ward}, ${booking.listing.county}`,
      bookingLink,
    };

    // Send to guest
    await emailService.sendBookingConfirmation(emailData);

    // Send to host
    await emailService.sendHostBookingNotification(emailData);

    return NextResponse.json(
      { success: true, message: 'Booking confirmation emails sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email send error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to send emails',
      },
      { status: 500 }
    );
  }
}
