"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeeCategoryController = exports.updateFeeCategoryController = exports.getFeeCategoryController = exports.getFeeCategoriesController = exports.createFeeCategoryController = void 0;
const fee_category_service_1 = require("./fee-category.service");
const fee_category_validation_1 = require("./fee-category.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getFeeCategoryId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createFeeCategoryController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = fee_category_validation_1.createFeeCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const feeCategory = await (0, fee_category_service_1.createFeeCategory)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Fee category created successfully',
            data: feeCategory,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create fee category',
        });
    }
};
exports.createFeeCategoryController = createFeeCategoryController;
const getFeeCategoriesController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const feeCategories = await (0, fee_category_service_1.getFeeCategories)(schoolId);
        res.status(200).json({
            success: true,
            data: feeCategories,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve fee categories',
        });
    }
};
exports.getFeeCategoriesController = getFeeCategoriesController;
const getFeeCategoryController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeCategoryId = getFeeCategoryId(req);
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
            message: 'Fee category ID is required',
        });
        return;
    }
    try {
        const feeCategory = await (0, fee_category_service_1.getFeeCategoryById)(feeCategoryId, schoolId);
        res.status(200).json({
            success: true,
            data: feeCategory,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve fee category';
        res.status(message ===
            'Fee category not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getFeeCategoryController = getFeeCategoryController;
const updateFeeCategoryController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeCategoryId = getFeeCategoryId(req);
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
            message: 'Fee category ID is required',
        });
        return;
    }
    const validationResult = fee_category_validation_1.updateFeeCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const feeCategory = await (0, fee_category_service_1.updateFeeCategory)(feeCategoryId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Fee category updated successfully',
            data: feeCategory,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to update fee category';
        res.status(message ===
            'Fee category not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.updateFeeCategoryController = updateFeeCategoryController;
const deleteFeeCategoryController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeCategoryId = getFeeCategoryId(req);
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
            message: 'Fee category ID is required',
        });
        return;
    }
    try {
        const feeCategory = await (0, fee_category_service_1.deleteFeeCategory)(feeCategoryId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Fee category deactivated successfully',
            data: feeCategory,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to deactivate fee category';
        res.status(message ===
            'Fee category not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.deleteFeeCategoryController = deleteFeeCategoryController;
