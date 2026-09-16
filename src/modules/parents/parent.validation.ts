import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createParentSchema = z.object({
  userId: objectIdSchema,

  phone: z
    .string()
    .trim()
    .max(
      30,
      'Phone number cannot exceed 30 characters'
    )
    .optional(),

  address: z
    .string()
    .trim()
    .max(
      250,
      'Address cannot exceed 250 characters'
    )
    .optional(),

  occupation: z
    .string()
    .trim()
    .max(
      100,
      'Occupation cannot exceed 100 characters'
    )
    .optional(),
});

export const updateParentSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .max(
        30,
        'Phone number cannot exceed 30 characters'
      )
      .optional(),

    address: z
      .string()
      .trim()
      .max(
        250,
        'Address cannot exceed 250 characters'
      )
      .optional(),

    occupation: z
      .string()
      .trim()
      .max(
        100,
        'Occupation cannot exceed 100 characters'
      )
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        'At least one field is required for an update',
    }
  );

export type CreateParentValidatedInput =
  z.infer<typeof createParentSchema>;

export type UpdateParentValidatedInput =
  z.infer<typeof updateParentSchema>;