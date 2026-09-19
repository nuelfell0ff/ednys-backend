import dotenv from 'dotenv';

import {
  resolvePaystackAccount,
} from '../services/paystack-subaccount.service';

dotenv.config();

const testPaystackAccount =
  async (): Promise<void> => {
    const bankCode =
      process.env.PAYSTACK_TEST_BANK_CODE;

    const accountNumber =
      process.env.PAYSTACK_TEST_ACCOUNT_NUMBER;

    if (!bankCode || !accountNumber) {
      throw new Error(
        'PAYSTACK_TEST_BANK_CODE and PAYSTACK_TEST_ACCOUNT_NUMBER are not defined'
      );
    }

    try {
      const result =
        await resolvePaystackAccount(
          bankCode,
          accountNumber
        );

      console.log(
        'Paystack account resolved successfully.'
      );

      console.log(
        `Account Name: ${result.data.account_name}`
      );

      console.log(
        `Account Number: ${result.data.account_number}`
      );

      console.log(
        `Bank ID: ${result.data.bank_id ?? 'N/A'}`
      );

      process.exit(0);
    } catch (error) {
      console.error(
        'Paystack account resolution failed:',
        error
      );

      process.exit(1);
    }
  };

void testPaystackAccount();