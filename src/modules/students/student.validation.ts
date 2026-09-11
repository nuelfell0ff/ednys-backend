import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createStudentSchema = z.object({
  admissionNumber: z
    .string()
    .trim()
    .min(1, 'Admission number is required')
    .max(50, 'Admission number cannot exceed 50 characters'),

  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters'),

  middleName: z
    .string()
    .trim()
    .max(100, 'Middle name cannot exceed 100 characters')
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters'),

  dateOfBirth: z
    .string()
    .datetime({
      message: 'Date of birth must be a valid date',
    })
    .optional(),

  gender: z
    .enum(['MALE', 'FEMALE'])
    .optional(),

  classId: objectIdSchema.optional(),

  academicSessionId: objectIdSchema.optional(),
});

export const updateStudentSchema = z
  .object({
    admissionNumber: z
      .string()
      .trim()
      .min(1, 'Admission number cannot be empty')
      .max(
        50,
        'Admission number cannot exceed 50 characters'
      )
      .optional(),

    firstName: z
      .string()
      .trim()
      .min(1, 'First name cannot be empty')
      .max(
        100,
        'First name cannot exceed 100 characters'
      )
      .optional(),

    middleName: z
      .string()
      .trim()
      .max(
        100,
        'Middle name cannot exceed 100 characters'
      )
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, 'Last name cannot be empty')
      .max(
        100,
        'Last name cannot exceed 100 characters'
      )
      .optional(),

    dateOfBirth: z
      .string()
      .datetime({
        message: 'Date of birth must be a valid date',
      })
      .optional(),

    gender: z
      .enum(['MALE', 'FEMALE'])
      .optional(),

    classId: objectIdSchema.optional(),

    academicSessionId: objectIdSchema.optional(),

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

export type CreateStudentValidatedInput = z.infer<
  typeof createStudentSchema
>;

export type UpdateStudentValidatedInput = z.infer<
  typeof updateStudentSchema
>;
