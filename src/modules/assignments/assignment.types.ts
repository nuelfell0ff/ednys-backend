export interface CreateAssignmentInput {
  classId: string;
  subjectId: string;
  academicSessionId: string;
  title: string;
  instructions?: string;
  dueDate: string;
  isPublished?: boolean;
}

export interface UpdateAssignmentInput {
  title?: string;
  instructions?: string;
  dueDate?: string;
  isPublished?: boolean;
  isActive?: boolean;
}