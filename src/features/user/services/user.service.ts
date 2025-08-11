// src/features/user/services/user.service.ts
import apiClient from '../../../shared/api/apiClient';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { Profile } from '../../auth/types/auth.types';

// Define request data types matching the backend
type UpdateProfileData = { name?: string };
type UpdateSettingsData = { notifications_enabled?: boolean, language?: string };
type ChangePasswordData = { current_password: string, new_password: string };

const getProfile = async () => {
  const response = await apiClient.get<ApiResponse<Profile>>('/user/profile');
  return response.data.data;
};

const updateProfile = async (data: UpdateProfileData) => {
  const response = await apiClient.put<ApiResponse<Profile>>('/user/profile', data);
  return response.data.data;
};

const updateSettings = async (data: UpdateSettingsData) => {
  const response = await apiClient.put<ApiResponse<Profile>>('/user/settings', data);
  return response.data.data;
};

const changePassword = async (data: ChangePasswordData) => {
  await apiClient.put('/user/password', data);
};

export const userService = {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
};