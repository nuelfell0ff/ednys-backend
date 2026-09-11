import { Request, Response } from 'express';

import {
  createUser,
  getUserById,
} from './user.service';

import {
  createUserSchema,
} from './user.validation';

import { UserRole } from './user.model';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getUserId = (
  req: Request
): string | null => {
  const { id } = req.params;

  if (
    typeof id !== 'string' ||
    !id.trim()
  ) {
    return null;
  }

  return id;
};

export const createUserController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      createUserSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const user = await createUser(
        schoolId,
        {
          ...validationResult.data,
          role:
            validationResult.data.role as UserRole,
        }
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create user',
      });
    }
  };

export const getUserController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });

      return;
    }

    try {
      const user = await getUserById(
        userId,
        schoolId
      );

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'User not found',
      });
    }
  };