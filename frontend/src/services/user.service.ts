import apiClient from './api';
import type { ApiResponse } from '../types';

interface User {
    id: number;
    username: string;
    email: string;
    role_id: number;
    role?: {
        id: number;
        name: string;
    };
    branch_id?: number;
    branch?: {
        id: number;
        name: string;
        is_main: boolean;
    };
    is_active: boolean;
    created_at: string;
}

interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role_id: number;
    branch_id?: number;
    is_active: boolean;
}

interface UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string;
    role_id?: number;
    branch_id?: number;
    is_active?: boolean;
}

export const userService = {
    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get<ApiResponse<{ users: User[]; total: number }>>('/users', {
            params: { page, limit },
        });
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
        return response.data;
    },

    create: async (data: CreateUserRequest) => {
        const response = await apiClient.post<ApiResponse<User>>('/users', data);
        return response.data;
    },

    update: async (id: number, data: UpdateUserRequest) => {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
        return response.data;
    },
};
