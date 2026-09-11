export interface CreateClassInput {
  academicSessionId: string;
  name: string;
  code?: string;
  level?: string;
  capacity?: number;
}

export interface UpdateClassInput {
  academicSessionId?: string;
  name?: string;
  code?: string;
  level?: string;
  capacity?: number;
  isActive?: boolean;
}