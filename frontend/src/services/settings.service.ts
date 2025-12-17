import apiClient from './api';
import type { SystemSettings, ApiResponse } from '../types';

export const settingsService = {
    get: async () => {
        const response = await apiClient.get<ApiResponse<SystemSettings>>('/settings');
        return response.data;
    },

    getPublic: async () => {
        const response = await apiClient.get<ApiResponse<SystemSettings>>('/settings/public');
        return response.data;
    },

    update: async (settings: SystemSettings) => {
        const response = await apiClient.post<ApiResponse>('/settings', settings);
        return response.data;
    },

    uploadLogo: async (formData: FormData) => {
        const response = await apiClient.post<ApiResponse>('/settings/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
