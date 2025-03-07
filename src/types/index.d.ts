declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Fix: Replace empty object types with more specific types
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module '@vueuse/core' {
  // Fix the empty object types according to ESLint's recommendations
  export function useRafFn(fn: () => void, options?: Record<string, unknown>): { 
    pause: () => void; 
    resume: () => void;
  };
}

// Extend Window interface for custom properties if needed
interface Window {
  // Add any global window extensions here
  errorLogger?: unknown;
}

// Extend ImportMeta interface to include env properties
interface ImportMeta {
  env: {
    // Base configuration
    BASE_URL: string;
    MODE: string;
    DEV: boolean;
    PROD: boolean;
    SSR: boolean;
    
    // App version information
    APP_VERSION?: string;
    VUE_VERSION?: string;
    FRAMEWORK?: string;
    FRAMEWORK_VERSION?: string;
    INSPIRA_UI_VERSION?: string;
    
    // Debug and logging settings
    VITE_DEBUG?: string;
    VITE_ERROR_CONSOLE_ENABLED?: string;
    VITE_ERROR_CONSOLE_LEVEL?: string;
  };
  
  // HMR API
  hot?: {
    on(event: string, callback: (data: unknown) => void): void;
    accept(cb?: () => void): void;
  };
}

// Add any other global type declarations here
