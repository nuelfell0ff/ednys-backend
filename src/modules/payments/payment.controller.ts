import { Request, Response } from 'express';

import {
  createPayment,
  getPaymentById,
  getPayments,
  initializePaystackPayment,
} from './payment.service';

import {
  createPaymentSchema,
  initializePaystackPaymentSchema,
  paymentQuerySchema,
} from './payment.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getUserId = (
  req: Request
): string | null => {
  if (!req.user?.userId) {
    return null;
  }

  return req.user.userId;
};

const getPaymentId = (
  req: Request
): string | null => {
  const { id } = req.params;

  if (
    typeof id !== 'string' ||
    !id.trim()
  ) {
    return null;
  }

  return id;
};

export const createPaymentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      createPaymentSchema.safeParse(
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
      const payment =
        await createPayment(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Payment created successfully',
        data: payment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create payment',
      });
    }
  };

export const initializePaystackPaymentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      initializePaystackPaymentSchema.safeParse(
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
      const payment =
        await initializePaystackPayment(
          schoolId,
          userId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Paystack payment initialized successfully',
        data: payment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to initialize Paystack payment',
      });
    }
  };

export const getPaymentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      paymentQuerySchema.safeParse(
        req.query
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
      const payments =
        await getPayments(
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve payments',
      });
    }
  };

export const getPaymentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const paymentId =
      getPaymentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!paymentId) {
      res.status(400).json({
        success: false,
        message:
          'Payment ID is required',
      });

      return;
    }

    try {
      const payment =
        await getPaymentById(
          paymentId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve payment';

      res.status(
        message === 'Payment not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };