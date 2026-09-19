import { Types } from 'mongoose';

import {
  Invoice,
  InvoiceStatus,
} from '../invoices/invoice.model';

import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './payment.model';

import {
  CreatePaymentInput,
  PaymentQueryInput,
} from './payment.types';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validateId = (
  id: string,
  fieldName: string
): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const generatePaymentReference = (): string => {
  const paymentId =
    new Types.ObjectId().toString();

  return `PAY-${paymentId.toUpperCase()}`;
};

const getInvoiceStatus = (
  balance: number
): InvoiceStatus => {
  if (balance <= 0) {
    return InvoiceStatus.PAID;
  }

  return InvoiceStatus.PARTIALLY_PAID;
};

export const createPayment = async (
  schoolId: string,
  data: CreatePaymentInput
) => {
  validateSchoolId(schoolId);

  validateId(
    data.invoiceId,
    'invoice ID'
  );

  if (data.amount <= 0) {
    throw new Error(
      'Payment amount must be greater than zero'
    );
  }

  const invoice =
    await Invoice.findOne({
      _id: data.invoiceId,
      schoolId,
    });

  if (!invoice) {
    throw new Error(
      'Invoice not found'
    );
  }

  if (
    invoice.status ===
    InvoiceStatus.CANCELLED
  ) {
    throw new Error(
      'Payment cannot be made against a cancelled invoice'
    );
  }

  if (
    invoice.balance <= 0 ||
    invoice.status === InvoiceStatus.PAID
  ) {
    throw new Error(
      'Invoice is already fully paid'
    );
  }

  if (data.amount > invoice.balance) {
    throw new Error(
      `Payment amount cannot exceed the invoice balance of ${invoice.balance}`
    );
  }

  const reference =
    data.reference?.trim() ||
    generatePaymentReference();

  const isPaystackPayment =
    data.paymentMethod ===
    PaymentMethod.PAYSTACK;

  const paymentStatus =
    isPaystackPayment
      ? PaymentStatus.PENDING
      : PaymentStatus.SUCCESS;

  const paidAt = isPaystackPayment
    ? undefined
    : new Date();

  const payment =
    await Payment.create({
      schoolId:
        new Types.ObjectId(schoolId),
      invoiceId:
        new Types.ObjectId(
          data.invoiceId
        ),
      studentId: invoice.studentId,
      amount: data.amount,
      paymentMethod:
        data.paymentMethod,
      status: paymentStatus,
      reference,
      paidAt,
    });

  if (isPaystackPayment) {
    return payment.populate([
      {
        path: 'invoiceId',
        select:
          'invoiceNumber totalAmount amountPaid balance status term',
      },
      {
        path: 'studentId',
        select:
          'admissionNumber firstName middleName lastName',
      },
    ]);
  }

  const updatedInvoice =
    await Invoice.findOneAndUpdate(
      {
        _id: data.invoiceId,
        schoolId,
        status: {
          $nin: [
            InvoiceStatus.CANCELLED,
            InvoiceStatus.PAID,
          ],
        },
        balance: {
          $gte: data.amount,
        },
      },
      {
        $inc: {
          amountPaid: data.amount,
          balance: -data.amount,
        },
      },
      {
        new: true,
      }
    );

  if (!updatedInvoice) {
    await Payment.findByIdAndDelete(
      payment._id
    );

    throw new Error(
      'Unable to apply payment to invoice'
    );
  }

  updatedInvoice.status =
    getInvoiceStatus(
      updatedInvoice.balance
    );

  await updatedInvoice.save();

  return payment.populate([
    {
      path: 'invoiceId',
      select:
        'invoiceNumber totalAmount amountPaid balance status term',
    },
    {
      path: 'studentId',
      select:
        'admissionNumber firstName middleName lastName',
    },
  ]);
};

export const getPayments = async (
  schoolId: string,
  filters: PaymentQueryInput = {}
) => {
  validateSchoolId(schoolId);

  const query: {
    schoolId: string;
    invoiceId?: string;
    studentId?: string;
    paymentMethod?: PaymentQueryInput['paymentMethod'];
    status?: PaymentQueryInput['status'];
  } = {
    schoolId,
  };

  if (filters.invoiceId) {
    validateId(
      filters.invoiceId,
      'invoice ID'
    );

    query.invoiceId =
      filters.invoiceId;
  }

  if (filters.studentId) {
    validateId(
      filters.studentId,
      'student ID'
    );

    query.studentId =
      filters.studentId;
  }

  if (
    filters.paymentMethod !==
    undefined
  ) {
    query.paymentMethod =
      filters.paymentMethod;
  }

  if (filters.status !== undefined) {
    query.status = filters.status;
  }

  const payments =
    await Payment.find(query)
      .populate({
        path: 'invoiceId',
        select:
          'invoiceNumber totalAmount amountPaid balance status term',
      })
      .populate({
        path: 'studentId',
        select:
          'admissionNumber firstName middleName lastName',
      })
      .sort({
        createdAt: -1,
      });

  return payments;
};

export const getPaymentById =
  async (
    paymentId: string,
    schoolId: string
  ) => {
    validateId(
      paymentId,
      'payment ID'
    );

    validateSchoolId(schoolId);

    const payment =
      await Payment.findOne({
        _id: paymentId,
        schoolId,
      })
        .populate({
          path: 'invoiceId',
          select:
            'invoiceNumber totalAmount amountPaid balance status term',
        })
        .populate({
          path: 'studentId',
          select:
            'admissionNumber firstName middleName lastName',
        });

    if (!payment) {
      throw new Error(
        'Payment not found'
      );
    }

    return payment;
  };