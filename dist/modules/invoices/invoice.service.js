"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelInvoice = exports.getInvoiceById = exports.getInvoices = exports.createInvoice = void 0;
const mongoose_1 = require("mongoose");
const academic_session_model_1 = require("../academic-sessions/academic-session.model");
const fee_structure_model_1 = require("../fee-structures/fee-structure.model");
const student_model_1 = require("../students/student.model");
const invoice_model_1 = require("./invoice.model");
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
const generateInvoiceNumber = () => {
    const invoiceId = new mongoose_1.Types.ObjectId().toString();
    return `INV-${invoiceId.toUpperCase()}`;
};
const createInvoice = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateId(data.studentId, 'student ID');
    validateId(data.academicSessionId, 'academic session ID');
    const student = await student_model_1.Student.findOne({
        _id: data.studentId,
        schoolId,
        isActive: true,
    });
    if (!student) {
        throw new Error('Active student not found');
    }
    if (!student.classId) {
        throw new Error('Student is not assigned to a class');
    }
    if (!student.academicSessionId) {
        throw new Error('Student is not assigned to an academic session');
    }
    if (student.academicSessionId.toString() !==
        data.academicSessionId) {
        throw new Error('Student does not belong to the selected academic session');
    }
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: data.academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
    const existingInvoice = await invoice_model_1.Invoice.findOne({
        schoolId,
        studentId: data.studentId,
        academicSessionId: data.academicSessionId,
        term: data.term,
        status: {
            $ne: invoice_model_1.InvoiceStatus.CANCELLED,
        },
    });
    if (existingInvoice) {
        throw new Error('An active invoice already exists for this student, session and term');
    }
    const feeStructures = await fee_structure_model_1.FeeStructure.find({
        schoolId,
        academicSessionId: data.academicSessionId,
        term: data.term,
        classId: student.classId,
        isActive: true,
    })
        .populate({
        path: 'feeCategoryId',
        select: 'name',
    })
        .sort({
        createdAt: 1,
    })
        .lean();
    if (feeStructures.length === 0) {
        throw new Error('No active fee structures found for this student, class, session and term');
    }
    const items = feeStructures.map((feeStructure) => {
        const feeCategory = feeStructure.feeCategoryId;
        if (!feeCategory ||
            !feeCategory.name) {
            throw new Error('A fee structure has an invalid fee category');
        }
        return {
            feeStructureId: feeStructure._id,
            feeCategoryId: feeCategory._id,
            feeCategoryName: feeCategory.name,
            amount: feeStructure.amount,
            dueDate: feeStructure.dueDate,
            isMandatory: feeStructure.isMandatory,
        };
    });
    const totalAmount = items.reduce((total, item) => total + item.amount, 0);
    const amountPaid = 0;
    const balance = totalAmount;
    const invoice = await invoice_model_1.Invoice.create({
        _id: new mongoose_1.Types.ObjectId(),
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        studentId: new mongoose_1.Types.ObjectId(data.studentId),
        classId: student.classId,
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        term: data.term,
        invoiceNumber: generateInvoiceNumber(),
        items,
        totalAmount,
        amountPaid,
        balance,
        status: invoice_model_1.InvoiceStatus.PENDING,
        issuedAt: new Date(),
    });
    return invoice.populate([
        {
            path: 'studentId',
            select: 'admissionNumber firstName middleName lastName',
        },
        {
            path: 'classId',
            select: 'name',
        },
        {
            path: 'academicSessionId',
            select: 'name startDate endDate isActive',
        },
    ]);
};
exports.createInvoice = createInvoice;
const getInvoices = async (schoolId, filters = {}) => {
    validateSchoolId(schoolId);
    const query = {
        schoolId,
    };
    if (filters.studentId) {
        validateId(filters.studentId, 'student ID');
        query.studentId =
            filters.studentId;
    }
    if (filters.academicSessionId) {
        validateId(filters.academicSessionId, 'academic session ID');
        query.academicSessionId =
            filters.academicSessionId;
    }
    if (filters.term !== undefined) {
        query.term = filters.term;
    }
    if (filters.status !== undefined) {
        query.status = filters.status;
    }
    const invoices = await invoice_model_1.Invoice.find(query)
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .sort({
        issuedAt: -1,
    });
    return invoices;
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (invoiceId, schoolId) => {
    validateId(invoiceId, 'invoice ID');
    validateSchoolId(schoolId);
    const invoice = await invoice_model_1.Invoice.findOne({
        _id: invoiceId,
        schoolId,
    })
        .populate({
        path: 'studentId',
        select: 'admissionNumber firstName middleName lastName',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    return invoice;
};
exports.getInvoiceById = getInvoiceById;
const cancelInvoice = async (invoiceId, schoolId) => {
    validateId(invoiceId, 'invoice ID');
    validateSchoolId(schoolId);
    const invoice = await invoice_model_1.Invoice.findOne({
        _id: invoiceId,
        schoolId,
    });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    if (invoice.status ===
        invoice_model_1.InvoiceStatus.PAID) {
        throw new Error('A paid invoice cannot be cancelled');
    }
    if (invoice.status ===
        invoice_model_1.InvoiceStatus.PARTIALLY_PAID) {
        throw new Error('A partially paid invoice cannot be cancelled');
    }
    if (invoice.status ===
        invoice_model_1.InvoiceStatus.CANCELLED) {
        throw new Error('Invoice is already cancelled');
    }
    invoice.status =
        invoice_model_1.InvoiceStatus.CANCELLED;
    await invoice.save();
    return invoice.populate([
        {
            path: 'studentId',
            select: 'admissionNumber firstName middleName lastName',
        },
        {
            path: 'classId',
            select: 'name',
        },
        {
            path: 'academicSessionId',
            select: 'name startDate endDate isActive',
        },
    ]);
};
exports.cancelInvoice = cancelInvoice;
