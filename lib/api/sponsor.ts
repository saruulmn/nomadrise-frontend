/**
 * Sponsor API Module
 * 
 * Handles sponsor-related API calls:
 * - CRUD operations for sponsors
 */

import api from './base';

// ============================================================================
// Types
// ============================================================================

export interface Sponsor {
  id?: number;
  url: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  tier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorCreatePayload {
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  tier?: string;
}

export type SponsorUpdatePayload = Partial<SponsorCreatePayload>;

// ============================================================================
// Sponsor Operations
// ============================================================================

/**
 * Get all sponsors
 */
export async function getAllSponsors(): Promise<Sponsor[]> {
  const response = await api.get<Sponsor[]>('/sponsors/', { skipAuth: true });
  return response.data;
}

/**
 * Get sponsor by ID
 */
export async function getSponsorById(id: number): Promise<Sponsor> {
  const response = await api.get<Sponsor>(`/sponsors/${id}/`, { skipAuth: true });
  return response.data;
}

/**
 * Create new sponsor
 */
export async function createSponsor(data: SponsorCreatePayload): Promise<Sponsor> {
  const response = await api.post<Sponsor>('/sponsors/', data);
  return response.data;
}

/**
 * Update sponsor
 */
export async function updateSponsor(id: number, data: SponsorUpdatePayload): Promise<Sponsor> {
  const response = await api.put<Sponsor>(`/sponsors/${id}/`, data);
  return response.data;
}

/**
 * Delete sponsor
 */
export async function deleteSponsor(id: number): Promise<void> {
  await api.delete(`/sponsors/${id}/`);
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const sponsorApi = {
  getAll: getAllSponsors,
  getById: getSponsorById,
  create: createSponsor,
  update: updateSponsor,
  delete: deleteSponsor,
};

export default sponsorApi;
