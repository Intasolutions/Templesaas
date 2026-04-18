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
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (tenantCode) {
            config.headers['X-Tenant-Code'] = tenantCode;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor (to handle 401 and refresh token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/users/token/refresh/`, { refresh: refreshToken });
                    if (res.status === 200) {
                        const { access } = res.data;
                        localStorage.setItem('token', access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                        processQueue(null, access);
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('tenantCode');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
