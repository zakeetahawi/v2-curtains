const API_URL = 'http://localhost:8080/api/v1';

const SalesAPI = {
    async getAll(page = 1, limit = 10, status = '', customerId = '') {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/sales?page=${page}&limit=${limit}&status=${status}&customer_id=${customerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getOne(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/sales/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async create(data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
};

const SalesState = {
    orders: [],
    ordersTotal: 0,
    ordersPage: 1,
    ordersStatus: '',
    selectedOrder: null,
    showOrderModal: false,
};

export { SalesAPI, SalesState };
