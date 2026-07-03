import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'https://script.google.com/macros/s/AKfycbwYRGrLU3LzY1RLXOP4t2NJvVEr_oFvMKnqJb5wQEbNVN-1p5q9XBldSHovGfN15xmt',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/macros': {
          target: 'https://script.google.com',
          changeOrigin: true,
        },
      },
    },
  };
});
