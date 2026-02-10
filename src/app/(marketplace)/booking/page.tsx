'use client';

import { FC, useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Users, DollarSign, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface BookingData {
  listingId: string;
  listingTitle: string;
  basePrice: number;
  pricePeriod: 'hour' | 'day' | 'night' | 'week' | 'month';
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalNights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  specialRequests: string;
}

const BookingContent: FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock listing data - in real app, would fetch from API
  const [booking, setBooking] = useState<BookingData>({
    listingId: '1',
    listingTitle: 'Cozy Studio in Westlands',
    basePrice: 3500,
    pricePeriod: 'night',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalNights: 0,
    subtotal: 0,
    serviceFee: 0,
    total: 0,
    specialRequests: '',
  });

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  // Calculate totals when dates change
  useEffect(() => {
    if (booking.checkInDate && booking.checkOutDate) {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        const subtotal = booking.basePrice * nights;
        const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
        const total = subtotal + serviceFee;

        setBooking((prev) => ({
          ...prev,
          totalNights: nights,
          subtotal,
          serviceFee,
          total,
        }));
      }
    }
  }, [booking.checkInDate, booking.checkOutDate, booking.basePrice]);

  const handleSubmitBooking = async () => {
    if (!booking.checkInDate || !booking.checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (booking.totalNights <= 0) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: When Supabase is configured, submit to API
      // const response = await fetch('/api/bookings/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(booking),
      // });

      console.log('Creating booking:', booking);

      // For now, just show success
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Dates' },
              { num: 2, label: 'Guests' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => (
              <div key={s.num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <p className={`ml-2 font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
                  {s.label}
                </p>
                {s.num < 4 && <div className="flex-1 h-1 bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Step 1: Dates */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Your Dates</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={18} />
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={booking.checkInDate}
                        onChange={(e) => setBooking({ ...booking, checkInDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={18} />
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={booking.checkOutDate}
                        onChange={(e) => setBooking({ ...booking, checkOutDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={booking.checkInDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {booking.totalNights > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-900 font-medium">
                        {booking.totalNights} night{booking.totalNights > 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    disabled={!booking.checkInDate || !booking.checkOutDate || booking.totalNights <= 0}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 2: Guests */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Who's Coming?</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline mr-2" size={18} />
                      Number of Guests
                    </label>
                    <select
                      value={booking.guests}
                      onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      Next <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Special Requests</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anything we should know?
                    </label>
                    <textarea
                      value={booking.specialRequests}
                      onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                      placeholder="Let the host know about any special requests..."
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={isLoading}
                      className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Processing...' : (
                        <>
                          Confirm Booking <Check size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Check className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600">
                      Your booking request has been sent to the host. You'll receive a response within 24 hours.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      Booking Reference: <span className="font-semibold">#BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Check-in: <span className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Check-out: <span className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => router.push('/booking/history')}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                  >
                    View My Bookings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{booking.listingTitle}</h3>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    KES {booking.basePrice.toLocaleString()} × {booking.totalNights || '?'} night{(booking.totalNights || 0) > 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold">KES {booking.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold">KES {booking.serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  KES {booking.total.toLocaleString()}
                </span>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="inline mr-2" size={16} />
                  You won't be charged until the host confirms your booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
};

export default BookingPage;
