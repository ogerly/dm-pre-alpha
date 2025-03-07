<template>
  <header class="bg-white border-b shadow-sm">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center space-x-2"
        >
          <span class="text-xl font-bold text-blue-600">DreamMall</span>
        </router-link>
        
        <!-- Navigation Menu -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            v-for="item in mainNavItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-blue-600 transition-colors"
            active-class="text-blue-600 font-medium"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
      
      <!-- Right side items -->
      <div class="flex items-center space-x-4">
        <!-- User is authenticated -->
        <template v-if="authStore.isAuthenticated">
          <div class="hidden md:flex items-center space-x-3">
            <span class="text-gray-600 text-sm">
              {{ authStore.user?.name || authStore.user?.email }}
            </span>
            <button 
              class="text-sm text-gray-500 hover:text-red-600" 
              @click="logout"
            >
              Logout
            </button>
          </div>
        </template>
        
        <!-- User is not authenticated -->
        <template v-else>
          <router-link 
            to="/login" 
            class="text-sm text-gray-600 hover:text-blue-600"
          >
            Login
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import errorLogger from '@/services/errorLogger';

export default defineComponent({
  name: 'AppHeader',

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    // Main navigation items
    const mainNavItems = [
      { name: 'Home', path: '/' },
      { name: 'Profiles', path: '/profiles' },
      { name: 'Matching', path: '/matching' },
    ];

    // Method to handle logout
    const logout = async () => {
      try {
        errorLogger.info('User logging out');
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        errorLogger.error('Error during logout', error);
      }
    };

    return {
      authStore,
      mainNavItems,
      logout
    };
  }
});
</script>
