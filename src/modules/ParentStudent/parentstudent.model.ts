import mongoose, {
  Document,
  Schema,
  Types,
} from 'mongoose';

export enum ParentStudentRelationship {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
  OTHER = 'OTHER',
}

export interface IParentStudent
  extends Document {
  parentId: Types.ObjectId;
  studentId: Types.ObjectId;
  schoolId: Types.ObjectId;
  relationship: ParentStudentRelationship;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const parentStudentSchema =
  new Schema<IParentStudent>(
    {
      parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Parent',
        required: true,
        index: true,
      },

      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
      },

      schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
      },

      relationship: {
        type: String,
        enum: Object.values(
          ParentStudentRelationship
        ),
        required: true,
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

parentStudentSchema.index(
  {
    schoolId: 1,
    parentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

export const ParentStudent =
  mongoose.model<IParentStudent>(
    'ParentStudent',
    parentStudentSchema
  );