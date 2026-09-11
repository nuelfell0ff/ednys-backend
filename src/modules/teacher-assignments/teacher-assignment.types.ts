export interface CreateTeacherAssignmentInput {
  teacherId: string;
  classId: string;
  subjectId: string;
  academicSessionId: string;
}

export interface UpdateTeacherAssignmentInput {
  isActive?: boolean;
}