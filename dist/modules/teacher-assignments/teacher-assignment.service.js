"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherAssignment = exports.updateTeacherAssignment = exports.getTeacherAssignmentById = exports.getTeacherAssignments = exports.createTeacherAssignment = void 0;
const mongoose_1 = require("mongoose");
const teacher_assignment_model_1 = require("./teacher-assignment.model");
const teacher_model_1 = require("../teachers/teacher.model");
const class_model_1 = require("../classes/class.model");
const subject_model_1 = require("../subjects/subject.model");
const academic_session_model_1 = require("../academic-sessions/academic-session.model");
const validateObjectId = (value, message) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};
const validateSchoolId = (schoolId) => {
    validateObjectId(schoolId, 'Invalid school ID');
};
const createTeacherAssignment = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(data.teacherId, 'Invalid teacher ID');
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.subjectId, 'Invalid subject ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    const teacher = await teacher_model_1.Teacher.findOne({
        _id: data.teacherId,
        schoolId,
        isActive: true,
    });
    if (!teacher) {
        throw new Error('Teacher not found or is inactive');
    }
    const classRecord = await class_model_1.Class.findOne({
        _id: data.classId,
        schoolId,
        academicSessionId: data.academicSessionId,
        isActive: true,
    });
    if (!classRecord) {
        throw new Error('Class not found, inactive, or does not belong to this academic session');
    }
    const subject = await subject_model_1.Subject.findOne({
        _id: data.subjectId,
        schoolId,
        isActive: true,
    });
    if (!subject) {
        throw new Error('Subject not found or is inactive');
    }
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: data.academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
    const existingAssignment = await teacher_assignment_model_1.TeacherAssignment.findOne({
        schoolId,
        teacherId: data.teacherId,
        classId: data.classId,
        subjectId: data.subjectId,
        academicSessionId: data.academicSessionId,
    });
    if (existingAssignment) {
        throw new Error('This teacher assignment already exists');
    }
    const assignment = await teacher_assignment_model_1.TeacherAssignment.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        teacherId: new mongoose_1.Types.ObjectId(data.teacherId),
        classId: new mongoose_1.Types.ObjectId(data.classId),
        subjectId: new mongoose_1.Types.ObjectId(data.subjectId),
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
    });
    return assignment;
};
exports.createTeacherAssignment = createTeacherAssignment;
const getTeacherAssignments = async (schoolId) => {
    validateSchoolId(schoolId);
    const assignments = await teacher_assignment_model_1.TeacherAssignment.find({
        schoolId,
        isActive: true,
    })
        .populate({
        path: 'teacherId',
        populate: {
            path: 'userId',
            select: 'name email role isActive',
        },
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity academicSessionId isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name code description isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        createdAt: -1,
    });
    return assignments;
};
exports.getTeacherAssignments = getTeacherAssignments;
const getTeacherAssignmentById = async (assignmentId, schoolId) => {
    validateObjectId(assignmentId, 'Invalid teacher assignment ID');
    validateSchoolId(schoolId);
    const assignment = await teacher_assignment_model_1.TeacherAssignment.findOne({
        _id: assignmentId,
        schoolId,
    })
        .populate({
        path: 'teacherId',
        populate: {
            path: 'userId',
            select: 'name email role isActive',
        },
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity academicSessionId isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name code description isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    });
    if (!assignment) {
        throw new Error('Teacher assignment not found');
    }
    return assignment;
};
exports.getTeacherAssignmentById = getTeacherAssignmentById;
const updateTeacherAssignment = async (assignmentId, schoolId, data) => {
    validateObjectId(assignmentId, 'Invalid teacher assignment ID');
    validateSchoolId(schoolId);
    const assignment = await teacher_assignment_model_1.TeacherAssignment.findOneAndUpdate({
        _id: assignmentId,
        schoolId,
    }, {
        $set: {
            isActive: data.isActive,
        },
    }, {
        new: true,
        runValidators: true,
    });
    if (!assignment) {
        throw new Error('Teacher assignment not found');
    }
    return assignment;
};
exports.updateTeacherAssignment = updateTeacherAssignment;
const deleteTeacherAssignment = async (assignmentId, schoolId) => {
    validateObjectId(assignmentId, 'Invalid teacher assignment ID');
    validateSchoolId(schoolId);
    const assignment = await teacher_assignment_model_1.TeacherAssignment.findOneAndUpdate({
        _id: assignmentId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!assignment) {
        throw new Error('Teacher assignment not found');
    }
    return assignment;
};
exports.deleteTeacherAssignment = deleteTeacherAssignment;
