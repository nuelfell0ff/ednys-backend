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
  verifyPaystackTransaction,
} from '../../services/paystack.service';

const getInvoiceStatus = (
  balance: number
): InvoiceStatus => {
  if (balance <= 0) {
    return InvoiceStatus.PAID;
  }

  return InvoiceStatus.PARTIALLY_PAID;
};

export const processPaystackChargeSuccess =
  async (
    reference: string
  ) => {
    if (
      !reference ||
      !reference.trim()
    ) {
      throw new Error(
        'Transaction reference is required'
      );
    }

    const payment =
      await Payment.findOne({
        reference: reference.trim(),
        paymentMethod:
          PaymentMethod.PAYSTACK,
      });

    if (!payment) {
      throw new Error(
        'Payment not found for this transaction reference'
      );
    }

    if (
      payment.status ===
      PaymentStatus.SUCCESS
    ) {
      return {
        alreadyProcessed: true,
        payment,
      };
    }

    if (
      payment.status ===
      PaymentStatus.REFUNDED
    ) {
      throw new Error(
        'Refunded payment cannot be processed as successful'
      );
    }

    const verification =
      await verifyPaystackTransaction(
        reference
      );

    if (
      !verification.status ||
      !verification.data
    ) {
      throw new Error(
        verification.message ||
          'Unable to verify Paystack transaction'
      );
    }

    const transaction =
      verification.data;

    if (
      transaction.status.toLowerCase() !==
      'success'
    ) {
      throw new Error(
        `Paystack transaction is not successful. Current status: ${transaction.status}`
      );
    }

    if (
      transaction.reference !==
      payment.reference
    ) {
      throw new Error(
        'Paystack transaction reference does not match payment reference'
      );
    }

    const expectedAmount =
      Math.round(
        payment.amount * 100
      );

    if (
      transaction.amount !==
      expectedAmount
    ) {
      throw new Error(
        'Paystack transaction amount does not match payment amount'
      );
    }

    if (
      transaction.currency !==
      'NGN'
    ) {
      throw new Error(
        'Paystack transaction currency is not NGN'
      );
    }

    const paidAt =
      transaction.paid_at
        ? new Date(transaction.paid_at)
        : new Date();

    if (
      Number.isNaN(
        paidAt.getTime()
      )
    ) {
      throw new Error(
        'Invalid Paystack payment date'
      );
    }

    const paymentUpdated =
      await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status: PaymentStatus.PENDING,
        },
        {
          $set: {
            status:
              PaymentStatus.SUCCESS,
            paidAt,
          },
        },
        {
          new: true,
        }
      );

    if (!paymentUpdated) {
      const existingPayment =
        await Payment.findById(
          payment._id
        );

      if (
        existingPayment?.status ===
        PaymentStatus.SUCCESS
      ) {
        return {
          alreadyProcessed: true,
          payment:
            existingPayment,
        };
      }

      throw new Error(
        'Unable to update payment status'
      );
    }

    const invoice =
      await Invoice.findOne({
        _id: payment.invoiceId,
        schoolId: payment.schoolId,
      });

    if (!invoice) {
      await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status:
            PaymentStatus.SUCCESS,
        },
        {
          $set: {
            status:
              PaymentStatus.PENDING,
            paidAt: undefined,
          },
        }
      );

      throw new Error(
        'Invoice not found for payment'
      );
    }

    if (
      invoice.status ===
      InvoiceStatus.CANCELLED
    ) {
      await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status:
            PaymentStatus.SUCCESS,
        },
        {
          $set: {
            status:
              PaymentStatus.PENDING,
            paidAt: undefined,
          },
        }
      );

      throw new Error(
        'Payment cannot be applied to a cancelled invoice'
      );
    }

    const updatedInvoice =
      await Invoice.findOneAndUpdate(
        {
          _id: payment.invoiceId,
          schoolId:
            payment.schoolId,
          status: {
            $nin: [
              InvoiceStatus.CANCELLED,
              InvoiceStatus.PAID,
            ],
          },
          balance: {
            $gte: payment.amount,
          },
        },
        {
          $inc: {
            amountPaid:
              payment.amount,
            balance:
              -payment.amount,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedInvoice) {
      await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status:
            PaymentStatus.SUCCESS,
        },
        {
          $set: {
            status:
              PaymentStatus.PENDING,
            paidAt: undefined,
          },
        }
      );

      throw new Error(
        'Unable to apply Paystack payment to invoice'
      );
    }

    updatedInvoice.status =
      getInvoiceStatus(
        updatedInvoice.balance
      );

    await updatedInvoice.save();

    const populatedPayment =
      await Payment.findById(
        payment._id
      )
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

    return {
      alreadyProcessed: false,
      payment:
        populatedPayment,
      invoice:
        updatedInvoice,
    };
  };