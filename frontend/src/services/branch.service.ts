import apiClient from './api';
import type { Branch, ApiResponse } from '../types';

export const branchService = {
    getAll: async () => {
        const response = await apiClient.get<ApiResponse<Branch[]>>('/branches');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await apiClient.get<ApiResponse<Branch>>(`/branches/${id}`);
        return response.data;
    },

    create: async (data: Partial<Branch>) => {
        const response = await apiClient.post<ApiResponse<Branch>>('/branches', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Branch>) => {
        const response = await apiClient.put<ApiResponse<Branch>>(`/branches/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<ApiResponse>(`/branches/${id}`);
        return response.data;
    },

    getDashboard: async (id: number) => {
        const response = await apiClient.get<ApiResponse<any>>(`/branches/${id}/dashboard`);
        return response.data;
    },

    setMain: async (id: number) => {
        const response = await apiClient.post<ApiResponse>(`/branches/${id}/set-main`);
        return response.data;
    },
};
