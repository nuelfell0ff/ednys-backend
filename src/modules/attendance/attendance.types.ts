import { AttendanceStatus } from './attendance.model';

export interface CreateAttendanceInput {
  studentId: string;
  classId: string;
  academicSessionId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendanceInput {
  status?: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceInput {
  classId: string;
  academicSessionId: string;
  date: string;
  records: BulkAttendanceRecordInput[];
}