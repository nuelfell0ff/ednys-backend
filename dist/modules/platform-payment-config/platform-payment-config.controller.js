"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePlatformPaymentConfigController = exports.updatePlatformPaymentConfigController = exports.getPlatformPaymentConfigController = exports.createPlatformPaymentConfigController = void 0;
const platform_payment_config_service_1 = require("./platform-payment-config.service");
const platform_payment_config_validation_1 = require("./platform-payment-config.validation");
const createPlatformPaymentConfigController = async (req, res) => {
    const validationResult = platform_payment_config_validation_1.createPlatformPaymentConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const config = await (0, platform_payment_config_service_1.createPlatformPaymentConfig)(validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Platform payment configuration created successfully',
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to create platform payment configuration';
        res.status(message ===
            'Platform payment configuration already exists'
            ? 409
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.createPlatformPaymentConfigController = createPlatformPaymentConfigController;
const getPlatformPaymentConfigController = async (_req, res) => {
    try {
        const config = await (0, platform_payment_config_service_1.getPlatformPaymentConfig)();
        res.status(200).json({
            success: true,
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve platform payment configuration';
        res.status(message ===
            'Platform payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getPlatformPaymentConfigController = getPlatformPaymentConfigController;
const updatePlatformPaymentConfigController = async (req, res) => {
    const validationResult = platform_payment_config_validation_1.updatePlatformPaymentConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const config = await (0, platform_payment_config_service_1.updatePlatformPaymentConfig)(validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Platform payment configuration updated successfully',
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to update platform payment configuration';
        res.status(message ===
            'Platform payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.updatePlatformPaymentConfigController = updatePlatformPaymentConfigController;
const disablePlatformPaymentConfigController = async (_req, res) => {
    try {
        const config = await (0, platform_payment_config_service_1.disablePlatformPaymentConfig)();
        res.status(200).json({
            success: true,
            message: 'Platform payment configuration disabled successfully',
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to disable platform payment configuration';
        res.status(message ===
            'Platform payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.disablePlatformPaymentConfigController = disablePlatformPaymentConfigController;
