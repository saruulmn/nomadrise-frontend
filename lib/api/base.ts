/**
 * Base API Layer
 * 
 * Centralized HTTP client with:
 * - Configurable base URL
 * - JWT Authorization header injection
 * - Token refresh on 401
 * - Standardized error handling
 * - Type-safe request/response handling
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
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add JWT Authorization header if not skipped
  if (!skipAuth) {
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
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

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
// Token Management Exports (for auth module)
// ============================================================================

export const tokenStorage = TokenStorage;

export default api;
