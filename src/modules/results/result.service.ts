import { Types } from 'mongoose';

import { Result, ResultStatus } from './result.model';
import {
  BulkCreateResultInput,
  CreateResultInput,
  UpdateResultInput,
} from './result.types';

import { Student } from '../students/student.model';
import { Teacher } from '../teachers/teacher.model';
import { TeacherAssignment } from '../teacher-assignments/teacher-assignment.model';
import { Class } from '../classes/class.model';
import { Subject } from '../subjects/subject.model';
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

const calculateTotal = (
  firstCA: number,
  secondCA: number,
  exam: number
): number => {
  return firstCA + secondCA + exam;
};

const calculateGrade = (
  total: number
): string => {
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

const validateTeacherAssignment = async (
  teacherId: Types.ObjectId,
  schoolId: string,
  classId: string,
  subjectId: string,
  academicSessionId: string
): Promise<void> => {
  const assignment =
    await TeacherAssignment.findOne({
      schoolId,
      teacherId,
      classId,
      subjectId,
      academicSessionId,
      isActive: true,
    });

  if (!assignment) {
    throw new Error(
      'You are not assigned to teach this subject for this class and academic session'
    );
  }
};

const validateAcademicContext = async (
  schoolId: string,
  classId: string,
  subjectId: string,
  academicSessionId: string
): Promise<void> => {
  const classRecord =
    await Class.findOne({
      _id: classId,
      schoolId,
      academicSessionId,
      isActive: true,
    });

  if (!classRecord) {
    throw new Error(
      'Class not found, inactive, or does not belong to this academic session'
    );
  }

  const subject =
    await Subject.findOne({
      _id: subjectId,
      schoolId,
      isActive: true,
    });

  if (!subject) {
    throw new Error(
      'Subject not found or inactive'
    );
  }

  const academicSession =
    await AcademicSession.findOne({
      _id: academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }
};

const validateStudent = async (
  schoolId: string,
  studentId: string,
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

const hasCompleteScores = (
  firstCA?: number,
  secondCA?: number,
  exam?: number
): boolean => {
  return (
    firstCA !== undefined &&
    secondCA !== undefined &&
    exam !== undefined
  );
};

export const createResult = async (
  userId: string,
  schoolId: string,
  data: CreateResultInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    data.studentId,
    'Invalid student ID'
  );

  validateObjectId(
    data.classId,
    'Invalid class ID'
  );

  validateObjectId(
    data.subjectId,
    'Invalid subject ID'
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

  await validateTeacherAssignment(
    teacher._id,
    schoolId,
    data.classId,
    data.subjectId,
    data.academicSessionId
  );

  await validateAcademicContext(
    schoolId,
    data.classId,
    data.subjectId,
    data.academicSessionId
  );

  await validateStudent(
    schoolId,
    data.studentId,
    data.classId,
    data.academicSessionId
  );

  const existingResult =
    await Result.findOne({
      schoolId,
      studentId: data.studentId,
      subjectId: data.subjectId,
      academicSessionId:
        data.academicSessionId,
      term: data.term,
    });

  if (existingResult) {
    throw new Error(
      'A result already exists for this student, subject, academic session, and term'
    );
  }

  const complete = hasCompleteScores(
    data.firstCA,
    data.secondCA,
    data.exam
  );

  const total = complete
    ? calculateTotal(
        data.firstCA!,
        data.secondCA!,
        data.exam!
      )
    : undefined;

  const grade =
    total !== undefined
      ? calculateGrade(total)
      : undefined;

  const result = await Result.create({
    schoolId,
    studentId: data.studentId,
    teacherId: teacher._id,
    classId: data.classId,
    subjectId: data.subjectId,
    academicSessionId:
      data.academicSessionId,
    term: data.term,
    firstCA: data.firstCA,
    secondCA: data.secondCA,
    exam: data.exam,
    total,
    grade,
    remark: data.remark?.trim(),
    status: ResultStatus.DRAFT,
  });

  return result;
};

export const createBulkResults = async (
  userId: string,
  schoolId: string,
  data: BulkCreateResultInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    data.classId,
    'Invalid class ID'
  );

  validateObjectId(
    data.subjectId,
    'Invalid subject ID'
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

  await validateTeacherAssignment(
    teacher._id,
    schoolId,
    data.classId,
    data.subjectId,
    data.academicSessionId
  );

  await validateAcademicContext(
    schoolId,
    data.classId,
    data.subjectId,
    data.academicSessionId
  );

  const studentIds = data.records.map(
    (record) => record.studentId
  );

  const duplicateStudentIds =
    studentIds.filter(
      (studentId, index) =>
        studentIds.indexOf(studentId) !==
        index
    );

  const uniqueDuplicateStudentIds = [
    ...new Set(duplicateStudentIds),
  ];

  const results: Array<{
    studentId: string;
    success: boolean;
    action?: 'created' | 'updated';
    resultId?: string;
    total?: number;
    grade?: string;
    message?: string;
  }> = [];

  for (
    const record of data.records
  ) {
    try {
      validateObjectId(
        record.studentId,
        'Invalid student ID'
      );

      if (
        uniqueDuplicateStudentIds.includes(
          record.studentId
        )
      ) {
        throw new Error(
          'Duplicate student ID in bulk request'
        );
      }

      await validateStudent(
        schoolId,
        record.studentId,
        data.classId,
        data.academicSessionId
      );

      const existingResult =
        await Result.findOne({
          schoolId,
          studentId:
            record.studentId,
          subjectId:
            data.subjectId,
          academicSessionId:
            data.academicSessionId,
          term: data.term,
        });

      if (existingResult) {
        if (
          existingResult.status ===
          ResultStatus.PUBLISHED
        ) {
          throw new Error(
            'Published results cannot be modified by a teacher'
          );
        }

        if (
          existingResult.teacherId.toString() !==
          teacher._id.toString()
        ) {
          throw new Error(
            'You do not have permission to modify this result'
          );
        }

        if (
          record.firstCA !==
          undefined
        ) {
          existingResult.firstCA =
            record.firstCA;
        }

        if (
          record.secondCA !==
          undefined
        ) {
          existingResult.secondCA =
            record.secondCA;
        }

        if (
          record.exam !==
          undefined
        ) {
          existingResult.exam =
            record.exam;
        }

        if (
          hasCompleteScores(
            existingResult.firstCA,
            existingResult.secondCA,
            existingResult.exam
          )
        ) {
          const firstCA =
            existingResult.firstCA!;

          const secondCA =
            existingResult.secondCA!;

          const exam =
            existingResult.exam!;

          const total =
            calculateTotal(
              firstCA,
              secondCA,
              exam
            );

          existingResult.total =
            total;

          existingResult.grade =
            calculateGrade(total);
        } else {
          existingResult.total =
            undefined;

          existingResult.grade =
            undefined;
        }

        if (
          record.remark !==
          undefined
        ) {
          existingResult.remark =
            record.remark.trim();
        }

        await existingResult.save();

        results.push({
          studentId:
            record.studentId,
          success: true,
          action: 'updated',
          resultId:
            existingResult._id.toString(),
          total:
            existingResult.total,
          grade:
            existingResult.grade,
        });

        continue;
      }

      const complete =
        hasCompleteScores(
          record.firstCA,
          record.secondCA,
          record.exam
        );

      const total = complete
        ? calculateTotal(
            record.firstCA!,
            record.secondCA!,
            record.exam!
          )
        : undefined;

      const grade =
        total !== undefined
          ? calculateGrade(total)
          : undefined;

      const result =
        await Result.create({
          schoolId,
          studentId:
            record.studentId,
          teacherId: teacher._id,
          classId: data.classId,
          subjectId: data.subjectId,
          academicSessionId:
            data.academicSessionId,
          term: data.term,
          firstCA:
            record.firstCA,
          secondCA:
            record.secondCA,
          exam: record.exam,
          total,
          grade,
          remark:
            record.remark?.trim(),
          status:
            ResultStatus.DRAFT,
        });

      results.push({
        studentId:
          record.studentId,
        success: true,
        action: 'created',
        resultId:
          result._id.toString(),
        total:
          result.total,
        grade:
          result.grade,
      });
    } catch (error) {
      results.push({
        studentId:
          record.studentId,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to process result',
      });
    }
  }

  const successful =
    results.filter(
      (result) => result.success
    );

  const failed =
    results.filter(
      (result) => !result.success
    );

  return {
    totalRecords:
      data.records.length,
    successfulRecords:
      successful.length,
    failedRecords:
      failed.length,
    createdRecords:
      successful.filter(
        (result) =>
          result.action ===
          'created'
      ).length,
    updatedRecords:
      successful.filter(
        (result) =>
          result.action ===
          'updated'
      ).length,
    results,
  };
};

export const getResults = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const results =
    await Result.find({
      schoolId,
    })
      .populate({
        path: 'studentId',
        select:
          'firstName middleName lastName admissionNumber gender',
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
        select:
          'name code level capacity isActive',
      })
      .populate({
        path: 'subjectId',
        select: 'name isActive',
      })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      })
      .sort({
        createdAt: -1,
      });

  return results;
};

