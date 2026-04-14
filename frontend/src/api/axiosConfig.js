import axios from 'axios';

// Get the API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include tenant header
axiosInstance.interceptors.request.use(
    (config) => {
        // Get tenant code from subdomain or localStorage
        let tenantCode = null;

        // Try to get from subdomain first
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            const parts = hostname.split('.');
            if (parts.length > 2) {
                tenantCode = parts[0]; // First part is subdomain
            }
        }

        // Fallback to localStorage if no subdomain
        if (!tenantCode) {
            tenantCode = localStorage.getItem('tenantCode') || 'default';
        }

        // Add tenant header
        config.headers['X-Tenant-Code'] = tenantCode;

        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
