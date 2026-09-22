"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePlatformPaymentConfig = exports.updatePlatformPaymentConfig = exports.getPlatformPaymentConfig = exports.createPlatformPaymentConfig = void 0;
const platform_payment_config_model_1 = require("./platform-payment-config.model");
const createPlatformPaymentConfig = async (data) => {
    const existingConfig = await platform_payment_config_model_1.PlatformPaymentConfig.findOne();
    if (existingConfig) {
        throw new Error('Platform payment configuration already exists');
    }
    const config = await platform_payment_config_model_1.PlatformPaymentConfig.create({
        platformFeePercentage: data.platformFeePercentage ?? 0,
        platformFeeFixed: data.platformFeeFixed ?? 0,
        isEnabled: data.isEnabled ?? true,
    });
    return config;
};
exports.createPlatformPaymentConfig = createPlatformPaymentConfig;
const getPlatformPaymentConfig = async () => {
    const config = await platform_payment_config_model_1.PlatformPaymentConfig.findOne();
    if (!config) {
        throw new Error('Platform payment configuration not found');
    }
    return config;
};
exports.getPlatformPaymentConfig = getPlatformPaymentConfig;
const updatePlatformPaymentConfig = async (data) => {
    const config = await platform_payment_config_model_1.PlatformPaymentConfig.findOne();
    if (!config) {
        throw new Error('Platform payment configuration not found');
    }
    if (data.platformFeePercentage !==
        undefined) {
        config.platformFeePercentage =
            data.platformFeePercentage;
    }
    if (data.platformFeeFixed !==
        undefined) {
        config.platformFeeFixed =
            data.platformFeeFixed;
    }
    if (data.isEnabled !== undefined) {
        config.isEnabled =
            data.isEnabled;
    }
    await config.save();
    return config;
};
exports.updatePlatformPaymentConfig = updatePlatformPaymentConfig;
const disablePlatformPaymentConfig = async () => {
    const config = await platform_payment_config_model_1.PlatformPaymentConfig.findOne();
    if (!config) {
        throw new Error('Platform payment configuration not found');
    }
    config.isEnabled = false;
    await config.save();
    return config;
};
exports.disablePlatformPaymentConfig = disablePlatformPaymentConfig;
