"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getSubjects = exports.createSubject = void 0;
const mongoose_1 = require("mongoose");
const subject_model_1 = require("./subject.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const createSubject = async (schoolId, data) => {
    validateSchoolId(schoolId);
    const name = data.name.trim();
    const existingSubject = await subject_model_1.Subject.findOne({
        schoolId,
        name,
    });
    if (existingSubject) {
        throw new Error('A subject with this name already exists in this school');
    }
    const subject = await subject_model_1.Subject.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        name,
        code: data.code?.trim().toUpperCase(),
        description: data.description?.trim(),
    });
    return subject;
};
exports.createSubject = createSubject;
const getSubjects = async (schoolId) => {
    validateSchoolId(schoolId);
    const subjects = await subject_model_1.Subject.find({
        schoolId,
        isActive: true,
    }).sort({
        name: 1,
    });
    return subjects;
};
exports.getSubjects = getSubjects;
const getSubjectById = async (subjectId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(subjectId)) {
        throw new Error('Invalid subject ID');
    }
    validateSchoolId(schoolId);
    const subject = await subject_model_1.Subject.findOne({
        _id: subjectId,
        schoolId,
    });
    if (!subject) {
        throw new Error('Subject not found');
    }
    return subject;
};
exports.getSubjectById = getSubjectById;
const updateSubject = async (subjectId, schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(subjectId)) {
        throw new Error('Invalid subject ID');
    }
    validateSchoolId(schoolId);
    const existingSubject = await subject_model_1.Subject.findOne({
        _id: subjectId,
        schoolId,
    });
    if (!existingSubject) {
        throw new Error('Subject not found');
    }
    const name = data.name !== undefined
        ? data.name.trim()
        : existingSubject.name;
    if (data.name !== undefined) {
        const duplicateSubject = await subject_model_1.Subject.findOne({
            schoolId,
            name,
            _id: {
                $ne: subjectId,
            },
        });
        if (duplicateSubject) {
            throw new Error('A subject with this name already exists in this school');
        }
    }
    const updateData = {
        ...(data.name !== undefined && {
            name,
        }),
        ...(data.code !== undefined && {
            code: data.code.trim().toUpperCase(),
        }),
        ...(data.description !== undefined && {
            description: data.description.trim(),
        }),
        ...(data.isActive !== undefined && {
            isActive: data.isActive,
        }),
    };
    const subject = await subject_model_1.Subject.findOneAndUpdate({
        _id: subjectId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!subject) {
        throw new Error('Subject not found');
    }
    return subject;
};
exports.updateSubject = updateSubject;
const deleteSubject = async (subjectId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(subjectId)) {
        throw new Error('Invalid subject ID');
    }
    validateSchoolId(schoolId);
    const subject = await subject_model_1.Subject.findOneAndUpdate({
        _id: subjectId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!subject) {
        throw new Error('Subject not found');
    }
    return subject;
};
exports.deleteSubject = deleteSubject;
