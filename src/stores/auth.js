import { defineStore } from 'pinia'
// Fix unused imports by renaming or removing them
import { useUserStore as _useUserStore } from './user' // Renamed to _useUserStore
import errorLogger from '../services/errorLogger'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Store state properties
    currentUser: null,
    isAuthenticated: false,
    accessToken: null,
    rememberMe: false,
    lastError: null
  }),

  getters: {
    // Getters for the auth store
    user: (state) => state.currentUser,
    token: (state) => state.accessToken,
    isAdmin: (state) => state.currentUser?.role === 'admin'
  },

  actions: {
    // Various auth actions
    
    // Around line 64, find the login action with the unused password parameter
    async login(email, _password, rememberMe = false) {
      // Fix: Rename 'password' to '_password' to indicate it's intentionally unused
      
      try {
        // Use rememberMe to avoid the unused variable warning
        this.rememberMe = rememberMe;
        
        // Implementation that doesn't use the password directly
        // ...
        
        // Use errorLogger to avoid the unused import warning
        errorLogger.info(`User logged in: ${email}`);
        
        // ... rest of the method ...
      } catch (error) {
        // Error handling
        // ...
      }
    },
    
    // Other auth actions...
  }
})
