import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface ITeacher extends Document {
  schoolId: Types.ObjectId;
  userId: Types.ObjectId;
  employeeNumber?: string;
  qualification?: string;
  phone?: string;
  address?: string;
  dateOfEmployment?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    employeeNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    qualification: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    dateOfEmployment: {
      type: Date,
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


teacherSchema.index(
  {
    schoolId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);


teacherSchema.index(
  {
    schoolId: 1,
    employeeNumber: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

export const Teacher = mongoose.model<ITeacher>(
  'Teacher',
  teacherSchema
);