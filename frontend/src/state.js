export const AppState = {
    currentPage: 'login',
    user: null,
    isAuthenticated: false,
    // Customers State
    customers: [],
    customersTotal: 0,
    customersPage: 1,
    customersSearch: '',
    selectedCustomer: null,
    showCustomerModal: false,
    // Orders State
    ordersStatus: '',
    selectedOrder: null,
    showOrderModal: false,
    // Inventory State
    products: [],
    productsTotal: 0,
    productsPage: 1,
    productsSearch: '',
    categories: [],
    selectedCategory: '',
    selectedProduct: null,
    showProductModal: false,
    // Production State
    productionOrders: [],
    productionOrdersTotal: 0,
    productionOrdersPage: 1,
    productionOrdersStatus: '',
    selectedProductionOrder: null,
    showProductionOrderModal: false,
    // Reports State
    salesStats: null,
    inventoryStats: null,
    dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    },
    showDeleteModal: false,
};
