import apiClient from './api';
import type { Customer, CustomerActivity, CustomerDocument, ApiResponse } from '../types';

export const customerService = {
    getAll: async (page = 1, limit = 10, search = '') => {
        const response = await apiClient.get<ApiResponse<{ customers: Customer[]; total: number }>>('/customers', {
            params: { page, limit, search },
        });
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
        return response.data;
    },

    create: async (data: Partial<Customer>) => {
        const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Customer>) => {
        const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<ApiResponse>(`/customers/${id}`);
        return response.data;
    },

    // Activities
    getActivities: async (customerId: number) => {
        const response = await apiClient.get<ApiResponse<CustomerActivity[]>>(`/customers/${customerId}/activities`);
        return response.data;
    },

    addActivity: async (customerId: number, data: Partial<CustomerActivity>) => {
        const response = await apiClient.post<ApiResponse>(`/customers/${customerId}/activities`, data);
        return response.data;
    },

    // Documents
    getDocuments: async (customerId: number) => {
        const response = await apiClient.get<ApiResponse<CustomerDocument[]>>(`/customers/${customerId}/documents`);
        return response.data;
    },

    uploadDocument: async (customerId: number, formData: FormData) => {
        const response = await apiClient.post<ApiResponse>(`/customers/${customerId}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
