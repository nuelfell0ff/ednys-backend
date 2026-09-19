import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export enum PaymentMethod {
  PAYSTACK = 'PAYSTACK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  POS = 'POS',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface IPayment extends Document {
  schoolId: Types.ObjectId;
  invoiceId: Types.ObjectId;
  studentId: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  platformFeePercentage?: number;
  platformFeeAmount?: number;
  schoolAmount?: number;
  paidAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema =
  new Schema<IPayment>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
      },
      invoiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true,
        index: true,
      },
      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        required: true,
        default: PaymentStatus.PENDING,
        index: true,
      },
      reference: {
        type: String,
        trim: true,
        maxlength: 150,
      },
      platformFeePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      platformFeeAmount: {
        type: Number,
        min: 0,
      },
      schoolAmount: {
        type: Number,
        min: 0,
      },
      paidAt: {
        type: Date,
      },
      metadata: {
        type: Schema.Types.Mixed,
      },
    },
    {
      timestamps: true,
    }
  );

paymentSchema.index(
  {
    schoolId: 1,
    reference: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

paymentSchema.index({
  schoolId: 1,
  invoiceId: 1,
  createdAt: -1,
});

export const Payment =
  mongoose.model<IPayment>(
    'Payment',
    paymentSchema
  );