export const getMyResults = async (
  userId: string,
  schoolId: string
) => {
  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const results =
    await Result.find({
      schoolId,
      teacherId: teacher._id,
    })
      .populate({
        path: 'studentId',
        select:
          'firstName middleName lastName admissionNumber gender',
      })
      .populate({
        path: 'classId',
        select:
          'name code level capacity isActive',
      })
      .populate({
        path: 'subjectId',
        select: 'name isActive',
      })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      })
      .sort({
        createdAt: -1,
      });

  return results;
};

export const getResultById = async (
  schoolId: string,
  resultId: string
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    resultId,
    'Invalid result ID'
  );

  const result =
    await Result.findOne({
      _id: resultId,
      schoolId,
    })
      .populate({
        path: 'studentId',
        select:
          'firstName middleName lastName admissionNumber gender',
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
        select:
          'name code level capacity isActive',
      })
      .populate({
        path: 'subjectId',
        select: 'name isActive',
      })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      });

  if (!result) {
    throw new Error(
      'Result not found'
    );
  }

  return result;
};

export const publishResult = async (
  schoolId: string,
  resultId: string
) => {
  validateObjectId(
    schoolId,
    'Invalid school ID'
  );

  validateObjectId(
    resultId,
    'Invalid result ID'
  );

  const result = await Result.findOne({
    _id: resultId,
    schoolId,
  });

  if (!result) {
    throw new Error('Result not found');
  }

  if (
    result.status ===
    ResultStatus.PUBLISHED
  ) {
    throw new Error(
      'Result is already published'
    );
  }

  if (
    !hasCompleteScores(
      result.firstCA,
      result.secondCA,
      result.exam
    )
  ) {
    throw new Error(
      'Result cannot be published until First CA, Second CA, and Exam scores are entered'
    );
  }

  const firstCA = result.firstCA!;
  const secondCA = result.secondCA!;
  const exam = result.exam!;

  const total = calculateTotal(
    firstCA,
    secondCA,
    exam
  );

  const grade =
    calculateGrade(total);

  result.total = total;
  result.grade = grade;
  result.status =
    ResultStatus.PUBLISHED;

  await result.save();

  return result;
};

