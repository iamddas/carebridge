import axiosInstance from './axios';

const REQUEST_ENDPOINTS = {
  GET_ALL: '/requests',
  GET_BY_ID: '/requests/:id',
  CREATE: '/requests',
  UPDATE: '/requests/:id',
  DELETE: '/requests/:id',
  GET_MY_REQUESTS: '/requests/my-requests',
  UPDATE_STATUS: '/requests/:id/status',
};

export const requestApi = {
  getAll: (params) =>
    axiosInstance.get(REQUEST_ENDPOINTS.GET_ALL, { params }),

  getById: (id) =>
    axiosInstance.get(REQUEST_ENDPOINTS.GET_BY_ID.replace(':id', id)),

  create: (requestData) =>
    axiosInstance.post(REQUEST_ENDPOINTS.CREATE, requestData),

  update: (id, requestData) =>
    axiosInstance.put(REQUEST_ENDPOINTS.UPDATE.replace(':id', id), requestData),

  delete: (id) =>
    axiosInstance.delete(REQUEST_ENDPOINTS.DELETE.replace(':id', id)),

  getMyRequests: (params) =>
    axiosInstance.get(REQUEST_ENDPOINTS.GET_MY_REQUESTS, { params }),

  updateStatus: (id, status) =>
    axiosInstance.patch(REQUEST_ENDPOINTS.UPDATE_STATUS.replace(':id', id), { status }),
};

export default requestApi;
