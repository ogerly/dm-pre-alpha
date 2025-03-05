<template>
  <div class="not-found">
    <div class="container">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div class="actions">
        <button class="action-button primary" @click="goToHome">
          Go to Dashboard
        </button>
        <button class="action-button secondary" @click="goBack">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorTracking } from '@/composables/useErrorTracking'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'NotFoundPage',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { errorLogger } = useErrorTracking('NotFoundPage')
    
    // Log that 404 page was accessed
    errorLogger.warn('404 page accessed', {
      path: window.location.pathname,
      referrer: document.referrer
    })
    
    const goToHome = () => {
      if (authStore.isAuthenticated) {
        router.push('/')
      } else {
        router.push('/login')
      }
    }
    
    const goBack = () => {
      router.go(-1)
    }
    
    return {
      goToHome,
      goBack
    }
  }
})
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background-color: #f7f7f7;
}

.container {
  max-width: 500px;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.primary:hover {
  background-color: #1d4ed8;
}

.secondary {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.secondary:hover {
  background-color: #f3f4f6;
}
</style>
