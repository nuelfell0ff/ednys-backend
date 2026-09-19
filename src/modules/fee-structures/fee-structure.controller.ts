import { Request, Response } from 'express';

import {
  createFeeStructure,
  deleteFeeStructure,
  getFeeStructureById,
  getFeeStructures,
  updateFeeStructure,
} from './fee-structure.service';

import {
  createFeeStructureSchema,
  updateFeeStructureSchema,
} from './fee-structure.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getFeeStructureId = (
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

export const createFeeStructureController =
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
      createFeeStructureSchema.safeParse(
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
      const feeStructure =
        await createFeeStructure(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Fee structure created successfully',
        data: feeStructure,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create fee structure',
      });
    }
  };

export const getFeeStructuresController =
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
      const feeStructures =
        await getFeeStructures(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: feeStructures,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve fee structures',
      });
    }
  };

export const getFeeStructureController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeStructureId =
      getFeeStructureId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeStructureId) {
      res.status(400).json({
        success: false,
        message:
          'Fee structure ID is required',
      });

      return;
    }

    try {
      const feeStructure =
        await getFeeStructureById(
          feeStructureId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: feeStructure,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve fee structure';

      res.status(
        message ===
          'Fee structure not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const updateFeeStructureController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeStructureId =
      getFeeStructureId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeStructureId) {
      res.status(400).json({
        success: false,
        message:
          'Fee structure ID is required',
      });

      return;
    }

    const validationResult =
      updateFeeStructureSchema.safeParse(
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
      const feeStructure =
        await updateFeeStructure(
          feeStructureId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Fee structure updated successfully',
        data: feeStructure,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update fee structure';

      res.status(
        message ===
          'Fee structure not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const deleteFeeStructureController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const feeStructureId =
      getFeeStructureId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!feeStructureId) {
      res.status(400).json({
        success: false,
        message:
          'Fee structure ID is required',
      });

      return;
    }

    try {
      const feeStructure =
        await deleteFeeStructure(
          feeStructureId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Fee structure deactivated successfully',
        data: feeStructure,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to deactivate fee structure';

      res.status(
        message ===
          'Fee structure not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };