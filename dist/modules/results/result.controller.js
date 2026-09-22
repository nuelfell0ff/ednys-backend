"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResultController = exports.updateResultController = exports.publishResultController = exports.getResultController = exports.getChildResultsForParentController = exports.getMyChildrenResultsController = exports.getMyResultsController = exports.getResultsController = exports.createBulkResultController = exports.createResultController = void 0;
const result_service_1 = require("./result.service");
const result_validation_1 = require("./result.validation");
const result_model_1 = require("./result.model");
const getSchoolId = (req) => {
    return req.user?.schoolId;
};
const getUserId = (req) => {
    return req.user?.userId;
};
const getResultId = (req) => {
    const resultId = req.params.id;
    if (typeof resultId !== 'string') {
        return undefined;
    }
    return resultId;
};
const getStudentId = (req) => {
    const studentId = req.params.studentId;
    if (typeof studentId !== 'string') {
        return undefined;
    }
    return studentId;
};
const getAcademicSessionId = (req) => {
    const academicSessionId = req.query.academicSessionId;
    if (typeof academicSessionId !==
        'string') {
        return undefined;
    }
    return academicSessionId;
};
const getTerm = (req) => {
    const term = req.query.term;
    if (typeof term !== 'string') {
        return undefined;
    }
    if (!Object.values(result_model_1.ResultTerm).includes(term)) {
        return undefined;
    }
    return term;
};
const isValidObjectId = (value) => {
    return /^[a-fA-F0-9]{24}$/.test(value);
};
const createResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = result_validation_1.createResultSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const result = await (0, result_service_1.createResult)(userId, schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Result created successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create result',
        });
    }
};
exports.createResultController = createResultController;
const createBulkResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = result_validation_1.bulkCreateResultSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const result = await (0, result_service_1.createBulkResults)(userId, schoolId, validationResult.data);
        const hasFailures = result.failedRecords > 0;
        res.status(hasFailures ? 207 : 201).json({
            success: result.failedRecords === 0,
            message: hasFailures
                ? 'Bulk result processing completed with some errors'
                : 'Bulk results processed successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to process bulk results',
        });
    }
};
exports.createBulkResultController = createBulkResultController;
const getResultsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const results = await (0, result_service_1.getResults)(schoolId);
        res.status(200).json({
            success: true,
            data: results,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve results',
        });
    }
};
exports.getResultsController = getResultsController;
const getMyResultsController = async (req, res) => {
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
        const results = await (0, result_service_1.getMyResults)(userId, schoolId);
        res.status(200).json({
            success: true,
            data: results,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your results',
        });
    }
};
exports.getMyResultsController = getMyResultsController;
const getMyChildrenResultsController = async (req, res) => {
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
        const results = await (0, result_service_1.getMyChildrenResults)(userId, schoolId);
        res.status(200).json({
            success: true,
            data: results,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your children\'s results',
        });
    }
};
exports.getMyChildrenResultsController = getMyChildrenResultsController;
const getChildResultsForParentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const studentId = getStudentId(req);
    const academicSessionId = getAcademicSessionId(req);
    const term = getTerm(req);
    if (!schoolId || !userId) {
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
    if (academicSessionId &&
        !isValidObjectId(academicSessionId)) {
        res.status(400).json({
            success: false,
            message: 'Invalid academic session ID',
        });
        return;
    }
    if (req.query.term !== undefined &&
        !term) {
        res.status(400).json({
            success: false,
            message: 'Invalid term',
        });
        return;
    }
    try {
        const results = await (0, result_service_1.getChildResultsForParent)(schoolId, userId, studentId, academicSessionId, term);
        res.status(200).json({
            success: true,
            data: results,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve child results',
        });
    }
};
exports.getChildResultsForParentController = getChildResultsForParentController;
const getResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const resultId = getResultId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!resultId) {
        res.status(400).json({
            success: false,
            message: 'Result ID is required',
        });
        return;
    }
    try {
        const result = await (0, result_service_1.getResultById)(schoolId, resultId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve result',
        });
    }
};
exports.getResultController = getResultController;
const publishResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const resultId = getResultId(req);
    if (!resultId) {
        res.status(400).json({
            success: false,
            message: 'Result ID is required',
        });
        return;
    }
    try {
        const result = await (0, result_service_1.publishResult)(schoolId, resultId);
        res.status(200).json({
            success: true,
            message: 'Result published successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to publish result',
        });
    }
};
exports.publishResultController = publishResultController;
const updateResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const resultId = getResultId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!resultId) {
        res.status(400).json({
            success: false,
            message: 'Result ID is required',
        });
        return;
    }
    const validationResult = result_validation_1.updateResultSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const result = await (0, result_service_1.updateResult)(userId, schoolId, resultId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Result updated successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update result',
        });
    }
};
exports.updateResultController = updateResultController;
const deleteResultController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const resultId = getResultId(req);
    if (!schoolId || !userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!resultId) {
        res.status(400).json({
            success: false,
            message: 'Result ID is required',
        });
        return;
    }
    try {
        const result = await (0, result_service_1.deleteResult)(userId, schoolId, resultId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to delete result',
        });
    }
};
exports.deleteResultController = deleteResultController;
