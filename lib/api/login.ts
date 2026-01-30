/**
 * Login API Module
 * Handles email/password authentication
 */

import api from './base';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
  };
}

/**
 * Login with email and password
 * Returns JWT tokens and user info
 */
export async function loginWithEmail(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/', payload, {
    skipAuth: true,
  });
  return response.data;
}
