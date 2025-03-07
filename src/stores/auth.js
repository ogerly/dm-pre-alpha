import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import errorLogger from '@/services/errorLogger';

// Simulate API call delay
const simulateApiCall = (success = true, delay = 800) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve();
      } else {
        reject(new Error('API call failed'));
      }
    }, delay);
  });
};

// Define auth store
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref('');
  const isLoading = ref(false);
  
  // Get initial state from localStorage if available
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    try {
      const parsedAuth = JSON.parse(storedAuth);
      user.value = parsedAuth.user;
      token.value = parsedAuth.token;
    } catch (err) {
      errorLogger.error('Failed to parse stored auth data', err);
      localStorage.removeItem('auth');
    }
  }
  
  // Computed
  const isAuthenticated = computed(() => Boolean(user.value && token.value));
  const isAdmin = computed(() => user.value?.role === 'admin');
  
  // Actions
  const login = async (email, password, remember = false) => {
    isLoading.value = true;
    
    try {
      // In a real app, you would make an actual API call
      await simulateApiCall(true);
      
      // Check test user credentials
      if (email === 'test@example.com' && password === 'test123') {
        // Success - set user data
        user.value = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        };
        
        // Generate a mock token
        token.value = `mock-jwt-token-${Date.now()}`;
        
        // Store in localStorage if remember is true
        if (remember) {
          const authData = { user: user.value, token: token.value };
          localStorage.setItem('auth', JSON.stringify(authData));
        }
        
        return;
      }
      
      // For admin login
      if (email === 'admin@example.com' && password === 'admin123') {
        user.value = {
          id: '2',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        };
        
        token.value = `mock-admin-jwt-token-${Date.now()}`;
        
        if (remember) {
          const authData = { user: user.value, token: token.value };
          localStorage.setItem('auth', JSON.stringify(authData));
        }
        
        return;
      }
      
      // Invalid credentials
      throw new Error('Invalid email or password');
    } catch (error) {
      errorLogger.error('Login error', error);
      throw new Error(error.message || 'Authentication failed');
    } finally {
      isLoading.value = false;
    }
  };
  
  const logout = async () => {
    try {
      // In a real app, call logout API endpoint
      await simulateApiCall(true, 300);
      
      // Clear user data
      user.value = null;
      token.value = '';
      
      // Remove from localStorage
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
      
    } catch (error) {
      errorLogger.error('Logout error', error);
      throw new Error('Logout failed');
    }
  };
  
  const checkAuth = async () => {
    // In a real app, validate the token with the server
    if (!token.value) return false;
    
    try {
      await simulateApiCall(true, 300);
      return isAuthenticated.value;
    } catch {
      // Token invalid, logout
      await logout();
      return false;
    }
  };
  
  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth
  };
});
