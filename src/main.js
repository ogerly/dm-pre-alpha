import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useUIStore } from './stores/ui'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'
import './assets/styles/tailwind.css'

// Create Vue app
const app = createApp(App)

// Use Pinia
app.use(pinia)

// Use Router
app.use(router)

// Initialize stores
const uiStore = useUIStore()
const authStore = useAuthStore()
const userStore = useUserStore()

// Load initial data
async function initializeApp() {
  // Initialize UI settings (like dark mode)
  uiStore.initializeDarkMode()

  // Load user data
  await userStore.loadUsers()
  
  // Check authentication status
  await authStore.checkAuth()
  
  // Mount app after initial data is loaded
  app.mount('#app')
}

initializeApp()
