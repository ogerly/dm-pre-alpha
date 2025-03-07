import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import errorLogger from '@/services/errorLogger'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken') || null)
  const loading = ref(false)
  const error = ref(null)
  
  // Computed properties
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // Check if the user is already authenticated
  async function checkAuth() {
    if (!token.value) return false
    
    try {
      loading.value = true
      error.value = null
      
      // In a real app, validate the token with a server
      // For this demo, we'll just use a mock user
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock user data
      user.value = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      }
      
      errorLogger.info('Auth check successful', { userId: user.value.id })
      return true
    } catch (err) {
      errorLogger.error('Auth check failed', err)
      error.value = 'Authentication failed'
      token.value = null
      user.value = null
      localStorage.removeItem('authToken')
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Login a user
  async function login(credentials) {
    try {
      loading.value = true
      error.value = null
      
      // Validate credentials
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password are required')
      }
      
      // In a real app, this would call an API
      // For this demo, we use a mock login
      
      // Check credentials (demo only)
      if (credentials.email === 'test@example.com' && credentials.password === 'test123') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Set auth token
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).slice(2)
        token.value = mockToken
        localStorage.setItem('authToken', mockToken)
        
        // Set user data
        user.value = {
          id: '1',
          name: 'Test User',
          email: credentials.email,
          role: 'user'
        }
        
        errorLogger.info('Login successful', { userId: user.value.id })
        return true
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (err) {
      errorLogger.error('Login failed', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Register a new user
  async function register(userData) {
    try {
      loading.value = true
      error.value = null
      
      // Validate input
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required')
      }
      
      // In a real app, this would call an API
      // For this demo, we use a mock registration
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Set auth token
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).slice(2)
      token.value = mockToken
      localStorage.setItem('authToken', mockToken)
      
      // Set user data
      user.value = {
        id: Math.random().toString(36).slice(2),
        name: userData.name || 'New User',
        email: userData.email,
        role: 'user'
      }
      
      errorLogger.info('Registration successful', { userId: user.value.id })
      return true
    } catch (err) {
      errorLogger.error('Registration failed', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Logout the user
  async function logout() {
    try {
      // In a real app, notify the server
      
      // Clear auth data
      token.value = null
      user.value = null
      localStorage.removeItem('authToken')
      
      errorLogger.info('Logout successful')
      return true
    } catch (err) {
      errorLogger.error('Logout failed', err)
      return false
    }
  }
  
  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    isAdmin,
    
    // Actions
    checkAuth,
    login,
    register,
    logout
  }
})
