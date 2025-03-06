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


<div id="sticky-banner" tabindex="-1" class="fixed top-0 start-0 z-50 flex justify-between w-full p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
    <div class="flex items-center mx-auto">
        <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            <span class="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center shrink-0">
                <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z"/>
                </svg>
                <span class="sr-only">Light bulb</span>
            </span>
            <span>New brand identity has been launched for the <a href="https://flowbite.com" class="inline font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">Flowbite Library</a></span>
        </p>
    </div>
    <div class="flex items-center">
        <button data-dismiss-target="#sticky-banner" type="button" class="shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close banner</span>
        </button>
    </div>
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
