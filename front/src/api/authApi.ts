import { apiClient } from './apiClient';

// ─── Auth endpoints ──────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  token: string;
  roles: string[];
  [key: string]: unknown;
}

export const loginRequest = (credentials: LoginCredentials) =>
  apiClient.post<AuthResponse>('/auth/login', credentials);
