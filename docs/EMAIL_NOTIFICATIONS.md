# Email Notifications System

## Overview

The Kodisha Marketplace has a complete email notification system for:
- 📧 Booking confirmations (guest & host)
- 💳 Payment receipts
- 💰 Host payouts
- 💬 New message alerts

All emails are beautifully formatted with branded templates and responsive design.

## Architecture

```
Event Occurs (booking/payment/message)
    ↓
[Trigger Email Endpoint]
    ↓
[Email Service processes]
    ↓
[Resend or SMTP sends]
    ↓
User receives email
```

## Email Service: `src/lib/email.ts`

**EmailService** class provides all email operations:

### Key Methods

- **`sendBookingConfirmation(data)`** - Guest booking confirmation
- **`sendHostBookingNotification(data)`** - Host booking alert
- **`sendPaymentReceipt(data)`** - Payment confirmation
- **`sendPayoutNotification(data)`** - Host earnings payout
- **`sendMessageNotification(...)`** - New message alert

### Features

- **Dual Provider Support**: Resend or SMTP
- **Beautiful HTML Templates**: Professional, responsive designs
- **Transaction Tracking**: Links and references for booking follow-up
- **Error Handling**: Graceful fallbacks if email fails

## Email Endpoints

### POST `/api/emails/booking-confirmation`

Sends booking confirmation emails to both guest and host.

**Request:**
```json
{
  "bookingId": "booking_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmation emails sent"
}
```

**Emails Sent:**
1. **To Guest**: Booking details, check-in/out dates, host info
2. **To Host**: Guest details, property info, payment pending notice

---

### POST `/api/emails/payment-receipt`

Sends payment receipt to guest.

**Request:**
```json
{
  "transactionId": "txn_123"
}
```

**Emails Sent:**
1. **To Guest**: Amount, M-Pesa reference, booking details

---

### POST `/api/emails/payout-notification`

Sends payout notification to host.

**Request:**
```json
{
  "payoutId": "payout_123"
}
```

**Emails Sent:**
1. **To Host**: Payout amount, M-Pesa reference, booking source

---

### POST `/api/emails/message-notification`

Sends new message alert to recipient.

**Request:**
```json
{
  "messageId": "msg_123"
}
```

**Emails Sent:**
1. **To Recipient**: Sender name, message preview, link to messages

---

## Setup Instructions

### Step 1: Choose Email Provider

#### Option A: Resend (Recommended)

1. Go to [Resend](https://resend.com)
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx...
   EMAIL_FROM=noreply@kodisha.co.ke
   ```

**Advantages:**
- Free tier: 100 emails/day
- Easy setup, no configuration
- Built for developers
- Great deliverability

#### Option B: SMTP (Gmail, SendGrid, etc.)

**For Gmail:**
1. Enable 2-factor authentication
2. Create App-specific password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - App passwords (at bottom)
   - Generate password for Mail/Windows Computer
3. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

**For SendGrid:**
1. Create SendGrid account
2. Get API key
3. Configure with SMTP:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=SG.xxx...
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Step 2: Configure Environment

1. Copy template: `cp .env.email.example .env.local`
2. Update with your credentials
3. Verify `NEXT_PUBLIC_APP_URL` is correct

### Step 3: Integrate with Events

#### On Booking Created

After creating a booking, call the confirmation endpoint:

```typescript
// In booking creation API route
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails/booking-confirmation`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId: newBooking.id }),
});
```

#### On Payment Completed

After payment succeeds, call the receipt endpoint:

```typescript
// In payment callback handler
if (paymentSuccessful) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails/payment-receipt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId: transaction.id }),
  });
}
```

#### On Payout Processed

After host payout, call payout endpoint:

```typescript
// In payout processing
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails/payout-notification`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ payoutId: payout.id }),
});
```

#### On New Message

When message is created:

```typescript
// In message creation
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails/message-notification`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messageId: message.id }),
});
```

---

## Email Templates

### 1. Booking Confirmation (Guest)
```
🎉 Booking Confirmed!

Shows:
- Listing details
- Check-in/out dates
- Total price
- Host name
- Booking reference
- Link to booking page
```

