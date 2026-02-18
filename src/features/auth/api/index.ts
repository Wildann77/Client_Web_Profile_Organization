import { get, post } from '@/shared/lib/api';
import type { User } from '@/shared/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await post<AuthResponse>('/auth/login', credentials);
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    return response;
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<User> => {
    return post<User>('/auth/register', credentials);
  },

  // Logout
  logout: async (): Promise<void> => {
    await post('/auth/logout', {});
    localStorage.removeItem('accessToken');
  },

  // Get current user
  me: async (): Promise<User> => {
    return get<User>('/auth/me');
  },

  // Refresh token
  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await post<{ accessToken: string }>('/auth/refresh', {});
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    return response;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    return post('/auth/change-password', data);
  },
};
