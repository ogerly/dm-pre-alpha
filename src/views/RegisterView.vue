<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </router-link>
        </p>
      </div>

      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleRegister"
      >
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label
              for="name"
              class="sr-only"
            >Full name</label>
            <input 
              id="name" 
              v-model="name" 
              name="name" 
              type="text" 
              autocomplete="name"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Full name" 
            >
          </div>
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
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
              autocomplete="new-password" 
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Password" 
            >
          </div>
          <div>
            <label
              for="confirm-password"
              class="sr-only"
            >Confirm password</label>
            <input 
              id="confirm-password" 
              v-model="confirmPassword" 
              name="confirm-password" 
              type="password" 
              autocomplete="new-password" 
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="Confirm password" 
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="authStore.loading || !isFormValid"
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
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
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
            {{ authStore.loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>

      <!-- Password strength indicator -->
      <div
        v-if="password"
        class="mt-2"
      >
        <p class="text-sm mb-1">
          Password strength:
        </p>
        <div class="h-2 bg-gray-200 rounded-full">
          <div 
            class="h-full rounded-full transition-all duration-300"
            :class="{
              'bg-red-500': passwordStrength < 40,
              'bg-yellow-500': passwordStrength >= 40 && passwordStrength < 70,
              'bg-green-500': passwordStrength >= 70
            }"
            :style="`width: ${passwordStrength}%`"
          />
        </div>
        <ul class="text-xs text-gray-500 mt-1 space-y-1">
          <li :class="{ 'text-green-600': password.length >= 8 }">
            {{ password.length >= 8 ? '✓' : '×' }} At least 8 characters
          </li>
          <li :class="{ 'text-green-600': hasSpecialChar }">
            {{ hasSpecialChar ? '✓' : '×' }} At least one special character
          </li>
          <li :class="{ 'text-green-600': hasNumberChar }">
            {{ hasNumberChar ? '✓' : '×' }} At least one number
          </li>
          <li :class="{ 'text-green-600': hasUppercaseChar }">
            {{ hasUppercaseChar ? '✓' : '×' }} At least one uppercase letter
          </li>
        </ul>
      </div>
      
      <!-- Password match indicator -->
      <div
        v-if="password && confirmPassword"
        class="mt-2"
      >
        <p 
          :class="{
            'text-green-600': passwordsMatch,
            'text-red-600': !passwordsMatch
          }"
          class="text-sm"
        >
          {{ passwordsMatch ? '✓ Passwords match' : '× Passwords do not match' }}
        </p>
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
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'RegisterView',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    
    // Password validation
    const hasUppercaseChar = computed(() => /[A-Z]/.test(password.value))
    const hasNumberChar = computed(() => /\d/.test(password.value))
    // Fix: Remove unnecessary escape characters
    const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value))
    const passwordsMatch = computed(() => password.value === confirmPassword.value)
    
    // Calculate password strength
    const passwordStrength = computed(() => {
      if (!password.value) return 0
      
      let strength = 0
      
      // Length
      if (password.value.length >= 8) strength += 25
      if (password.value.length >= 12) strength += 10
      
      // Character types
      if (hasUppercaseChar.value) strength += 20
      if (hasNumberChar.value) strength += 20
      if (hasSpecialChar.value) strength += 25
      
      return Math.min(strength, 100)
    })
    
    // Form validation
    const isFormValid = computed(() => {
      return (
        email.value.trim() !== '' && 
        password.value.trim() !== '' && 
        confirmPassword.value.trim() !== '' && 
        passwordsMatch.value &&
        password.value.length >= 8
      )
    })
    
    const handleRegister = async () => {
      if (!isFormValid.value) {
        errorLogger.warn('Attempted to submit invalid registration form')
        return
      }
      
      try {
        const success = await authStore.register({
          name: name.value,
          email: email.value,
          password: password.value
        })
        
        if (success) {
          errorLogger.info('User registered successfully')
          router.push('/')
        } else {
          // Error is handled by the store
          errorLogger.warn('Registration failed')
        }
      } catch (error) {
        errorLogger.error('Unexpected error during registration', error)
      }
    }
    
    return {
      name,
      email,
      password,
      confirmPassword,
      authStore,
      handleRegister,
      hasUppercaseChar,
      hasNumberChar,
      hasSpecialChar,
      passwordStrength,
      passwordsMatch,
      isFormValid
    }
  }
})
</script>
