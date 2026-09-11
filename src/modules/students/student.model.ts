import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export enum StudentGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface IStudent extends Document {
  schoolId: Types.ObjectId;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: StudentGender;
  classId?: Types.ObjectId;
  academicSessionId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    middleName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: Object.values(StudentGender),
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },

    academicSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSession',
      index: true,
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

studentSchema.index(
  {
    schoolId: 1,
    admissionNumber: 1,
  },
  {
    unique: true,
  }
);

export const Student = mongoose.model<IStudent>(
  'Student',
  studentSchema
);