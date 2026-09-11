import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface IAcademicSession extends Document {
  schoolId: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const academicSessionSchema =
  new Schema<IAcademicSession>(
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
        maxlength: 50,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

academicSessionSchema.index(
  {
    schoolId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const AcademicSession =
  mongoose.model<IAcademicSession>(
    'AcademicSession',
    academicSessionSchema
  );