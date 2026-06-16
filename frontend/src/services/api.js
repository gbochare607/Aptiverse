import axios from 'axios';

// Create an instance
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
        // Add requested role header if available
        const requestedRole = localStorage.getItem('userRole') || localStorage.getItem('requestedRole');
        if (requestedRole) {
            config.headers['x-requested-role'] = requestedRole;
        }

        // Check for admin JWT session
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
            return config;
        }

        // Try to get token from Clerk (most reliable source)
        if (window.Clerk && window.Clerk.session) {
            try {
                const token = await window.Clerk.session.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Failed to get Clerk token in interceptor", e);
            }
        }

        // Fallback to localStorage (legacy)
        const token = localStorage.getItem('token');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout if 401? Or refresh?
            // For now, let's just reject
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
