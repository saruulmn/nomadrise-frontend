/**
 * Organization API Module
 * 
 * Handles organization-related API calls:
 * - CRUD operations for organizations
 */

import api from './base';

// ============================================================================
// Types
// ============================================================================

export interface Organization {
  id?: number;
  url: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationCreatePayload {
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
}

export type OrganizationUpdatePayload = Partial<OrganizationCreatePayload>;

// ============================================================================
// Organization Operations
// ============================================================================

/**
 * Get all organizations
 */
export async function getAllOrganizations(): Promise<Organization[]> {
  const response = await api.get<Organization[]>('/organizations/', { skipAuth: true });
  return response.data;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: number): Promise<Organization> {
  const response = await api.get<Organization>(`/organizations/${id}/`, { skipAuth: true });
  return response.data;
}

/**
 * Create new organization
 */
export async function createOrganization(data: OrganizationCreatePayload): Promise<Organization> {
  const response = await api.post<Organization>('/organizations/', data);
  return response.data;
}

/**
 * Update organization
 */
export async function updateOrganization(
  id: number,
  data: OrganizationUpdatePayload
): Promise<Organization> {
  const response = await api.put<Organization>(`/organizations/${id}/`, data);
  return response.data;
}

/**
 * Delete organization
 */
export async function deleteOrganization(id: number): Promise<void> {
  await api.delete(`/organizations/${id}/`);
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const organizationApi = {
  getAll: getAllOrganizations,
  getById: getOrganizationById,
  create: createOrganization,
  update: updateOrganization,
  delete: deleteOrganization,
};

export default organizationApi;
