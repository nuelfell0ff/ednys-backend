import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(
      150,
      'Name cannot exceed 150 characters'
    ),

  email: z
    .string()
    .trim()
    .email('Must be a valid email address')
    .max(
      150,
      'Email cannot exceed 150 characters'
    ),

  password: z
    .string()
    .min(
      8,
      'Password must be at least 8 characters'
    )
    .max(
      100,
      'Password cannot exceed 100 characters'
    ),

  role: z.enum([
    'ADMIN',
    'TEACHER',
    'PARENT',
  ]),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name cannot be empty')
      .max(
        150,
        'Name cannot exceed 150 characters'
      )
      .optional(),

    email: z
      .string()
      .trim()
      .email('Must be a valid email address')
      .max(
        150,
        'Email cannot exceed 150 characters'
      )
      .optional(),

    role: z
      .enum([
        'ADMIN',
        'TEACHER',
        'PARENT',
      ])
      .optional(),

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

export const createTeacherUserSchema =
  createUserSchema.extend({
    role: z.literal('TEACHER'),
  });

export type CreateUserValidatedInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserValidatedInput =
  z.infer<typeof updateUserSchema>;

export type CreateTeacherUserValidatedInput =
  z.infer<
    typeof createTeacherUserSchema
  >;