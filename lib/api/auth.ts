/**
 * Auth API Module
 * 
 * Handles all authentication-related API calls:
 * - JWT token operations (login, refresh, verify)
 * - OAuth user sync with Django backend
 * - User account deletion
 * - Token storage management
 */

import api, { ApiError } from './base';

// ============================================================================
// Types
// ============================================================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface OAuthSyncPayload {
  email: string | null | undefined;
  name: string | null | undefined;
  image: string | null | undefined;
  provider: string;
  provider_account_id: string;
}

export interface SyncUserResponse {
  user_id: number;
  email: string;
  created: boolean;
}

export interface DeleteAccountPayload {
  email: string | null | undefined;
  provider: string;
  provider_account_id: string;
}

// ============================================================================
// JWT Authentication
// ============================================================================

/**
 * Login with username/password to get JWT tokens
 */
export async function login(credentials: LoginCredentials): Promise<TokenPair> {
  const response = await api.post<TokenPair>('/token/', credentials, { skipAuth: true });
  return response.data;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await api.post<{ access: string }>(
    '/token/refresh/',
    { refresh },
    { skipAuth: true }
  );
  return response.data;
}

/**
 * Verify if a token is valid
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await api.post('/token/verify/', { token }, { skipAuth: true });
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return false;
    }
    throw error;
  }
}

// ============================================================================
// OAuth Backend Sync
// ============================================================================

/**
 * Sync OAuth user to Django backend
 * Called after successful OAuth sign-in (Google/Facebook/Apple)
 */
export async function syncOAuthUser(payload: OAuthSyncPayload): Promise<SyncUserResponse> {
  const response = await api.post<SyncUserResponse>('/auth/sync/', payload, { skipAuth: true });
  return response.data;
}

/**
 * Delete user account and all associated data
 * Called from data deletion page for GDPR/Meta compliance
 */
export async function deleteAccount(payload: DeleteAccountPayload): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>('/auth/delete/', payload, { skipAuth: true });
  return response.data;
}

/**
 * Get user info from Django backend by provider info
 */
export async function getUserByProvider(
  provider: string,
  providerAccountId: string
): Promise<SyncUserResponse | null> {
  try {
    const response = await api.get<SyncUserResponse>(
      `/auth/user/?provider=${provider}&provider_account_id=${providerAccountId}`,
      { skipAuth: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const authApi = {
  // JWT operations
  login,
  refreshToken,
  verifyToken,
  
  // OAuth operations
  syncOAuthUser,
  deleteAccount,
  getUserByProvider,
};

export default authApi;
