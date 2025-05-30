import { UserResponseDto } from '../dto';
import { UserRole } from '../entities/user.entity';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  avatar?: string;
}

export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  role?: UserRole;
}

export interface UpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
}

export interface LoginUser {
  email: string;
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