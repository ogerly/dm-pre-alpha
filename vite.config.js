import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 3000,
    // Ensure proper CORS handling
    cors: true,
    // Configure to serve json files correctly
    assetsInclude: ['**/*.json']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    // Ensure JSON files are handled correctly in the build
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Ensure CSS files are properly served
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./src/assets/styles/global.css";'
      }
    }
  },
  // Configure publicDir to ensure static files are served correctly
  publicDir: 'public',
  optimizeDeps: {
    // Enable dependency pre-bundling
    include: ['vue']
  }
});
