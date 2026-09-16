export interface CreateParentStudentInput {
  parentId: string;
  studentId: string;
  relationship:
    | 'FATHER'
    | 'MOTHER'
    | 'GUARDIAN'
    | 'OTHER';
}

export interface UpdateParentStudentInput {
  relationship?:
    | 'FATHER'
    | 'MOTHER'
    | 'GUARDIAN'
    | 'OTHER';
  isActive?: boolean;
}