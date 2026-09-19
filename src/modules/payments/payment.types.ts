import {
  PaymentMethod,
  PaymentStatus,
} from './payment.model';

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
}

export interface PaymentQueryInput {
  invoiceId?: string;
  studentId?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
}