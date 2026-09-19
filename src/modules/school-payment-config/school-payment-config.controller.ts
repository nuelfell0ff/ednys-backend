import { Request, Response } from 'express';

import {
  createSchoolPaymentConfig,
  disableSchoolPaymentConfig,
  getSchoolPaymentConfig,
  updateSchoolPaymentConfig,
} from './school-payment-config.service';

import {
  createSchoolPaymentConfigSchema,
  updateSchoolPaymentConfigSchema,
} from './school-payment-config.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

export const createSchoolPaymentConfigController =
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
      createSchoolPaymentConfigSchema.safeParse(
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
      const config =
        await createSchoolPaymentConfig(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'School payment configuration created successfully',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create payment configuration',
      });
    }
  };

export const getSchoolPaymentConfigController =
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
      const config =
        await getSchoolPaymentConfig(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve payment configuration';

      res.status(
        message ===
          'Payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const updateSchoolPaymentConfigController =
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
      updateSchoolPaymentConfigSchema.safeParse(
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
      const config =
        await updateSchoolPaymentConfig(
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'School payment configuration updated successfully',
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update payment configuration';

      res.status(
        message ===
          'Payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const disableSchoolPaymentConfigController =
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
      const config =
        await disableSchoolPaymentConfig(
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'School payment configuration disabled successfully',
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to disable payment configuration';

      res.status(
        message ===
          'Payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };