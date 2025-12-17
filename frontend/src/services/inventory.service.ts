import apiClient from './api';
import type { Product, ApiResponse } from '../types';

export const inventoryService = {
    getAll: async (page = 1, limit = 10, search = '') => {
        const response = await apiClient.get<ApiResponse<{ products: Product[]; total: number }>>('/inventory/products', {
            params: { page, limit, search },
        });
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await apiClient.get<ApiResponse<Product>>(`/inventory/products/${id}`);
        return response.data;
    },

    create: async (data: Partial<Product>) => {
        const response = await apiClient.post<ApiResponse<Product>>('/inventory/products', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Product>) => {
        const response = await apiClient.put<ApiResponse<Product>>(`/inventory/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<ApiResponse>(`/inventory/products/${id}`);
        return response.data;
    },
};
