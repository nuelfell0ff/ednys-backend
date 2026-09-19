import mongoose, {
  Document,
  Schema,
} from 'mongoose';

export interface IPlatformPaymentConfig
  extends Document {
  platformFeePercentage: number;
  platformFeeFixed: number;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const platformPaymentConfigSchema =
  new Schema<IPlatformPaymentConfig>(
    {
      platformFeePercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      platformFeeFixed: {
        type: Number,
        min: 0,
        default: 0,
      },
      isEnabled: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const PlatformPaymentConfig =
  mongoose.model<IPlatformPaymentConfig>(
    'PlatformPaymentConfig',
    platformPaymentConfigSchema
  );