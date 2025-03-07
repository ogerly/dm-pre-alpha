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

// Make sure this matches your GitHub Pages path - critical for resolving 404 errors
const baseUrl = process.env.NODE_ENV === 'production' ? './' : '/';

export default defineConfig({
  plugins: [vue()],
  base: baseUrl, 
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 4000,
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
    assetsInlineLimit: 0,
    copyPublicDir: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VUE_VERSION': JSON.stringify(vueVersion),
    'import.meta.env.FRAMEWORK': JSON.stringify(framework),
    'import.meta.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
    'import.meta.env.INSPIRA_UI_VERSION': JSON.stringify(inspiraVersion),
    'import.meta.env.VITE_SOCKET_URL': JSON.stringify(baseUrl === '/' ? 'http://localhost:3000' : 'https://ogerly.github.io'),
    'import.meta.env.BASE_URL': JSON.stringify(baseUrl),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
