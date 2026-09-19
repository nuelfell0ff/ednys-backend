import { z } from 'zod';

export const createSchoolPaymentConfigSchema =
  z.object({
    paystackSubaccountCode: z
      .string()
      .trim()
      .max(
        100,
        'Paystack subaccount code cannot exceed 100 characters'
      )
      .optional(),

    paystackAccountName: z
      .string()
      .trim()
      .max(
        150,
        'Paystack account name cannot exceed 150 characters'
      )
      .optional(),

    settlementBankCode: z
      .string()
      .trim()
      .max(
        20,
        'Settlement bank code cannot exceed 20 characters'
      )
      .optional(),

    settlementBankName: z
      .string()
      .trim()
      .max(
        100,
        'Settlement bank name cannot exceed 100 characters'
      )
      .optional(),

    settlementAccountNumber: z
      .string()
      .trim()
      .max(
        30,
        'Settlement account number cannot exceed 30 characters'
      )
      .optional(),

    isEnabled:
      z.boolean().optional(),
  });

export const updateSchoolPaymentConfigSchema =
  createSchoolPaymentConfigSchema
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateSchoolPaymentConfigValidatedInput =
  z.infer<
    typeof createSchoolPaymentConfigSchema
  >;

export type UpdateSchoolPaymentConfigValidatedInput =
  z.infer<
    typeof updateSchoolPaymentConfigSchema
  >;