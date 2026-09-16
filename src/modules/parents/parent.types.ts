export interface CreateParentInput {
  userId: string;
  phone?: string;
  address?: string;
  occupation?: string;
}

export interface UpdateParentInput {
  phone?: string;
  address?: string;
  occupation?: string;
  isActive?: boolean;
}