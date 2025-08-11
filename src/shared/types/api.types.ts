// src/shared/types/api.types.ts
export interface ApiResponse<T> {
    success: boolean;
    data: T;
  }
  
  export interface MessageResponse {
    message: string;
  }