import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export enum ResultTerm {
  FIRST_TERM = 'FIRST_TERM',
  SECOND_TERM = 'SECOND_TERM',
  THIRD_TERM = 'THIRD_TERM',
}

export enum ResultStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface IResult extends Document {
  schoolId: Types.ObjectId;
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  academicSessionId: Types.ObjectId;
  term: ResultTerm;
  firstCA?: number;
  secondCA?: number;
  exam?: number;
  total?: number;
  grade?: string;
  remark?: string;
  status: ResultStatus;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
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

    term: {
      type: String,
      enum: Object.values(ResultTerm),
      required: true,
      index: true,
    },

    firstCA: {
      type: Number,
      min: 0,
      max: 20,
    },

    secondCA: {
      type: Number,
      min: 0,
      max: 20,
    },

    exam: {
      type: Number,
      min: 0,
      max: 60,
    },

    total: {
      type: Number,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      trim: true,
      maxlength: 5,
    },

    remark: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.DRAFT,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index(
  {
    schoolId: 1,
    studentId: 1,
    subjectId: 1,
    academicSessionId: 1,
    term: 1,
  },
  {
    unique: true,
  }
);

resultSchema.index({
  schoolId: 1,
  classId: 1,
  subjectId: 1,
  academicSessionId: 1,
  term: 1,
});

export const Result = mongoose.model<IResult>(
  'Result',
  resultSchema
);