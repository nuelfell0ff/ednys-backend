import { z } from 'zod';

import { ResultTerm } from '../results/result.model';
import { InvoiceStatus } from './invoice.model';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createInvoiceSchema =
  z.object({
    studentId: objectIdSchema,

    academicSessionId: objectIdSchema,

    term: z.enum(
      Object.values(ResultTerm) as [
        ResultTerm,
        ...ResultTerm[]
      ]
    ),
  });

export const invoiceQuerySchema =
  z.object({
    studentId:
      objectIdSchema.optional(),

    academicSessionId:
      objectIdSchema.optional(),

    term: z
      .enum(
        Object.values(ResultTerm) as [
          ResultTerm,
          ...ResultTerm[]
        ]
      )
      .optional(),

    status: z
      .enum(
        Object.values(InvoiceStatus) as [
          InvoiceStatus,
          ...InvoiceStatus[]
        ]
      )
      .optional(),
  });

export const cancelInvoiceSchema =
  z.object({
    reason: z
      .string()
      .trim()
      .max(
        250,
        'Cancellation reason cannot exceed 250 characters'
      )
      .optional(),
  });

export type CreateInvoiceValidatedInput =
  z.infer<
    typeof createInvoiceSchema
  >;

export type InvoiceQueryValidatedInput =
  z.infer<
    typeof invoiceQuerySchema
  >;

export type CancelInvoiceValidatedInput =
  z.infer<
    typeof cancelInvoiceSchema
  >;