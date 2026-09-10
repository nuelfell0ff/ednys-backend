import { UserRole } from '../modules/users/user.model';

export interface AuthenticatedUser {
  userId: string;
  schoolId: string;
  role: UserRole;
}