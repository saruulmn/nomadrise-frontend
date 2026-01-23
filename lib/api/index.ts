/**
 * API Module Index
 * 
 * Centralized exports for all API modules.
 * Import from '@/lib/api' in components.
 * 
 * Example usage:
 *   import { authApi, scholarshipApi } from '@/lib/api';
 *   
 *   // Auth operations
 *   await authApi.login({ username, password });
 *   
 *   // Scholarship operations
 *   const scholarships = await scholarshipApi.getAll();
 */

// Base API layer
export { default as api, ApiError, tokenStorage } from './base';
export type { HttpMethod, ApiRequestOptions, ApiResponse } from './base';

// Auth module
export { default as authApi } from './auth';
export {
  login,
  refreshToken,
  verifyToken,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  syncOAuthUser,
  deleteAccount,
  getUserByProvider,
} from './auth';
export type {
  LoginCredentials,
  TokenPair,
  OAuthSyncPayload,
  SyncUserResponse,
  DeleteAccountPayload,
} from './auth';

// User module
export { default as userApi } from './user';
export {
  getCurrentUser,
  getUserById,
  updateProfile,
  getAllUsers,
} from './user';
export type { User, UserProfile, UpdateProfilePayload } from './user';

// Content module
export { default as contentApi } from './content';
export {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from './content';
export type { ContentItem, ContentCreatePayload, ContentUpdatePayload } from './content';

// Scholarship module
export { default as scholarshipApi } from './scholarship';
export {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from './scholarship';
export type {
  Scholarship,
  ScholarshipListResponse,
  ScholarshipCreatePayload,
  ScholarshipUpdatePayload,
  ScholarshipFilters,
} from './scholarship';

// Organization module
export { default as organizationApi } from './organization';
export {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from './organization';
export type {
  Organization,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
} from './organization';

// Sponsor module
export { default as sponsorApi } from './sponsor';
export {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from './sponsor';
export type { Sponsor, SponsorCreatePayload, SponsorUpdatePayload } from './sponsor';
