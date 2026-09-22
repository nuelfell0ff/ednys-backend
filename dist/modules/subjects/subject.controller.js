"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubjectController = exports.updateSubjectController = exports.getSubjectController = exports.getSubjectsController = exports.createSubjectController = void 0;
const subject_service_1 = require("./subject.service");
const subject_validation_1 = require("./subject.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getSubjectId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createSubjectController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = subject_validation_1.createSubjectSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const subject = await (0, subject_service_1.createSubject)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: subject,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create subject',
        });
    }
};
exports.createSubjectController = createSubjectController;
const getSubjectsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const subjects = await (0, subject_service_1.getSubjects)(schoolId);
        res.status(200).json({
            success: true,
            data: subjects,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve subjects',
        });
    }
};
exports.getSubjectsController = getSubjectsController;
const getSubjectController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!subjectId) {
        res.status(400).json({
            success: false,
            message: 'Subject ID is required',
        });
        return;
    }
    try {
        const subject = await (0, subject_service_1.getSubjectById)(subjectId, schoolId);
        res.status(200).json({
            success: true,
            data: subject,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Subject not found',
        });
    }
};
exports.getSubjectController = getSubjectController;
const updateSubjectController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!subjectId) {
        res.status(400).json({
            success: false,
            message: 'Subject ID is required',
        });
        return;
    }
    const validationResult = subject_validation_1.updateSubjectSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const subject = await (0, subject_service_1.updateSubject)(subjectId, schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: subject,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update subject',
        });
    }
};
exports.updateSubjectController = updateSubjectController;
const deleteSubjectController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!subjectId) {
        res.status(400).json({
            success: false,
            message: 'Subject ID is required',
        });
        return;
    }
    try {
        const subject = await (0, subject_service_1.deleteSubject)(subjectId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully',
            data: subject,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Subject not found',
        });
    }
};
exports.deleteSubjectController = deleteSubjectController;
