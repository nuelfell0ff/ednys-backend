import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface ISchoolPaymentConfig
  extends Document {
  schoolId: Types.ObjectId;
  paystackSubaccountCode?: string;
  paystackAccountName?: string;
  settlementBankCode?: string;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schoolPaymentConfigSchema =
  new Schema<ISchoolPaymentConfig>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        unique: true,
        index: true,
      },
      paystackSubaccountCode: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      paystackAccountName: {
        type: String,
        trim: true,
        maxlength: 150,
      },
      settlementBankCode: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      settlementBankName: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      settlementAccountNumber: {
        type: String,
        trim: true,
        maxlength: 30,
      },
      isEnabled: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export const SchoolPaymentConfig =
  mongoose.model<ISchoolPaymentConfig>(
    'SchoolPaymentConfig',
    schoolPaymentConfigSchema
  );