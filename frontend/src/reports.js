const API_URL = 'http://localhost:8080/api/v1';

const ReportsAPI = {
    async getSalesStats(startDate, endDate) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/reports/sales?start_date=${startDate}&end_date=${endDate}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getInventoryStats() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/reports/inventory`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
};

const ReportsState = {
    salesStats: null,
    inventoryStats: null,
    dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    }
};

export { ReportsAPI, ReportsState };
