# M-Pesa Payment Integration Guide

## Overview

This guide explains how to integrate M-Pesa payments into the Kodisha Marketplace. The system is production-ready and requires only credential setup from Safaricom's Daraja API platform.

## System Architecture

```
User Payment Request
    ↓
[POST /api/payments/initiate] → Validates request
    ↓
[MpesaService.getAccessToken()] → Gets OAuth token
    ↓
[MpesaService.initiateStkPush()] → Shows M-Pesa prompt to user
    ↓
User enters M-Pesa PIN
    ↓
[POST /api/payments/callback] ← M-Pesa sends callback result
    ↓
[Transaction updated in Supabase]
    ↓
[Booking marked as paid]
```

## Components

### 1. Core Service: `src/lib/mpesa.ts`

**MpesaService** class provides all M-Pesa interactions:

#### Key Methods

- **`getAccessToken()`** - OAuth 2.0 authentication with Daraja API
  - Caches token for 45 minutes
  - Refreshes automatically with 60s buffer
  - Returns access token for subsequent requests

- **`initiateStkPush(request)`** - Prompts user for M-Pesa payment
  - Phone: 254xxxxxxxx format (auto-normalized)
  - Amount: KES amount to charge
  - Reference: Booking ID for tracking
  - Returns: CheckoutRequestID for tracking
  - Timeout: 2 minutes for user to enter PIN

- **`queryTransactionStatus(checkoutRequestId)`** - Check payment result
  - Called after STK push timeout
  - Returns payment status: 0 (success) or error code
  - Updates database with result

- **`sendPayoutToHost(phone, amount, reference)`** - B2C payout
  - Sends money to host from merchant account
  - Called after booking completion
  - Transfers host earnings

- **`validateCallback(callback)`** - Verify webhook signature
  - Prevents tampering with payment callbacks
  - Validates signature against M-Pesa credentials

#### Interfaces

```typescript
interface PaymentRequest {
  phone: string;
  amount: number;
  bookingId: string;
  description?: string;
}

interface PaymentResponse {
  success: boolean;
  checkoutRequestId?: string;
  error?: string;
}

interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: any }>;
      };
    };
  };
}
```

### 2. Payment Endpoints

#### POST `/api/payments/initiate`

Initiates a payment request.

**Request:**
```json
{
  "amount": 2500,
  "phone": "0712345678",
  "bookingId": "booking_123"
}
```

**Response (Success):**
```json
{
  "transactionId": "txn_abc123",
  "checkoutRequestId": "ws_co_123456789"
}
```

**Response (Error):**
```json
{
  "error": "Invalid phone number"
}
```

**Logic:**
1. Validates input (amount > 0, valid phone, valid booking)
2. Authenticates user via Supabase session
3. Creates transaction record in database with 'pending' status
4. Calls MpesaService.initiateStkPush()
5. Returns checkout request ID to frontend
6. Frontend polls `/api/payments/status` to check result

---

#### POST `/api/payments/callback`

Receives M-Pesa payment result webhook.

**Called by:** M-Pesa after user completes/cancels payment

**Response:** Always returns 200 (M-Pesa requirement)

**Logic:**
1. Extracts result from callback payload
2. Updates transaction status: 'completed' or 'failed'
3. If successful:
   - Stores M-Pesa receipt number
   - Updates booking.paid_at timestamp
   - Sets booking.status = 'confirmed'
4. Logs all callbacks for debugging
5. TODO: Send confirmation emails

**Callback Payload Example:**
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 2500 },
          { "Name": "MpesaReceiptNumber", "Value": "LJH61CD60RN" },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

---

#### GET `/api/payments/status`

Checks payment status.

**Query Params:**
- `transactionId` - Transaction ID from initiate response

**Response (Pending):**
```json
{
  "status": "pending",
  "amount": 2500
}
```

**Response (Completed):**
```json
{
  "status": "completed",
  "amount": 2500,
  "mpesaRef": "LJH61CD60RN",
  "completedAt": "2024-01-15T10:30:45Z"
}
```

**Response (Failed):**
```json
{
  "status": "failed",
  "amount": 2500,
  "error": "User cancelled transaction"
}
```

---

#### POST `/api/payments/payout`

Sends earnings to host (B2C payment).

**Request:**
```json
{
  "hostId": "user_456",
  "amount": 2000,
  "reference": "booking_123_payout"
}
```

**Response:**
```json
{
  "payoutId": "payout_123",
  "status": "initiated",
  "conversationId": "CONV_ID_123"
}
```

**Logic:**
1. Validates host ID and amount
2. Checks authorization (user is admin or system)
3. Retrieves host's phone number
4. Calls MpesaService.sendPayoutToHost()
5. Creates payout record with 'pending' status
6. Updates to 'completed' on success
7. Logs and stores M-Pesa conversation ID

### 3. Payment History Component

**Component:** `src/components/PaymentHistory.tsx`

Features:
- Shows all transactions for logged-in user
- Filter by status (all, completed, pending, failed)
- Displays M-Pesa reference numbers
- Calculates total completed payments
- Export button (UI ready, backend needed)
- Responsive table design

**Usage:**
```tsx
import PaymentHistory from '@/components/PaymentHistory';

export default function MyPayments() {
  return <PaymentHistory />;
}

// For host payouts:
return <PaymentHistory isHost={true} />;
```

---

## Setup Instructions

### Step 1: Get Daraja API Credentials

