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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
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
// Token Management (client-side only)
// ============================================================================

const TokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setTokens: (access: string, refresh: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// ============================================================================
// Token Refresh Logic
// ============================================================================

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = TokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    TokenStorage.setTokens(data.access, refreshToken);
    return data.access;
  } catch {
    TokenStorage.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/en/login';
    }
    return null;
  }
};

// ============================================================================
// Core Request Function
// ============================================================================

async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, skipAuth = false, useApiKey = false } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
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

  // Add JWT Authorization header if not skipped and not using API key
  if (!skipAuth && !useApiKey) {
    const token = TokenStorage.getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  // Make the request
  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 - Token expired
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        onTokenRefreshed(newToken);
        // Retry with new token
        requestHeaders['Authorization'] = `Bearer ${newToken}`;
        config.headers = requestHeaders;
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      }
    } else {
      // Wait for token refresh to complete
      await new Promise<void>((resolve) => {
        subscribeToTokenRefresh((token) => {
          requestHeaders['Authorization'] = `Bearer ${token}`;
          resolve();
        });
      });
      config.headers = requestHeaders;
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    }
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

// ============================================================================
// Token Management Exports (for auth module)
// ============================================================================

export const tokenStorage = TokenStorage;

export default api;
