<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </router-link>
        </p>
      </div>
      
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label
              for="email-address"
              class="sr-only"
            >Email address</label>
            <input 
              id="email-address" 
              v-model="email"
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Email address" 
            >
          </div>
          <div>
            <label
              for="password"
              class="sr-only"
            >Password</label>
            <input 
              id="password" 
              v-model="password"
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Password" 
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe"
              name="remember-me" 
              type="checkbox" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            >
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="authStore.loading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg 
                v-if="!authStore.loading" 
                class="h-5 w-5 text-blue-500 group-hover:text-blue-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fill-rule="evenodd" 
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                  clip-rule="evenodd" 
                />
              </svg>
              <svg 
                v-else
                class="animate-spin h-5 w-5 text-blue-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      
      <!-- Login hints for demo -->
      <div
        v-if="showDemoHint"
        class="mt-6 border-t pt-4"
      >
        <div class="bg-blue-50 p-4 rounded text-sm">
          <h3 class="font-medium text-blue-700 mb-1">
            Demo Login
          </h3>
          <p class="text-blue-600 mb-2">
            For testing, use these credentials:
          </p>
          <div class="bg-white p-2 rounded border border-blue-100">
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> test123</p>
          </div>
        </div>
      </div>
      
      <!-- Error display -->
      <div
        v-if="authStore.error"
        class="mt-4"
      >
        <div class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ authStore.error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'LoginView',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const showDemoHint = ref(true)
    
    const handleLogin = async () => {
      try {
        const success = await authStore.login({
          email: email.value,
          password: password.value,
          remember: rememberMe.value
        })
        
        if (success) {
          errorLogger.info('User logged in successfully')
          router.push('/')
        } else {
          // Error is handled by the store
          errorLogger.warn('Login failed', { email: email.value })
        }
      } catch (error) {
        errorLogger.error('Unexpected error during login', error)
      }
    }
    
    return {
      email,
      password,
      rememberMe,
      showDemoHint,
      authStore,
      handleLogin
    }
  }
})
</script>