1. Go to [Safaricom Daraja API](https://developer.safaricom.co.ke/)
2. Register for an account
3. Create an "app" on the dashboard
4. Get these credentials:
   - **Consumer Key** (API Key)
   - **Consumer Secret** (API Secret)
5. Request M-Pesa integration (Paybill or Buy Goods):
   - **Paybill Number** (Short Code) - e.g., 174379
   - **Passkey** - for Lipa Na M-Pesa Online
6. For host payouts (B2C), get:
   - **Initiator Name** (API username)
   - **Initiator Password** (API password)

### Step 2: Configure Environment Variables

1. Copy `.env.mpesa.example` to `.env.local`:
   ```bash
   cp .env.mpesa.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORT_CODE=174379
   MPESA_PASSKEY=your_passkey
   MPESA_INITIATOR_NAME=your_username
   MPESA_INITIATOR_PASSWORD=your_password
   ```

3. **For Development (Sandbox):**
   ```
   MPESA_ENVIRONMENT=sandbox
   MPESA_TEST_MODE=true
   ```

4. **For Production:**
   - Change `MPESA_ENVIRONMENT=production`
   - Set `MPESA_TEST_MODE=false`
   - Update callback URLs to your domain

### Step 3: Configure Callback URL

The callback URL must be publicly accessible (not localhost).

**For Development:** Use ngrok to create a tunnel:
```bash
# Install ngrok: https://ngrok.com/download

# Create tunnel (in new terminal)
ngrok http 3000

# You'll get: https://abc123.ngrok.io

# Update .env.local
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payments/callback
```

**For Production:**
```
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback
```

### Step 4: Test Integration

#### Test 1: STK Push (User Payment)

```bash
# Make a payment request
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "phone": "0712345678",
    "bookingId": "test_booking_123"
  }'
```

Response:
```json
{
  "transactionId": "txn_...",
  "checkoutRequestId": "ws_co_..."
}
```

Check status:
```bash
curl http://localhost:3000/api/payments/status?transactionId=txn_...
```

#### Test 2: Sandbox Testing

Use these test credentials in sandbox mode:
- **Phone:** 254708374149
- **Amount:** Any amount (100-250,000 KES)
- **PIN:** 123456

### Step 5: Database Migrations

Ensure the `transactions` table exists:

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  mpesa_ref TEXT,
  checkout_request_id TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

## Frontend Integration

### Display Payment Button

```tsx
'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function BookingPayment({ bookingId, amount }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState('');

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user's phone from session or input
      if (!phone) {
        setError('Please enter phone number');
        return;
      }

      // Initiate payment
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount,
          bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Poll for payment status
      const pollStatus = async () => {
        const statusResponse = await fetch(
          `/api/payments/status?transactionId=${data.transactionId}`
        );
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          setSuccess(true);
          // Redirect or refresh booking
          window.location.reload();
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Payment failed');
        } else {
          // Still pending, poll again in 2 seconds
          setTimeout(pollStatus, 2000);
        }
      };

      // Start polling (M-Pesa STK push is shown to user now)
      setTimeout(pollStatus, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4 text-green-700">
          ✓ Payment successful! Your booking is confirmed.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will receive the M-Pesa payment prompt
        </p>
      </div>

      <div className="bg-gray-50 rounded p-4 mb-6">
        <p className="text-sm text-gray-600">Amount to Pay</p>
        <p className="text-2xl font-bold text-gray-900">KES {amount.toLocaleString()}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !phone}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        You will receive an M-Pesa prompt on your phone. Enter your PIN to complete payment.
      </p>
    </div>
  );
}
```

---

## Security Best Practices

1. **Never commit credentials** - Keep `.env.local` in `.gitignore`
2. **Validate all inputs** - Phone numbers, amounts, booking IDs
3. **Verify callbacks** - Always validate M-Pesa callback signatures
4. **Use HTTPS** - Required for production
5. **Rate limiting** - Add rate limiting to payment endpoints
6. **Audit logging** - Log all payment operations
7. **Error handling** - Never expose API secrets in error messages

---

## Troubleshooting

### Issue: "Invalid access token"
- Check MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET
- Verify credentials in Daraja dashboard
- Check if credentials are for sandbox vs production

### Issue: "Transaction timeout"
- Ensure callback URL is publicly accessible
- Test with ngrok for local development
- Check M-Pesa callback configuration in Daraja dashboard

### Issue: "Phone number validation failed"
- Ensure phone is in 254xxxxxxx format
- Service auto-normalizes 0xxxxxxx to 254xxxxxxx
- Verify phone number has 10 digits after country code

### Issue: "B2C payment fails"
- Check MPESA_INITIATOR_NAME and MPESA_INITIATOR_PASSWORD
- Verify host phone number is correct format
- Ensure merchant account has sufficient balance

---

## Testing Checklist

- [ ] Sandbox credentials configured in `.env.local`
- [ ] Callback URL set and tested (use ngrok for local dev)
- [ ] Test transaction created in database
- [ ] STK push prompt appears on test phone
- [ ] Payment callback received and processed
- [ ] Transaction status updated correctly
- [ ] Booking marked as paid after successful payment
- [ ] Payment history displays correctly
- [ ] B2C payout tested (if available)
- [ ] Error handling works for failed payments

---

## Next Steps After Setup

1. **Email Notifications** - Send confirmation after payment
2. **Host Payouts** - Automatically pay hosts after booking completion
3. **Refund Handling** - Implement refund logic
4. **Payment Analytics** - Dashboard showing payment metrics
5. **Invoice Generation** - PDF invoices for bookings

---

## Support

For M-Pesa Daraja API documentation:
- https://developer.safaricom.co.ke/apis
- https://safaricom-mpesa.readme.io/

For issues, check:
- API logs in Daraja dashboard
- Transaction logs in Supabase
- Server logs (check terminal output)
