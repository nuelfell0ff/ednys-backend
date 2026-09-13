import {
  ResultTerm,
} from './result.model';

export interface CreateResultInput {
  studentId: string;
  classId: string;
  subjectId: string;
  academicSessionId: string;
  term: ResultTerm;
  firstCA?: number;
  secondCA?: number;
  exam?: number;
  remark?: string;
}

export interface UpdateResultInput {
  firstCA?: number;
  secondCA?: number;
  exam?: number;
  remark?: string;
}