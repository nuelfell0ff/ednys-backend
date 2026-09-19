import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

import { ResultTerm } from '../results/result.model';

export interface IFeeStructure extends Document {
  schoolId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  term: ResultTerm;
  classId: Types.ObjectId;
  feeCategoryId: Types.ObjectId;
  amount: number;
  dueDate?: Date;
  isMandatory: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feeStructureSchema =
  new Schema<IFeeStructure>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
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

      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
      },

      feeCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCategory',
        required: true,
        index: true,
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

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

feeStructureSchema.index(
  {
    schoolId: 1,
    academicSessionId: 1,
    term: 1,
    classId: 1,
    feeCategoryId: 1,
  },
  {
    unique: true,
  }
);

export const FeeStructure =
  mongoose.model<IFeeStructure>(
    'FeeStructure',
    feeStructureSchema
  );