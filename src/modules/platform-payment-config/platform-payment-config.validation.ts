import { z } from 'zod';

const percentageSchema = z
  .number()
  .min(
    0,
    'Platform fee percentage cannot be negative'
  )
  .max(
    100,
    'Platform fee percentage cannot exceed 100'
  );

const fixedFeeSchema = z
  .number()
  .min(
    0,
    'Platform fixed fee cannot be negative'
  );

export const createPlatformPaymentConfigSchema =
  z.object({
    platformFeePercentage:
      percentageSchema.optional(),

    platformFeeFixed:
      fixedFeeSchema.optional(),

    isEnabled:
      z.boolean().optional(),
  });

export const updatePlatformPaymentConfigSchema =
  createPlatformPaymentConfigSchema
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreatePlatformPaymentConfigValidatedInput =
  z.infer<
    typeof createPlatformPaymentConfigSchema
  >;

export type UpdatePlatformPaymentConfigValidatedInput =
  z.infer<
    typeof updatePlatformPaymentConfigSchema
  >;