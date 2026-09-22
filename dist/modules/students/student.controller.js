"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentController = exports.updateStudentController = exports.getStudentController = exports.getMyChildrenStudentsController = exports.getStudentsController = exports.createStudentController = void 0;
const student_service_1 = require("./student.service");
const student_validation_1 = require("./student.validation");
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
const getStudentId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' || !id.trim()) {
        return null;
    }
    return id;
};
const createStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = student_validation_1.createStudentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const student = await (0, student_service_1.createStudent)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create student',
        });
    }
};
exports.createStudentController = createStudentController;
const getStudentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const students = await (0, student_service_1.getStudents)(schoolId);
        res.status(200).json({
            success: true,
            data: students,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve students',
        });
    }
};
exports.getStudentsController = getStudentsController;
const getMyChildrenStudentsController = async (req, res) => {
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
        const students = await (0, student_service_1.getMyChildrenStudents)(userId, schoolId);
        res.status(200).json({
            success: true,
            data: students,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your children',
        });
    }
};
exports.getMyChildrenStudentsController = getMyChildrenStudentsController;
const getStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const studentId = getStudentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!studentId) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required',
        });
        return;
    }
    try {
        const student = await (0, student_service_1.getStudentById)(studentId, schoolId);
        res.status(200).json({
            success: true,
            data: student,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Student not found',
        });
    }
};
exports.getStudentController = getStudentController;
const updateStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const studentId = getStudentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!studentId) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required',
        });
        return;
    }
    const validationResult = student_validation_1.updateStudentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const student = await (0, student_service_1.updateStudent)(studentId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update student',
        });
    }
};
exports.updateStudentController = updateStudentController;
const deleteStudentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const studentId = getStudentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!studentId) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required',
        });
        return;
    }
    try {
        const student = await (0, student_service_1.deleteStudent)(studentId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: student,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Student not found',
        });
    }
};
exports.deleteStudentController = deleteStudentController;
