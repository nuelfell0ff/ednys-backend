import { Request, Response } from 'express';

import {
  createBulkResults,
  createResult,
  deleteResult,
  getChildResultsForParent,
  getMyChildrenResults,
  getMyResults,
  getResultById,
  getResults,
  publishResult,
  updateResult,
} from './result.service';

import {
  bulkCreateResultSchema,
  createResultSchema,
  updateResultSchema,
} from './result.validation';

import { ResultTerm } from './result.model';

const getSchoolId = (
  req: Request
): string | undefined => {
  return req.user?.schoolId;
};

const getUserId = (
  req: Request
): string | undefined => {
  return req.user?.userId;
};

const getResultId = (
  req: Request
): string | undefined => {
  const resultId = req.params.id;

  if (typeof resultId !== 'string') {
    return undefined;
  }

  return resultId;
};

const getStudentId = (
  req: Request
): string | undefined => {
  const studentId = req.params.studentId;

  if (typeof studentId !== 'string') {
    return undefined;
  }

  return studentId;
};

const getAcademicSessionId = (
  req: Request
): string | undefined => {
  const academicSessionId =
    req.query.academicSessionId;

  if (
    typeof academicSessionId !==
    'string'
  ) {
    return undefined;
  }

  return academicSessionId;
};

const getTerm = (
  req: Request
): ResultTerm | undefined => {
  const term = req.query.term;

  if (typeof term !== 'string') {
    return undefined;
  }

  if (
    !Object.values(ResultTerm).includes(
      term as ResultTerm
    )
  ) {
    return undefined;
  }

  return term as ResultTerm;
};

const isValidObjectId = (
  value: string
): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(value);
};

export const createResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    const validationResult =
      createResultSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const result =
        await createResult(
          userId,
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Result created successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create result',
      });
    }
  };

export const createBulkResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    const validationResult =
      bulkCreateResultSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const result =
        await createBulkResults(
          userId,
          schoolId,
          validationResult.data
        );

      const hasFailures =
        result.failedRecords > 0;

      res.status(
        hasFailures ? 207 : 201
      ).json({
        success:
          result.failedRecords === 0,
        message: hasFailures
          ? 'Bulk result processing completed with some errors'
          : 'Bulk results processed successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to process bulk results',
      });
    }
  };

export const getResultsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const results =
        await getResults(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve results',
      });
    }
  };

export const getMyResultsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const results =
        await getMyResults(
          userId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve your results',
      });
    }
  };

export const getMyChildrenResultsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const results =
        await getMyChildrenResults(
          userId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve your children\'s results',
      });
    }
  };

export const getChildResultsForParentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const studentId = getStudentId(req);
    const academicSessionId =
      getAcademicSessionId(req);
    const term = getTerm(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!studentId) {
      res.status(400).json({
        success: false,
        message:
          'Student ID is required',
      });

      return;
    }

    if (
      academicSessionId &&
      !isValidObjectId(
        academicSessionId
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          'Invalid academic session ID',
      });

      return;
    }

    if (
      req.query.term !== undefined &&
      !term
    ) {
      res.status(400).json({
        success: false,
        message:
          'Invalid term',
      });

      return;
    }

    try {
      const results =
        await getChildResultsForParent(
          schoolId,
          userId,
          studentId,
          academicSessionId,
          term
        );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve child results',
      });
    }
  };

export const getResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const resultId = getResultId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!resultId) {
      res.status(400).json({
        success: false,
        message:
          'Result ID is required',
      });

      return;
    }

    try {
      const result =
        await getResultById(
          schoolId,
          resultId
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve result',
      });
    }
  };

export const publishResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    const resultId = getResultId(req);

    if (!resultId) {
      res.status(400).json({
        success: false,
        message:
          'Result ID is required',
      });

      return;
    }

    try {
      const result =
        await publishResult(
          schoolId,
          resultId
        );

      res.status(200).json({
        success: true,
        message:
          'Result published successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to publish result',
      });
    }
  };

export const updateResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const resultId = getResultId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!resultId) {
      res.status(400).json({
        success: false,
        message:
          'Result ID is required',
      });

      return;
    }

    const validationResult =
      updateResultSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const result =
        await updateResult(
          userId,
          schoolId,
          resultId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Result updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update result',
      });
    }
  };

export const deleteResultController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const resultId = getResultId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!resultId) {
      res.status(400).json({
        success: false,
        message:
          'Result ID is required',
      });

      return;
    }

    try {
      const result =
        await deleteResult(
          userId,
          schoolId,
          resultId
        );

      res.status(200).json({
        success: true,
        message:
          result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete result',
      });
    }
  };
