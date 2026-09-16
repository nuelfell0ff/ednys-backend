import { Request, Response } from 'express';

import {
  createParent,
  getParentById,
  getParentByUserId,
  getParents,
  updateParent,
} from './parent.service';

import {
  createParentSchema,
  updateParentSchema,
} from './parent.validation';

const getSchoolId = (
  req: Request
): string | undefined => {
  return req.user?.schoolId;
};

const getParentId = (
  req: Request
): string | undefined => {
  const parentId = req.params.id;

  if (typeof parentId !== 'string') {
    return undefined;
  }

  return parentId;
};

export const createParentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    const validationResult =
      createParentSchema.safeParse(
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
      const parent =
        await createParent(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Parent profile created successfully',
        data: parent,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create parent profile',
      });
    }
  };

export const getParentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const parents =
        await getParents(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: parents,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve parents',
      });
    }
  };

export const getParentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const parentId = getParentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!parentId) {
      res.status(400).json({
        success: false,
        message:
          'Parent ID is required',
      });

      return;
    }

    try {
      const parent =
        await getParentById(
          schoolId,
          parentId
        );

      res.status(200).json({
        success: true,
        data: parent,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve parent',
      });
    }
  };

export const getParentByUserController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = req.params.userId;

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (typeof userId !== 'string') {
      res.status(400).json({
        success: false,
        message:
          'User ID is required',
      });

      return;
    }

    try {
      const parent =
        await getParentByUserId(
          schoolId,
          userId
        );

      res.status(200).json({
        success: true,
        data: parent,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve parent',
      });
    }
  };

export const updateParentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const parentId = getParentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!parentId) {
      res.status(400).json({
        success: false,
        message:
          'Parent ID is required',
      });

      return;
    }

    const validationResult =
      updateParentSchema.safeParse(
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
      const parent =
        await updateParent(
          schoolId,
          parentId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Parent profile updated successfully',
        data: parent,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update parent',
      });
    }
  };