import { get, patch } from '@/shared/lib/api';
import type { Setting } from '@/shared/types';

export const settingsApi = {
    // Get all settings (admin)
    getAll: (): Promise<Setting[]> => get<Setting[]>('/settings'),

    // Get public settings only
    getPublic: (): Promise<Setting[]> => get<Setting[]>('/settings/public'),

    // Update single setting
    update: (key: string, value: string): Promise<Setting> =>
        patch<Setting>(`/settings/${key}`, { value }),

    // Update multiple settings at once
    updateBulk: (settings: Record<string, string>): Promise<Setting[]> =>
        patch<Setting[]>('/settings', { settings }),
};
