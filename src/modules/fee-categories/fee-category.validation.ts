import { z } from 'zod';

export const createFeeCategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        'Fee category name is required'
      )
      .max(
        100,
        'Fee category name cannot exceed 100 characters'
      ),

    description: z
      .string()
      .trim()
      .max(
        250,
        'Description cannot exceed 250 characters'
      )
      .optional(),
  });

export const updateFeeCategorySchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          1,
          'Fee category name is required'
        )
        .max(
          100,
          'Fee category name cannot exceed 100 characters'
        )
        .optional(),

      description: z
        .string()
        .trim()
        .max(
          250,
          'Description cannot exceed 250 characters'
        )
        .optional(),

      isActive: z
        .boolean()
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateFeeCategoryValidatedInput =
  z.infer<
    typeof createFeeCategorySchema
  >;

export type UpdateFeeCategoryValidatedInput =
  z.infer<
    typeof updateFeeCategorySchema
  >;