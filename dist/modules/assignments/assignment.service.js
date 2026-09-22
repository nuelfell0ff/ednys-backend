"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentById = exports.getTeacherAssignmentsForUser = exports.getAssignments = exports.createAssignment = void 0;
const mongoose_1 = require("mongoose");
const assignment_model_1 = require("./assignment.model");
const teacher_model_1 = require("../teachers/teacher.model");
const teacher_assignment_model_1 = require("../teacher-assignments/teacher-assignment.model");
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
const getTeacherProfile = async (userId, schoolId) => {
    validateObjectId(userId, 'Invalid user ID');
    validateSchoolId(schoolId);
    const teacher = await teacher_model_1.Teacher.findOne({
        userId,
        schoolId,
        isActive: true,
    });
    if (!teacher) {
        throw new Error('Active teacher profile not found');
    }
    return teacher;
};
const createAssignment = async (userId, schoolId, data) => {
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.subjectId, 'Invalid subject ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    const teacherAssignment = await teacher_assignment_model_1.TeacherAssignment.findOne({
        schoolId,
        teacherId: teacher._id,
        classId: data.classId,
        subjectId: data.subjectId,
        academicSessionId: data.academicSessionId,
        isActive: true,
    });
    if (!teacherAssignment) {
        throw new Error('You are not assigned to teach this subject for this class and academic session');
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
    const assignment = await assignment_model_1.Assignment.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        teacherId: teacher._id,
        classId: new mongoose_1.Types.ObjectId(data.classId),
        subjectId: new mongoose_1.Types.ObjectId(data.subjectId),
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        title: data.title.trim(),
        instructions: data.instructions?.trim(),
        dueDate: new Date(data.dueDate),
        isPublished: data.isPublished ?? false,
    });
    return assignment;
};
exports.createAssignment = createAssignment;
const getAssignments = async (schoolId) => {
    validateSchoolId(schoolId);
    const assignments = await assignment_model_1.Assignment.find({
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
        dueDate: 1,
        createdAt: -1,
    });
    return assignments;
};
exports.getAssignments = getAssignments;
const getTeacherAssignmentsForUser = async (userId, schoolId) => {
    const teacher = await getTeacherProfile(userId, schoolId);
    const assignments = await assignment_model_1.Assignment.find({
        schoolId,
        teacherId: teacher._id,
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
        dueDate: 1,
        createdAt: -1,
    });
    return assignments;
};
exports.getTeacherAssignmentsForUser = getTeacherAssignmentsForUser;
const getAssignmentById = async (assignmentId, schoolId) => {
    validateObjectId(assignmentId, 'Invalid assignment ID');
    validateSchoolId(schoolId);
    const assignment = await assignment_model_1.Assignment.findOne({
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
        throw new Error('Assignment not found');
    }
    return assignment;
};
exports.getAssignmentById = getAssignmentById;
const updateAssignment = async (assignmentId, userId, schoolId, data) => {
    validateObjectId(assignmentId, 'Invalid assignment ID');
    validateSchoolId(schoolId);
    const teacher = await getTeacherProfile(userId, schoolId);
    const assignment = await assignment_model_1.Assignment.findOne({
        _id: assignmentId,
        schoolId,
        teacherId: teacher._id,
    });
    if (!assignment) {
        throw new Error('Assignment not found or you do not have permission to update it');
    }
    const updateData = {};
    if (data.title !== undefined) {
        updateData.title =
            data.title.trim();
    }
    if (data.instructions !== undefined) {
        updateData.instructions =
            data.instructions.trim();
    }
    if (data.dueDate !== undefined) {
        updateData.dueDate =
            new Date(data.dueDate);
    }
    if (data.isPublished !== undefined) {
        updateData.isPublished =
            data.isPublished;
    }
    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive;
    }
    const updatedAssignment = await assignment_model_1.Assignment.findOneAndUpdate({
        _id: assignmentId,
        schoolId,
        teacherId: teacher._id,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedAssignment) {
        throw new Error('Assignment not found or you do not have permission to update it');
    }
    return updatedAssignment;
};
exports.updateAssignment = updateAssignment;
const deleteAssignment = async (assignmentId, userId, schoolId) => {
    validateObjectId(assignmentId, 'Invalid assignment ID');
    validateSchoolId(schoolId);
    const teacher = await getTeacherProfile(userId, schoolId);
    const assignment = await assignment_model_1.Assignment.findOneAndUpdate({
        _id: assignmentId,
        schoolId,
        teacherId: teacher._id,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!assignment) {
        throw new Error('Assignment not found or you do not have permission to delete it');
    }
    return assignment;
};
exports.deleteAssignment = deleteAssignment;
