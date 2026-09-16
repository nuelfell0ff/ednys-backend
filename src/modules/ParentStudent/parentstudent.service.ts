import { Types } from 'mongoose';

import {
  ParentStudent,
  ParentStudentRelationship,
} from './parentstudent.model';

import {
  CreateParentStudentInput,
  UpdateParentStudentInput,
} from './parentstudent.types';

import { Parent } from '../parents/parent.model';
import { Student } from '../students/student.model';

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

const validateRelationship = (
  relationship: string
): ParentStudentRelationship => {
  if (
    !Object.values(
      ParentStudentRelationship
    ).includes(
      relationship as ParentStudentRelationship
    )
  ) {
    throw new Error(
      'Invalid parent-student relationship'
    );
  }

  return relationship as ParentStudentRelationship;
};

export const createParentStudent = async (
  schoolId: string,
  data: CreateParentStudentInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    data.parentId,
    'Invalid parent ID'
  );

  validateObjectId(
    data.studentId,
    'Invalid student ID'
  );

  const parent =
    await Parent.findOne({
      _id: data.parentId,
      schoolId,
      isActive: true,
    });

  if (!parent) {
    throw new Error(
      'Active parent profile not found in this school'
    );
  }

  const student =
    await Student.findOne({
      _id: data.studentId,
      schoolId,
      isActive: true,
    });

  if (!student) {
    throw new Error(
      'Active student not found in this school'
    );
  }

  const existingRelationship =
    await ParentStudent.findOne({
      schoolId,
      parentId: parent._id,
      studentId: student._id,
    });

  if (existingRelationship) {
    throw new Error(
      'This parent is already linked to this student'
    );
  }

  const relationship =
    validateRelationship(
      data.relationship
    );

  const parentStudent =
    await ParentStudent.create({
      parentId: parent._id,
      studentId: student._id,
      schoolId: new Types.ObjectId(
        schoolId
      ),
      relationship,
      isActive: true,
    });

  return parentStudent;
};

export const getParentStudents = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const relationships =
    await ParentStudent.find({
      schoolId,
      isActive: true,
    })
      .populate({
        path: 'parentId',
        populate: {
          path: 'userId',
          select:
            'name email role isActive',
        },
      })
      .populate({
        path: 'studentId',
        select:
          'admissionNumber firstName middleName lastName classId academicSessionId isActive',
      })
      .sort({
        createdAt: -1,
      });

  return relationships;
};

export const getParentStudentById =
  async (
    schoolId: string,
    relationshipId: string
  ) => {
    validateSchoolId(schoolId);

    validateObjectId(
      relationshipId,
      'Invalid relationship ID'
    );

    const relationship =
      await ParentStudent.findOne({
        _id: relationshipId,
        schoolId,
      })
        .populate({
          path: 'parentId',
          populate: {
            path: 'userId',
            select:
              'name email role isActive',
          },
        })
        .populate({
          path: 'studentId',
          select:
            'admissionNumber firstName middleName lastName classId academicSessionId isActive',
        });

    if (!relationship) {
      throw new Error(
        'Parent-student relationship not found'
      );
    }

    return relationship;
  };

export const getStudentsForAuthenticatedParent =
  async (
    schoolId: string,
    userId: string
  ) => {
    validateSchoolId(schoolId);

    validateObjectId(
      userId,
      'Invalid user ID'
    );

    const parent =
      await Parent.findOne({
        userId,
        schoolId,
        isActive: true,
      });

    if (!parent) {
      throw new Error(
        'Active parent profile not found for this user'
      );
    }

    const relationships =
      await ParentStudent.find({
        schoolId,
        parentId: parent._id,
        isActive: true,
      })
        .populate({
          path: 'studentId',
          select:
            'admissionNumber firstName middleName lastName dateOfBirth gender classId academicSessionId isActive',
        })
        .sort({
          createdAt: -1,
        });

    return relationships;
  };

export const updateParentStudent =
  async (
    schoolId: string,
    relationshipId: string,
    data: UpdateParentStudentInput
  ) => {
    validateSchoolId(schoolId);

    validateObjectId(
      relationshipId,
      'Invalid relationship ID'
    );

    const relationship =
      await ParentStudent.findOne({
        _id: relationshipId,
        schoolId,
      });

    if (!relationship) {
      throw new Error(
        'Parent-student relationship not found'
      );
    }

    if (
      data.relationship !==
      undefined
    ) {
      relationship.relationship =
        validateRelationship(
          data.relationship
        );
    }

    if (
      data.isActive !== undefined
    ) {
      relationship.isActive =
        data.isActive;
    }

    await relationship.save();

    return relationship;
  };

export const deleteParentStudent =
  async (
    schoolId: string,
    relationshipId: string
  ) => {
    validateSchoolId(schoolId);

    validateObjectId(
      relationshipId,
      'Invalid relationship ID'
    );

    const relationship =
      await ParentStudent.findOneAndUpdate(
        {
          _id: relationshipId,
          schoolId,
        },
        {
          $set: {
            isActive: false,
          },
        },
        {
          new: true,
        }
      );

    if (!relationship) {
      throw new Error(
        'Parent-student relationship not found'
      );
    }

    return relationship;
  };