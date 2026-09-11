export interface CreateAcademicSessionInput {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateAcademicSessionInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}