import { z } from 'zod';

import {
  PaymentMethod,
  PaymentStatus,
} from './payment.model';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createPaymentSchema =
  z.object({
    invoiceId: objectIdSchema,
    amount: z
      .number()
      .positive(
        'Payment amount must be greater than zero'
      ),
    paymentMethod: z.enum(
      Object.values(PaymentMethod) as [
        PaymentMethod,
        ...PaymentMethod[]
      ]
    ),
    reference: z
      .string()
      .trim()
      .min(
        1,
        'Payment reference cannot be empty'
      )
      .max(
        150,
        'Payment reference cannot exceed 150 characters'
      )
      .optional(),
  });

export const initializePaystackPaymentSchema =
  z.object({
    invoiceId: objectIdSchema,
    amount: z
      .number()
      .positive(
        'Payment amount must be greater than zero'
      ),
  });

export const paymentQuerySchema =
  z.object({
    invoiceId:
      objectIdSchema.optional(),
    studentId:
      objectIdSchema.optional(),
    paymentMethod: z
      .enum(
        Object.values(PaymentMethod) as [
          PaymentMethod,
          ...PaymentMethod[]
        ]
      )
      .optional(),
    status: z
      .enum(
        Object.values(PaymentStatus) as [
          PaymentStatus,
          ...PaymentStatus[]
        ]
      )
      .optional(),
  });

export type CreatePaymentValidatedInput =
  z.infer<typeof createPaymentSchema>;

export type InitializePaystackPaymentValidatedInput =
  z.infer<
    typeof initializePaystackPaymentSchema
  >;

export type PaymentQueryValidatedInput =
  z.infer<typeof paymentQuerySchema>;