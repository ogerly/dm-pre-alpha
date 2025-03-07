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
            >
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
          <div class="mt-1">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            >
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
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
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
    
    // Handle login form submission
    const handleLogin = async () => {
      if (isLoading.value) return;
      
      error.value = '';
      isLoading.value = true;
      
      try {
        errorLogger.debug('Attempting login', { email: email.value });
        await authStore.login(email.value, password.value, rememberMe.value);
        errorLogger.info('Login successful');
        router.push('/');
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
      handleLogin
    };
  }
});
</script>
