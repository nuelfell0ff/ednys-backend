import { Request, Response } from 'express';

import {
  createFeeCategory,
  deleteFeeCategory,
  getFeeCategories,
  getFeeCategoryById,
  updateFeeCategory,
} from './fee-category.service';

import {
  createFeeCategorySchema,
  updateFeeCategorySchema,
} from './fee-category.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getFeeCategoryId = (
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

export const createFeeCategoryController =
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
      createFeeCategorySchema.safeParse(
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
      const feeCategory =
        await createFeeCategory(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Fee category created successfully',
        data: feeCategory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create fee category',
      });
    }
  };

export const getFeeCategoriesController =
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

    try {
      const feeCategories =
        await getFeeCategories(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: feeCategories,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve fee categories',
      });
    }
  };

export const getFeeCategoryController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeCategoryId =
      getFeeCategoryId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeCategoryId) {
      res.status(400).json({
        success: false,
        message:
          'Fee category ID is required',
      });

      return;
    }

    try {
      const feeCategory =
        await getFeeCategoryById(
          feeCategoryId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: feeCategory,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve fee category';

      res.status(
        message ===
          'Fee category not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const updateFeeCategoryController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeCategoryId =
      getFeeCategoryId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeCategoryId) {
      res.status(400).json({
        success: false,
        message:
          'Fee category ID is required',
      });

      return;
    }

    const validationResult =
      updateFeeCategorySchema.safeParse(
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
      const feeCategory =
        await updateFeeCategory(
          feeCategoryId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Fee category updated successfully',
        data: feeCategory,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update fee category';

      res.status(
        message ===
          'Fee category not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const deleteFeeCategoryController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeCategoryId =
      getFeeCategoryId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeCategoryId) {
      res.status(400).json({
        success: false,
        message:
          'Fee category ID is required',
      });

      return;
    }

    try {
      const feeCategory =
        await deleteFeeCategory(
          feeCategoryId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Fee category deactivated successfully',
        data: feeCategory,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to deactivate fee category';

      res.status(
        message ===
          'Fee category not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };