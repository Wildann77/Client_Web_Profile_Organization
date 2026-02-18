import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api';
import type { Setting } from '@/shared/types';

const ADMIN_QUERY_KEY = ['settings', 'admin'];
const PUBLIC_QUERY_KEY = ['settings', 'public'];

// ── Public hooks ────────────────────────────────────────────────────────────

export const usePublicSettings = () => {
    return useQuery({
        queryKey: PUBLIC_QUERY_KEY,
        queryFn: settingsApi.getPublic,
        staleTime: 60 * 1000, // 1 menit agar lebih responsif saat development
    });
};

/** Ambil nilai satu setting berdasarkan key. Mengembalikan string kosong jika belum ada. */
export const useSetting = (key: string): string => {
    const { data } = usePublicSettings();
    return data?.find((s: Setting) => s.key === key)?.value ?? '';
};

// ── Admin hooks ──────────────────────────────────────────────────────────────

export const useAdminSettings = () => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEY,
        queryFn: settingsApi.getAll,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ key, value }: { key: string; value: string }) =>
            settingsApi.update(key, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PUBLIC_QUERY_KEY });
        },
    });
};

export const useUpdateBulkSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: Record<string, string>) =>
            settingsApi.updateBulk(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PUBLIC_QUERY_KEY });
        },
    });
};

