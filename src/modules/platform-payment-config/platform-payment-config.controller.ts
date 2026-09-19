import { Request, Response } from 'express';

import {
  createPlatformPaymentConfig,
  disablePlatformPaymentConfig,
  getPlatformPaymentConfig,
  updatePlatformPaymentConfig,
} from './platform-payment-config.service';

import {
  createPlatformPaymentConfigSchema,
  updatePlatformPaymentConfigSchema,
} from './platform-payment-config.validation';

export const createPlatformPaymentConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationResult =
      createPlatformPaymentConfigSchema.safeParse(
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
        await createPlatformPaymentConfig(
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Platform payment configuration created successfully',
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create platform payment configuration';

      res.status(
        message ===
          'Platform payment configuration already exists'
          ? 409
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const getPlatformPaymentConfigController =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const config =
        await getPlatformPaymentConfig();

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve platform payment configuration';

      res.status(
        message ===
          'Platform payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const updatePlatformPaymentConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationResult =
      updatePlatformPaymentConfigSchema.safeParse(
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
        await updatePlatformPaymentConfig(
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Platform payment configuration updated successfully',
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update platform payment configuration';

      res.status(
        message ===
          'Platform payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const disablePlatformPaymentConfigController =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const config =
        await disablePlatformPaymentConfig();

      res.status(200).json({
        success: true,
        message:
          'Platform payment configuration disabled successfully',
        data: config,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to disable platform payment configuration';

      res.status(
        message ===
          'Platform payment configuration not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };