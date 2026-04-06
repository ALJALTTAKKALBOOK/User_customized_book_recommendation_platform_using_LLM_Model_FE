import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Use VITE_API_BASE_URL from .env if present to proxy `/api` to backend.
      proxy: ((): Record<string, any> => {
        const raw = env.VITE_API_BASE_URL as string | undefined;
        // If the provided URL contains a trailing /api, strip it for proxy target to avoid duplication
        const target = raw && raw.length > 0 ? raw.replace(/\/(?:api)?\/?$/, '') : 'http://localhost:8000';
        return {
          '/api': {
            target,
            changeOrigin: true,
            secure: false,
          },
        };
      })(),
    },
  };
});
