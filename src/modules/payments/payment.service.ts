import { Types } from 'mongoose';

import {
  Invoice,
  InvoiceStatus,
} from '../invoices/invoice.model';

import {
  Parent,
} from '../parents/parent.model';

import {
  ParentStudent,
} from '../ParentStudent/parentstudent.model';

import {
  PlatformPaymentConfig,
} from '../platform-payment-config/platform-payment-config.model';

import {
  SchoolPaymentConfig,
} from '../school-payment-config/school-payment-config.model';

import {
  User,
  UserRole,
} from '../users/user.model';

import {
  initializePaystackTransaction,
} from '../../services/paystack.service';

import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './payment.model';

import {
  CreatePaymentInput,
  InitializePaystackPaymentInput,
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

const populatePayment = async (
  payment: typeof Payment.prototype
) => {
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
    return populatePayment(payment);
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

  return populatePayment(payment);
};

export const initializePaystackPayment =
  async (
    schoolId: string,
    userId: string,
    data: InitializePaystackPaymentInput
  ) => {
    validateSchoolId(schoolId);

    validateId(
      userId,
      'user ID'
    );

    validateId(
      data.invoiceId,
      'invoice ID'
    );

    if (data.amount <= 0) {
      throw new Error(
        'Payment amount must be greater than zero'
      );
    }

    const user =
      await User.findOne({
        _id: userId,
        schoolId,
        role: UserRole.PARENT,
        isActive: true,
      });

    if (!user) {
      throw new Error(
        'Active parent user not found'
      );
    }

    if (!user.email) {
      throw new Error(
        'Parent email address is required for payment'
      );
    }

    const parent =
      await Parent.findOne({
        userId,
        schoolId,
        isActive: true,
      });

    if (!parent) {
      throw new Error(
        'Active parent profile not found'
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

    const parentStudent =
      await ParentStudent.findOne({
        schoolId,
        parentId: parent._id,
        studentId: invoice.studentId,
        isActive: true,
      });

    if (!parentStudent) {
      throw new Error(
        'You are not authorized to pay this student invoice'
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

    const paymentConfig =
      await SchoolPaymentConfig.findOne({
        schoolId,
        isEnabled: true,
      });

    if (!paymentConfig) {
      throw new Error(
        'School payment configuration is not enabled'
      );
    }

    if (
      !paymentConfig.paystackSubaccountCode
    ) {
      throw new Error(
        'Paystack subaccount is not configured for this school'
      );
    }

    const platformConfig =
      await PlatformPaymentConfig.findOne();

    if (!platformConfig) {
      throw new Error(
        'Platform payment configuration not found'
      );
    }

    if (!platformConfig.isEnabled) {
      throw new Error(
        'Platform payment configuration is disabled'
      );
    }

    if (
      platformConfig.platformFeePercentage < 0 ||
      platformConfig.platformFeePercentage > 100
    ) {
      throw new Error(
        'Invalid platform fee percentage'
      );
    }

    if (
      platformConfig.platformFeeFixed < 0
    ) {
      throw new Error(
        'Invalid platform fixed fee'
      );
    }

    if (
      platformConfig.platformFeeFixed > 0
    ) {
      throw new Error(
        'Fixed platform fees are not supported in Paystack initialization yet'
      );
    }

    const platformFeePercentage =
      platformConfig.platformFeePercentage;

    const platformFeeAmount =
      Math.round(
        data.amount *
          (platformFeePercentage / 100) *
          100
      ) / 100;

    const schoolAmount =
      Math.round(
        (data.amount -
          platformFeeAmount) *
          100
      ) / 100;

    if (schoolAmount < 0) {
      throw new Error(
        'Calculated school amount cannot be negative'
      );
    }

    const reference =
      generatePaymentReference();

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
          PaymentMethod.PAYSTACK,
        status:
          PaymentStatus.PENDING,
        reference,
        platformFeePercentage,
        platformFeeAmount,
        schoolAmount,
      });

    try {
      const paystackResponse =
        await initializePaystackTransaction({
          email: user.email,
          amount: data.amount,
          reference,
          subaccount:
            paymentConfig.paystackSubaccountCode,
          metadata: {
            paymentId:
              payment._id.toString(),
            invoiceId:
              invoice._id.toString(),
            studentId:
              invoice.studentId.toString(),
            schoolId,
            parentUserId: user._id.toString(),
          },
        });

      if (
        !paystackResponse.status ||
        !paystackResponse.data
          ?.authorization_url
      ) {
        await Payment.findByIdAndDelete(
          payment._id
        );

        throw new Error(
          paystackResponse.message ||
            'Unable to initialize Paystack transaction'
        );
      }

      return {
        payment:
          await populatePayment(payment),
        authorizationUrl:
          paystackResponse.data
            .authorization_url,
        accessCode:
          paystackResponse.data
            .access_code,
        reference:
          paystackResponse.data
            .reference,
      };
    } catch (error) {
      await Payment.findByIdAndDelete(
        payment._id
      );

      throw error;
    }
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