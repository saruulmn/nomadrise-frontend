/**
 * Content API Module
 * 
 * Handles content-related API calls:
 * - CRUD operations for content items
 */

import api from './base';

// ============================================================================
// Types
// ============================================================================

export interface ContentItem {
  id?: number;
  url: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentCreatePayload {
  url: string;
  title: string;
  description: string;
}

export interface ContentUpdatePayload {
  url?: string;
  title?: string;
  description?: string;
}

// ============================================================================
// Content Operations
// ============================================================================

/**
 * Get all content items
 */
export async function getAllContent(): Promise<ContentItem[]> {
  const response = await api.get<ContentItem[]>('/contents/', { skipAuth: true });
  return response.data;
}

/**
 * Get content item by ID
 */
export async function getContentById(id: number): Promise<ContentItem> {
  const response = await api.get<ContentItem>(`/contents/${id}/`, { skipAuth: true });
  return response.data;
}

/**
 * Create new content item
 */
export async function createContent(data: ContentCreatePayload): Promise<ContentItem> {
  const response = await api.post<ContentItem>('/contents/', data);
  return response.data;
}

/**
 * Update content item
 */
export async function updateContent(id: number, data: ContentUpdatePayload): Promise<ContentItem> {
  const response = await api.put<ContentItem>(`/contents/${id}/`, data);
  return response.data;
}

/**
 * Delete content item
 */
export async function deleteContent(id: number): Promise<void> {
  await api.delete(`/contents/${id}/`);
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const contentApi = {
  getAll: getAllContent,
  getById: getContentById,
  create: createContent,
  update: updateContent,
  delete: deleteContent,
};

export default contentApi;
