import { Request, Response } from 'express';
import crypto from 'crypto';

import {
  processPaystackChargeSuccess,
} from './paystack-webhook.service';

interface PaystackWebhookEvent {
  event?: string;
  data?: {
    reference?: string;
  };
}

const getSignature = (
  req: Request
): string | undefined => {
  const signature =
    req.headers['x-paystack-signature'];

  if (Array.isArray(signature)) {
    return signature[0];
  }

  return signature;
};

const verifySignature = (
  rawBody: Buffer,
  signature: string
): boolean => {
  const secret =
    process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not defined'
    );
  }

  const expectedSignature =
    crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      'utf8'
    );

  const receivedBuffer =
    Buffer.from(
      signature,
      'utf8'
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
};

export const paystackWebhookController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const signature =
        getSignature(req);

      if (!signature) {
        res.status(401).json({
          success: false,
          message:
            'Paystack signature is required',
        });

        return;
      }

      if (
        !Buffer.isBuffer(req.body)
      ) {
        res.status(400).json({
          success: false,
          message:
            'Invalid webhook request body',
        });

        return;
      }

      const isValid =
        verifySignature(
          req.body,
          signature
        );

      if (!isValid) {
        res.status(401).json({
          success: false,
          message:
            'Invalid Paystack webhook signature',
        });

        return;
      }

      let event:
        | PaystackWebhookEvent
        | undefined;

      try {
        event =
          JSON.parse(
            req.body.toString('utf8')
          ) as PaystackWebhookEvent;
      } catch {
        res.status(400).json({
          success: false,
          message:
            'Invalid webhook JSON payload',
        });

        return;
      }

      if (
        event.event !==
        'charge.success'
      ) {
        res.status(200).json({
          success: true,
          message:
            'Webhook event received',
        });

        return;
      }

      const reference =
        event.data?.reference;

      if (!reference) {
        res.status(400).json({
          success: false,
          message:
            'Transaction reference is missing',
        });

        return;
      }

      const result =
        await processPaystackChargeSuccess(
          reference
        );

      res.status(200).json({
        success: true,
        message:
          result.alreadyProcessed
            ? 'Payment already processed'
            : 'Payment processed successfully',
      });
    } catch (error) {
      console.error(
        'Paystack webhook processing error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to process Paystack webhook',
      });
    }
  };