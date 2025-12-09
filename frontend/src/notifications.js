
const API_URL = 'http://localhost:8080/api/v1';

const NotificationsAPI = {
    async getUnread() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async markAsRead(id) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/notifications/${id}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }
};

export { NotificationsAPI };
