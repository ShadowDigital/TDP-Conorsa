import { apiClient } from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  roles: string[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  isActive?: boolean;
}

export const getUsers = (params?: { limit?: number; offset?: number }) =>
  apiClient.get<User[]>('/usuarios', { params });

export const getUser = (id: string) =>
  apiClient.get<User>(`/usuarios/${id}`);

export const createUser = (data: CreateUserDto) =>
  apiClient.post<User>('/usuarios', data);

export const updateUser = (id: string, data: UpdateUserDto) =>
  apiClient.patch<User>(`/usuarios/${id}`, data);

export const getProfile = (id: string) =>
  apiClient.get<User>(`/usuarios/perfil/${id}`);

export const updateProfile = (id: string, data: UpdateUserDto) =>
  apiClient.patch<User>(`/usuarios/perfil/${id}`, data);

export const deleteUser = (id: string) =>
  apiClient.delete(`/usuarios/${id}`);
