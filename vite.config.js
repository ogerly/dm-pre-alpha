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

// GitHub Pages path - using proper relative URLs for production
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
    sourcemap: process.env.NODE_ENV !== 'production',
    assetsInlineLimit: 0,
    copyPublicDir: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure that generated file names are consistent
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VUE_VERSION': JSON.stringify(vueVersion),
    'import.meta.env.FRAMEWORK': JSON.stringify(framework),
    'import.meta.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
    'import.meta.env.INSPIRA_UI_VERSION': JSON.stringify(inspiraVersion),
    // Use a different socket URL based on environment
    'import.meta.env.VITE_SOCKET_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://your-production-socket-server.com' // Replace with your production socket server
        : 'http://localhost:3000'
    ),
    'import.meta.env.BASE_URL': JSON.stringify(baseUrl),
    'import.meta.env.PROD': process.env.NODE_ENV === 'production',
    'import.meta.env.DEV': process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
