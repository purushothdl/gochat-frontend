// src/features/auth/services/auth.service.ts
import apiClient from '../../../shared/api/apiClient';
import type { ApiResponse, MessageResponse } from '../../../shared/types/api.types';
import type { AuthPayload, Device, MePayload, Profile, RefreshPayload } from '../types/auth.types';

// Note: Define parameter types for each function
type RegisterData = { name: string; email: string; password: string };
type LoginData = { email: string; password: string };
type ForgotPasswordData = { email: string };
type ResetPasswordData = { token: string; password: string };

const register = async (data: RegisterData) => {
    const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', data);
    return response.data.data;
};

const login = async (data: LoginData) => {
  const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', data);
  return response.data.data;
};

const getMe = async () => {
  const response = await apiClient.get<ApiResponse<MePayload>>('/auth/me');
  return response.data.data.user;
};

const forgotPassword = async (data: ForgotPasswordData) => {
  await apiClient.post('/auth/forgot-password', data);
};

const resetPassword = async (data: ResetPasswordData) => {
  await apiClient.post('/auth/reset-password', data);
};

const refresh = async () => {
    const response = await apiClient.post<ApiResponse<RefreshPayload>>('/auth/refresh');
    return response.data.data;
  };

 const getUserProfile = async () => {
  const response = await apiClient.get<ApiResponse<Profile>>('/user/profile');
  return response.data.data;
};

const listDevices = async () => {
  const response = await apiClient.get<ApiResponse<{ devices: Device[] }>>('/auth/devices');
  return response.data.data.devices;
};

const logout = async () => {
  await apiClient.post('/auth/logout');
};

const logoutDevice = async (deviceId: string) => {
  const response = await apiClient.post<ApiResponse<MessageResponse>>('/auth/logout-device', {
    device_id: deviceId,
  });
  return response.data.data;
};

const logoutAllDevices = async () => {
  const response = await apiClient.post<ApiResponse<MessageResponse>>('/auth/logout-all');
  return response.data.data;
};



export const authService = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  refresh,
  getUserProfile,
  listDevices,
  logout,
  logoutDevice,
  logoutAllDevices
};