import { Types } from 'mongoose';

import { AcademicSession } from './academic-session.model';

import {
  CreateAcademicSessionInput,
  UpdateAcademicSessionInput,
} from './academic-session.types';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validateSessionDates = (
  startDate: string,
  endDate: string
): void => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error('Invalid academic session dates');
  }

  if (end <= start) {
    throw new Error(
      'End date must be after start date'
    );
  }
};

export const createAcademicSession = async (
  schoolId: string,
  data: CreateAcademicSessionInput
) => {
  validateSchoolId(schoolId);

  validateSessionDates(
    data.startDate,
    data.endDate
  );

  const existingSession =
    await AcademicSession.findOne({
      schoolId,
      name: data.name.trim(),
    });

  if (existingSession) {
    throw new Error(
      'An academic session with this name already exists in this school'
    );
  }

  if (data.isActive === true) {
    await AcademicSession.updateMany(
      {
        schoolId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }

  const session = await AcademicSession.create({
    schoolId: new Types.ObjectId(schoolId),
    name: data.name.trim(),
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    isActive: data.isActive ?? false,
  });

  return session;
};

export const getAcademicSessions = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const sessions =
    await AcademicSession.find({
      schoolId,
    }).sort({
      startDate: -1,
    });

  return sessions;
};

export const getActiveAcademicSession = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const session =
    await AcademicSession.findOne({
      schoolId,
      isActive: true,
    });

  return session;
};

export const getAcademicSessionById = async (
  sessionId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new Error('Invalid academic session ID');
  }

  validateSchoolId(schoolId);

  const session =
    await AcademicSession.findOne({
      _id: sessionId,
      schoolId,
    });

  if (!session) {
    throw new Error('Academic session not found');
  }

  return session;
};

export const updateAcademicSession = async (
  sessionId: string,
  schoolId: string,
  data: UpdateAcademicSessionInput
) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new Error('Invalid academic session ID');
  }

  validateSchoolId(schoolId);

  if (
    data.startDate !== undefined &&
    data.endDate !== undefined
  ) {
    validateSessionDates(
      data.startDate,
      data.endDate
    );
  }

  const existingSession =
    await AcademicSession.findOne({
      _id: sessionId,
      schoolId,
    });

  if (!existingSession) {
    throw new Error('Academic session not found');
  }

  if (data.name !== undefined) {
    const duplicateSession =
      await AcademicSession.findOne({
        schoolId,
        name: data.name.trim(),
        _id: {
          $ne: sessionId,
        },
      });

    if (duplicateSession) {
      throw new Error(
        'An academic session with this name already exists in this school'
      );
    }
  }

  if (data.isActive === true) {
    await AcademicSession.updateMany(
      {
        schoolId,
        _id: {
          $ne: sessionId,
        },
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }

  const updateData = {
    ...(data.name !== undefined && {
      name: data.name.trim(),
    }),

    ...(data.startDate !== undefined && {
      startDate: new Date(data.startDate),
    }),

    ...(data.endDate !== undefined && {
      endDate: new Date(data.endDate),
    }),

    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  };

  if (
    data.startDate !== undefined &&
    data.endDate === undefined
  ) {
    const startDate = new Date(data.startDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      startDate >= existingSession.endDate
    ) {
      throw new Error(
        'Start date must be before the end date'
      );
    }
  }

  if (
    data.endDate !== undefined &&
    data.startDate === undefined
  ) {
    const endDate = new Date(data.endDate);

    if (
      Number.isNaN(endDate.getTime()) ||
      endDate <= existingSession.startDate
    ) {
      throw new Error(
        'End date must be after the start date'
      );
    }
  }

  const session =
    await AcademicSession.findOneAndUpdate(
      {
        _id: sessionId,
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

  if (!session) {
    throw new Error('Academic session not found');
  }

  return session;
};

export const deleteAcademicSession = async (
  sessionId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new Error('Invalid academic session ID');
  }

  validateSchoolId(schoolId);

  const session =
    await AcademicSession.findOneAndDelete({
      _id: sessionId,
      schoolId,
    });

  if (!session) {
    throw new Error('Academic session not found');
  }

  return session;
};