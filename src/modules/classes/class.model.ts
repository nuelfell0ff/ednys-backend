import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface IClass extends Document {
  schoolId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  name: string;
  code?: string;
  level?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
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

    level: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    capacity: {
      type: Number,
      min: 1,
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

classSchema.index(
  {
    schoolId: 1,
    academicSessionId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const Class = mongoose.model<IClass>(
  'Class',
  classSchema
);