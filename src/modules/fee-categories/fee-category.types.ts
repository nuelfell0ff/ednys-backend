export interface CreateFeeCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateFeeCategoryInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}