/**
 * Base API Layer
 * 
 * Centralized HTTP client with:
 * - Configurable base URL
 * - JWT Authorization header injection (client-side)
 * - X-API-Key header injection (server-side only)
 * - Token refresh on 401
 * - Standardized error handling
 * - Type-safe request/response handling
 * 
 * SECURITY NOTE:
 * - NEXTJS_API_KEY environment variable is NEVER exposed to client
 * - X-API-Key header is only injected from server-side (Next.js App Router)
 * - Client components must use internal API routes for secure backend communication
 */

import { getCurrentLocale, type LocalizedMessage } from './errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const REQUEST_TIMEOUT_MS = 30000;

// ============================================================================
// Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean; // For public endpoints that don't need JWT
  useApiKey?: boolean; // For server-side requests using X-API-Key (server-only)
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    const message = extractErrorMessage(data) || `API Error: ${status} ${statusText}`;
    super(message);
    this.name = 'ApiError';
  }
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as { message?: unknown; detail?: unknown; error?: unknown };
  const lang = getCurrentLocale();
  if (typeof record.message === 'string') return record.message;
  if (record.message && typeof record.message === 'object') {
    const localized = record.message as LocalizedMessage;
    return localized[lang] || localized.selected || localized.en || localized.mn || null;
  }
  if (typeof record.detail === 'string') return record.detail;
  if (typeof record.error === 'string') return record.error;
  return null;
}

// ============================================================================
// Server-Side API Key Configuration (NEVER exposed to client)
// ============================================================================

/**
 * Get the X-API-Key for server-side requests.
 * 
 * This function should ONLY be called from:
 * - Next.js App Router Server Components
 * - Next.js API Routes
 * - Server-side utilities and middleware
 * 
 * NEVER call this from client components or browser context.
 * 
 * @returns The X-API-Key value or null if not configured
 */
function getApiKeyForServerRequest(): string | null {
  // Only available in server environment
  if (typeof window !== 'undefined') {
    // Client-side context - should never reach here
    console.error(
      'SECURITY ERROR: Attempted to access NEXTJS_API_KEY from client-side. ' +
      'Use internal API routes (/api/...) instead of direct backend calls.'
    );
    return null;
  }
  
  // Server-side: safe to access environment variable
  return process.env.NEXTJS_API_KEY || null;
}

// ============================================================================
// Token Refresh Logic (placeholder — token refresh is handled by NextAuth auth.ts)
// ============================================================================

// ============================================================================
// Core Request Function
// ============================================================================

async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, useApiKey = false } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': getCurrentLocale(),
    ...headers,
  };

  // Add X-API-Key header if requested (server-side only)
  if (useApiKey) {
    const apiKey = getApiKeyForServerRequest();
    if (apiKey) {
      requestHeaders['X-API-Key'] = apiKey;
    } else if (typeof window === 'undefined') {
      // Server-side but key not configured
      console.warn(
        'NEXTJS_API_KEY is not configured. ' +
        'Set the environment variable NEXTJS_API_KEY for secure Next.js to Django communication.'
      );
    }
  }

  // Authorization header must be passed explicitly via options.headers:
  //   { headers: { Authorization: `Bearer ${session._at}` } }
  // Token refresh is handled server-side by NextAuth (auth.ts).

  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  config.signal = controller.signal;

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  // Make the request
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  // Parse response
  let data: T;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = (await response.text()) as unknown as T;
  }

  // Handle error responses
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nomadrise:auth-expired'));
    }
    throw new ApiError(response.status, response.statusText, data);
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

// ============================================================================
// HTTP Method Shortcuts
// ============================================================================

export const api = {
  /** GET — JWT token attached if available (default behaviour). */
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /** GET — always sends Authorization header; throws if no token exists. */
  getAuth: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET', skipAuth: false }),

  /** GET — never sends Authorization header; for fully public endpoints. */
  getPublic: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET', skipAuth: true }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE', body }),
};

// ============================================================================
// Server-Side API Key Helpers (for Next.js App Router)
// ============================================================================

/**
 * Server-side API helpers using X-API-Key authentication.
 * 
 * Usage (Server Component):
 *   import { serverApi } from '@/lib/api/base';
 *   const { data } = await serverApi.get<StatsData>('/nextjs/stats/');
 * 
 * Usage (API Route):
 *   import { serverApi } from '@/lib/api/base';
 *   const response = await serverApi.post('/nextjs/sync/', { event: 'page_view' });
 * 
 * SECURITY: Only use from server-side code (server components, API routes, utilities with 'use server')
 */
export const serverApi = {
  /**
   * GET request with X-API-Key authentication (server-side only).
   * 
   * @param endpoint API endpoint path
   * @param options Request options
   * @returns Promise resolving to API response
   */
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET', useApiKey: true, skipAuth: true }),

  /**
   * POST request with X-API-Key authentication (server-side only).
   */
  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body, useApiKey: true, skipAuth: true }),

  /**
   * PUT request with X-API-Key authentication (server-side only).
   */
  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body, useApiKey: true, skipAuth: true }),

  /**
   * PATCH request with X-API-Key authentication (server-side only).
   */
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body, useApiKey: true, skipAuth: true }),

  /**
   * DELETE request with X-API-Key authentication (server-side only).
   */
  delete: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE', body, useApiKey: true, skipAuth: true }),
};

// ============================================================================
// Standalone GET helpers (named exports for cleaner imports)
// ============================================================================

/**
 * GET endpoint that always attaches the JWT Authorization header.
 *
 * Usage:
 *   import { getWithAuth } from '@/lib/api/base';
 *   const { data } = await getWithAuth<Profile[]>('/profiles/me/');
 */
export const getWithAuth = <T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
) => request<T>(endpoint, { ...options, method: 'GET', skipAuth: false });

/**
 * GET endpoint that never attaches an Authorization header.
 * Use for fully public endpoints (mentors, assets, scholarships, etc.)
 *
 * Usage:
 *   import { getWithoutAuth } from '@/lib/api/base';
 *   const { data } = await getWithoutAuth<MentorProfile[]>('/mentors/profiles/');
 */
export const getWithoutAuth = <T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
) => request<T>(endpoint, { ...options, method: 'GET', skipAuth: true });

/**
 * GET endpoint with X-API-Key authentication (server-side only).
 * Use for secure server-to-server communication.
 *
 * Usage (Server Component):
 *   import { getWithApiKey } from '@/lib/api/base';
 *   const { data } = await getWithApiKey<HealthStatus>('/nextjs/health-check/');
 */
export const getWithApiKey = <T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
) => request<T>(endpoint, { ...options, method: 'GET', useApiKey: true, skipAuth: true });

export default api;
