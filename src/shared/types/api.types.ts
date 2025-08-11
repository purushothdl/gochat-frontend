// src/shared/types/api.types.ts
export interface ApiResponse<T> {
    success: boolean;
    data: T;
  }
  
export interface MessageResponse {
    message: string;
  }
  
export interface ValidationErrors {
[field: string]: string;
}

export interface ApiErrorResponse {
success: boolean;
data?: ValidationErrors; 
error: {
    code: string;
    message: string;
};
}