import apiClient from './api';
import type { SalesOrder, ApiResponse } from '../types';

export const salesService = {
    getAll: async (page = 1, limit = 10, search = '') => {
        const response = await apiClient.get<ApiResponse<{ orders: SalesOrder[]; total: number }>>('/sales', {
            params: { page, limit, search },
        });
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await apiClient.get<ApiResponse<SalesOrder>>(`/sales/${id}`);
        return response.data;
    },

    create: async (data: Partial<SalesOrder>) => {
        const response = await apiClient.post<ApiResponse<SalesOrder>>('/sales', data);
        return response.data;
    },

    update: async (id: number, data: Partial<SalesOrder>) => {
        const response = await apiClient.put<ApiResponse<SalesOrder>>(`/sales/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<ApiResponse>(`/sales/${id}`);
        return response.data;
    },
};
