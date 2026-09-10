export interface RegisterInput {
  schoolName: string;
  schoolEmail?: string;
  schoolPhone?: string;
  schoolAddress?: string;
  schoolCity?: string;
  schoolState?: string;

  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}