/**
 * User API Module
 * 
 * Handles user account-related API calls:
 * - User profile operations
 * - Account settings
 * - User preferences
 */

import api from './base';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: number;
  email: string;
  full_name?: string;
  profile_image_url?: string;
  provider?: string;
  provider_user_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  user: User;
  preferences?: Record<string, unknown>;
}

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
}

// ============================================================================
// User Profile Operations
// ============================================================================

/**
 * Get current authenticated user's profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/users/me/');
  return response.data;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}/`);
  return response.data;
}

/**
 * Update user profile
 */
export async function updateProfile(id: number, data: UpdateProfilePayload): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/`, data);
  return response.data;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users/');
  return response.data;
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const userApi = {
  getCurrentUser,
  getUserById,
  updateProfile,
  getAllUsers,
};

export default userApi;
