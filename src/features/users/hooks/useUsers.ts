import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api';
import type { UserFilters, CreateUserInput, UpdateUserInput } from '../api';
import { createMutationErrorHandler } from '@/shared/lib/errorHandler';

export const USER_QUERY_KEY = ['admin', 'users'];

export const useAdminUsers = (filters?: UserFilters) => {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, filters],
        queryFn: () => usersApi.getAll(filters),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserInput) => usersApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
            toast.success('Pengguna berhasil ditambahkan');
        },
        onError: createMutationErrorHandler({
            fallbackMessage: 'Gagal menambahkan pengguna',
            context: 'useCreateUser',
        }),
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
            usersApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
            toast.success('Pengguna berhasil diperbarui');
        },
        onError: createMutationErrorHandler({
            fallbackMessage: 'Gagal memperbarui pengguna',
            context: 'useUpdateUser',
        }),
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            usersApi.toggleStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
            toast.success('Status pengguna diperbarui');
        },
        onError: createMutationErrorHandler({
            fallbackMessage: 'Gagal mengubah status pengguna',
            context: 'useToggleUserStatus',
        }),
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
            toast.success('Pengguna berhasil dihapus');
        },
        onError: createMutationErrorHandler({
            fallbackMessage: 'Gagal menghapus pengguna',
            context: 'useDeleteUser',
        }),
    });
};