export const updateResult = async (
  userId: string,
  schoolId: string,
  resultId: string,
  data: UpdateResultInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    resultId,
    'Invalid result ID'
  );

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const result =
    await Result.findOne({
      _id: resultId,
      schoolId,
      teacherId: teacher._id,
    });

  if (!result) {
    throw new Error(
      'Result not found or you do not have permission to modify it'
    );
  }

  if (
    result.status ===
    ResultStatus.PUBLISHED
  ) {
    throw new Error(
      'Published results cannot be modified by a teacher'
    );
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

  if (
    hasCompleteScores(
      result.firstCA,
      result.secondCA,
      result.exam
    )
  ) {
    const firstCA = result.firstCA!;
    const secondCA = result.secondCA!;
    const exam = result.exam!;

    const total = calculateTotal(
      firstCA,
      secondCA,
      exam
    );

    result.total = total;
    result.grade =
      calculateGrade(total);
  } else {
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

export const deleteResult = async (
  userId: string,
  schoolId: string,
  resultId: string
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    resultId,
    'Invalid result ID'
  );

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const result =
    await Result.findOne({
      _id: resultId,
      schoolId,
      teacherId: teacher._id,
    });

  if (!result) {
    throw new Error(
      'Result not found or you do not have permission to delete it'
    );
  }

  if (
    result.status ===
    ResultStatus.PUBLISHED
  ) {
    throw new Error(
      'Published results cannot be deleted'
    );
  }

  await Result.deleteOne({
    _id: result._id,
    schoolId,
  });

  return {
    message:
      'Result deleted successfully',
  };
};