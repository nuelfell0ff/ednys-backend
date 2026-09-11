import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

export interface IAttendance
  extends Document {
  schoolId: Types.ObjectId;
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema =
  new Schema<IAttendance>(
    {
      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
      },

      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
      },

      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
      },

      academicSessionId: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSession',
        required: true,
        index: true,
      },

      date: {
        type: Date,
        required: true,
        index: true,
      },

      status: {
        type: String,
        enum: Object.values(
          AttendanceStatus
        ),
        required: true,
      },

      remarks: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      markedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

attendanceSchema.index(
  {
    schoolId: 1,
    studentId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

attendanceSchema.index({
  schoolId: 1,
  classId: 1,
  academicSessionId: 1,
  date: 1,
});

export const Attendance =
  mongoose.model<IAttendance>(
    'Attendance',
    attendanceSchema
  );