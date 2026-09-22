"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const registerController = async (req, res) => {
    try {
        const data = req.body;
        const result = await (0, auth_service_1.registerSchoolAdmin)(data);
        res.status(201).json({
            success: true,
            message: 'School registered successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Registration failed',
        });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const data = req.body;
        const result = await (0, auth_service_1.loginUser)(data);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Login failed',
        });
    }
};
exports.loginController = loginController;
const getMeController = (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        data: user,
    });
};
exports.getMeController = getMeController;
