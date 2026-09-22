"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResult = exports.updateResult = exports.publishResult = exports.getResultById = exports.getChildResultsForParent = exports.getMyChildrenResults = exports.getMyResults = exports.getResults = exports.createBulkResults = exports.createResult = void 0;
const mongoose_1 = require("mongoose");
const result_model_1 = require("./result.model");
const student_model_1 = require("../students/student.model");
const teacher_model_1 = require("../teachers/teacher.model");
const teacher_assignment_model_1 = require("../teacher-assignments/teacher-assignment.model");
const class_model_1 = require("../classes/class.model");
const subject_model_1 = require("../subjects/subject.model");
const academic_session_model_1 = require("../academic-sessions/academic-session.model");
const parent_model_1 = require("../parents/parent.model");
const parentstudent_model_1 = require("../ParentStudent/parentstudent.model");
const validateObjectId = (value, message) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};
const validateSchoolId = (schoolId) => {
    validateObjectId(schoolId, 'Invalid school ID');
};
const calculateTotal = (firstCA, secondCA, exam) => {
    return firstCA + secondCA + exam;
};
const calculateGrade = (total) => {
    if (total >= 75) {
        return 'A';
    }
    if (total >= 65) {
        return 'B';
    }
    if (total >= 55) {
        return 'C';
    }
    if (total >= 45) {
        return 'D';
    }
    if (total >= 40) {
        return 'E';
    }
    return 'F';
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
const validateTeacherAssignment = async (teacherId, schoolId, classId, subjectId, academicSessionId) => {
    const assignment = await teacher_assignment_model_1.TeacherAssignment.findOne({
        schoolId,
        teacherId,
        classId,
        subjectId,
        academicSessionId,
        isActive: true,
    });
    if (!assignment) {
        throw new Error('You are not assigned to teach this subject for this class and academic session');
    }
};
const validateAcademicContext = async (schoolId, classId, subjectId, academicSessionId) => {
    const classRecord = await class_model_1.Class.findOne({
        _id: classId,
        schoolId,
        academicSessionId,
        isActive: true,
    });
    if (!classRecord) {
        throw new Error('Class not found, inactive, or does not belong to this academic session');
    }
    const subject = await subject_model_1.Subject.findOne({
        _id: subjectId,
        schoolId,
        isActive: true,
    });
    if (!subject) {
        throw new Error('Subject not found or inactive');
    }
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
};
const validateStudent = async (schoolId, studentId, classId, academicSessionId) => {
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
const hasCompleteScores = (firstCA, secondCA, exam) => {
    return (firstCA !== undefined &&
        secondCA !== undefined &&
        exam !== undefined);
};
const createResult = async (userId, schoolId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(data.studentId, 'Invalid student ID');
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.subjectId, 'Invalid subject ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    await validateTeacherAssignment(teacher._id, schoolId, data.classId, data.subjectId, data.academicSessionId);
    await validateAcademicContext(schoolId, data.classId, data.subjectId, data.academicSessionId);
    await validateStudent(schoolId, data.studentId, data.classId, data.academicSessionId);
    const existingResult = await result_model_1.Result.findOne({
        schoolId,
        studentId: data.studentId,
        subjectId: data.subjectId,
        academicSessionId: data.academicSessionId,
        term: data.term,
    });
    if (existingResult) {
        throw new Error('A result already exists for this student, subject, academic session, and term');
    }
    const complete = hasCompleteScores(data.firstCA, data.secondCA, data.exam);
    const total = complete
        ? calculateTotal(data.firstCA, data.secondCA, data.exam)
        : undefined;
    const grade = total !== undefined
        ? calculateGrade(total)
        : undefined;
    const result = await result_model_1.Result.create({
        schoolId,
        studentId: data.studentId,
        teacherId: teacher._id,
        classId: data.classId,
        subjectId: data.subjectId,
        academicSessionId: data.academicSessionId,
        term: data.term,
        firstCA: data.firstCA,
        secondCA: data.secondCA,
        exam: data.exam,
        total,
        grade,
        remark: data.remark?.trim(),
        status: result_model_1.ResultStatus.DRAFT,
    });
    return result;
};
exports.createResult = createResult;
const createBulkResults = async (userId, schoolId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(data.classId, 'Invalid class ID');
    validateObjectId(data.subjectId, 'Invalid subject ID');
    validateObjectId(data.academicSessionId, 'Invalid academic session ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    await validateTeacherAssignment(teacher._id, schoolId, data.classId, data.subjectId, data.academicSessionId);
    await validateAcademicContext(schoolId, data.classId, data.subjectId, data.academicSessionId);
    const studentIds = data.records.map((record) => record.studentId);
    const duplicateStudentIds = studentIds.filter((studentId, index) => studentIds.indexOf(studentId) !==
        index);
    const uniqueDuplicateStudentIds = [
        ...new Set(duplicateStudentIds),
    ];
    const results = [];
    for (const record of data.records) {
        try {
            validateObjectId(record.studentId, 'Invalid student ID');
            if (uniqueDuplicateStudentIds.includes(record.studentId)) {
                throw new Error('Duplicate student ID in bulk request');
            }
            await validateStudent(schoolId, record.studentId, data.classId, data.academicSessionId);
            const existingResult = await result_model_1.Result.findOne({
                schoolId,
                studentId: record.studentId,
                subjectId: data.subjectId,
                academicSessionId: data.academicSessionId,
                term: data.term,
            });
            if (existingResult) {
                if (existingResult.status ===
                    result_model_1.ResultStatus.PUBLISHED) {
                    throw new Error('Published results cannot be modified by a teacher');
                }
                if (existingResult.teacherId.toString() !==
                    teacher._id.toString()) {
                    throw new Error('You do not have permission to modify this result');
                }
                if (record.firstCA !==
                    undefined) {
                    existingResult.firstCA =
                        record.firstCA;
                }
                if (record.secondCA !==
                    undefined) {
                    existingResult.secondCA =
                        record.secondCA;
                }
                if (record.exam !==
                    undefined) {
                    existingResult.exam =
                        record.exam;
                }
                if (hasCompleteScores(existingResult.firstCA, existingResult.secondCA, existingResult.exam)) {
                    const firstCA = existingResult.firstCA;
                    const secondCA = existingResult.secondCA;
                    const exam = existingResult.exam;
                    const total = calculateTotal(firstCA, secondCA, exam);
                    existingResult.total =
                        total;
                    existingResult.grade =
                        calculateGrade(total);
                }
                else {
                    existingResult.total =
                        undefined;
                    existingResult.grade =
                        undefined;
                }
                if (record.remark !==
                    undefined) {
                    existingResult.remark =
                        record.remark.trim();
                }
                await existingResult.save();
                results.push({
                    studentId: record.studentId,
                    success: true,
                    action: 'updated',
                    resultId: existingResult._id.toString(),
                    total: existingResult.total,
                    grade: existingResult.grade,
                });
                continue;
            }
            const complete = hasCompleteScores(record.firstCA, record.secondCA, record.exam);
            const total = complete
                ? calculateTotal(record.firstCA, record.secondCA, record.exam)
                : undefined;
            const grade = total !== undefined
                ? calculateGrade(total)
                : undefined;
            const result = await result_model_1.Result.create({
                schoolId,
                studentId: record.studentId,
                teacherId: teacher._id,
                classId: data.classId,
                subjectId: data.subjectId,
                academicSessionId: data.academicSessionId,
                term: data.term,
                firstCA: record.firstCA,
                secondCA: record.secondCA,
                exam: record.exam,
                total,
                grade,
                remark: record.remark?.trim(),
                status: result_model_1.ResultStatus.DRAFT,
            });
            results.push({
                studentId: record.studentId,
                success: true,
                action: 'created',
                resultId: result._id.toString(),
                total: result.total,
                grade: result.grade,
            });
        }
        catch (error) {
            results.push({
                studentId: record.studentId,
                success: false,
                message: error instanceof Error
                    ? error.message
                    : 'Failed to process result',
            });
        }
    }
    const successful = results.filter((result) => result.success);
    const failed = results.filter((result) => !result.success);
    return {
        totalRecords: data.records.length,
        successfulRecords: successful.length,
        failedRecords: failed.length,
        createdRecords: successful.filter((result) => result.action ===
            'created').length,
        updatedRecords: successful.filter((result) => result.action ===
            'updated').length,
        results,
    };
};
exports.createBulkResults = createBulkResults;
const getResults = async (schoolId) => {
    validateSchoolId(schoolId);
    const results = await result_model_1.Result.find({
        schoolId,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender',
    })
        .populate({
        path: 'teacherId',
        populate: {
            path: 'userId',
            select: 'name email',
        },
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        createdAt: -1,
    });
    return results;
};
exports.getResults = getResults;
const getMyResults = async (userId, schoolId) => {
    const teacher = await getTeacherProfile(userId, schoolId);
    const results = await result_model_1.Result.find({
        schoolId,
        teacherId: teacher._id,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender',
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        createdAt: -1,
    });
    return results;
};
exports.getMyResults = getMyResults;
/*
 * Parent result access
 *
 * The authenticated user's userId is used to
 * resolve the Parent profile. The parent can
 * only access results belonging to students
 * linked to that Parent profile.
 *
 * Only PUBLISHED results are returned.
 */
const getMyChildrenResults = async (userId, schoolId) => {
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
    }).select('studentId');
    const studentIds = relationships.map((relationship) => relationship.studentId);
    if (studentIds.length === 0) {
        return [];
    }
    const results = await result_model_1.Result.find({
        schoolId,
        studentId: {
            $in: studentIds,
        },
        status: result_model_1.ResultStatus.PUBLISHED,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender',
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        createdAt: -1,
    });
    return results;
};
exports.getMyChildrenResults = getMyChildrenResults;
/*
 * Parent result access for a specific child
 *
 * The authenticated user's userId is used to
 * resolve the Parent profile. The requested
 * student must be actively linked to that
 * Parent profile in the same school.
 *
 * Only PUBLISHED results are returned.
 */
const getChildResultsForParent = async (schoolId, userId, studentId, academicSessionId, term) => {
    validateSchoolId(schoolId);
    validateObjectId(userId, 'Invalid user ID');
    validateObjectId(studentId, 'Invalid student ID');
    if (academicSessionId) {
        validateObjectId(academicSessionId, 'Invalid academic session ID');
    }
    if (term &&
        !Object.values(result_model_1.ResultTerm).includes(term)) {
        throw new Error('Invalid term');
    }
    const parent = await parent_model_1.Parent.findOne({
        schoolId,
        userId,
        isActive: true,
    });
    if (!parent) {
        throw new Error('Active parent profile not found for this user');
    }
    const relationship = await parentstudent_model_1.ParentStudent.findOne({
        schoolId,
        parentId: parent._id,
        studentId,
        isActive: true,
    });
    if (!relationship) {
        throw new Error('You do not have access to this student');
    }
    const resultQuery = {
        schoolId,
        studentId,
        status: result_model_1.ResultStatus.PUBLISHED,
    };
    if (academicSessionId) {
        resultQuery.academicSessionId =
            academicSessionId;
    }
    if (term) {
        resultQuery.term = term;
    }
    const results = await result_model_1.Result.find(resultQuery)
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender',
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        createdAt: -1,
    });
    return results;
};
exports.getChildResultsForParent = getChildResultsForParent;
const getResultById = async (schoolId, resultId) => {
    validateSchoolId(schoolId);
    validateObjectId(resultId, 'Invalid result ID');
    const result = await result_model_1.Result.findOne({
        _id: resultId,
        schoolId,
    })
        .populate({
        path: 'studentId',
        select: 'firstName middleName lastName admissionNumber gender',
    })
        .populate({
        path: 'teacherId',
        populate: {
            path: 'userId',
            select: 'name email',
        },
    })
        .populate({
        path: 'classId',
        select: 'name code level capacity isActive',
    })
        .populate({
        path: 'subjectId',
        select: 'name isActive',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    });
    if (!result) {
        throw new Error('Result not found');
    }
    return result;
};
exports.getResultById = getResultById;
const publishResult = async (schoolId, resultId) => {
    validateObjectId(schoolId, 'Invalid school ID');
    validateObjectId(resultId, 'Invalid result ID');
    const result = await result_model_1.Result.findOne({
        _id: resultId,
        schoolId,
    });
    if (!result) {
        throw new Error('Result not found');
    }
    if (result.status ===
        result_model_1.ResultStatus.PUBLISHED) {
        throw new Error('Result is already published');
    }
    if (!hasCompleteScores(result.firstCA, result.secondCA, result.exam)) {
        throw new Error('Result cannot be published until First CA, Second CA, and Exam scores are entered');
    }
    const firstCA = result.firstCA;
    const secondCA = result.secondCA;
    const exam = result.exam;
    const total = calculateTotal(firstCA, secondCA, exam);
    const grade = calculateGrade(total);
    result.total = total;
    result.grade = grade;
    result.status =
        result_model_1.ResultStatus.PUBLISHED;
    await result.save();
    return result;
};
exports.publishResult = publishResult;
const updateResult = async (userId, schoolId, resultId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(resultId, 'Invalid result ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    const result = await result_model_1.Result.findOne({
        _id: resultId,
        schoolId,
        teacherId: teacher._id,
    });
    if (!result) {
        throw new Error('Result not found or you do not have permission to modify it');
    }
    if (result.status ===
        result_model_1.ResultStatus.PUBLISHED) {
        throw new Error('Published results cannot be modified by a teacher');
    }
    if (data.firstCA !== undefined) {
        result.firstCA = data.firstCA;
    }
    if (data.secondCA !== undefined) {
        result.secondCA =
            data.secondCA;
    }
    if (data.exam !== undefined) {
        result.exam = data.exam;
    }
    if (hasCompleteScores(result.firstCA, result.secondCA, result.exam)) {
        const firstCA = result.firstCA;
        const secondCA = result.secondCA;
        const exam = result.exam;
        const total = calculateTotal(firstCA, secondCA, exam);
        result.total = total;
        result.grade =
            calculateGrade(total);
    }
    else {
        result.total = undefined;
        result.grade = undefined;
    }
    if (data.remark !== undefined) {
        result.remark =
            data.remark.trim();
    }
    await result.save();
    return result;
};
exports.updateResult = updateResult;
const deleteResult = async (userId, schoolId, resultId) => {
    validateSchoolId(schoolId);
    validateObjectId(resultId, 'Invalid result ID');
    const teacher = await getTeacherProfile(userId, schoolId);
    const result = await result_model_1.Result.findOne({
        _id: resultId,
        schoolId,
        teacherId: teacher._id,
    });
    if (!result) {
        throw new Error('Result not found or you do not have permission to delete it');
    }
    if (result.status ===
        result_model_1.ResultStatus.PUBLISHED) {
        throw new Error('Published results cannot be deleted');
    }
    await result_model_1.Result.deleteOne({
        _id: result._id,
        schoolId,
    });
    return {
        message: 'Result deleted successfully',
    };
};
exports.deleteResult = deleteResult;
