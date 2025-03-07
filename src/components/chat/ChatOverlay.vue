<template>
  <div class="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="font-semibold">
        Chat
      </h3>
      <button
        class="text-gray-500 hover:text-gray-700"
        @click="uiStore.toggleChat"
      >
        <span class="sr-only">Close</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div class="h-64 overflow-y-auto p-4 bg-gray-50">
      <p class="text-center text-gray-500">
        Chat messages will appear here
      </p>
    </div>
    <div class="p-4 border-t">
      <div class="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..." 
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useUIStore } from '@/stores/ui'

export default defineComponent({
  name: 'ChatOverlay',
  
  setup() {
    const uiStore = useUIStore()
    
    return {
      uiStore
    }
  }
})
</script>
