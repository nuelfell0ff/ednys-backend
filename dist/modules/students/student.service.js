"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getMyChildrenStudents = exports.getStudents = exports.createStudent = void 0;
const mongoose_1 = require("mongoose");
const student_model_1 = require("./student.model");
const parent_model_1 = require("../parents/parent.model");
const parentstudent_model_1 = require("../ParentStudent/parentstudent.model");
const convertGender = (gender) => {
    if (!gender) {
        return undefined;
    }
    return gender === 'MALE'
        ? student_model_1.StudentGender.MALE
        : student_model_1.StudentGender.FEMALE;
};
const createStudent = async (schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    if (data.classId &&
        !mongoose_1.Types.ObjectId.isValid(data.classId)) {
        throw new Error('Invalid class ID');
    }
    if (data.academicSessionId &&
        !mongoose_1.Types.ObjectId.isValid(data.academicSessionId)) {
        throw new Error('Invalid academic session ID');
    }
    const admissionNumber = data.admissionNumber.trim().toUpperCase();
    const existingStudent = await student_model_1.Student.findOne({
        schoolId,
        admissionNumber,
    });
    if (existingStudent) {
        throw new Error('A student with this admission number already exists in this school');
    }
    const student = await student_model_1.Student.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        admissionNumber,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: convertGender(data.gender),
        classId: data.classId
            ? new mongoose_1.Types.ObjectId(data.classId)
            : undefined,
        academicSessionId: data.academicSessionId
            ? new mongoose_1.Types.ObjectId(data.academicSessionId)
            : undefined,
    });
    return student;
};
exports.createStudent = createStudent;
const getStudents = async (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    const students = await student_model_1.Student.find({
        schoolId,
        isActive: true,
    }).sort({
        createdAt: -1,
    });
    return students;
};
exports.getStudents = getStudents;
const getMyChildrenStudents = async (userId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
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
    const students = await student_model_1.Student.find({
        _id: { $in: studentIds },
        schoolId,
        isActive: true,
    })
        .select('admissionNumber firstName middleName lastName dateOfBirth gender classId academicSessionId isActive')
        .sort({
        createdAt: -1,
    });
    return students;
};
exports.getMyChildrenStudents = getMyChildrenStudents;
const getStudentById = async (studentId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    const student = await student_model_1.Student.findOne({
        _id: studentId,
        schoolId,
    });
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};
exports.getStudentById = getStudentById;
const updateStudent = async (studentId, schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    if (data.classId &&
        !mongoose_1.Types.ObjectId.isValid(data.classId)) {
        throw new Error('Invalid class ID');
    }
    if (data.academicSessionId &&
        !mongoose_1.Types.ObjectId.isValid(data.academicSessionId)) {
        throw new Error('Invalid academic session ID');
    }
    const admissionNumber = data.admissionNumber
        ? data.admissionNumber.trim().toUpperCase()
        : undefined;
    if (admissionNumber) {
        const existingStudent = await student_model_1.Student.findOne({
            schoolId,
            admissionNumber,
            _id: {
                $ne: studentId,
            },
        });
        if (existingStudent) {
            throw new Error('A student with this admission number already exists in this school');
        }
    }
    const updateData = {
        ...(data.firstName !== undefined && {
            firstName: data.firstName,
        }),
        ...(data.middleName !== undefined && {
            middleName: data.middleName,
        }),
        ...(data.lastName !== undefined && {
            lastName: data.lastName,
        }),
        ...(data.dateOfBirth !== undefined && {
            dateOfBirth: data.dateOfBirth,
        }),
        ...(data.gender !== undefined && {
            gender: convertGender(data.gender),
        }),
        ...(data.classId !== undefined && {
            classId: data.classId
                ? new mongoose_1.Types.ObjectId(data.classId)
                : undefined,
        }),
        ...(data.academicSessionId !== undefined && {
            academicSessionId: data.academicSessionId
                ? new mongoose_1.Types.ObjectId(data.academicSessionId)
                : undefined,
        }),
        ...(admissionNumber !== undefined && {
            admissionNumber,
        }),
        ...(data.isActive !== undefined && {
            isActive: data.isActive,
        }),
    };
    const student = await student_model_1.Student.findOneAndUpdate({
        _id: studentId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};
exports.updateStudent = updateStudent;
const deleteStudent = async (studentId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    const student = await student_model_1.Student.findOneAndUpdate({
        _id: studentId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};
exports.deleteStudent = deleteStudent;
