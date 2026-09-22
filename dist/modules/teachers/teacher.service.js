"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.getTeacherById = exports.getTeachers = exports.createTeacher = void 0;
const mongoose_1 = require("mongoose");
const teacher_model_1 = require("./teacher.model");
const user_model_1 = require("../users/user.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validateUserId = (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }
};
const normalizeOptionalString = (value) => {
    const normalized = value?.trim();
    return normalized || undefined;
};
const createTeacher = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateUserId(data.userId);
    const user = await user_model_1.User.findOne({
        _id: data.userId,
        schoolId,
        role: user_model_1.UserRole.TEACHER,
        isActive: true,
    });
    if (!user) {
        throw new Error('Teacher user not found or is not an active teacher');
    }
    const existingTeacher = await teacher_model_1.Teacher.findOne({
        schoolId,
        userId: data.userId,
    });
    if (existingTeacher) {
        throw new Error('A teacher profile already exists for this user');
    }
    const employeeNumber = normalizeOptionalString(data.employeeNumber)?.toUpperCase();
    if (employeeNumber) {
        const existingEmployee = await teacher_model_1.Teacher.findOne({
            schoolId,
            employeeNumber,
        });
        if (existingEmployee) {
            throw new Error('A teacher with this employee number already exists');
        }
    }
    const teacher = await teacher_model_1.Teacher.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        userId: new mongoose_1.Types.ObjectId(data.userId),
        employeeNumber,
        qualification: normalizeOptionalString(data.qualification),
        phone: normalizeOptionalString(data.phone),
        address: normalizeOptionalString(data.address),
        dateOfEmployment: data.dateOfEmployment
            ? new Date(data.dateOfEmployment)
            : undefined,
    });
    return teacher;
};
exports.createTeacher = createTeacher;
const getTeachers = async (schoolId) => {
    validateSchoolId(schoolId);
    const teachers = await teacher_model_1.Teacher.find({
        schoolId,
        isActive: true,
    })
        .populate({
        path: 'userId',
        select: 'name email role isActive',
    })
        .sort({
        createdAt: -1,
    });
    return teachers;
};
exports.getTeachers = getTeachers;
const getTeacherById = async (teacherId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
    }
    validateSchoolId(schoolId);
    const teacher = await teacher_model_1.Teacher.findOne({
        _id: teacherId,
        schoolId,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    return teacher;
};
exports.getTeacherById = getTeacherById;
const updateTeacher = async (teacherId, schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
    }
    validateSchoolId(schoolId);
    const existingTeacher = await teacher_model_1.Teacher.findOne({
        _id: teacherId,
        schoolId,
    });
    if (!existingTeacher) {
        throw new Error('Teacher not found');
    }
    const employeeNumber = data.employeeNumber !== undefined
        ? normalizeOptionalString(data.employeeNumber)?.toUpperCase()
        : undefined;
    if (data.employeeNumber !== undefined &&
        employeeNumber) {
        const duplicateTeacher = await teacher_model_1.Teacher.findOne({
            schoolId,
            employeeNumber,
            _id: {
                $ne: teacherId,
            },
        });
        if (duplicateTeacher) {
            throw new Error('A teacher with this employee number already exists');
        }
    }
    const updateData = {
        ...(data.employeeNumber !== undefined && {
            employeeNumber,
        }),
        ...(data.qualification !== undefined && {
            qualification: normalizeOptionalString(data.qualification),
        }),
        ...(data.phone !== undefined && {
            phone: normalizeOptionalString(data.phone),
        }),
        ...(data.address !== undefined && {
            address: normalizeOptionalString(data.address),
        }),
        ...(data.dateOfEmployment !== undefined && {
            dateOfEmployment: new Date(data.dateOfEmployment),
        }),
        ...(data.isActive !== undefined && {
            isActive: data.isActive,
        }),
    };
    const teacher = await teacher_model_1.Teacher.findOneAndUpdate({
        _id: teacherId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    return teacher;
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (teacherId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
    }
    validateSchoolId(schoolId);
    const teacher = await teacher_model_1.Teacher.findOneAndUpdate({
        _id: teacherId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    return teacher;
};
exports.deleteTeacher = deleteTeacher;
