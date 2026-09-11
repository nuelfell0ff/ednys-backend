import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

const dateStringSchema = z
  .string()
  .datetime({
    message: 'Must be a valid date and time',
  });

export const createTeacherSchema = z.object({
  userId: objectIdSchema,

  employeeNumber: z
    .string()
    .trim()
    .max(
      50,
      'Employee number cannot exceed 50 characters'
    )
    .optional(),

  qualification: z
    .string()
    .trim()
    .max(
      150,
      'Qualification cannot exceed 150 characters'
    )
    .optional(),

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

  dateOfEmployment:
    dateStringSchema.optional(),
});

export const updateTeacherSchema = z
  .object({
    employeeNumber: z
      .string()
      .trim()
      .max(
        50,
        'Employee number cannot exceed 50 characters'
      )
      .optional(),

    qualification: z
      .string()
      .trim()
      .max(
        150,
        'Qualification cannot exceed 150 characters'
      )
      .optional(),

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

    dateOfEmployment:
      dateStringSchema.optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        'At least one field is required for an update',
    }
  );

export type CreateTeacherValidatedInput =
  z.infer<typeof createTeacherSchema>;

export type UpdateTeacherValidatedInput =
  z.infer<typeof updateTeacherSchema>;