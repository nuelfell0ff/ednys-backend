import dotenv from 'dotenv';

import mongoose from 'mongoose';

import { connectDatabase } from '../config/database';

dotenv.config();

const cleanupSchoolPaymentConfig =
  async (): Promise<void> => {
    await connectDatabase();

    const result =
      await mongoose.connection
        .collection('schoolpaymentconfigs')
        .updateMany(
          {},
          {
            $unset: {
              platformFeePercentage: '',
              platformFeeFixed: '',
            },
          }
        );

    console.log(
      `Cleanup completed. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
    );

    await mongoose.disconnect();
  };

void cleanupSchoolPaymentConfig();