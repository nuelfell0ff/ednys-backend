export interface CreatePlatformPaymentConfigInput {
  platformFeePercentage?: number;
  platformFeeFixed?: number;
  isEnabled?: boolean;
}

export interface UpdatePlatformPaymentConfigInput {
  platformFeePercentage?: number;
  platformFeeFixed?: number;
  isEnabled?: boolean;
}