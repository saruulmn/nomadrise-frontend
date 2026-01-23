/**
 * Scholarship API Module
 * 
 * Handles scholarship-related API calls:
 * - CRUD operations for scholarships
 * - Filtering and search
 */

import api from './base';

// ============================================================================
// Types
// ============================================================================

export interface Scholarship {
  id?: number;
  url: string;
  org: string;
  org_name: string;
  title: string;
  description: string;
  study_level: string;
  field_of_study: string;
  coverage: string;
  amount: string;
  currency: string;
  application_open_at: string;
  application_close_at: string;
  application_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ScholarshipListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Scholarship[];
}

export interface ScholarshipCreatePayload {
  url: string;
  org: string;
  title: string;
  description: string;
  study_level: string;
  field_of_study: string;
  coverage: string;
  amount: string;
  currency: string;
  application_open_at: string;
  application_close_at: string;
  application_url: string;
  is_active?: boolean;
}

export type ScholarshipUpdatePayload = Partial<ScholarshipCreatePayload>;

export interface ScholarshipFilters {
  study_level?: string;
  field_of_study?: string;
  is_active?: boolean;
  search?: string;
}

// ============================================================================
// Scholarship Operations
// ============================================================================

/**
 * Get all scholarships (supports pagination)
 */
export async function getAllScholarships(
  filters?: ScholarshipFilters
): Promise<Scholarship[]> {
  let endpoint = '/scholarships/';
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.study_level) params.append('study_level', filters.study_level);
    if (filters.field_of_study) params.append('field_of_study', filters.field_of_study);
    if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
  }
  
  const response = await api.get<Scholarship[] | ScholarshipListResponse>(endpoint, { skipAuth: true });
  
  // Handle both paginated and non-paginated responses
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.results || [];
}

/**
 * Get scholarship by ID
 */
export async function getScholarshipById(id: number): Promise<Scholarship> {
  const response = await api.get<Scholarship>(`/scholarships/${id}/`, { skipAuth: true });
  return response.data;
}

/**
 * Create new scholarship
 */
export async function createScholarship(data: ScholarshipCreatePayload): Promise<Scholarship> {
  const response = await api.post<Scholarship>('/scholarships/', data);
  return response.data;
}

/**
 * Update scholarship
 */
export async function updateScholarship(
  id: number,
  data: ScholarshipUpdatePayload
): Promise<Scholarship> {
  const response = await api.put<Scholarship>(`/scholarships/${id}/`, data);
  return response.data;
}

/**
 * Delete scholarship
 */
export async function deleteScholarship(id: number): Promise<void> {
  await api.delete(`/scholarships/${id}/`);
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const scholarshipApi = {
  getAll: getAllScholarships,
  getById: getScholarshipById,
  create: createScholarship,
  update: updateScholarship,
  delete: deleteScholarship,
};

export default scholarshipApi;
