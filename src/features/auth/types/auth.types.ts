// src/features/auth/types/auth.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image_url: string; 
  is_verified: boolean; 
  created_at: string; 
}

// For the detailed /user/profile response
export interface Profile extends User {
  last_login: string;
  settings: {
    notifications_enabled: boolean;
    language: string;
  };
}

export interface Device {
  id: string;
  device_info: string;
  ip_address: string;
  last_used_at: string;
  created_at: string;
}

export interface AuthPayload {
  user: User;
  access_token: string;
  expires_at: string;
}

export interface MePayload {
  user: User;
}

export interface RefreshPayload {
  access_token: string;
  expires_at: string;
}
