import axiosInstance from './axiosInstance';

export const getEmergencies = () =>
    axiosInstance.get('/emergency').then((r) => r.data);

export const createEmergency = (data) =>
    axiosInstance.post('/emergency', data).then((r) => r.data);

export const getBroadcasts = () =>
    axiosInstance.get('/broadcast').then((r) => r.data);

export const createBroadcast = (data) =>
    axiosInstance.post('/broadcast', data).then((r) => r.data);
