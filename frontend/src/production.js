const API_URL = 'http://localhost:8080/api/v1';

const ProductionAPI = {
    async getAllOrders(page = 1, limit = 10, status = '') {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/production/orders?page=${page}&limit=${limit}&status=${status}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getOrder(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/production/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async createOrder(data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/production/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async getBOM(productId) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/production/bom/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
};

const ProductionState = {
    productionOrders: [],
    productionOrdersTotal: 0,
    productionOrdersPage: 1,
    productionOrdersStatus: '',
    selectedProductionOrder: null,
    showProductionOrderModal: false,
};

export { ProductionAPI, ProductionState };
