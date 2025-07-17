import { UserResponseDto } from "@users";
import { UserRole } from "@enums";

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age?: number;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  avatar?: string;
}

export interface UpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
}

export interface LoginUser {
  userName: string;
  password: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

export interface PaginatedUsers {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
