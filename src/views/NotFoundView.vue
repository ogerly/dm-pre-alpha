<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-extrabold text-blue-600">
        404
      </h1>
      
      <div class="inline-flex items-center justify-center w-full">
        <hr class="w-64 h-1 my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div class="absolute px-4 -translate-x-1/2 bg-gray-50 left-1/2">
          <svg
            class="w-8 h-8 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      
      <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        Page not found
      </h2>
      <p class="mt-4 text-lg text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-8">
        <router-link 
          to="/" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import errorLogger from '@/services/errorLogger';

export default defineComponent({
  name: 'NotFoundView',
  
  setup() {
    onMounted(() => {
      errorLogger.warn('User accessed non-existent route', {
        path: window.location.pathname,
        href: window.location.href
      });
    });
  }
});
</script>
