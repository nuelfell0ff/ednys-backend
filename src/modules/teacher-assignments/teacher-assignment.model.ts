import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface ITeacherAssignment
  extends Document {
  schoolId: Types.ObjectId;
  teacherId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teacherAssignmentSchema =
  new Schema<ITeacherAssignment>(
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

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

teacherAssignmentSchema.index(
  {
    schoolId: 1,
    teacherId: 1,
    classId: 1,
    subjectId: 1,
    academicSessionId: 1,
  },
  {
    unique: true,
  }
);

export const TeacherAssignment =
  mongoose.model<ITeacherAssignment>(
    'TeacherAssignment',
    teacherAssignmentSchema
  );