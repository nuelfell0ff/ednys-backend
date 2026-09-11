import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface ISubject extends Document {
  schoolId: Types.ObjectId;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
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

    code: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
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

subjectSchema.index(
  {
    schoolId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const Subject = mongoose.model<ISubject>(
  'Subject',
  subjectSchema
);