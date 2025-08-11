// src/features/user/types/user.types.ts

export interface User {
    id: string;
    name: string;
    email: string;
    image_url: string; 
    is_verified: boolean; 
    created_at: string; 
  }
  
  // A specific interface for the user's settings.
  export interface UserSettings {
    notifications_enabled: boolean;
    language: string;
  }
  
  // The detailed Profile model, which includes settings.
  export interface Profile extends User {
    last_login: string | null;
    settings: UserSettings;
  }
  
  // --- Response types for user-related API calls ---
  
  export interface UpdateProfileResponse {
    message: string;
    user: Profile;
  }
  
  export interface UpdateSettingsResponse {
    message: string;
    settings: UserSettings;
  }