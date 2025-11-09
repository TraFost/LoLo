import path from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // esbuild: {
  //   drop: ['console', 'debugger'],
  // },
  base: '/',
});
