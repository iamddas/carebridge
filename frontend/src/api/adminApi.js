import axiosInstance from './axiosInstance';

export const getUsers = (search) =>
    axiosInstance.get('/admin/users', { params: search ? { search } : {} }).then((r) => r.data);

export const getUser = (id) =>
    axiosInstance.get(`/admin/users/${id}`).then((r) => r.data);

export const changeUserRole = ({ id, role }) =>
    axiosInstance.put(`/admin/users/${id}/role`, { role }).then((r) => r.data);

export const setUserStatus = ({ id, enabled }) =>
    axiosInstance.put(`/admin/users/${id}/status`, { enabled }).then((r) => r.data);

export const deleteUser = (id) =>
    axiosInstance.delete(`/admin/users/${id}`).then((r) => r.data);

export const getUserRequests = (id) =>
    axiosInstance.get(`/admin/users/${id}/requests`).then((r) => r.data);

export const getAllMessages = () =>
    axiosInstance.get('/messages/admin/all').then((r) => r.data);

export const deleteMessage = (id) =>
    axiosInstance.delete(`/messages/admin/${id}`).then((r) => r.data);
