import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface IFeeCategory extends Document {
  schoolId: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feeCategorySchema = new Schema<IFeeCategory>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 250,
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

feeCategorySchema.index(
  {
    schoolId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const FeeCategory =
  mongoose.model<IFeeCategory>(
    'FeeCategory',
    feeCategorySchema
  );