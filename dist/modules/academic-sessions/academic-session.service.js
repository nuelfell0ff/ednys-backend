"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAcademicSession = exports.updateAcademicSession = exports.getAcademicSessionById = exports.getActiveAcademicSession = exports.getAcademicSessions = exports.createAcademicSession = void 0;
const mongoose_1 = require("mongoose");
const academic_session_model_1 = require("./academic-session.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validateSessionDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())) {
        throw new Error('Invalid academic session dates');
    }
    if (end <= start) {
        throw new Error('End date must be after start date');
    }
};
const createAcademicSession = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateSessionDates(data.startDate, data.endDate);
    const existingSession = await academic_session_model_1.AcademicSession.findOne({
        schoolId,
        name: data.name.trim(),
    });
    if (existingSession) {
        throw new Error('An academic session with this name already exists in this school');
    }
    if (data.isActive === true) {
        await academic_session_model_1.AcademicSession.updateMany({
            schoolId,
            isActive: true,
        }, {
            $set: {
                isActive: false,
            },
        });
    }
    const session = await academic_session_model_1.AcademicSession.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        name: data.name.trim(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? false,
    });
    return session;
};
exports.createAcademicSession = createAcademicSession;
const getAcademicSessions = async (schoolId) => {
    validateSchoolId(schoolId);
    const sessions = await academic_session_model_1.AcademicSession.find({
        schoolId,
    }).sort({
        startDate: -1,
    });
    return sessions;
};
exports.getAcademicSessions = getAcademicSessions;
const getActiveAcademicSession = async (schoolId) => {
    validateSchoolId(schoolId);
    const session = await academic_session_model_1.AcademicSession.findOne({
        schoolId,
        isActive: true,
    });
    return session;
};
exports.getActiveAcademicSession = getActiveAcademicSession;
const getAcademicSessionById = async (sessionId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(sessionId)) {
        throw new Error('Invalid academic session ID');
    }
    validateSchoolId(schoolId);
    const session = await academic_session_model_1.AcademicSession.findOne({
        _id: sessionId,
        schoolId,
    });
    if (!session) {
        throw new Error('Academic session not found');
    }
    return session;
};
exports.getAcademicSessionById = getAcademicSessionById;
const updateAcademicSession = async (sessionId, schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(sessionId)) {
        throw new Error('Invalid academic session ID');
    }
    validateSchoolId(schoolId);
    if (data.startDate !== undefined &&
        data.endDate !== undefined) {
        validateSessionDates(data.startDate, data.endDate);
    }
    const existingSession = await academic_session_model_1.AcademicSession.findOne({
        _id: sessionId,
        schoolId,
    });
    if (!existingSession) {
        throw new Error('Academic session not found');
    }
    if (data.name !== undefined) {
        const duplicateSession = await academic_session_model_1.AcademicSession.findOne({
            schoolId,
            name: data.name.trim(),
            _id: {
                $ne: sessionId,
            },
        });
        if (duplicateSession) {
            throw new Error('An academic session with this name already exists in this school');
        }
    }
    if (data.isActive === true) {
        await academic_session_model_1.AcademicSession.updateMany({
            schoolId,
            _id: {
                $ne: sessionId,
            },
            isActive: true,
        }, {
            $set: {
                isActive: false,
            },
        });
    }
    const updateData = {
        ...(data.name !== undefined && {
            name: data.name.trim(),
        }),
        ...(data.startDate !== undefined && {
            startDate: new Date(data.startDate),
        }),
        ...(data.endDate !== undefined && {
            endDate: new Date(data.endDate),
        }),
        ...(data.isActive !== undefined && {
            isActive: data.isActive,
        }),
    };
    if (data.startDate !== undefined &&
        data.endDate === undefined) {
        const startDate = new Date(data.startDate);
        if (Number.isNaN(startDate.getTime()) ||
            startDate >= existingSession.endDate) {
            throw new Error('Start date must be before the end date');
        }
    }
    if (data.endDate !== undefined &&
        data.startDate === undefined) {
        const endDate = new Date(data.endDate);
        if (Number.isNaN(endDate.getTime()) ||
            endDate <= existingSession.startDate) {
            throw new Error('End date must be after the start date');
        }
    }
    const session = await academic_session_model_1.AcademicSession.findOneAndUpdate({
        _id: sessionId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!session) {
        throw new Error('Academic session not found');
    }
    return session;
};
exports.updateAcademicSession = updateAcademicSession;
const deleteAcademicSession = async (sessionId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(sessionId)) {
        throw new Error('Invalid academic session ID');
    }
    validateSchoolId(schoolId);
    const session = await academic_session_model_1.AcademicSession.findOneAndDelete({
        _id: sessionId,
        schoolId,
    });
    if (!session) {
        throw new Error('Academic session not found');
    }
    return session;
};
exports.deleteAcademicSession = deleteAcademicSession;
