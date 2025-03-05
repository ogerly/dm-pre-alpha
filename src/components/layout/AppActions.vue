<template>
  <div class="fixed bottom-6 right-6 flex flex-col space-y-2">
    <button @click="uiStore.toggleChat"
            class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg">
      <span class="sr-only">Open Chat</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useUIStore } from '@/stores/ui'

export default defineComponent({
  name: 'AppActions',
  
  setup() {
    const uiStore = useUIStore()
    
    return {
      uiStore
    }
  }
})
</script>
