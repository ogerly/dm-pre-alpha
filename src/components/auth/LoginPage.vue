<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
    <!-- Add the background particles for a more engaging login page -->
    <ParticlesBg class="absolute inset-0 z-0" />
    
    <div class="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10 relative">
      <!-- Logo and sparkle effect on top of the form -->
      <div class="text-center relative">
        <Sparkles>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            DreamMall
          </h2>
        </Sparkles>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>
      
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <!-- Alert for errors -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 p-4 rounded-md"
        >
          <p class="text-sm text-red-800 dark:text-red-300">
            {{ error }}
          </p>
        </div>
        
        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
              :class="{ 'border-red-500': emailError }"
              @blur="validateEmail"
            >
            <p
              v-if="emailError"
              class="mt-1 text-sm text-red-600"
            >
              {{ emailError }}
            </p>
          </div>
        </div>
        
        <!-- Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
              :class="{ 'border-red-500': passwordError }"
              @blur="validatePassword"
            >
            <button 
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              @click="showPassword = !showPassword"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                :class="showPassword ? 'text-blue-500' : 'text-gray-500'"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  v-if="showPassword"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  v-if="!showPassword"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
            </button>
            <p
              v-if="passwordError"
              class="mt-1 text-sm text-red-600"
            >
              {{ passwordError }}
            </p>
          </div>
        </div>
        
        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            >
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          
          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        
        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="isLoading"
              class="flex items-center"
            >
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <!-- Quick Login Buttons -->
        <div class="mt-4">
          <p class="text-sm text-center text-gray-500 mb-2">
            Or use test account
          </p>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="fillTestCredentials"
          >
            Test User (test@example.com)
          </button>
        </div>
        
        <!-- Sign up link -->
        <div class="text-center text-sm">
          <p class="text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link 
              to="/register" 
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Sign up
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ParticlesBg from '@/components/ui/ParticlesBg.vue';
import Sparkles from '@/components/ui/Sparkles.vue';
import { useErrorTracking } from '@/composables/useErrorTracking';

export default defineComponent({
  name: 'LoginPage',
  
  components: {
    ParticlesBg,
    Sparkles
  },
  
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { errorLogger } = useErrorTracking('LoginPage');
    
    // Form state
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const error = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);
    
    // Validation states
    const emailError = ref('');
    const passwordError = ref('');
    
    // Validate email
    const validateEmail = () => {
      emailError.value = '';
      if (!email.value) {
        emailError.value = 'Email is required';
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        emailError.value = 'Please enter a valid email address';
        return false;
      }
      
      return true;
    };
    
    // Validate password
    const validatePassword = () => {
      passwordError.value = '';
      if (!password.value) {
        passwordError.value = 'Password is required';
        return false;
      }
      
      if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters';
        return false;
      }
      
      return true;
    };
    
    // Check if form is valid
    const isFormValid = computed(() => {
      return email.value && password.value && !emailError.value && !passwordError.value;
    });
    
    // Fill in test credentials
    const fillTestCredentials = () => {
      email.value = 'test@example.com';
      password.value = 'test123';
      emailError.value = '';
      passwordError.value = '';
    };
    
    // Handle login form submission
    const handleLogin = async () => {
      if (isLoading.value) return;
      
      // Validate form
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      
      if (!isEmailValid || !isPasswordValid) {
        return;
      }
      
      error.value = '';
      isLoading.value = true;
      
      try {
        errorLogger.debug('Attempting login', { email: email.value });
        await authStore.login(email.value, password.value, rememberMe.value);
        errorLogger.info('Login successful');
        router.push(router.currentRoute.value.query.redirect || '/');
      } catch (err) {
        errorLogger.error('Login failed', err);
        error.value = err.message || 'Failed to sign in. Please check your credentials.';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      email,
      password,
      rememberMe,
      error,
      isLoading,
      showPassword,
      emailError,
      passwordError,
      isFormValid,
      validateEmail,
      validatePassword,
      handleLogin,
      fillTestCredentials
    };
  }
});
</script>
