import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface IAssignment
  extends Document {
  schoolId: Types.ObjectId;
  teacherId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  title: string;
  instructions?: string;
  dueDate: Date;
  isPublished: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema =
  new Schema<IAssignment>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
      },

      teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
        index: true,
      },

      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
      },

      subjectId: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true,
      },

      academicSessionId: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSession',
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      instructions: {
        type: String,
        trim: true,
        maxlength: 5000,
      },

      dueDate: {
        type: Date,
        required: true,
      },

      isPublished: {
        type: Boolean,
        default: false,
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

assignmentSchema.index({
  schoolId: 1,
  teacherId: 1,
  classId: 1,
  subjectId: 1,
  academicSessionId: 1,
});

assignmentSchema.index({
  schoolId: 1,
  classId: 1,
  academicSessionId: 1,
  dueDate: 1,
});

export const Assignment =
  mongoose.model<IAssignment>(
    'Assignment',
    assignmentSchema
  );