import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

import { ResultTerm } from '../results/result.model';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface IInvoiceItem {
  feeStructureId: Types.ObjectId;
  feeCategoryId: Types.ObjectId;
  feeCategoryName: string;
  amount: number;
  dueDate?: Date;
  isMandatory: boolean;
}

export interface IInvoice extends Document {
  schoolId: Types.ObjectId;
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  term: ResultTerm;
  invoiceNumber: string;
  items: IInvoiceItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: InvoiceStatus;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema =
  new Schema<IInvoiceItem>(
    {
      feeStructureId: {
        type: Schema.Types.ObjectId,
        ref: 'FeeStructure',
        required: true,
      },

      feeCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCategory',
        required: true,
      },

      feeCategoryName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      dueDate: {
        type: Date,
      },

      isMandatory: {
        type: Boolean,
        default: true,
      },
    },
    {
      _id: false,
    }
  );

const invoiceSchema =
  new Schema<IInvoice>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
      },

      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
      },

      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
      },

      academicSessionId: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSession',
        required: true,
        index: true,
      },

      term: {
        type: String,
        enum: Object.values(ResultTerm),
        required: true,
        index: true,
      },

      invoiceNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      items: {
        type: [invoiceItemSchema],
        required: true,
        validate: {
          validator: (
            value: IInvoiceItem[]
          ) => value.length > 0,
          message:
            'Invoice must contain at least one fee item',
        },
      },

      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      amountPaid: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      balance: {
        type: Number,
        required: true,
        min: 0,
      },

      status: {
        type: String,
        enum: Object.values(InvoiceStatus),
        required: true,
        default: InvoiceStatus.PENDING,
        index: true,
      },

      issuedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

invoiceSchema.index(
  {
    schoolId: 1,
    invoiceNumber: 1,
  },
  {
    unique: true,
  }
);

invoiceSchema.index({
  schoolId: 1,
  studentId: 1,
  academicSessionId: 1,
  term: 1,
});

export const Invoice =
  mongoose.model<IInvoice>(
    'Invoice',
    invoiceSchema
  );