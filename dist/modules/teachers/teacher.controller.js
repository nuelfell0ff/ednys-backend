"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherController = exports.updateTeacherController = exports.getTeacherController = exports.getTeachersController = exports.createTeacherController = void 0;
const teacher_service_1 = require("./teacher.service");
const teacher_validation_1 = require("./teacher.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getTeacherId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createTeacherController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = teacher_validation_1.createTeacherSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const teacher = await (0, teacher_service_1.createTeacher)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Teacher created successfully',
            data: teacher,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create teacher',
        });
    }
};
exports.createTeacherController = createTeacherController;
const getTeachersController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const teachers = await (0, teacher_service_1.getTeachers)(schoolId);
        res.status(200).json({
            success: true,
            data: teachers,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve teachers',
        });
    }
};
exports.getTeachersController = getTeachersController;
const getTeacherController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!teacherId) {
        res.status(400).json({
            success: false,
            message: 'Teacher ID is required',
        });
        return;
    }
    try {
        const teacher = await (0, teacher_service_1.getTeacherById)(teacherId, schoolId);
        res.status(200).json({
            success: true,
            data: teacher,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve teacher';
        res.status(message === 'Teacher not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getTeacherController = getTeacherController;
const updateTeacherController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!teacherId) {
        res.status(400).json({
            success: false,
            message: 'Teacher ID is required',
        });
        return;
    }
    const validationResult = teacher_validation_1.updateTeacherSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const teacher = await (0, teacher_service_1.updateTeacher)(teacherId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: teacher,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to update teacher';
        res.status(message === 'Teacher not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.updateTeacherController = updateTeacherController;
const deleteTeacherController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!teacherId) {
        res.status(400).json({
            success: false,
            message: 'Teacher ID is required',
        });
        return;
    }
    try {
        const teacher = await (0, teacher_service_1.deleteTeacher)(teacherId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Teacher deactivated successfully',
            data: teacher,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to deactivate teacher';
        res.status(message === 'Teacher not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.deleteTeacherController = deleteTeacherController;
