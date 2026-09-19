import { ResultTerm } from '../results/result.model';
import { InvoiceStatus } from './invoice.model';

export interface CreateInvoiceInput {
  studentId: string;
  academicSessionId: string;
  term: ResultTerm;
}

export interface InvoiceQueryInput {
  studentId?: string;
  academicSessionId?: string;
  term?: ResultTerm;
  status?: InvoiceStatus;
}

export interface CancelInvoiceInput {
  reason?: string;
}