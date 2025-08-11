// src/features/user/services/user.service.ts
import apiClient from '../../../shared/api/apiClient';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { Profile, UpdateProfileResponse, UpdateSettingsResponse, UserSettings } from '../types/user.types';

// Define request data types matching the backend
type UpdateProfileData = { name?: string };
type UpdateSettingsData = { notifications_enabled?: boolean, language?: string };
type ChangePasswordData = { current_password: string, new_password: string };

const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get<ApiResponse<Profile>>('/user/profile');
  return response.data.data;
};

const updateProfile = async (data: UpdateProfileData): Promise<Profile> => {
  const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>('/user/profile', data);
  return response.data.data.user;
};

const updateSettings = async (data: UpdateSettingsData): Promise<UserSettings> => {
  const response = await apiClient.put<ApiResponse<UpdateSettingsResponse>>('/user/settings', data);
  return response.data.data.settings;
};

const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await apiClient.put('/user/password', data);
};

export const userService = {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
};