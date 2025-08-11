// src/shared/config/index.ts

const config = {
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  };
  
  export default config;