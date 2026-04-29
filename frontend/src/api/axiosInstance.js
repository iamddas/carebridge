import axios from 'axios';
import { showError } from '../utils/toast';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data && 'success' in response.data) {
            return { ...response, data: response.data.data };
        }
        return response;
    },
    (error) => {
        const url = error.config?.url ?? '';
        const isAuthEndpoint = url.startsWith('/auth/');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        if (!isAuthEndpoint) {
            const msg = error.response?.data?.message || 'An error occurred';
            showError(msg);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
