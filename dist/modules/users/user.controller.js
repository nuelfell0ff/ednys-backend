"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserController = exports.createUserController = void 0;
const user_service_1 = require("./user.service");
const user_validation_1 = require("./user.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getUserId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createUserController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = user_validation_1.createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const user = await (0, user_service_1.createUser)(schoolId, {
            ...validationResult.data,
            role: validationResult.data.role,
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create user',
        });
    }
};
exports.createUserController = createUserController;
const getUserController = async (req, res) => {
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
        res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
        return;
    }
    try {
        const user = await (0, user_service_1.getUserById)(userId, schoolId);
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'User not found',
        });
    }
};
exports.getUserController = getUserController;
