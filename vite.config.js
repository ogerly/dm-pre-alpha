import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true
  },
  // Ensure CSS files are properly served
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./styles/global.css";'
      }
    }
  }
});
