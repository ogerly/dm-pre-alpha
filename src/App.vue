<template>
  <router-view />
  <small><b>DreamMall</b> | 
    App: v{{ version }} | 
    Vue: v{{ vueVersion }} | 
    Framework: {{ framework }} {{ frameworkVersion }} | 
    Inspira-UI: {{ inspiraUiVersion }}
  </small>
  <ErrorConsole />
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

// Import components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'
import ChatOverlay from '@/components/chat/ChatOverlay.vue'
import ErrorConsole from '@/components/debug/ErrorConsole.vue'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'App',
  
  components: { 
    AppHeader,
    AppActions,
    ChatOverlay,
    ErrorConsole
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    
    // Get version info from environment variables
    const version = import.meta.env.APP_VERSION
    const vueVersion = import.meta.env.VUE_VERSION
    const framework = import.meta.env.FRAMEWORK
    const frameworkVersion = import.meta.env.FRAMEWORK_VERSION
    const inspiraUiVersion = import.meta.env.INSPIRA_UI_VERSION
    
    onMounted(async () => {
      try {
        errorLogger.info("App mounted - initializing data")
        
        // First load user data
        errorLogger.debug("Loading users...")
        await userStore.loadUsers()
        errorLogger.info("Users loaded successfully")
        
        // Then check authentication
        errorLogger.debug("Checking authentication...")
        await authStore.checkAuth()
        errorLogger.info("Authentication check completed")
        
        errorLogger.info("Initial data loading complete")
      } catch (error) {
        errorLogger.error("Error during app initialization", error)
      }
    })
    
    // This ensures the router properly handles paths with the base URL
    onMounted(() => {
      // Get the path after the base URL
      const path = window.location.pathname.replace(import.meta.env.BASE_URL, '/');
      
      // If we're on a path that should be handled by the router
      if (path !== '/' && !path.includes('.')) {
        router.push(path);
      }
    });

    // Handle logout
    const handleLogout = () => {
      try {
        errorLogger.debug("Logging out user...")
        authStore.logout()
        router.push('/login')
        errorLogger.info("User logged out successfully")
      } catch (error) {
        errorLogger.error("Failed to logout", error)
      }
    }
    
    // Handle tab changes
    const handleTabChange = (tab) => {
      try {
        errorLogger.debug(`Changing tab to ${tab}`)
        uiStore.setActiveTab(tab)
        router.push(`/${tab}`)
      } catch (error) {
        errorLogger.error(`Failed to change tab to ${tab}`, error)
      }
    }
    
    // Import profiles from file
    const importProfilesFromFile = (event) => {
      const file = event.target.files[0]
      if (file) {
        errorLogger.debug(`Importing profiles from file: ${file.name}`)
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const profiles = JSON.parse(e.target?.result || '{}')
            userStore.importUsers(profiles)
            errorLogger.info(`Successfully imported ${Object.keys(profiles).length} profiles`)
          } catch (error) {
            errorLogger.error("Failed to parse JSON file", error)
            alert("Invalid JSON file format")
          }
        }
        reader.readAsText(file)
      }
    }
    
    return {
      authStore,
      userStore,
      uiStore,
      handleLogout,
      handleTabChange,
      importProfilesFromFile,
      // Add version info to returned properties
      version,
      vueVersion,
      framework,
      frameworkVersion,
      inspiraUiVersion  // Added this property to be used in the template
    }
  }
})
</script>

<style>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>