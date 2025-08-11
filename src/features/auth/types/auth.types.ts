import type { User } from "../../user/types/user.types";

// src/features/auth/types/auth.types.ts
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
