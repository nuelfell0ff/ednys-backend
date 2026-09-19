import dotenv from 'dotenv';

import axios from 'axios';

dotenv.config();

const secretKey =
  process.env.PAYSTACK_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    'PAYSTACK_SECRET_KEY is not defined'
  );
}

export const paystackClient =
  axios.create({
    baseURL:
      process.env.PAYSTACK_BASE_URL ||
      'https://api.paystack.co',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });