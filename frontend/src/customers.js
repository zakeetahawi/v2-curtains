// ==================== CUSTOMERS PAGE ====================

// API Client for Customers
const API_URL = 'http://localhost:8080/api/v1';

// API Client for Customers
const CustomersAPI = {
    async getAll(page = 1, limit = 10, search = '') {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers?page=${page}&limit=${limit}&search=${search}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getOne(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async create(data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async update(id, data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async delete(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async addActivity(id, data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async getActivities(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}/activities`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async uploadDocument(id, formData) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}/documents`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Content-Type handled automatically for FormData
            body: formData
        });
        return await response.json();
    },

    async getDocuments(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/customers/${id}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
};

// Customers State
const CustomersState = {
    customers: [],
    total: 0,
    page: 1,
    limit: 10,
    search: '',
    selectedCustomer: null,
    showModal: false,
    showDeleteModal: false,
};

// Export for use in main.js
export { CustomersAPI, CustomersState };
