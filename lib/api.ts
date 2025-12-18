import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/en/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    axios.post(`${API_BASE_URL}/token/`, { username, password }),
  
  refresh: (refreshToken: string) =>
    axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken }),
  
  verify: (token: string) =>
    axios.post(`${API_BASE_URL}/token/verify/`, { token }),
  
  setTokens: (access: string, refresh: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  },
  
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },
  
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },
};

// Content API
export const contentApi = {
  getAll: () => apiClient.get('/contents/'),
  getById: (id: number) => apiClient.get(`/contents/${id}/`),
  create: (data: any) => apiClient.post('/contents/', data),
  update: (id: number, data: any) => apiClient.put(`/contents/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/contents/${id}/`),
};

// Sponsor API
export const sponsorApi = {
  getAll: () => apiClient.get('/sponsors/'),
  getById: (id: number) => apiClient.get(`/sponsors/${id}/`),
  create: (data: any) => apiClient.post('/sponsors/', data),
  update: (id: number, data: any) => apiClient.put(`/sponsors/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/sponsors/${id}/`),
};

// Organization API
export const organizationApi = {
  getAll: () => apiClient.get('/organizations/'),
  getById: (id: number) => apiClient.get(`/organizations/${id}/`),
  create: (data: any) => apiClient.post('/organizations/', data),
  update: (id: number, data: any) => apiClient.put(`/organizations/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/organizations/${id}/`),
};

// Scholarship API
export const scholarshipApi = {
  getAll: () => apiClient.get('/scholarships/'),
  getById: (id: number) => apiClient.get(`/scholarships/${id}/`),
  create: (data: any) => apiClient.post('/scholarships/', data),
  update: (id: number, data: any) => apiClient.put(`/scholarships/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/scholarships/${id}/`),
};

export default apiClient;
