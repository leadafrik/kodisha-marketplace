/**
 * M-Pesa Integration Service
 * Handles all payment processing with Safaricom Daraja API
 * 
 * Environment variables needed:
 * - NEXT_PUBLIC_MPESA_ENVIRONMENT: 'sandbox' | 'production'
 * - MPESA_CONSUMER_KEY: Daraja API key
 * - MPESA_CONSUMER_SECRET: Daraja API secret
 * - MPESA_SHORT_CODE: Business Short Code
 * - MPESA_PASSKEY: M-Pesa Passkey for STK push
 * - MPESA_CALLBACK_URL: Webhook for payment updates
 */

export interface MpesaConfig {
  environment: 'sandbox' | 'production';
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey: string;
  callbackUrl: string;
}

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  description: string;
  orderId: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  checkoutRequestID?: string;
  responseCode?: string;
  responseDescription?: string;
  error?: string;
  timestamp?: string;
}

export interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  phoneNumber: string;
  status: 'pending' | 'completed' | 'failed';
  mpesaRef?: string;
  orderId: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

class MpesaService {
  private config: MpesaConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MpesaConfig) {
    this.config = config;
  }

  /**
   * Get access token from Daraja API
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const url =
        this.config.environment === 'sandbox'
          ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
          : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

      const auth = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString('base64');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = (await response.json()) as { access_token: string; expires_in: number };

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 60s before expiry

      return this.accessToken;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error);
      throw error;
    }
  }

  /**
   * Generate timestamp for M-Pesa requests
   */
  private getTimestamp(): string {
    const date = new Date();
    return (
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0')
    );
  }

  /**
   * Generate password for STK push
   */
  private generatePassword(timestamp: string): string {
    const password = Buffer.from(
      `${this.config.shortCode}${this.config.passkey}${timestamp}`
    ).toString('base64');
    return password;
  }

  /**
   * Initiate STK push (Lipa Na M-Pesa Online)
   */
  async initiateStkPush(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate input
      if (!request.amount || request.amount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      if (!request.phoneNumber || request.phoneNumber.length < 9) {
        return { success: false, error: 'Invalid phone number' };
      }

      // Get access token
      const accessToken = await this.getAccessToken();

      // Prepare request
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const url =
        this.config.environment === 'sandbox'
          ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
          : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

      // Format phone number (add country code if needed)
      const formattedPhone = request.phoneNumber.startsWith('254')
        ? request.phoneNumber
        : `254${request.phoneNumber.replace(/^0/, '')}`;

      const payload = {
        BusinessShortCode: this.config.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount), // M-Pesa requires whole numbers
        PartyA: formattedPhone,
        PartyB: this.config.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.config.callbackUrl,
        AccountReference: request.accountReference,
        TransactionDesc: request.description,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('M-Pesa STK push error:', errorData);
        return {
          success: false,
          error: errorData.errorMessage || 'Failed to initiate payment',
        };
      }

      const data = (await response.json()) as {
        CheckoutRequestID: string;
        ResponseCode: string;
        ResponseDescription: string;
        MerchantRequestID: string;
      };

      return {
        success: data.ResponseCode === '0',
        checkoutRequestID: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error initiating STK push:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Query transaction status
   */
  async queryTransactionStatus(checkoutRequestID: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const url =
        this.config.environment === 'sandbox'
          ? 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
          : 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';

      const payload = {
        BusinessShortCode: this.config.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to query transaction' };
      }

      const data = (await response.json()) as {
        ResponseCode: string;
        ResultCode?: string;
        ResultDesc: string;
      };

      // ResponseCode 0 = success, ResultCode 0 = completed payment
      return {
        success: data.ResponseCode === '0' && data.ResultCode === '0',
        responseCode: data.ResponseCode,
        responseDescription: data.ResultDesc,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error querying transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process B2C payment (send money to host)
   */
  async sendPayoutToHost(
    hostPhone: string,
    amount: number,
    description: string
  ): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const url =
        this.config.environment === 'sandbox'
          ? 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest'
          : 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';

      // Format phone number
      const formattedPhone = hostPhone.startsWith('254')
        ? hostPhone
        : `254${hostPhone.replace(/^0/, '')}`;

      const payload = {
        InitiatorName: 'Kodisha',
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL, // Encrypted credential
        CommandID: 'BusinessPayment',
        Amount: Math.round(amount),
        PartyA: this.config.shortCode,
        PartyB: formattedPhone,
        Remarks: description,
        QueueTimeOutURL: this.config.callbackUrl,
        ResultURL: this.config.callbackUrl,
        Occasion: 'Host Payout',
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.errorMessage || 'Failed to send payout',
        };
      }

      const data = (await response.json()) as {
        ConversationID: string;
        ResponseCode: string;
        ResponseDescription: string;
      };

      return {
        success: data.ResponseCode === '0',
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending payout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Validate M-Pesa callback signature
   */
  validateCallback(data: unknown, signature: string): boolean {
    // TODO: Implement signature validation using M-Pesa certificate
    // This is critical for production
    return true;
  }
}

// Initialize service with environment variables
export const initializeMpesaService = (): MpesaService => {
  const config: MpesaConfig = {
    environment: (process.env.NEXT_PUBLIC_MPESA_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    shortCode: process.env.MPESA_SHORT_CODE || '',
    passkey: process.env.MPESA_PASSKEY || '',
    callbackUrl: process.env.MPESA_CALLBACK_URL || '',
  };

  return new MpesaService(config);
};

export default MpesaService;
