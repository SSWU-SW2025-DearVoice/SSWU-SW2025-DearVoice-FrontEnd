import axios from "axios";
import { authStorage } from "../utils/authStorage";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const noAuthPaths = [
      '/api/auth/login/',
      '/api/auth/signup/',
      '/api/auth/refresh/',
      '/api/auth/login/google/',
      '/api/letters/share/${uuid}/'
    ];
    
    if (noAuthPaths.some((path) => config.url?.includes(path))) {
      return config;
    }

    const accessToken = authStorage.getAccessToken();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    const loginPaths = ['/auth/login/', '/auth/signup/', '/auth/login/google/'];
    const isLoginRequest = loginPaths.some(path => originalRequest.url?.includes(path));
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;
      
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/api/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          authStorage.setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          authStorage.clearTokens();
          window.location.href = "/";
        }
      } else {
        authStorage.clearTokens();
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;