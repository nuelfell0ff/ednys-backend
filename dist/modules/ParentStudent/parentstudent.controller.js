"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParentStudentController = exports.updateParentStudentController = exports.getMyStudentsController = exports.getParentStudentController = exports.getParentStudentsController = exports.createParentStudentController = void 0;
const parentstudent_service_1 = require("./parentstudent.service");
const parentstudent_validation_1 = require("./parentstudent.validation");
const getSchoolId = (req) => {
    return req.user?.schoolId;
};
const getUserId = (req) => {
    return req.user?.userId;
};
const getRelationshipId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return undefined;
    }
    return id;
};
const createParentStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = parentstudent_validation_1.createParentStudentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const relationship = await (0, parentstudent_service_1.createParentStudent)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Parent-student relationship created successfully',
            data: relationship,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create parent-student relationship',
        });
    }
};
exports.createParentStudentController = createParentStudentController;
const getParentStudentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const relationships = await (0, parentstudent_service_1.getParentStudents)(schoolId);
        res.status(200).json({
            success: true,
            data: relationships,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve parent-student relationships',
        });
    }
};
exports.getParentStudentsController = getParentStudentsController;
const getParentStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const relationshipId = getRelationshipId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!relationshipId) {
        res.status(400).json({
            success: false,
            message: 'Relationship ID is required',
        });
        return;
    }
    try {
        const relationship = await (0, parentstudent_service_1.getParentStudentById)(schoolId, relationshipId);
        res.status(200).json({
            success: true,
            data: relationship,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Parent-student relationship not found',
        });
    }
};
exports.getParentStudentController = getParentStudentController;
const getMyStudentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Authenticated user not found',
        });
        return;
    }
    try {
        const relationships = await (0, parentstudent_service_1.getStudentsForAuthenticatedParent)(schoolId, userId);
        res.status(200).json({
            success: true,
            data: relationships,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve students for parent',
        });
    }
};
exports.getMyStudentsController = getMyStudentsController;
const updateParentStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const relationshipId = getRelationshipId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!relationshipId) {
        res.status(400).json({
            success: false,
            message: 'Relationship ID is required',
        });
        return;
    }
    const validationResult = parentstudent_validation_1.updateParentStudentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const relationship = await (0, parentstudent_service_1.updateParentStudent)(schoolId, relationshipId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Parent-student relationship updated successfully',
            data: relationship,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update parent-student relationship',
        });
    }
};
exports.updateParentStudentController = updateParentStudentController;
const deleteParentStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const relationshipId = getRelationshipId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!relationshipId) {
        res.status(400).json({
            success: false,
            message: 'Relationship ID is required',
        });
        return;
    }
    try {
        const relationship = await (0, parentstudent_service_1.deleteParentStudent)(schoolId, relationshipId);
        res.status(200).json({
            success: true,
            message: 'Parent-student relationship deactivated successfully',
            data: relationship,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Parent-student relationship not found',
        });
    }
};
exports.deleteParentStudentController = deleteParentStudentController;
