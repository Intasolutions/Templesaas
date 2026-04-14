import axios from 'axios';

// Base URL configuration
// TODO: Move to .env variable (VITE_API_URL)
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (to attach token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const tenantCode = localStorage.getItem('tenantCode');

        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        if (tenantCode) {
            config.headers['X-Tenant-Code'] = tenantCode;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (to handle 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto-logout on invalid token
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
