// src/shared/config/index.ts
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const wsUrl = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8081';

const config = {
  apiUrl,
  wsUrl,
};

export default config;