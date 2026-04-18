// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',   // ← Change this in production
    timeout: 10000,
});

// 🔥 Automatically attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔥 Auto logout if token expires or is invalid (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            window.location.href = '/login';   // redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;