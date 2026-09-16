import { Request, Response } from 'express';

import {
  createBulkResults,
  createResult,
  deleteResult,
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