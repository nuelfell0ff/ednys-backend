import { paystackClient } from '../config/paystack';

export interface InitializePaystackTransactionInput {
  email: string;
  amount: number;
  reference: string;
  subaccount: string;
  transactionCharge?: number;
  bearer?: 'account' | 'subaccount';
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyPaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    transaction_date: string;
    paid_at?: string;
    channel?: string;
    gateway_response?: string;
    metadata?: Record<string, unknown> | string | null;
    subaccount?: {
      subaccount_code?: string;
      business_name?: string;
    } | null;
  };
}

export const verifyPaystackConnection =
  async (): Promise<void> => {
    await paystackClient.get('/balance');
  };

export const initializePaystackTransaction =
  async (
    data: InitializePaystackTransactionInput
  ): Promise<InitializePaystackTransactionResponse> => {
    if (!data.email) {
      throw new Error('Customer email is required');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error(
        'Transaction amount must be greater than zero'
      );
    }

    if (!data.reference) {
      throw new Error(
        'Transaction reference is required'
      );
    }

    if (!data.subaccount) {
      throw new Error(
        'Paystack subaccount is required'
      );
    }

    const amountInKobo =
      Math.round(data.amount * 100);

    const response =
      await paystackClient.post<InitializePaystackTransactionResponse>(
        '/transaction/initialize',
        {
          email: data.email,
          amount: amountInKobo,
          reference: data.reference,
          subaccount: data.subaccount,
          transaction_charge:
            data.transactionCharge,
          bearer: data.bearer,
          callback_url: data.callbackUrl,
          metadata: data.metadata,
          currency: 'NGN',
        }
      );

    return response.data;
  };

export const verifyPaystackTransaction =
  async (
    reference: string
  ): Promise<VerifyPaystackTransactionResponse> => {
    if (!reference?.trim()) {
      throw new Error(
        'Transaction reference is required'
      );
    }

    const response =
      await paystackClient.get<VerifyPaystackTransactionResponse>(
        `/transaction/verify/${encodeURIComponent(
          reference.trim()
        )}`
      );

    return response.data;
  };