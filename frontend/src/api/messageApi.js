import axiosInstance from './axiosInstance';

export const getUserDirectory = () =>
    axiosInstance.get('/users/directory').then((r) => r.data);

export const getConversation = (userId) =>
    axiosInstance.get(`/messages/${userId}`).then((r) => r.data);

export const sendMessage = (data) =>
    axiosInstance.post('/messages', data).then((r) => r.data);

export const markMessageRead = (id) =>
    axiosInstance.put(`/messages/${id}/read`).then((r) => r.data);
