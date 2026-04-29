import axiosInstance from './axios';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  OAUTH_SUCCESS: '/auth/oauth-success',
};

export const authApi = {
  login: (email, password) =>
    axiosInstance.post(AUTH_ENDPOINTS.LOGIN, { email, password }),

  register: (userData) =>
    axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData),

  refreshToken: () =>
    axiosInstance.post(AUTH_ENDPOINTS.REFRESH_TOKEN),

  logout: () =>
    axiosInstance.post(AUTH_ENDPOINTS.LOGOUT),

  getCurrentUser: () =>
    axiosInstance.get(AUTH_ENDPOINTS.ME),

  handleOAuthSuccess: (code, provider) =>
    axiosInstance.post(AUTH_ENDPOINTS.OAUTH_SUCCESS, { code, provider }),
};

export default authApi;
