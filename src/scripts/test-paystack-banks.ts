import dotenv from 'dotenv';

import { getPaystackBanks } from '../services/paystack-subaccount.service';

dotenv.config();

const testPaystackBanks =
  async (): Promise<void> => {
    try {
      const result =
        await getPaystackBanks();

      console.log(
        `Paystack returned ${result.data.length} banks.`
      );

      result.data.forEach((bank) => {
        console.log(
          `${bank.name} | Code: ${bank.code}`
        );
      });

      process.exit(0);
    } catch (error) {
      console.error(
        'Failed to retrieve Paystack banks:',
        error
      );

      process.exit(1);
    }
  };

void testPaystackBanks();