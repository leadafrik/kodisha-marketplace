import nodemailer from 'nodemailer';

/**
 * Email notification service using Resend or SendGrid
 * Configure via environment variables:
 * - RESEND_API_KEY - If using Resend
 * - SENDGRID_API_KEY - If using SendGrid
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface BookingConfirmationData {
  bookingId: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  location: string;
  bookingLink: string;
}

interface PaymentReceiptData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  mpesaRef: string;
  listingTitle: string;
  paymentDate: string;
}

interface HostPayoutData {
  hostName: string;
  hostEmail: string;
  amount: number;
  bookingId: string;
  mpesaRef?: string;
}

/**
 * Email Service Class
 */
export class EmailService {
  private transporter: any;
  private fromEmail: string;
  private useResend: boolean;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@kodisha.co.ke';
    this.useResend = !!process.env.RESEND_API_KEY;

    if (this.useResend) {
      // Using Resend API
      this.transporter = null; // Resend uses fetch API
    } else {
      // Fallback: Using Nodemailer with SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  /**
   * Send email using Resend API
   */
  private async sendViaResend(options: EmailOptions): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }
  }

  /**
   * Send email using SMTP
   */
  private async sendViaSMTP(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      throw new Error('SMTP not configured');
    }

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  /**
   * Main send method
   */
  async send(options: EmailOptions): Promise<void> {
    try {
      if (this.useResend) {
        await this.sendViaResend(options);
      } else {
        await this.sendViaSMTP(options);
      }
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Send booking confirmation to guest
   */
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            h2 { color: #111827; margin-top: 0; }
            .price { font-size: 24px; font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p>Your reservation has been confirmed successfully.</p>
            </div>
            <div class="content">
              <h2>Hello ${data.guestName},</h2>
              <p>Thank you for booking with us! Your reservation details are below:</p>

              <div class="details">
                <div class="detail-row">
                  <strong>Listing</strong>
                  <span>${data.listingTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Location</strong>
                  <span>${data.location}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-in</strong>
                  <span>${new Date(data.checkInDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-out</strong>
                  <span>${new Date(data.checkOutDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Host</strong>
                  <span>${data.hostName}</span>
                </div>
                <div class="detail-row">
                  <strong>Total Price</strong>
                  <span class="price">KES ${data.totalPrice.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Booking ID</strong>
                  <span>#${data.bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <p>Next: Complete payment to confirm your booking.</p>

              <center>
                <a href="${data.bookingLink}" class="button">View Booking</a>
              </center>

              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions, please contact the host directly through your booking page.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kodisha Marketplace. All rights reserved.</p>
              <p><a href="https://kodisha.co.ke" style="color: #9ca3af;">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: data.guestEmail,
      subject: `Booking Confirmed: ${data.listingTitle}`,
      html,
    });
  }

  /**
   * Send booking confirmation to host
   */
  async sendHostBookingNotification(data: BookingConfirmationData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            h2 { color: #111827; margin-top: 0; }
            .price { font-size: 24px; font-weight: bold; color: #16a34a; }
            .alert { background: #fef3c7; border: 1px solid #fcd34d; padding: 12px; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 New Booking!</h1>
              <p>You have a new reservation for your property.</p>
            </div>
            <div class="content">
              <h2>Hello ${data.hostName},</h2>
              <p>Great news! You have a new booking for your property:</p>

              <div class="alert">
                <strong>⚠️ Awaiting Payment:</strong> This booking is pending guest payment. It will be confirmed once payment is received.
              </div>

              <div class="details">
                <div class="detail-row">
                  <strong>Guest Name</strong>
                  <span>${data.guestName}</span>
                </div>
                <div class="detail-row">
                  <strong>Property</strong>
                  <span>${data.listingTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-in</strong>
                  <span>${new Date(data.checkInDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-out</strong>
                  <span>${new Date(data.checkOutDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Expected Earnings</strong>
                  <span class="price">KES ${data.totalPrice.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Booking ID</strong>
                  <span>#${data.bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <p><strong>Next Step:</strong> The guest needs to complete payment. You'll be notified when payment is received.</p>

              <center>
                <a href="${data.bookingLink}" class="button">View Booking</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kodisha Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: data.hostEmail,
      subject: `New Booking: ${data.listingTitle}`,
      html,
    });
  }

  /**
   * Send payment receipt to guest
   */
  async sendPaymentReceipt(data: PaymentReceiptData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #16a34a; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            h2 { color: #111827; margin-top: 0; }
            .price { font-size: 28px; font-weight: bold; color: #16a34a; }
            .ref { background: #e0e7ff; padding: 8px 12px; border-radius: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Successful!</h1>
              <p>Your payment has been received and processed.</p>
            </div>
            <div class="content">
              <h2>Thank you, ${data.guestName}!</h2>
              <p>Your booking payment has been confirmed. Here's your receipt:</p>

              <div class="details">
                <div class="detail-row">
                  <strong>Amount Paid</strong>
                  <span class="price">KES ${data.amount.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>M-Pesa Reference</strong>
                  <span class="ref">${data.mpesaRef}</span>
                </div>
                <div class="detail-row">
                  <strong>Booking</strong>
                  <span>${data.listingTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Payment Date</strong>
                  <span>${new Date(data.paymentDate).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Booking ID</strong>
                  <span>#${data.bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <p>Your booking is now confirmed! You should receive a message from the host soon with check-in details.</p>
              <p style="color: #6b7280; font-size: 14px;">
                <strong>Save this email for your records.</strong> Your booking reference is <strong>#${data.bookingId.substring(0, 8).toUpperCase()}</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kodisha Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: data.guestEmail,
      subject: `Payment Receipt: ${data.listingTitle}`,
      html,
    });
  }

  /**
   * Send payout notification to host
   */
  async sendPayoutNotification(data: HostPayoutData): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            h2 { color: #111827; margin-top: 0; }
            .amount { font-size: 32px; font-weight: bold; color: #16a34a; }
            .success { background: #dcfce7; border: 1px solid #86efac; padding: 12px; border-radius: 6px; margin: 15px 0; color: #166534; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payout Processed!</h1>
              <p>Your earnings have been sent to your M-Pesa account.</p>
            </div>
            <div class="content">
              <h2>Hello ${data.hostName},</h2>
              <p>Great news! Your earnings have been paid out successfully.</p>

              <div class="success">
                <strong>✅ Payment Status:</strong> Successfully sent to your M-Pesa account.
              </div>

              <div class="details">
                <div class="detail-row">
                  <strong>Amount Paid</strong>
                  <span class="amount">KES ${data.amount.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>From Booking</strong>
                  <span>#${data.bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
                ${data.mpesaRef ? `
                <div class="detail-row">
                  <strong>M-Pesa Reference</strong>
                  <span style="font-family: monospace;">${data.mpesaRef}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <strong>Payout Date</strong>
                  <span>${new Date().toLocaleString()}</span>
                </div>
              </div>

              <p>The amount should appear in your M-Pesa account within a few minutes. If you don't receive it, please contact our support team.</p>
              <p style="color: #6b7280; font-size: 14px;">
                Keep this email for your records. Your payout reference is <strong>#${data.bookingId.substring(0, 8).toUpperCase()}</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kodisha Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: data.hostEmail,
      subject: `Payout Received: KES ${data.amount.toLocaleString()}`,
      html,
    });
  }

  /**
   * Send message notification
   */
  async sendMessageNotification(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    messagePreview: string,
    messageLink: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #111827; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Message</h1>
              <p>You have a new message on Kodisha.</p>
            </div>
            <div class="content">
              <h2>Hello ${recipientName},</h2>
              <p><strong>${senderName}</strong> sent you a message:</p>

              <div class="message-box">
                <p><em>"${messagePreview}"</em></p>
              </div>

              <center>
                <a href="${messageLink}" class="button">View Message</a>
              </center>

              <p style="color: #6b7280; font-size: 14px;">
                Reply to the message to continue the conversation.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kodisha Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: recipientEmail,
      subject: `New Message from ${senderName}`,
      html,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
