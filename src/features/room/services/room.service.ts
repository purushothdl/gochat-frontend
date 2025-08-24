// src/features/room/services/room.service.ts
import apiClient from '../../../shared/api/apiClient';
import type { ApiResponse } from '../../../shared/types/api.types';

interface Room {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  is_broadcast_only: boolean;
  created_at: string;
}

const getRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get<ApiResponse<Room[]>>('/rooms');
  return response.data.data;
};

export const roomService = {
  getRooms,
};