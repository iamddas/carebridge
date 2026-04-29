import axiosInstance from './axiosInstance';

export const getRequests = (status) =>
    axiosInstance.get('/requests', { params: status ? { status } : {} }).then((r) => r.data);

export const getRequestById = (id) =>
    axiosInstance.get(`/requests/${id}`).then((r) => r.data);

export const getMyRequests = () =>
    axiosInstance.get('/requests/my').then((r) => r.data);

export const getAcceptedByMe = () =>
    axiosInstance.get('/requests/accepted').then((r) => r.data);

export const createRequest = (data) =>
    axiosInstance.post('/requests', data).then((r) => r.data);

export const updateRequest = ({ id, ...data }) =>
    axiosInstance.put(`/requests/${id}`, data).then((r) => r.data);

export const deleteRequest = (id) =>
    axiosInstance.delete(`/requests/${id}`).then((r) => r.data);

export const acceptRequest = (id) =>
    axiosInstance.put(`/requests/${id}/accept`).then((r) => r.data);

export const completeRequest = (id) =>
    axiosInstance.put(`/requests/${id}/complete`).then((r) => r.data);
