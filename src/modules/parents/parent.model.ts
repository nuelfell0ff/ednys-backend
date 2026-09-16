import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export interface IParent extends Document {
  userId: Types.ObjectId;
  schoolId: Types.ObjectId;
  phone?: string;
  address?: string;
  occupation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const parentSchema = new Schema<IParent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
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

    occupation: {
      type: String,
      trim: true,
      maxlength: 100,
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

parentSchema.index(
  {
    schoolId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export const Parent = mongoose.model<IParent>(
  'Parent',
  parentSchema
);