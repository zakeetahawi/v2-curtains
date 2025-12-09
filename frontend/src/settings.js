
const API_URL = 'http://localhost:8080/api/v1';

const SettingsAPI = {
    async get() {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/settings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    },

    async getPublic() {
        const response = await fetch(`${API_URL}/settings/public`);
        return await response.json();
    },

    async update(data) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async uploadLogo(formData) {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/settings/logo`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return await response.json();
    }
};

export { SettingsAPI };
