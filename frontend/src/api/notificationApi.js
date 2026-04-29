import axiosInstance from './axiosInstance';

export const getNotifications = () =>
    axiosInstance.get('/notifications').then((r) => r.data);

export const getUnreadCount = () =>
    axiosInstance.get('/notifications/unread-count').then((r) => r.data);

export const markNotificationRead = (id) =>
    axiosInstance.put(`/notifications/${id}/read`).then((r) => r.data);

export const notifyUser = ({ userId, ...data }) =>
    axiosInstance.post(`/notifications/admin/notify/${userId}`, data).then((r) => r.data);

export const broadcastNotification = (data) =>
    axiosInstance.post('/notifications/admin/broadcast', data).then((r) => r.data);
