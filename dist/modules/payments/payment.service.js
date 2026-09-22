"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getPayments = exports.createPayment = void 0;
const mongoose_1 = require("mongoose");
const invoice_model_1 = require("../invoices/invoice.model");
const payment_model_1 = require("./payment.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validateId = (id, fieldName) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName}`);
    }
};
const generatePaymentReference = () => {
    const paymentId = new mongoose_1.Types.ObjectId().toString();
    return `PAY-${paymentId.toUpperCase()}`;
};
const getInvoiceStatus = (balance) => {
    if (balance <= 0) {
        return invoice_model_1.InvoiceStatus.PAID;
    }
    return invoice_model_1.InvoiceStatus.PARTIALLY_PAID;
};
const createPayment = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateId(data.invoiceId, 'invoice ID');
    if (data.amount <= 0) {
        throw new Error('Payment amount must be greater than zero');
    }
    const invoice = await invoice_model_1.Invoice.findOne({
        _id: data.invoiceId,
        schoolId,
    });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    if (invoice.status ===
        invoice_model_1.InvoiceStatus.CANCELLED) {
        throw new Error('Payment cannot be made against a cancelled invoice');
    }
    if (invoice.balance <= 0 ||
        invoice.status === invoice_model_1.InvoiceStatus.PAID) {
        throw new Error('Invoice is already fully paid');
    }
    if (data.amount > invoice.balance) {
        throw new Error(`Payment amount cannot exceed the invoice balance of ${invoice.balance}`);
    }
    const reference = data.reference?.trim() ||
        generatePaymentReference();
    const isPaystackPayment = data.paymentMethod ===
        payment_model_1.PaymentMethod.PAYSTACK;
    const paymentStatus = isPaystackPayment
        ? payment_model_1.PaymentStatus.PENDING
        : payment_model_1.PaymentStatus.SUCCESS;
    const paidAt = isPaystackPayment
        ? undefined
        : new Date();
    const payment = await payment_model_1.Payment.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        invoiceId: new mongoose_1.Types.ObjectId(data.invoiceId),
        studentId: invoice.studentId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: paymentStatus,
        reference,
        paidAt,
    });
    if (isPaystackPayment) {
        return payment.populate([
            {
                path: 'invoiceId',
                select: 'invoiceNumber totalAmount amountPaid balance status term',
            },
            {
                path: 'studentId',
                select: 'admissionNumber firstName middleName lastName',
            },
        ]);
    }
    const updatedInvoice = await invoice_model_1.Invoice.findOneAndUpdate({
        _id: data.invoiceId,
        schoolId,
        status: {
            $nin: [
                invoice_model_1.InvoiceStatus.CANCELLED,
                invoice_model_1.InvoiceStatus.PAID,
            ],
        },
        balance: {
            $gte: data.amount,
        },
    }, {
        $inc: {
            amountPaid: data.amount,
            balance: -data.amount,
        },
    }, {
        new: true,
    });
    if (!updatedInvoice) {
        await payment_model_1.Payment.findByIdAndDelete(payment._id);
        throw new Error('Unable to apply payment to invoice');
    }
    updatedInvoice.status =
        getInvoiceStatus(updatedInvoice.balance);
    await updatedInvoice.save();
    return payment.populate([
        {
            path: 'invoiceId',
            select: 'invoiceNumber totalAmount amountPaid balance status term',
        },
        {
            path: 'studentId',
            select: 'admissionNumber firstName middleName lastName',
        },
    ]);
};
exports.createPayment = createPayment;
const getPayments = async (schoolId, filters = {}) => {
    validateSchoolId(schoolId);
    const query = {
        schoolId,
    };
    if (filters.invoiceId) {
        validateId(filters.invoiceId, 'invoice ID');
        query.invoiceId =
            filters.invoiceId;
    }
    if (filters.studentId) {
        validateId(filters.studentId, 'student ID');
        query.studentId =
            filters.studentId;
    }
    if (filters.paymentMethod !==
        undefined) {
        query.paymentMethod =
            filters.paymentMethod;
    }
    if (filters.status !== undefined) {
        query.status = filters.status;
    }
    const payments = await payment_model_1.Payment.find(query)
        .populate({
        path: 'invoiceId',
        select: 'invoiceNumber totalAmount amountPaid balance status term',
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName',
    })
        .sort({
        createdAt: -1,
    });
    return payments;
};
exports.getPayments = getPayments;
const getPaymentById = async (paymentId, schoolId) => {
    validateId(paymentId, 'payment ID');
    validateSchoolId(schoolId);
    const payment = await payment_model_1.Payment.findOne({
        _id: paymentId,
        schoolId,
    })
        .populate({
        path: 'invoiceId',
        select: 'invoiceNumber totalAmount amountPaid balance status term',
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName',
    });
    if (!payment) {
        throw new Error('Payment not found');
    }
    return payment;
};
exports.getPaymentById = getPaymentById;
