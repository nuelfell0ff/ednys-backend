"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.updateClass = exports.getClassById = exports.getClasses = exports.createClass = void 0;
const mongoose_1 = require("mongoose");
const class_model_1 = require("./class.model");
const validateObjectId = (value, fieldName) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${fieldName}`);
    }
};
const createClass = async (schoolId, data) => {
    validateObjectId(schoolId, 'school ID');
    validateObjectId(data.academicSessionId, 'academic session ID');
    const name = data.name.trim();
    const existingClass = await class_model_1.Class.findOne({
        schoolId,
        academicSessionId: data.academicSessionId,
        name,
    });
    if (existingClass) {
        throw new Error('A class with this name already exists in this academic session');
    }
    const newClass = await class_model_1.Class.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        name,
        code: data.code?.trim().toUpperCase(),
        level: data.level?.trim(),
        capacity: data.capacity,
    });
    return newClass;
};
exports.createClass = createClass;
const getClasses = async (schoolId, academicSessionId) => {
    validateObjectId(schoolId, 'school ID');
    if (academicSessionId) {
        validateObjectId(academicSessionId, 'academic session ID');
    }
    const filter = {
        schoolId,
        isActive: true,
    };
    if (academicSessionId) {
        filter.academicSessionId =
            academicSessionId;
    }
    const classes = await class_model_1.Class.find(filter)
        .sort({
        name: 1,
    });
    return classes;
};
exports.getClasses = getClasses;
const getClassById = async (classId, schoolId) => {
    validateObjectId(classId, 'class ID');
    validateObjectId(schoolId, 'school ID');
    const classRecord = await class_model_1.Class.findOne({
        _id: classId,
        schoolId,
    });
    if (!classRecord) {
        throw new Error('Class not found');
    }
    return classRecord;
};
exports.getClassById = getClassById;
const updateClass = async (classId, schoolId, data) => {
    validateObjectId(classId, 'class ID');
    validateObjectId(schoolId, 'school ID');
    if (data.academicSessionId) {
        validateObjectId(data.academicSessionId, 'academic session ID');
    }
    const existingClass = await class_model_1.Class.findOne({
        _id: classId,
        schoolId,
    });
    if (!existingClass) {
        throw new Error('Class not found');
    }
    const academicSessionId = data.academicSessionId ??
        existingClass.academicSessionId.toString();
    const name = data.name !== undefined
        ? data.name.trim()
        : existingClass.name;
    const duplicateClass = await class_model_1.Class.findOne({
        schoolId,
        academicSessionId,
        name,
        _id: {
            $ne: classId,
        },
    });
    if (duplicateClass) {
        throw new Error('A class with this name already exists in this academic session');
    }
    const updateData = {
        ...(data.academicSessionId !== undefined && {
            academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        }),
        ...(data.name !== undefined && {
            name,
        }),
        ...(data.code !== undefined && {
            code: data.code.trim().toUpperCase(),
        }),
        ...(data.level !== undefined && {
            level: data.level.trim(),
        }),
        ...(data.capacity !== undefined && {
            capacity: data.capacity,
        }),
        ...(data.isActive !== undefined && {
            isActive: data.isActive,
        }),
    };
    const updatedClass = await class_model_1.Class.findOneAndUpdate({
        _id: classId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedClass) {
        throw new Error('Class not found');
    }
    return updatedClass;
};
exports.updateClass = updateClass;
const deleteClass = async (classId, schoolId) => {
    validateObjectId(classId, 'class ID');
    validateObjectId(schoolId, 'school ID');
    const classRecord = await class_model_1.Class.findOneAndUpdate({
        _id: classId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!classRecord) {
        throw new Error('Class not found');
    }
    return classRecord;
};
exports.deleteClass = deleteClass;
