import { Types } from 'mongoose';

import { Attendance } from './attendance.model';
import {
  BulkAttendanceInput,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from './attendance.types';

import { Student } from '../students/student.model';
import { Teacher } from '../teachers/teacher.model';
import { TeacherAssignment } from '../teacher-assignments/teacher-assignment.model';
import { Class } from '../classes/class.model';
import { AcademicSession } from '../academic-sessions/academic-session.model';

const validateObjectId = (
  value: string,
  message: string
): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error(message);
  }
};

const validateSchoolId = (
  schoolId: string
): void => {
  validateObjectId(
    schoolId,
    'Invalid school ID'
  );
};

const normalizeDate = (
  date: string
): Date => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(
      'Invalid attendance date'
    );
  }

  const year = parsedDate.getUTCFullYear();
  const month = parsedDate.getUTCMonth();
  const day = parsedDate.getUTCDate();

  return new Date(
    Date.UTC(year, month, day)
  );
};

const getTeacherProfile = async (
  userId: string,
  schoolId: string
) => {
  validateObjectId(
    userId,
    'Invalid user ID'
  );

  validateSchoolId(schoolId);

  const teacher = await Teacher.findOne({
    userId,
    schoolId,
    isActive: true,
  });

  if (!teacher) {
    throw new Error(
      'Active teacher profile not found'
    );
  }

  return teacher;
};

const validateTeacherClassAccess =
  async (
    teacherId: Types.ObjectId,
    schoolId: string,
    classId: string,
    academicSessionId: string
  ): Promise<void> => {
    const assignment =
      await TeacherAssignment.findOne({
        schoolId,
        teacherId,
        classId,
        academicSessionId,
        isActive: true,
      });

    if (!assignment) {
      throw new Error(
        'You are not assigned to teach this class for this academic session'
      );
    }
  };

const validateStudentInClass =
  async (
    studentId: string,
    schoolId: string,
    classId: string,
    academicSessionId: string
  ) => {
    const student =
      await Student.findOne({
        _id: studentId,
        schoolId,
        classId,
        academicSessionId,
        isActive: true,
      });

    if (!student) {
      throw new Error(
        'Student not found, inactive, or does not belong to this class and academic session'
      );
    }

    return student;
  };

export const createAttendance = async (
  userId: string,
  schoolId: string,
  data: CreateAttendanceInput
) => {
  validateObjectId(
    data.studentId,
    'Invalid student ID'
  );

  validateObjectId(
    data.classId,
    'Invalid class ID'
  );

  validateObjectId(
    data.academicSessionId,
    'Invalid academic session ID'
  );

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  await validateTeacherClassAccess(
    teacher._id,
    schoolId,
    data.classId,
    data.academicSessionId
  );

  const classRecord =
    await Class.findOne({
      _id: data.classId,
      schoolId,
      academicSessionId:
        data.academicSessionId,
      isActive: true,
    });

  if (!classRecord) {
    throw new Error(
      'Class not found, inactive, or does not belong to this academic session'
    );
  }

  const academicSession =
    await AcademicSession.findOne({
      _id: data.academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }

  await validateStudentInClass(
    data.studentId,
    schoolId,
    data.classId,
    data.academicSessionId
  );

  const attendanceDate =
    normalizeDate(data.date);

  const existingAttendance =
    await Attendance.findOne({
      schoolId,
      studentId: data.studentId,
      date: attendanceDate,
    });

  if (existingAttendance) {
    throw new Error(
      'Attendance has already been recorded for this student on this date'
    );
  }

  const attendance =
    await Attendance.create({
      schoolId: new Types.ObjectId(
        schoolId
      ),
      studentId: new Types.ObjectId(
        data.studentId
      ),
      classId: new Types.ObjectId(
        data.classId
      ),
      academicSessionId:
        new Types.ObjectId(
          data.academicSessionId
        ),
      date: attendanceDate,
      status: data.status,
      remarks:
        data.remarks?.trim(),
      markedBy: new Types.ObjectId(
        userId
      ),
    });

  return attendance;
};

export const createBulkAttendance = async (
  userId: string,
  schoolId: string,
  data: BulkAttendanceInput
) => {
  validateObjectId(
    data.classId,
    'Invalid class ID'
  );

  validateObjectId(
    data.academicSessionId,
    'Invalid academic session ID'
  );

  if (data.records.length === 0) {
    throw new Error(
      'At least one attendance record is required'
    );
  }

  const studentIds =
    data.records.map(
      (record) => record.studentId
    );

  const uniqueStudentIds =
    new Set(studentIds);

  if (
    uniqueStudentIds.size !==
    studentIds.length
  ) {
    throw new Error(
      'A student cannot appear more than once in the same attendance submission'
    );
  }

  for (const studentId of studentIds) {
    validateObjectId(
      studentId,
      'Invalid student ID'
    );
  }

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  await validateTeacherClassAccess(
    teacher._id,
    schoolId,
    data.classId,
    data.academicSessionId
  );

  const classRecord =
    await Class.findOne({
      _id: data.classId,
      schoolId,
      academicSessionId:
        data.academicSessionId,
      isActive: true,
    });

  if (!classRecord) {
    throw new Error(
      'Class not found, inactive, or does not belong to this academic session'
    );
  }

  const academicSession =
    await AcademicSession.findOne({
      _id: data.academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }

  const students =
    await Student.find({
      _id: {
        $in: studentIds,
      },
      schoolId,
      classId: data.classId,
      academicSessionId:
        data.academicSessionId,
      isActive: true,
    });

  if (
    students.length !==
    studentIds.length
  ) {
    throw new Error(
      'One or more students were not found, are inactive, or do not belong to this class and academic session'
    );
  }

  const attendanceDate =
    normalizeDate(data.date);

  const existingAttendance =
    await Attendance.find({
      schoolId,
      classId: data.classId,
      academicSessionId:
        data.academicSessionId,
      date: attendanceDate,
      studentId: {
        $in: studentIds,
      },
    });

  const existingAttendanceMap =
    new Map(
      existingAttendance.map(
        (record) => [
          record.studentId.toString(),
          record,
        ]
      )
    );

  const operations = data.records.map(
    (record) => {
      const existing =
        existingAttendanceMap.get(
          record.studentId
        );

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
                remarks:
                  record.remarks?.trim(),
                markedBy:
                  new Types.ObjectId(
                    userId
                  ),
              },
            },
          },
        };
      }

      return {
        insertOne: {
          document: {
            schoolId:
              new Types.ObjectId(
                schoolId
              ),
            studentId:
              new Types.ObjectId(
                record.studentId
              ),
            classId:
              new Types.ObjectId(
                data.classId
              ),
            academicSessionId:
              new Types.ObjectId(
                data.academicSessionId
              ),
            date: attendanceDate,
            status: record.status,
            remarks:
              record.remarks?.trim(),
            markedBy:
              new Types.ObjectId(
                userId
              ),
          },
        },
      };
    }
  );

  await Attendance.bulkWrite(
    operations
  );

  const updatedAttendance =
    await Attendance.find({
      schoolId,
      classId: data.classId,
      academicSessionId:
        data.academicSessionId,
      date: attendanceDate,
      studentId: {
        $in: studentIds,
      },
    })
      .populate({
        path: 'studentId',
        select:
          'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
      })
      .populate({
        path: 'markedBy',
        select:
          'name email role',
      })
      .sort({
        createdAt: 1,
      });

  return updatedAttendance;
};

