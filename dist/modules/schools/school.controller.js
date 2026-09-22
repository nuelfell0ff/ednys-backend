"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchoolController = exports.getSchoolController = exports.createSchoolController = void 0;
const school_service_1 = require("./school.service");
const getSchoolId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' || !id.trim()) {
        return null;
    }
    return id;
};
const createSchoolController = async (req, res) => {
    try {
        const school = await (0, school_service_1.createSchool)(req.body);
        res.status(201).json({
            success: true,
            data: school,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create school',
        });
    }
};
exports.createSchoolController = createSchoolController;
const getSchoolController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(400).json({
            success: false,
            message: 'School ID is required',
        });
        return;
    }
    try {
        const school = await (0, school_service_1.getSchoolById)(schoolId);
        res.status(200).json({
            success: true,
            data: school,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'School not found',
        });
    }
};
exports.getSchoolController = getSchoolController;
const updateSchoolController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(400).json({
            success: false,
            message: 'School ID is required',
        });
        return;
    }
    try {
        const school = await (0, school_service_1.updateSchool)(schoolId, req.body);
        res.status(200).json({
            success: true,
            data: school,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to update school',
        });
    }
};
exports.updateSchoolController = updateSchoolController;
