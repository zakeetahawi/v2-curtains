const API_URL = 'http://localhost:8080/api/v1';

const InventoryAPI = {
    async getAllProducts(page = 1, limit = 10, search = '', categoryId = '') {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/inventory/products?page=${page}&limit=${limit}&search=${search}&category_id=${categoryId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getProduct(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/inventory/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async createProduct(data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/inventory/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async getAllCategories() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/inventory/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
};

const InventoryState = {
    products: [],
    productsTotal: 0,
    productsPage: 1,
    productsSearch: '',
    categories: [],
    selectedCategory: '',
    selectedProduct: null,
    showProductModal: false,
};

export { InventoryAPI, InventoryState };
