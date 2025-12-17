import apiClient from './api';
import type { ApiResponse, Notification } from '../types';

export const notificationService = {
    getUnread: async () => {
        const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
        return response.data;
    },

    markAsRead: async (id: number) => {
        const response = await apiClient.post<ApiResponse>(`/notifications/${id}/read`);
        return response.data;
    },
};
