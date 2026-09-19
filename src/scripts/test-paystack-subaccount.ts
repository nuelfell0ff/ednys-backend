import dotenv from 'dotenv';

import {
  createPaystackSubaccount,
} from '../services/paystack-subaccount.service';

dotenv.config();

const testPaystackSubaccount =
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
        await createPaystackSubaccount({
          businessName:
            'EDNYS Demo School',
          bankCode,
          accountNumber,
          percentageCharge: 2,
          description:
            'EDNYS Test Mode payment account',
          primaryContactEmail:
            'admin@ednysdemo.com',
        });

      console.log(
        'Paystack subaccount created successfully.'
      );

      console.log(
        `Subaccount Code: ${result.data.subaccount_code}`
      );

      console.log(
        `Business Name: ${result.data.business_name}`
      );

      console.log(
        `Account Name: ${result.data.account_name}`
      );

      console.log(
        `Settlement Bank: ${result.data.settlement_bank}`
      );

      console.log(
        `Percentage Charge: ${result.data.percentage_charge}%`
      );

      console.log(
        `Active: ${result.data.active}`
      );

      console.log(
        `Currency: ${result.data.currency}`
      );

      process.exit(0);
    } catch (error) {
      console.error(
        'Paystack subaccount creation failed:',
        error
      );

      process.exit(1);
    }
  };

void testPaystackSubaccount();