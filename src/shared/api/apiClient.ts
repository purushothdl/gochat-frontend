// src/shared/api/apiClient.ts
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { authService } from '../../features/auth/services/auth.service';
import  config  from '../config';

const apiClient = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if(originalRequest) {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return apiClient(originalRequest);
            }
          })
          .catch(err => Promise.reject(err));
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const { access_token } = await authService.refresh();
        useAuthStore.getState().setToken(access_token);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        if(originalRequest) {
            originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        }
        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;