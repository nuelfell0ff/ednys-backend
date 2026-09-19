import { UserRole } from './user.model';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}