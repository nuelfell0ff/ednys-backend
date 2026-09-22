"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceController = exports.getAttendanceController = exports.getStudentAttendanceController = exports.getAttendanceByClassController = exports.createBulkAttendanceController = exports.createAttendanceController = void 0;
const attendance_service_1 = require("./attendance.service");
const attendance_validation_1 = require("./attendance.validation");
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
const getAttendanceId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createAttendanceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = attendance_validation_1.createAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.createAttendance)(userId, schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Attendance recorded successfully',
            data: attendance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to record attendance',
        });
    }
};
exports.createAttendanceController = createAttendanceController;
const createBulkAttendanceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = attendance_validation_1.bulkAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.createBulkAttendance)(userId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Bulk attendance saved successfully',
            data: attendance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to save bulk attendance',
        });
    }
};
exports.createBulkAttendanceController = createBulkAttendanceController;
const getAttendanceByClassController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const { classId, academicSessionId, date, } = req.query;
    if (typeof classId !== 'string' ||
        !classId.trim()) {
        res.status(400).json({
            success: false,
            message: 'classId query parameter is required',
        });
        return;
    }
    if (typeof academicSessionId !== 'string' ||
        !academicSessionId.trim()) {
        res.status(400).json({
            success: false,
            message: 'academicSessionId query parameter is required',
        });
        return;
    }
    if (typeof date !== 'string' ||
        !date.trim()) {
        res.status(400).json({
            success: false,
            message: 'date query parameter is required',
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.getAttendanceByClass)(schoolId, classId, academicSessionId, date);
        res.status(200).json({
            success: true,
            data: attendance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve attendance',
        });
    }
};
exports.getAttendanceByClassController = getAttendanceByClassController;
const getStudentAttendanceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const { studentId } = req.params;
    if (typeof studentId !== 'string' ||
        !studentId.trim()) {
        res.status(400).json({
            success: false,
            message: 'Student ID is required',
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.getStudentAttendance)(studentId, schoolId);
        res.status(200).json({
            success: true,
            data: attendance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve student attendance',
        });
    }
};
exports.getStudentAttendanceController = getStudentAttendanceController;
const getAttendanceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const attendanceId = getAttendanceId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!attendanceId) {
        res.status(400).json({
            success: false,
            message: 'Attendance ID is required',
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.getAttendanceById)(attendanceId, schoolId);
        res.status(200).json({
            success: true,
            data: attendance,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Attendance record not found',
        });
    }
};
exports.getAttendanceController = getAttendanceController;
const updateAttendanceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const attendanceId = getAttendanceId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!attendanceId) {
        res.status(400).json({
            success: false,
            message: 'Attendance ID is required',
        });
        return;
    }
    const validationResult = attendance_validation_1.updateAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const attendance = await (0, attendance_service_1.updateAttendance)(attendanceId, userId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update attendance',
        });
    }
};
exports.updateAttendanceController = updateAttendanceController;
