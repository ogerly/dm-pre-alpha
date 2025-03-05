<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-bold text-gray-900">Sign in</h2>
      </div>
      <div v-if="errors && errors.length > 0" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p v-for="(error, index) in errors" :key="index" class="error-message">
          {{ error }}
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input id="email" v-model="email" name="email" type="email" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address">
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" v-model="password" name="password" type="password" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password">
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <div>
              <p class="text-sm font-medium text-gray-700">Available test accounts:</p>
              <div v-if="loginData && loginData.length > 0" class="mt-1">
                <div v-for="account in loginData" :key="account.email" class="text-xs text-gray-500">
                  <strong>{{ account.email }}</strong> / password: <strong>{{ account.password }}</strong>
                </div>
              </div>
              <p v-else class="text-xs text-gray-500">Loading available accounts...</p>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" :disabled="isLoading">
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useErrorTracking } from '@/composables/useErrorTracking'
import loginDataJson from '@/assets/store-test-login-data.json'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const errors = ref([])
    const users = ref([])
    const loginData = ref([])
    const isLoading = ref(false)
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('LoginPage')

    // Load users and login data when component mounts
    onMounted(async () => {
      try {
        await trackAsyncOperation('load users', async () => {
          await userStore.loadUsers()
          users.value = userStore.users || []
          
          // Load login data from the json file
          if (loginDataJson && Array.isArray(loginDataJson)) {
            loginData.value = loginDataJson
            errorLogger.debug(`Loaded ${loginData.value.length} test accounts`)
            
            // Log account details for debugging
            loginData.value.forEach((account, index) => {
              errorLogger.debug(`Account ${index+1}: ${account.email}, Password: ${account.password}`)
            })
          } else {
            errorLogger.error('Login data is not valid', { 
              dataType: typeof loginDataJson,
              isArray: Array.isArray(loginDataJson),
              value: loginDataJson
            })
            loginData.value = []
          }
        })
      } catch (error) {
        errorLogger.error('Failed to load data for login page', error)
        users.value = []
        loginData.value = []
      }
    })

    const handleLogin = async () => {
      // Clear previous errors
      errors.value = []
      isLoading.value = true
      
      // Simple validation
      if (!email.value || !password.value) {
        errors.value.push('Please enter both email and password')
        isLoading.value = false
        return
      }
      
      try {
        errorLogger.debug(`Attempting login with: ${email.value}`)
        const success = await authStore.login({ 
          email: email.value, 
          password: password.value 
        })
        
        if (success) {
          errorLogger.info('Login successful, navigating to dashboard...')
          
          // Use router.replace instead of push to avoid history issues
          // Add a slight delay to ensure store updates are complete
          setTimeout(() => {
            router.replace({ path: '/' })
              .then(() => {
                errorLogger.info('Navigation to dashboard complete')
              })
              .catch(err => {
                errorLogger.error('Navigation failed after login', err)
              })
          }, 100)
        } else {
          // If login returned false but didn't throw an error
          errors.value.push('Invalid email or password')
          isLoading.value = false
        }
      } catch (error) {
        errorLogger.error('Login attempt failed', error)
        errors.value.push(error.message || 'Login failed. Please try again.')
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      errors,
      users,
      loginData,
      isLoading,
      handleLogin
    }
  }
}
</script>
