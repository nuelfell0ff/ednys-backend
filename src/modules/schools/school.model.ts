import mongoose, { Document, Schema } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  slug: string;
  subdomain: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },

    subdomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 63,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: 'Nigeria',
      trim: true,
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

export const School = mongoose.model<ISchool>('School', schoolSchema);