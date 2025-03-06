import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read package.json
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

// Extract version information
const appVersion = pkg.version || '0.0.0';
const vueVersion = pkg.dependencies?.vue?.replace(/[\^~]/g, '') || '3.x';
const inspiraVersion = pkg.dependencies?.["inspira-ui"]?.replace(/[\^~]/g, '') || '0.0.0';
const framework = 'Vue.js';
const frameworkVersion = pkg.dependencies?.vue?.replace(/[\^~]/g, '') || '3.x';

// Determine the base URL - this needs to be empty for development with our Express server
const baseUrl = process.env.NODE_ENV === 'production' ? '/dm-pre-alpha/' : '/';

export default defineConfig({
  plugins: [vue()],
  base: baseUrl, // This sets the base path for assets
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 4000, // Keep using a different port for the dev server
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Ensure assets use proper MIME types
    assetsInlineLimit: 0
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VUE_VERSION': JSON.stringify(vueVersion),
    'import.meta.env.FRAMEWORK': JSON.stringify(framework),
    'import.meta.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
    'import.meta.env.INSPIRA_UI_VERSION': JSON.stringify(inspiraVersion),
    'import.meta.env.VITE_SOCKET_URL': JSON.stringify('http://localhost:3000'),
    'import.meta.env.BASE_URL': JSON.stringify(baseUrl),
  },
});
