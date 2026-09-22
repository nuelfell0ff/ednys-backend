"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParentController = exports.getParentByUserController = exports.getParentController = exports.getMyParentDashboardController = exports.getMyParentProfileController = exports.getParentsController = exports.createParentController = void 0;
const parent_service_1 = require("./parent.service");
const parent_validation_1 = require("./parent.validation");
const getSchoolId = (req) => {
    return req.user?.schoolId;
};
const getUserId = (req) => {
    return req.user?.userId;
};
const getParentId = (req) => {
    const parentId = req.params.id;
    if (typeof parentId !== 'string') {
        return undefined;
    }
    return parentId;
};
const createParentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = parent_validation_1.createParentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const parent = await (0, parent_service_1.createParent)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Parent profile created successfully',
            data: parent,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create parent profile',
        });
    }
};
exports.createParentController = createParentController;
const getParentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    try {
        const parents = await (0, parent_service_1.getParents)(schoolId);
        res.status(200).json({
            success: true,
            data: parents,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve parents',
        });
    }
};
exports.getParentsController = getParentsController;
const getMyParentProfileController = async (req, res) => {
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
        const parent = await (0, parent_service_1.getMyParentProfile)(schoolId, userId);
        res.status(200).json({
            success: true,
            data: parent,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your parent profile',
        });
    }
};
exports.getMyParentProfileController = getMyParentProfileController;
const getMyParentDashboardController = async (req, res) => {
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
        const dashboard = await (0, parent_service_1.getMyParentDashboard)(schoolId, userId);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve your parent dashboard',
        });
    }
};
exports.getMyParentDashboardController = getMyParentDashboardController;
const getParentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const parentId = getParentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!parentId) {
        res.status(400).json({
            success: false,
            message: 'Parent ID is required',
        });
        return;
    }
    try {
        const parent = await (0, parent_service_1.getParentById)(schoolId, parentId);
        res.status(200).json({
            success: true,
            data: parent,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve parent',
        });
    }
};
exports.getParentController = getParentController;
const getParentByUserController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const userId = req.params.userId;
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (typeof userId !== 'string') {
        res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
        return;
    }
    try {
        const parent = await (0, parent_service_1.getParentByUserId)(schoolId, userId);
        res.status(200).json({
            success: true,
            data: parent,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve parent',
        });
    }
};
exports.getParentByUserController = getParentByUserController;
const updateParentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const parentId = getParentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!parentId) {
        res.status(400).json({
            success: false,
            message: 'Parent ID is required',
        });
        return;
    }
    const validationResult = parent_validation_1.updateParentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const parent = await (0, parent_service_1.updateParent)(schoolId, parentId, validationResult.data);
        res.status(200).json({
            success: true,
            message: 'Parent profile updated successfully',
            data: parent,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update parent',
        });
    }
};
exports.updateParentController = updateParentController;
