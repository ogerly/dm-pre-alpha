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


export default defineConfig({
  plugins: [vue()],
  // Update base URL for GitHub Pages compatibility with the specific repo
  base: process.env.NODE_ENV === 'production' ? '/dm-pre-alpha/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VUE_VERSION': JSON.stringify(vueVersion),
    'import.meta.env.FRAMEWORK': JSON.stringify(framework),
    'import.meta.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
    'import.meta.env.INSPIRA_UI_VERSION': JSON.stringify(inspiraVersion),
  },
});
