"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignmentController = exports.updateAssignmentController = exports.getAssignmentController = exports.getMyAssignmentsController = exports.getAssignmentsController = exports.createAssignmentController = void 0;
const assignment_service_1 = require("./assignment.service");
const assignment_validation_1 = require("./assignment.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getUserId = (req) => {
    if (!req.user?.userId) {
        return null;
    }
    return req.user.userId;
};
const getAssignmentId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createAssignmentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = assignment_validation_1.createAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const assignment = await (0, assignment_service_1.createAssignment)(userId, schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create assignment',
        });
    }
};
exports.createAssignmentController = createAssignmentController;
const getAssignmentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const assignments = await (0, assignment_service_1.getAssignments)(schoolId);
        res.status(200).json({
            success: true,
            data: assignments,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve assignments',
        });
    }
};
exports.getAssignmentsController = getAssignmentsController;
const getMyAssignmentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const assignments = await (0, assignment_service_1.getTeacherAssignmentsForUser)(userId, schoolId);
        res.status(200).json({
            success: true,
            data: assignments,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your assignments',
        });
    }
};
exports.getMyAssignmentsController = getMyAssignmentsController;
const getAssignmentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const assignmentId = getAssignmentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!assignmentId) {
        res.status(400).json({
            success: false,
            message: 'Assignment ID is required',
        });
        return;
    }
    try {
        const assignment = await (0, assignment_service_1.getAssignmentById)(assignmentId, schoolId);
        res.status(200).json({
            success: true,
            data: assignment,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Assignment not found',
        });
    }
};
exports.getAssignmentController = getAssignmentController;
const updateAssignmentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const assignmentId = getAssignmentId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!assignmentId) {
        res.status(400).json({
            success: false,
            message: 'Assignment ID is required',
        });
        return;
    }
    const validationResult = assignment_validation_1.updateAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const assignment = await (0, assignment_service_1.updateAssignment)(assignmentId, userId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Assignment updated successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update assignment',
        });
    }
};
exports.updateAssignmentController = updateAssignmentController;
const deleteAssignmentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const assignmentId = getAssignmentId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!assignmentId) {
        res.status(400).json({
            success: false,
            message: 'Assignment ID is required',
        });
        return;
    }
    try {
        const assignment = await (0, assignment_service_1.deleteAssignment)(assignmentId, userId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Assignment not found',
        });
    }
};
exports.deleteAssignmentController = deleteAssignmentController;
