"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeeStructureController = exports.updateFeeStructureController = exports.getFeeStructureController = exports.getFeeStructuresController = exports.createFeeStructureController = void 0;
const fee_structure_service_1 = require("./fee-structure.service");
const fee_structure_validation_1 = require("./fee-structure.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getFeeStructureId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createFeeStructureController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = fee_structure_validation_1.createFeeStructureSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const feeStructure = await (0, fee_structure_service_1.createFeeStructure)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Fee structure created successfully',
            data: feeStructure,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create fee structure',
        });
    }
};
exports.createFeeStructureController = createFeeStructureController;
const getFeeStructuresController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const feeStructures = await (0, fee_structure_service_1.getFeeStructures)(schoolId);
        res.status(200).json({
            success: true,
            data: feeStructures,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve fee structures',
        });
    }
};
exports.getFeeStructuresController = getFeeStructuresController;
const getFeeStructureController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeStructureId = getFeeStructureId(req);
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
            message: 'Fee structure ID is required',
        });
        return;
    }
    try {
        const feeStructure = await (0, fee_structure_service_1.getFeeStructureById)(feeStructureId, schoolId);
        res.status(200).json({
            success: true,
            data: feeStructure,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve fee structure';
        res.status(message ===
            'Fee structure not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getFeeStructureController = getFeeStructureController;
const updateFeeStructureController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeStructureId = getFeeStructureId(req);
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
            message: 'Fee structure ID is required',
        });
        return;
    }
    const validationResult = fee_structure_validation_1.updateFeeStructureSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const feeStructure = await (0, fee_structure_service_1.updateFeeStructure)(feeStructureId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Fee structure updated successfully',
            data: feeStructure,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to update fee structure';
        res.status(message ===
            'Fee structure not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.updateFeeStructureController = updateFeeStructureController;
const deleteFeeStructureController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const feeStructureId = getFeeStructureId(req);
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
            message: 'Fee structure ID is required',
        });
        return;
    }
    try {
        const feeStructure = await (0, fee_structure_service_1.deleteFeeStructure)(feeStructureId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Fee structure deactivated successfully',
            data: feeStructure,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to deactivate fee structure';
        res.status(message ===
            'Fee structure not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.deleteFeeStructureController = deleteFeeStructureController;
