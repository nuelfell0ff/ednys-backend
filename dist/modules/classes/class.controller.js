"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClassController = exports.updateClassController = exports.getClassController = exports.getClassesController = exports.createClassController = void 0;
const class_service_1 = require("./class.service");
const class_validation_1 = require("./class.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getClassId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createClassController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = class_validation_1.createClassSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const classRecord = await (0, class_service_1.createClass)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: classRecord,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create class',
        });
    }
};
exports.createClassController = createClassController;
const getClassesController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const academicSessionId = typeof req.query.academicSessionId ===
        'string'
        ? req.query.academicSessionId
        : undefined;
    try {
        const classes = await (0, class_service_1.getClasses)(schoolId, academicSessionId);
        res.status(200).json({
            success: true,
            data: classes,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve classes',
        });
    }
};
exports.getClassesController = getClassesController;
const getClassController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const classId = getClassId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!classId) {
        res.status(400).json({
            success: false,
            message: 'Class ID is required',
        });
        return;
    }
    try {
        const classRecord = await (0, class_service_1.getClassById)(classId, schoolId);
        res.status(200).json({
            success: true,
            data: classRecord,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Class not found',
        });
    }
};
exports.getClassController = getClassController;
const updateClassController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const classId = getClassId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!classId) {
        res.status(400).json({
            success: false,
            message: 'Class ID is required',
        });
        return;
    }
    const validationResult = class_validation_1.updateClassSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const classRecord = await (0, class_service_1.updateClass)(classId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Class updated successfully',
            data: classRecord,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update class',
        });
    }
};
exports.updateClassController = updateClassController;
const deleteClassController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const classId = getClassId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!classId) {
        res.status(400).json({
            success: false,
            message: 'Class ID is required',
        });
        return;
    }
    try {
        const classRecord = await (0, class_service_1.deleteClass)(classId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Class deleted successfully',
            data: classRecord,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Class not found',
        });
    }
};
exports.deleteClassController = deleteClassController;
