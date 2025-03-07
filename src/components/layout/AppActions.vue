<template>
  <div class="app-actions">
    <div class="fixed bottom-6 right-6 flex flex-col space-y-2">
      <!-- Chat toggle button -->
      <button 
        class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
        @click="uiStore.toggleChat"
      >
        <span class="sr-only">Toggle chat</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      <!-- Help button -->
      <button 
        class="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center shadow-lg hover:bg-gray-700"
        @click="uiStore.toggleHelp"
      >
        <span class="sr-only">Toggle help</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <!-- Dev mode debug console toggle (only in development) -->
      <button 
        v-if="isDev"
        class="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700"
        @click="toggleErrorConsole"
      >
        <span class="sr-only">Toggle debug console</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useUIStore } from '@/stores/ui';
import errorLogger from '@/services/errorLogger';

export default defineComponent({
  name: 'AppActions',
  
  setup() {
    const uiStore = useUIStore();
    const isDev = computed(() => import.meta.env.DEV);
    
    // Toggle error console visibility
    const toggleErrorConsole = () => {
      // We'll use a keyboard shortcut to toggle the console
      const event = new KeyboardEvent('keydown', {
        key: 'D',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true
      });
      document.dispatchEvent(event);
      
      errorLogger.debug('Debug console toggled via button');
    };
    
    return {
      uiStore,
      isDev,
      toggleErrorConsole
    };
  }
});
</script>
