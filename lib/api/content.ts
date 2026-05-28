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
  id?: string;
  key: string;
  title: string;
  body_en: string;
  body_mn: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentCreatePayload {
  key: string;
  title: string;
  body_en: string;
  body_mn: string;
  is_active?: boolean;
}

export interface ContentUpdatePayload {
  key?: string;
  title?: string;
  body_en?: string;
  body_mn?: string;
  is_active?: boolean;
}

type ListResponse<T> = T[] | { results?: T[] };

function unwrapList<T>(data: ListResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  return Array.isArray(data.results) ? data.results : [];
}

// ============================================================================
// Content Operations
// ============================================================================

/**
 * Get all content items
 */
export async function getAllContent(): Promise<ContentItem[]> {
  const response = await api.get<ListResponse<ContentItem>>('/content-blocks/', { skipAuth: true });
  return unwrapList(response.data);
}

/**
 * Get content item by ID
 */
export async function getContentById(id: string): Promise<ContentItem> {
  const response = await api.get<ContentItem>(`/content-blocks/${id}/`, { skipAuth: true });
  return response.data;
}

/**
 * Create new content item
 */
export async function createContent(data: ContentCreatePayload): Promise<ContentItem> {
  const response = await api.post<ContentItem>('/content-blocks/', data);
  return response.data;
}

/**
 * Update content item
 */
export async function updateContent(id: string, data: ContentUpdatePayload): Promise<ContentItem> {
  const response = await api.put<ContentItem>(`/content-blocks/${id}/`, data);
  return response.data;
}

/**
 * Delete content item
 */
export async function deleteContent(id: string): Promise<void> {
  await api.delete(`/content-blocks/${id}/`);
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
