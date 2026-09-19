import { ResultTerm } from '../results/result.model';

export interface CreateFeeStructureInput {
  academicSessionId: string;
  term: ResultTerm;
  classId: string;
  feeCategoryId: string;
  amount: number;
  dueDate?: string;
  isMandatory?: boolean;
}

export interface UpdateFeeStructureInput {
  academicSessionId?: string;
  term?: ResultTerm;
  classId?: string;
  feeCategoryId?: string;
  amount?: number;
  dueDate?: string;
  isMandatory?: boolean;
  isActive?: boolean;
}