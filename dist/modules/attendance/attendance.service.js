"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendance = exports.getAttendanceById = exports.getStudentAttendance = exports.getAttendanceByClass = exports.createBulkAttendance = exports.createAttendance = void 0;
const mongoose_1 = require("mongoose");
const attendance_model_1 = require("./attendance.model");
const student_model_1 = require("../students/student.model");
const teacher_model_1 = require("../teachers/teacher.model");
const teacher_assignment_model_1 = require("../teacher-assignments/teacher-assignment.model");
const class_model_1 = require("../classes/class.model");
const academic_session_model_1 = require("../academic-sessions/academic-session.model");
const validateObjectId = (value, message) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};
const validateSchoolId = (schoolId) => {
    validateObjectId(schoolId, 'Invalid school ID');
};
const normalizeDate = (date) => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Invalid attendance date');
    }
    const year = parsedDate.getUTCFullYear();
    const month = parsedDate.getUTCMonth();
    const day = parsedDate.getUTCDate();
    return new Date(Date.UTC(year, month, day));
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
const validateTeacherClassAccess = async (teacherId, schoolId, classId, academicSessionId) => {
    const assignment = await teacher_assignment_model_1.TeacherAssignment.findOne({
        schoolId,
        teacherId,
        classId,
        academicSessionId,
        isActive: true,
    });
    if (!assignment) {
        throw new Error('You are not assigned to teach this class for this academic session');
    }
};
const validateStudentInClass = async (studentId, schoolId, classId, academicSessionId) => {
    const student = await student_model_1.Student.findOne({
        _id: studentId,
        schoolId,
        classId,
        academicSessionId,
        isActive: true,
    });
    if (!student) {
        throw new Error('Student not found, inactive, or does not belong to this class and academic session');
    }
    return student;
};
const createAttendance = async (userId, schoolId, data) => {
    validateObjectId(data.studentId, 'Invalid student ID');
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    await validateTeacherClassAccess(teacher._id, schoolId, data.classId, data.academicSessionId);
    const classRecord = await class_model_1.Class.findOne({
        _id: data.classId,
        schoolId,
        academicSessionId: data.academicSessionId,
        isActive: true,
    });
    if (!classRecord) {
        throw new Error('Class not found, inactive, or does not belong to this academic session');
    }
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: data.academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
    await validateStudentInClass(data.studentId, schoolId, data.classId, data.academicSessionId);
    const attendanceDate = normalizeDate(data.date);
    const existingAttendance = await attendance_model_1.Attendance.findOne({
        schoolId,
        studentId: data.studentId,
        date: attendanceDate,
    });
    if (existingAttendance) {
        throw new Error('Attendance has already been recorded for this student on this date');
    }
    const attendance = await attendance_model_1.Attendance.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        studentId: new mongoose_1.Types.ObjectId(data.studentId),
        classId: new mongoose_1.Types.ObjectId(data.classId),
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        date: attendanceDate,
        status: data.status,
        remarks: data.remarks?.trim(),
        markedBy: new mongoose_1.Types.ObjectId(userId),
    });
    return attendance;
};
exports.createAttendance = createAttendance;
const createBulkAttendance = async (userId, schoolId, data) => {
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    if (data.records.length === 0) {
        throw new Error('At least one attendance record is required');
    }
    const studentIds = data.records.map((record) => record.studentId);
    const uniqueStudentIds = new Set(studentIds);
    if (uniqueStudentIds.size !==
        studentIds.length) {
        throw new Error('A student cannot appear more than once in the same attendance submission');
    }
    for (const studentId of studentIds) {
        validateObjectId(studentId, 'Invalid student ID');
    }
    const teacher = await getTeacherProfile(userId, schoolId);
    await validateTeacherClassAccess(teacher._id, schoolId, data.classId, data.academicSessionId);
    const classRecord = await class_model_1.Class.findOne({
        _id: data.classId,
        schoolId,
        academicSessionId: data.academicSessionId,
        isActive: true,
    });
    if (!classRecord) {
        throw new Error('Class not found, inactive, or does not belong to this academic session');
    }
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: data.academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
    const students = await student_model_1.Student.find({
        _id: {
            $in: studentIds,
        },
        schoolId,
        classId: data.classId,
        academicSessionId: data.academicSessionId,
        isActive: true,
    });
    if (students.length !==
        studentIds.length) {
        throw new Error('One or more students were not found, are inactive, or do not belong to this class and academic session');
    }
    const attendanceDate = normalizeDate(data.date);
    const existingAttendance = await attendance_model_1.Attendance.find({
        schoolId,
        classId: data.classId,
        academicSessionId: data.academicSessionId,
        date: attendanceDate,
        studentId: {
            $in: studentIds,
        },
    });
    const existingAttendanceMap = new Map(existingAttendance.map((record) => [
        record.studentId.toString(),
        record,
    ]));
    const operations = data.records.map((record) => {
        const existing = existingAttendanceMap.get(record.studentId);
        if (existing) {
            return {
                updateOne: {
                    filter: {
                        _id: existing._id,
                        schoolId,
                    },
                    update: {
                        $set: {
                            status: record.status,
                            remarks: record.remarks?.trim(),
                            markedBy: new mongoose_1.Types.ObjectId(userId),
                        },
                    },
                },
            };
        }
        return {
            insertOne: {
                document: {
                    schoolId: new mongoose_1.Types.ObjectId(schoolId),
                    studentId: new mongoose_1.Types.ObjectId(record.studentId),
                    classId: new mongoose_1.Types.ObjectId(data.classId),
                    academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
                    date: attendanceDate,
                    status: record.status,
                    remarks: record.remarks?.trim(),
                    markedBy: new mongoose_1.Types.ObjectId(userId),
                },
            },
        };
    });
    await attendance_model_1.Attendance.bulkWrite(operations);
    const updatedAttendance = await attendance_model_1.Attendance.find({
        schoolId,
        classId: data.classId,
        academicSessionId: data.academicSessionId,
        date: attendanceDate,
        studentId: {
            $in: studentIds,
        },
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
    })
        .populate({
        path: 'markedBy',
        select: 'name email role',
    })
        .sort({
        createdAt: 1,
    });
    return updatedAttendance;
};
exports.createBulkAttendance = createBulkAttendance;
const getAttendanceByClass = async (schoolId, classId, academicSessionId, date) => {
    validateSchoolId(schoolId);
    validateObjectId(classId, 'Invalid class ID');
    validateObjectId(academicSessionId, 'Invalid academic session ID');
    const attendanceDate = normalizeDate(date);
    const students = await student_model_1.Student.find({
        schoolId,
        classId,
        academicSessionId,
        isActive: true,
    })
        .select('firstName middleName lastName admissionNumber gender classId academicSessionId')
        .sort({
        lastName: 1,
        firstName: 1,
    });
    const attendanceRecords = await attendance_model_1.Attendance.find({
        schoolId,
        classId,
        academicSessionId,
        date: attendanceDate,
    })
        .populate({
        path: 'markedBy',
        select: 'name email role',
    })
        .sort({
        createdAt: 1,
    });
    const attendanceMap = new Map(attendanceRecords.map((record) => [
        record.studentId.toString(),
        record,
    ]));
    return students.map((student) => {
        const record = attendanceMap.get(student._id.toString());
        return {
            student,
            attendanceId: record?._id ?? null,
            date: attendanceDate,
            status: record?.status ?? 'UNMARKED',
            remarks: record?.remarks ?? null,
            markedBy: record?.markedBy ?? null,
            createdAt: record?.createdAt ?? null,
            updatedAt: record?.updatedAt ?? null,
        };
    });
};
exports.getAttendanceByClass = getAttendanceByClass;
const getStudentAttendance = async (studentId, schoolId) => {
    validateObjectId(studentId, 'Invalid student ID');
    validateSchoolId(schoolId);
    const attendance = await attendance_model_1.Attendance.find({
        studentId,
        schoolId,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity academicSessionId isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'markedBy',
        select: 'name email role',
    })
        .sort({
        date: -1,
    });
    return attendance;
};
exports.getStudentAttendance = getStudentAttendance;
const getAttendanceById = async (attendanceId, schoolId) => {
    validateObjectId(attendanceId, 'Invalid attendance ID');
    validateSchoolId(schoolId);
    const attendance = await attendance_model_1.Attendance.findOne({
        _id: attendanceId,
        schoolId,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity academicSessionId isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'markedBy',
        select: 'name email role',
    });
    if (!attendance) {
        throw new Error('Attendance record not found');
    }
    return attendance;
};
exports.getAttendanceById = getAttendanceById;
const updateAttendance = async (attendanceId, userId, schoolId, data) => {
    validateObjectId(attendanceId, 'Invalid attendance ID');
    validateSchoolId(schoolId);
    const teacher = await getTeacherProfile(userId, schoolId);
    const attendance = await attendance_model_1.Attendance.findOne({
        _id: attendanceId,
        schoolId,
    });
    if (!attendance) {
        throw new Error('Attendance record not found');
    }
    await validateTeacherClassAccess(teacher._id, schoolId, attendance.classId.toString(), attendance.academicSessionId.toString());
    const updateData = {};
    if (data.status !== undefined) {
        updateData.status = data.status;
    }
    if (data.remarks !== undefined) {
        updateData.remarks =
            data.remarks.trim();
    }
    const updatedAttendance = await attendance_model_1.Attendance.findOneAndUpdate({
        _id: attendanceId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedAttendance) {
        throw new Error('Attendance record not found');
    }
    return updatedAttendance;
};
exports.updateAttendance = updateAttendance;
