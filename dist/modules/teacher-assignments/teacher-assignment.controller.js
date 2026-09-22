"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherAssignmentController = exports.updateTeacherAssignmentController = exports.getTeacherAssignmentController = exports.getTeacherAssignmentsController = exports.createTeacherAssignmentController = void 0;
const teacher_assignment_service_1 = require("./teacher-assignment.service");
const teacher_assignment_validation_1 = require("./teacher-assignment.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getAssignmentId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createTeacherAssignmentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = teacher_assignment_validation_1.createTeacherAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const assignment = await (0, teacher_assignment_service_1.createTeacherAssignment)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Teacher assignment created successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create teacher assignment',
        });
    }
};
exports.createTeacherAssignmentController = createTeacherAssignmentController;
const getTeacherAssignmentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const assignments = await (0, teacher_assignment_service_1.getTeacherAssignments)(schoolId);
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
                : 'Failed to retrieve teacher assignments',
        });
    }
};
exports.getTeacherAssignmentsController = getTeacherAssignmentsController;
const getTeacherAssignmentController = async (req, res) => {
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
            message: 'Teacher assignment ID is required',
        });
        return;
    }
    try {
        const assignment = await (0, teacher_assignment_service_1.getTeacherAssignmentById)(assignmentId, schoolId);
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
                : 'Teacher assignment not found',
        });
    }
};
exports.getTeacherAssignmentController = getTeacherAssignmentController;
const updateTeacherAssignmentController = async (req, res) => {
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
            message: 'Teacher assignment ID is required',
        });
        return;
    }
    const validationResult = teacher_assignment_validation_1.updateTeacherAssignmentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const assignment = await (0, teacher_assignment_service_1.updateTeacherAssignment)(assignmentId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Teacher assignment updated successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update teacher assignment',
        });
    }
};
exports.updateTeacherAssignmentController = updateTeacherAssignmentController;
const deleteTeacherAssignmentController = async (req, res) => {
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
            message: 'Teacher assignment ID is required',
        });
        return;
    }
    try {
        const assignment = await (0, teacher_assignment_service_1.deleteTeacherAssignment)(assignmentId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Teacher assignment deleted successfully',
            data: assignment,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Teacher assignment not found',
        });
    }
};
exports.deleteTeacherAssignmentController = deleteTeacherAssignmentController;
