import dotenv from 'dotenv';

import { verifyPaystackConnection } from '../services/paystack.service';

dotenv.config();

const testPaystackConnection =
  async (): Promise<void> => {
    try {
      await verifyPaystackConnection();

      console.log(
        'Paystack connection successful.'
      );

      process.exit(0);
    } catch (error) {
      console.error(
        'Paystack connection failed:',
        error
      );

      process.exit(1);
    }
  };

void testPaystackConnection();