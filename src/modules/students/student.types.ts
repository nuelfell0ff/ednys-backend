export interface CreateStudentInput {
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  classId?: string;
  academicSessionId?: string;
}

export interface UpdateStudentInput {
  admissionNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  classId?: string;
  academicSessionId?: string;
  isActive?: boolean;
}