/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';

export default defineConfig({
  base: '/see-you/',
  plugins: [
    react(),
    {
      name: 'serve-manifest',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.endsWith('manifest.webmanifest') || req.url.endsWith('manifest.json'))) {
            const manifestPath = path.resolve(__dirname, './public/manifest.webmanifest');
            if (fs.existsSync(manifestPath)) {
              res.setHeader('Content-Type', 'application/manifest+json');
              res.end(fs.readFileSync(manifestPath, 'utf-8'));
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
  },
});
