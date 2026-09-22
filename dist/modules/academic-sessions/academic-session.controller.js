"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAcademicSessionController = exports.updateAcademicSessionController = exports.getAcademicSessionController = exports.getActiveAcademicSessionController = exports.getAcademicSessionsController = exports.createAcademicSessionController = void 0;
const academic_session_service_1 = require("./academic-session.service");
const academic_session_validation_1 = require("./academic-session.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getSessionId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createAcademicSessionController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = academic_session_validation_1.createAcademicSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const session = await (0, academic_session_service_1.createAcademicSession)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Academic session created successfully',
            data: session,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create academic session',
        });
    }
};
exports.createAcademicSessionController = createAcademicSessionController;
const getAcademicSessionsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const sessions = await (0, academic_session_service_1.getAcademicSessions)(schoolId);
        res.status(200).json({
            success: true,
            data: sessions,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve academic sessions',
        });
    }
};
exports.getAcademicSessionsController = getAcademicSessionsController;
const getActiveAcademicSessionController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const session = await (0, academic_session_service_1.getActiveAcademicSession)(schoolId);
        res.status(200).json({
            success: true,
            data: session,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve active academic session',
        });
    }
};
exports.getActiveAcademicSessionController = getActiveAcademicSessionController;
const getAcademicSessionController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!sessionId) {
        res.status(400).json({
            success: false,
            message: 'Academic session ID is required',
        });
        return;
    }
    try {
        const session = await (0, academic_session_service_1.getAcademicSessionById)(sessionId, schoolId);
        res.status(200).json({
            success: true,
            data: session,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Academic session not found',
        });
    }
};
exports.getAcademicSessionController = getAcademicSessionController;
const updateAcademicSessionController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!sessionId) {
        res.status(400).json({
            success: false,
            message: 'Academic session ID is required',
        });
        return;
    }
    const validationResult = academic_session_validation_1.updateAcademicSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const session = await (0, academic_session_service_1.updateAcademicSession)(sessionId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Academic session updated successfully',
            data: session,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update academic session',
        });
    }
};
exports.updateAcademicSessionController = updateAcademicSessionController;
const deleteAcademicSessionController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!sessionId) {
        res.status(400).json({
            success: false,
            message: 'Academic session ID is required',
        });
        return;
    }
    try {
        const session = await (0, academic_session_service_1.deleteAcademicSession)(sessionId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Academic session deleted successfully',
            data: session,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Academic session not found',
        });
    }
};
exports.deleteAcademicSessionController = deleteAcademicSessionController;
