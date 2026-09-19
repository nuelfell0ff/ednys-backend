import { paystackClient } from '../config/paystack';

export interface CreatePaystackSubaccountInput {
  businessName: string;
  bankCode: string;
  accountNumber: string;
  percentageCharge: number;
  description?: string;
  primaryContactEmail?: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
}

export interface PaystackSubaccountResponse {
  status: boolean;
  message: string;
  data: {
    subaccount_code: string;
    business_name: string;
    account_number: string;
    percentage_charge: number;
    settlement_bank: string;
    account_name: string;
    active: boolean;
    currency: string;
  };
}

export interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode?: string;
  gateway?: string;
  pay_with_bank?: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

export interface PaystackBanksResponse {
  status: boolean;
  message: string;
  data: PaystackBank[];
}

export interface ResolvePaystackAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id?: number;
  };
}

export const getPaystackBanks =
  async (): Promise<PaystackBanksResponse> => {
    const response =
      await paystackClient.get<PaystackBanksResponse>(
        '/bank'
      );

    return response.data;
  };

export const resolvePaystackAccount =
  async (
    bankCode: string,
    accountNumber: string
  ): Promise<ResolvePaystackAccountResponse> => {
    const response =
      await paystackClient.get<ResolvePaystackAccountResponse>(
        '/bank/resolve',
        {
          params: {
            account_number:
              accountNumber,
            bank_code:
              bankCode,
          },
        }
      );

    return response.data;
  };

export const createPaystackSubaccount =
  async (
    data: CreatePaystackSubaccountInput
  ): Promise<PaystackSubaccountResponse> => {
    const response =
      await paystackClient.post<PaystackSubaccountResponse>(
        '/subaccount',
        {
          business_name:
            data.businessName,
          bank_code:
            data.bankCode,
          account_number:
            data.accountNumber,
          percentage_charge:
            data.percentageCharge,
          description:
            data.description,
          primary_contact_email:
            data.primaryContactEmail,
          primary_contact_name:
            data.primaryContactName,
          primary_contact_phone:
            data.primaryContactPhone,
        }
      );

    return response.data;
  };