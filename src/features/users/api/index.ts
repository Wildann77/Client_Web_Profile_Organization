import { get, post, patch, del } from '@/shared/lib/api';
import type { UserRole } from '@/shared/types';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserFilters {
    role?: UserRole;
    isActive?: boolean;
    search?: string;
}

export interface CreateUserInput {
    email: string;
    name: string;
    role: UserRole;
    password: string;
}

export interface UpdateUserInput {
    email?: string;
    name?: string;
    role?: UserRole;
    password?: string;
}

export const usersApi = {
    // Get all users (Admin)
    getAll: async (filters?: UserFilters): Promise<User[]> => {
        return get<User[]>('/users', filters as Record<string, unknown>);
    },

    // Create user
    create: async (data: CreateUserInput): Promise<User> => {
        return post<User>('/users', data);
    },

    // Update user
    update: async (id: string, data: UpdateUserInput): Promise<User> => {
        return patch<User>(`/users/${id}`, data);
    },

    // Toggle status
    toggleStatus: async (id: string, isActive: boolean): Promise<User> => {
        return patch<User>(`/users/${id}/status`, { isActive });
    },

    // Delete user
    delete: async (id: string): Promise<void> => {
        return del(`/users/${id}`);
    },
};
