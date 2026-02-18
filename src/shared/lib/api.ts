import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success && response.data.data) {
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          if (originalRequest.headers) {
            if (typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
            } else {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Generic API functions
export const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url, { params });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};

export const post = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.post<ApiResponse<T>>(url, data);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};

export const patch = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.patch<ApiResponse<T>>(url, data);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};

export const put = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.put<ApiResponse<T>>(url, data);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};

export const del = async <T>(url: string): Promise<T> => {
  const response = await api.delete<ApiResponse<T>>(url);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};
