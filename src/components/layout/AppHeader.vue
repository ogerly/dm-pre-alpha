<template>
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="container mx-auto px-4 py-4">
      <!-- Top Navigation Bar -->
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-800 dark:text-white">DreamMall</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <span v-if="authStore.currentUser" class="text-gray-600 hidden md:inline dark:text-gray-300">
            {{ authStore.currentUser.name || authStore.currentUser.email }}
            <span v-if="authStore.currentUser.role === 'admin'" class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
          </span>
          <DarkModeToggle />
          <button 
            @click="toggleChat" 
            class="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span v-if="unreadMessages" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {{ unreadMessages }}
            </span>
          </button>
          <button @click="toggleMobileMenu" class="md:hidden text-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button @click="handleLogout" 
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
            Logout
          </button>
        </div>
      </div>
      
      <!-- Main Navigation Menu - Desktop -->
      <nav class="hidden md:flex space-x-4">
        <router-link 
          v-for="navItem in navigationItems" 
          :key="navItem.path" 
          :to="navItem.path"
          class="px-3 py-2 rounded-md text-sm font-medium transition"
          :class="[
            $route.path === navItem.path
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          {{ navItem.name }}
        </router-link>
      </nav>
      
      <!-- Mobile Navigation Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-2 bg-gray-50 rounded-md p-2 dark:bg-gray-700">
        <router-link 
          v-for="navItem in navigationItems" 
          :key="navItem.path" 
          :to="navItem.path"
          class="block px-3 py-2 rounded-md text-base font-medium transition mb-1"
          :class="[
            $route.path === navItem.path
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ navItem.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useErrorTracking } from '@/composables/useErrorTracking'
import DarkModeToggle from '@/components/ui/DarkModeToggle.vue'

export default defineComponent({
  name: 'AppHeader',
  
  components: {
    DarkModeToggle
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    const { errorLogger } = useErrorTracking('AppHeader')
    const isMobileMenuOpen = ref(false)
    
    // Navigation items - add Chat to the list
    const navigationItems = [
      { name: 'Dashboard', path: '/' },
      { name: 'Matching', path: '/matching' },
      { name: 'Projects', path: '/projects' },
      { name: 'Table', path: '/table' },
      { name: 'Map', path: '/map' },
      { name: 'Video Chat', path: '/videochat' },
      { name: 'Chat', path: '/chat' }
    ]
    
    // For demo purposes - show unread message count
    const unreadMessages = ref(3)
    
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    
    const toggleChat = () => {
      errorLogger.debug('Chat toggle clicked')
      uiStore.toggleChat()
      unreadMessages.value = 0 // Reset unread count when opening chat
    }
    
    const handleLogout = () => {
      try {
        errorLogger.debug('User logging out')
        authStore.logout()
        router.push('/login')
      } catch (error) {
        errorLogger.error('Error during logout', error)
      }
    }
    
    return {
      authStore,
      uiStore,
      navigationItems,
      isMobileMenuOpen,
      unreadMessages,
      toggleMobileMenu,
      toggleChat,
      handleLogout
    }
  }
})
</script>
