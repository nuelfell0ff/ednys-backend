import { Types } from 'mongoose';

import { AcademicSession } from '../academic-sessions/academic-session.model';
import { FeeStructure } from '../fee-structures/fee-structure.model';
import { Student } from '../students/student.model';
import { Invoice, InvoiceStatus } from './invoice.model';
import {
  CreateInvoiceInput,
  InvoiceQueryInput,
} from './invoice.types';

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

const generateInvoiceNumber = (): string => {
  const invoiceId =
    new Types.ObjectId().toString();

  return `INV-${invoiceId.toUpperCase()}`;
};

export const createInvoice = async (
  schoolId: string,
  data: CreateInvoiceInput
) => {
  validateSchoolId(schoolId);

  validateId(
    data.studentId,
    'student ID'
  );

  validateId(
    data.academicSessionId,
    'academic session ID'
  );

  const student =
    await Student.findOne({
      _id: data.studentId,
      schoolId,
      isActive: true,
    });

  if (!student) {
    throw new Error(
      'Active student not found'
    );
  }

  if (!student.classId) {
    throw new Error(
      'Student is not assigned to a class'
    );
  }

  if (!student.academicSessionId) {
    throw new Error(
      'Student is not assigned to an academic session'
    );
  }

  if (
    student.academicSessionId.toString() !==
    data.academicSessionId
  ) {
    throw new Error(
      'Student does not belong to the selected academic session'
    );
  }

  const academicSession =
    await AcademicSession.findOne({
      _id: data.academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }

  const existingInvoice =
    await Invoice.findOne({
      schoolId,
      studentId: data.studentId,
      academicSessionId:
        data.academicSessionId,
      term: data.term,
      status: {
        $ne: InvoiceStatus.CANCELLED,
      },
    });

  if (existingInvoice) {
    throw new Error(
      'An active invoice already exists for this student, session and term'
    );
  }

  const feeStructures =
    await FeeStructure.find({
      schoolId,
      academicSessionId:
        data.academicSessionId,
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
    throw new Error(
      'No active fee structures found for this student, class, session and term'
    );
  }

  const items = feeStructures.map(
    (feeStructure) => {
      const feeCategory =
        feeStructure.feeCategoryId as unknown as {
          _id: Types.ObjectId;
          name: string;
        };

      if (
        !feeCategory ||
        !feeCategory.name
      ) {
        throw new Error(
          'A fee structure has an invalid fee category'
        );
      }

      return {
        feeStructureId:
          feeStructure._id,
        feeCategoryId:
          feeCategory._id,
        feeCategoryName:
          feeCategory.name,
        amount: feeStructure.amount,
        dueDate:
          feeStructure.dueDate,
        isMandatory:
          feeStructure.isMandatory,
      };
    }
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total + item.amount,
    0
  );

  const amountPaid = 0;

  const balance = totalAmount;

  const invoice =
    await Invoice.create({
      _id: new Types.ObjectId(),
      schoolId:
        new Types.ObjectId(schoolId),
      studentId:
        new Types.ObjectId(
          data.studentId
        ),
      classId: student.classId,
      academicSessionId:
        new Types.ObjectId(
          data.academicSessionId
        ),
      term: data.term,
      invoiceNumber:
        generateInvoiceNumber(),
      items,
      totalAmount,
      amountPaid,
      balance,
      status: InvoiceStatus.PENDING,
      issuedAt: new Date(),
    });

  return invoice.populate([
    {
      path: 'studentId',
      select:
        'admissionNumber firstName middleName lastName',
    },
    {
      path: 'classId',
      select: 'name',
    },
    {
      path: 'academicSessionId',
      select:
        'name startDate endDate isActive',
    },
  ]);
};

export const getInvoices = async (
  schoolId: string,
  filters: InvoiceQueryInput = {}
) => {
  validateSchoolId(schoolId);

  const query: {
    schoolId: string;
    studentId?: string;
    academicSessionId?: string;
    term?: InvoiceQueryInput['term'];
    status?: InvoiceQueryInput['status'];
  } = {
    schoolId,
  };

  if (filters.studentId) {
    validateId(
      filters.studentId,
      'student ID'
    );

    query.studentId =
      filters.studentId;
  }

  if (filters.academicSessionId) {
    validateId(
      filters.academicSessionId,
      'academic session ID'
    );

    query.academicSessionId =
      filters.academicSessionId;
  }

  if (filters.term !== undefined) {
    query.term = filters.term;
  }

  if (filters.status !== undefined) {
    query.status = filters.status;
  }

  const invoices =
    await Invoice.find(query)
      .populate({
        path: 'studentId',
        select:
          'admissionNumber firstName middleName lastName',
      })
      .populate({
        path: 'classId',
        select: 'name',
      })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      })
      .sort({
        issuedAt: -1,
      });

  return invoices;
};

export const getInvoiceById =
  async (
    invoiceId: string,
    schoolId: string
  ) => {
    validateId(
      invoiceId,
      'invoice ID'
    );

    validateSchoolId(schoolId);

    const invoice =
      await Invoice.findOne({
        _id: invoiceId,
        schoolId,
      })
        .populate({
          path: 'studentId',
          select:
            'admissionNumber firstName middleName lastName',
        })
        .populate({
          path: 'classId',
          select: 'name',
        })
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        });

    if (!invoice) {
      throw new Error(
        'Invoice not found'
      );
    }

    return invoice;
  };

export const cancelInvoice =
  async (
    invoiceId: string,
    schoolId: string
  ) => {
    validateId(
      invoiceId,
      'invoice ID'
    );

    validateSchoolId(schoolId);

    const invoice =
      await Invoice.findOne({
        _id: invoiceId,
        schoolId,
      });

    if (!invoice) {
      throw new Error(
        'Invoice not found'
      );
    }

    if (
      invoice.status ===
      InvoiceStatus.PAID
    ) {
      throw new Error(
        'A paid invoice cannot be cancelled'
      );
    }

    if (
      invoice.status ===
      InvoiceStatus.PARTIALLY_PAID
    ) {
      throw new Error(
        'A partially paid invoice cannot be cancelled'
      );
    }

    if (
      invoice.status ===
      InvoiceStatus.CANCELLED
    ) {
      throw new Error(
        'Invoice is already cancelled'
      );
    }

    invoice.status =
      InvoiceStatus.CANCELLED;

    await invoice.save();

    return invoice.populate([
      {
        path: 'studentId',
        select:
          'admissionNumber firstName middleName lastName',
      },
      {
        path: 'classId',
        select: 'name',
      },
      {
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      },
    ]);
  };