export const getAttendanceByClass =
  async (
    schoolId: string,
    classId: string,
    academicSessionId: string,
    date: string
  ) => {
    validateSchoolId(schoolId);

    validateObjectId(
      classId,
      'Invalid class ID'
    );

    validateObjectId(
      academicSessionId,
      'Invalid academic session ID'
    );

    const attendanceDate =
      normalizeDate(date);

    const students =
      await Student.find({
        schoolId,
        classId,
        academicSessionId,
        isActive: true,
      })
        .select(
          'firstName middleName lastName admissionNumber gender classId academicSessionId'
        )
        .sort({
          lastName: 1,
          firstName: 1,
        });

    const attendanceRecords =
      await Attendance.find({
        schoolId,
        classId,
        academicSessionId,
        date: attendanceDate,
      })
        .populate({
          path: 'markedBy',
          select:
            'name email role',
        })
        .sort({
          createdAt: 1,
        });

    const attendanceMap =
      new Map(
        attendanceRecords.map(
          (record) => [
            record.studentId.toString(),
            record,
          ]
        )
      );

    return students.map(
      (student) => {
        const record =
          attendanceMap.get(
            student._id.toString()
          );

        return {
          student,
          attendanceId:
            record?._id ?? null,
          date: attendanceDate,
          status:
            record?.status ?? 'UNMARKED',
          remarks:
            record?.remarks ?? null,
          markedBy:
            record?.markedBy ?? null,
          createdAt:
            record?.createdAt ?? null,
          updatedAt:
            record?.updatedAt ?? null,
        };
      }
    );
  };

export const getStudentAttendance =
  async (
    studentId: string,
    schoolId: string
  ) => {
    validateObjectId(
      studentId,
      'Invalid student ID'
    );

    validateSchoolId(schoolId);

    const attendance =
      await Attendance.find({
        studentId,
        schoolId,
      })
        .populate({
          path: 'studentId',
          select:
            'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
        })
        .populate({
          path: 'classId',
          select:
            'name code level capacity academicSessionId isActive',
        })
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        })
        .populate({
          path: 'markedBy',
          select:
            'name email role',
        })
        .sort({
          date: -1,
        });

    return attendance;
  };

export const getAttendanceById =
  async (
    attendanceId: string,
    schoolId: string
  ) => {
    validateObjectId(
      attendanceId,
      'Invalid attendance ID'
    );

    validateSchoolId(schoolId);

    const attendance =
      await Attendance.findOne({
        _id: attendanceId,
        schoolId,
      })
        .populate({
          path: 'studentId',
          select:
            'firstName middleName lastName admissionNumber gender classId academicSessionId isActive',
        })
        .populate({
          path: 'classId',
          select:
            'name code level capacity academicSessionId isActive',
        })
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        })
        .populate({
          path: 'markedBy',
          select:
            'name email role',
        });

    if (!attendance) {
      throw new Error(
        'Attendance record not found'
      );
    }

    return attendance;
  };

export const updateAttendance = async (
  attendanceId: string,
  userId: string,
  schoolId: string,
  data: UpdateAttendanceInput
) => {
  validateObjectId(
    attendanceId,
    'Invalid attendance ID'
  );

  validateSchoolId(schoolId);

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const attendance =
    await Attendance.findOne({
      _id: attendanceId,
      schoolId,
    });

  if (!attendance) {
    throw new Error(
      'Attendance record not found'
    );
  }

  await validateTeacherClassAccess(
    teacher._id,
    schoolId,
    attendance.classId.toString(),
    attendance.academicSessionId.toString()
  );

  const updateData: {
    status?: string;
    remarks?: string;
  } = {};

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.remarks !== undefined) {
    updateData.remarks =
      data.remarks.trim();
  }

  const updatedAttendance =
    await Attendance.findOneAndUpdate(
      {
        _id: attendanceId,
        schoolId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!updatedAttendance) {
    throw new Error(
      'Attendance record not found'
    );
  }

  return updatedAttendance;
};