### 2. Booking Notification (Host)
```
📅 New Booking!

Shows:
- Guest name
- Property details
- Dates
- Expected earnings
- Payment pending notice
- Booking reference
```

### 3. Payment Receipt (Guest)
```
✅ Payment Successful!

Shows:
- Amount paid
- M-Pesa reference number
- Booking details
- Payment date/time
- Booking reference
```

### 4. Payout Notification (Host)
```
💰 Payout Processed!

Shows:
- Amount paid
- M-Pesa reference
- Booking source
- Payment status
- Payout date
```

### 5. Message Notification
```
💬 New Message

Shows:
- Sender name
- Message preview (150 chars)
- Link to conversation
```

---

## Testing

### Test with Development Environment

1. Set up email provider (Resend or SMTP)
2. Update `.env.local` with credentials
3. Run dev server: `npm run dev`
4. Make a booking
5. Check your email inbox

### Test Email Sending

```bash
# Test Resend API
curl -X POST http://localhost:3000/api/emails/booking-confirmation \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "test_booking_id"}'
```

### Verify Email Content

Check:
- ✅ Branding and colors correct
- ✅ All dynamic data populated
- ✅ Links work correctly
- ✅ Layout responsive on mobile
- ✅ No broken images

---

## Troubleshooting

### Issue: "SMTP connection refused"
- Verify SMTP credentials
- Check firewall allows port 587
- Try port 465 with SMTP_SECURE=true
- Use telnet to test: `telnet smtp.gmail.com 587`

### Issue: "Resend API error"
- Verify API key is correct
- Check API key starts with `re_`
- Ensure key has email permission
- Check rate limits

### Issue: "Email not received"
- Check spam/junk folder
- Verify recipient email is correct
- Check email logs in provider dashboard
- Try test send to different address

### Issue: "Dynamic content not showing"
- Verify database queries work
- Check booking/user data exists
- Look for console errors
- Enable debug logging

---

## Email Delivery Best Practices

### Sender Reputation
- Use consistent sender email
- Monitor bounce rates
- Handle unsubscribes properly
- Monitor spam complaints

### Content Quality
- Clear subject lines
- Professional HTML design
- Mobile-responsive layouts
- Plain text alternative (optional)

### Timing
- Send immediately on event
- Use scheduled delivery for newsletters
- Consider timezone for reminder emails
- Batch sending during low-traffic hours

---

## Advanced Configuration

### Custom SMTP Server

If using your own mail server:
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@yourdomain.com
SMTP_PASSWORD=secure_password
```

### Multiple Email Senders

Modify `email.ts` to support different senders:
```typescript
// Different email for different types
const getFromEmail = (type: 'booking' | 'payment' | 'support') => {
  switch(type) {
    case 'booking': return 'bookings@kodisha.co.ke';
    case 'payment': return 'payments@kodisha.co.ke';
    case 'support': return 'support@kodisha.co.ke';
  }
};
```

### Email Logging

Add database logging to track email history:
```typescript
// In email.ts send() method
await supabase.from('email_logs').insert({
  to: options.to,
  subject: options.subject,
  sent_at: new Date(),
  status: 'sent',
});
```

---

## Analytics

Track email metrics:
- Sends, opens, clicks
- Bounce rates
- Unsubscribe rate
- Delivery time
- Provider dashboard

Resend and most SMTP providers provide these metrics automatically.

---

## FAQ

**Q: Can I customize email templates?**
A: Yes! Edit the HTML in `email.ts` for each template method.

**Q: Do I need to pay for email?**
A: Resend has free tier (100/day). SMTP depends on provider (Gmail ~100/day, SendGrid paid).

**Q: Can I send bulk emails?**
A: Yes, but add rate limiting to prevent blacklisting. Use queues for large sends.

**Q: How do I test without sending real emails?**
A: Use Resend's test mode or set up local email preview in dev.

**Q: Can guests unsubscribe?**
A: Not yet implemented. Add unsubscribe link in email templates and honor preferences.

---

## Next Steps

1. Add email preference management (opt-out/opt-in)
2. Create email preview page for testing
3. Add email analytics dashboard
4. Set up bounce/complaint handling
5. Create email templates admin panel
