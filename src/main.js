import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import errorLogger from '@/services/errorLogger'
import { darkModeGlobal } from '@/composables/useDarkMode'

// Import our fixed CSS file with proper import order
import './assets/styles/global.css'

const pinia = createPinia()
const app = createApp(App)

// Global error handler
app.config.errorHandler = (error, vm, info) => {
  errorLogger.error(`Global error: ${info}`, error, {
    component: vm?.$options?.name || 'Unknown'
  })
}

// Add error tracking to router
router.beforeEach((to, from, next) => {
  try {
    errorLogger.trackViewLoad(to.name || 'unknown')
    errorLogger.debug(`Navigation: ${from.path} → ${to.path}`)
    next()
  } catch (error) {
    errorLogger.error("Router error", error)
    next(error)
  }
})

// Register errorLogger as a plugin to make it accessible in components
app.provide('errorLogger', errorLogger)

// Make dark mode available globally
app.provide('darkMode', darkModeGlobal)

app
  .use(pinia)
  .use(router)
  .mount('#app')

// Log app startup
errorLogger.info("Application started", {
  timestamp: new Date().toISOString(),
  vueVersion: app.version
})

// For debugging
window.errorLogger = errorLogger;
