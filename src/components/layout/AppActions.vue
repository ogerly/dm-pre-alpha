<template>
  <div class="fixed bottom-6 right-6 flex flex-col space-y-2">
    <!-- Chat button (only show if not on the chat page) -->
    <button 
      v-if="!isOnChatPage"
      class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 relative"
      @click="openChat"
    >
      <span class="sr-only">Open Chat</span>
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
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      
      <!-- Unread message indicator -->
      <span
        v-if="unreadMessages" 
        class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
      >
        {{ unreadMessages }}
      </span>
    </button>
    
    <!-- Help button -->
    <button 
      class="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
      @click="toggleHelp"
    >
      <span class="sr-only">Help</span>
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
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>

    <!-- Back to top button (only show when scrolled down) -->
    <button 
      v-if="showScrollTop"
      class="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105" 
      @click="scrollToTop"
    >
      <span class="sr-only">Back to top</span>
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useErrorTracking } from '@/composables/useErrorTracking'

export default defineComponent({
  name: 'AppActions',
  
  setup() {
    // Fix: Rename 'router' to '_router' since it's not being used
    const _router = useRouter()
    const route = useRoute()
    const uiStore = useUIStore()
    const { errorLogger } = useErrorTracking('AppActions')
    
    // Track if user has scrolled down
    const showScrollTop = ref(false)
    
    // For demo purposes - unread message count
    const unreadMessages = ref(3)
    
    // Check if we're already on the chat page
    const isOnChatPage = computed(() => {
      return route.path === '/chat' || route.path === '/videochat'
    })
    
    // Open chat either by toggle (popup) or navigating to chat page
    const openChat = () => {
      errorLogger.debug('Opening chat')
      
      // Option 1: Toggle chat overlay
      uiStore.toggleChat()
      
      // Option 2: Navigate to chat page (uncomment to use this approach instead)
      // router.push('/chat')
      
      // Reset unread count
      unreadMessages.value = 0
    }
    
    const toggleHelp = () => {
      errorLogger.debug('Help button clicked')
      uiStore.toggleHelp()
    }
    
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    const handleScroll = () => {
      showScrollTop.value = window.scrollY > 300
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      uiStore,
      isOnChatPage,
      unreadMessages,
      showScrollTop,
      openChat,
      toggleHelp,
      scrollToTop
    }
  }
})
</script>
