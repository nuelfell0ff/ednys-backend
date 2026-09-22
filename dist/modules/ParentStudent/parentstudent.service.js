"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParentStudent = exports.updateParentStudent = exports.getStudentsForAuthenticatedParent = exports.getParentStudentById = exports.getParentStudents = exports.createParentStudent = void 0;
const mongoose_1 = require("mongoose");
const parentstudent_model_1 = require("./parentstudent.model");
const parent_model_1 = require("../parents/parent.model");
const student_model_1 = require("../students/student.model");
const validateObjectId = (value, message) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};
const validateSchoolId = (schoolId) => {
    validateObjectId(schoolId, 'Invalid school ID');
};
const validateRelationship = (relationship) => {
    if (!Object.values(parentstudent_model_1.ParentStudentRelationship).includes(relationship)) {
        throw new Error('Invalid parent-student relationship');
    }
    return relationship;
};
const createParentStudent = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(data.parentId, 'Invalid parent ID');
    validateObjectId(data.studentId, 'Invalid student ID');
    const parent = await parent_model_1.Parent.findOne({
        _id: data.parentId,
        schoolId,
        isActive: true,
    });
    if (!parent) {
        throw new Error('Active parent profile not found in this school');
    }
    const student = await student_model_1.Student.findOne({
        _id: data.studentId,
        schoolId,
        isActive: true,
    });
    if (!student) {
        throw new Error('Active student not found in this school');
    }
    const existingRelationship = await parentstudent_model_1.ParentStudent.findOne({
        schoolId,
        parentId: parent._id,
        studentId: student._id,
    });
    if (existingRelationship) {
        throw new Error('This parent is already linked to this student');
    }
    const relationship = validateRelationship(data.relationship);
    const parentStudent = await parentstudent_model_1.ParentStudent.create({
        parentId: parent._id,
        studentId: student._id,
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        relationship,
        isActive: true,
    });
    return parentStudent;
};
exports.createParentStudent = createParentStudent;
const getParentStudents = async (schoolId) => {
    validateSchoolId(schoolId);
    const relationships = await parentstudent_model_1.ParentStudent.find({
        schoolId,
        isActive: true,
    })
        .populate({
        path: 'parentId',
        populate: {
            path: 'userId',
            select: 'name email role isActive',
        },
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName classId academicSessionId isActive',
    })
        .sort({
        createdAt: -1,
    });
    return relationships;
};
exports.getParentStudents = getParentStudents;
const getParentStudentById = async (schoolId, relationshipId) => {
    validateSchoolId(schoolId);
    validateObjectId(relationshipId, 'Invalid relationship ID');
    const relationship = await parentstudent_model_1.ParentStudent.findOne({
        _id: relationshipId,
        schoolId,
    })
        .populate({
        path: 'parentId',
        populate: {
            path: 'userId',
            select: 'name email role isActive',
        },
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName classId academicSessionId isActive',
    });
    if (!relationship) {
        throw new Error('Parent-student relationship not found');
    }
    return relationship;
};
exports.getParentStudentById = getParentStudentById;
const getStudentsForAuthenticatedParent = async (schoolId, userId) => {
    validateSchoolId(schoolId);
    validateObjectId(userId, 'Invalid user ID');
    const parent = await parent_model_1.Parent.findOne({
        userId,
        schoolId,
        isActive: true,
    });
    if (!parent) {
        throw new Error('Active parent profile not found for this user');
    }
    const relationships = await parentstudent_model_1.ParentStudent.find({
        schoolId,
        parentId: parent._id,
        isActive: true,
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName dateOfBirth gender classId academicSessionId isActive',
    })
        .sort({
        createdAt: -1,
    });
    return relationships;
};
exports.getStudentsForAuthenticatedParent = getStudentsForAuthenticatedParent;
const updateParentStudent = async (schoolId, relationshipId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(relationshipId, 'Invalid relationship ID');
    const relationship = await parentstudent_model_1.ParentStudent.findOne({
        _id: relationshipId,
        schoolId,
    });
    if (!relationship) {
        throw new Error('Parent-student relationship not found');
    }
    if (data.relationship !==
        undefined) {
        relationship.relationship =
            validateRelationship(data.relationship);
    }
    if (data.isActive !== undefined) {
        relationship.isActive =
            data.isActive;
    }
    await relationship.save();
    return relationship;
};
exports.updateParentStudent = updateParentStudent;
const deleteParentStudent = async (schoolId, relationshipId) => {
    validateSchoolId(schoolId);
    validateObjectId(relationshipId, 'Invalid relationship ID');
    const relationship = await parentstudent_model_1.ParentStudent.findOneAndUpdate({
        _id: relationshipId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!relationship) {
        throw new Error('Parent-student relationship not found');
    }
    return relationship;
};
exports.deleteParentStudent = deleteParentStudent;
