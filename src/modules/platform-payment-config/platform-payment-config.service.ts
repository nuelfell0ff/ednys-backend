import {
  PlatformPaymentConfig,
} from './platform-payment-config.model';

import {
  CreatePlatformPaymentConfigInput,
  UpdatePlatformPaymentConfigInput,
} from './platform-payment-config.types';

export const createPlatformPaymentConfig =
  async (
    data: CreatePlatformPaymentConfigInput
  ) => {
    const existingConfig =
      await PlatformPaymentConfig.findOne();

    if (existingConfig) {
      throw new Error(
        'Platform payment configuration already exists'
      );
    }

    const config =
      await PlatformPaymentConfig.create({
        platformFeePercentage:
          data.platformFeePercentage ?? 0,
        platformFeeFixed:
          data.platformFeeFixed ?? 0,
        isEnabled:
          data.isEnabled ?? true,
      });

    return config;
  };

export const getPlatformPaymentConfig =
  async () => {
    const config =
      await PlatformPaymentConfig.findOne();

    if (!config) {
      throw new Error(
        'Platform payment configuration not found'
      );
    }

    return config;
  };

export const updatePlatformPaymentConfig =
  async (
    data: UpdatePlatformPaymentConfigInput
  ) => {
    const config =
      await PlatformPaymentConfig.findOne();

    if (!config) {
      throw new Error(
        'Platform payment configuration not found'
      );
    }

    if (
      data.platformFeePercentage !==
      undefined
    ) {
      config.platformFeePercentage =
        data.platformFeePercentage;
    }

    if (
      data.platformFeeFixed !==
      undefined
    ) {
      config.platformFeeFixed =
        data.platformFeeFixed;
    }

    if (
      data.isEnabled !== undefined
    ) {
      config.isEnabled =
        data.isEnabled;
    }

    await config.save();

    return config;
  };

export const disablePlatformPaymentConfig =
  async () => {
    const config =
      await PlatformPaymentConfig.findOne();

    if (!config) {
      throw new Error(
        'Platform payment configuration not found'
      );
    }

    config.isEnabled = false;

    await config.save();

    return config;
  };