import apiClient from './api';

export const productionService = {
    getOrders: async (page = 1, limit = 10, status = '') => {
        const response = await apiClient.get(`/production/orders`, {
            params: { page, limit, status }
        });
        return response.data;
    },

    createOrder: async (data: any) => {
        const response = await apiClient.post(`/production/orders`, data);
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await apiClient.patch(`/production/orders/${id}/status`, { status });
        return response.data;
    },

    getBOM: async (productId: number) => {
        const response = await apiClient.get(`/production/bom/${productId}`);
        return response.data;
    }
};
