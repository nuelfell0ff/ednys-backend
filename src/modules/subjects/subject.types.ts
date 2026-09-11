export interface CreateSubjectInput {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}