"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableSchoolPaymentConfigController = exports.updateSchoolPaymentConfigController = exports.getSchoolPaymentConfigController = exports.createSchoolPaymentConfigController = void 0;
const school_payment_config_service_1 = require("./school-payment-config.service");
const school_payment_config_validation_1 = require("./school-payment-config.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const createSchoolPaymentConfigController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = school_payment_config_validation_1.createSchoolPaymentConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const config = await (0, school_payment_config_service_1.createSchoolPaymentConfig)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'School payment configuration created successfully',
            data: config,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create payment configuration',
        });
    }
};
exports.createSchoolPaymentConfigController = createSchoolPaymentConfigController;
const getSchoolPaymentConfigController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const config = await (0, school_payment_config_service_1.getSchoolPaymentConfig)(schoolId);
        res.status(200).json({
            success: true,
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve payment configuration';
        res.status(message ===
            'Payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getSchoolPaymentConfigController = getSchoolPaymentConfigController;
const updateSchoolPaymentConfigController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = school_payment_config_validation_1.updateSchoolPaymentConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const config = await (0, school_payment_config_service_1.updateSchoolPaymentConfig)(schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'School payment configuration updated successfully',
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to update payment configuration';
        res.status(message ===
            'Payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.updateSchoolPaymentConfigController = updateSchoolPaymentConfigController;
const disableSchoolPaymentConfigController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const config = await (0, school_payment_config_service_1.disableSchoolPaymentConfig)(schoolId);
        res.status(200).json({
            success: true,
            message: 'School payment configuration disabled successfully',
            data: config,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to disable payment configuration';
        res.status(message ===
            'Payment configuration not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.disableSchoolPaymentConfigController = disableSchoolPaymentConfigController;
