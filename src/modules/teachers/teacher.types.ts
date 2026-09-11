export interface CreateTeacherInput {
  userId: string;
  employeeNumber?: string;
  qualification?: string;
  phone?: string;
  address?: string;
  dateOfEmployment?: string;
}

export interface UpdateTeacherInput {
  employeeNumber?: string;
  qualification?: string;
  phone?: string;
  address?: string;
  dateOfEmployment?: string;
  isActive?: boolean;
}