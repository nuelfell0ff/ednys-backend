import { Request, Response } from 'express';

import {
  cancelInvoice,
  createInvoice,
  getInvoiceById,
  getInvoices,
} from './invoice.service';

import {
  createInvoiceSchema,
  invoiceQuerySchema,
} from './invoice.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getInvoiceId = (
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

export const createInvoiceController =
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
      createInvoiceSchema.safeParse(
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
      const invoice =
        await createInvoice(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Invoice created successfully',
        data: invoice,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create invoice',
      });
    }
  };

export const getInvoicesController =
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
      invoiceQuerySchema.safeParse(
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
      const invoices =
        await getInvoices(
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve invoices',
      });
    }
  };

export const getInvoiceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const invoiceId =
      getInvoiceId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!invoiceId) {
      res.status(400).json({
        success: false,
        message:
          'Invoice ID is required',
      });

      return;
    }

    try {
      const invoice =
        await getInvoiceById(
          invoiceId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve invoice';

      res.status(
        message === 'Invoice not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const cancelInvoiceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const invoiceId =
      getInvoiceId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!invoiceId) {
      res.status(400).json({
        success: false,
        message:
          'Invoice ID is required',
      });

      return;
    }

    try {
      const invoice =
        await cancelInvoice(
          invoiceId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Invoice cancelled successfully',
        data: invoice,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to cancel invoice';

      res.status(
        message === 'Invoice not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };