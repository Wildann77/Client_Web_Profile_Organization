import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';
import type { UserFilters, CreateUserInput, UpdateUserInput } from '../api';
import { toast } from 'sonner';

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
        onError: (error: any) => {
            toast.error(error.message || 'Gagal menambahkan pengguna');
        },
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
        onError: (error: any) => {
            toast.error(error.message || 'Gagal memperbarui pengguna');
        },
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
        onError: (error: any) => {
            toast.error(error.message || 'Gagal mengubah status pengguna');
        },
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
        onError: (error: any) => {
            toast.error(error.message || 'Gagal menghapus pengguna');
        },
    });
};
