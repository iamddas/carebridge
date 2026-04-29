import axiosInstance from './axiosInstance';

export const login = (credentials) =>
    axiosInstance.post('/auth/login', credentials).then((r) => r.data);

export const register = (data) =>
    axiosInstance.post('/auth/register', data).then((r) => r.data);

export const getMe = () =>
    axiosInstance.get('/auth/me').then((r) => r.data);
