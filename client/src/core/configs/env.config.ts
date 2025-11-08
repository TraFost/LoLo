export const ENV = {
  SERVER: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
} as const;
