import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import loginData from '@/assets/store-test-login-data.json'
import errorLogger from '@/services/errorLogger'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAuthLoading = ref(false)
  
  // Check if user is logged in from localStorage
  const checkAuth = async () => {
    errorLogger.debug('Checking authentication status')
    
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser.value = JSON.parse(storedUser)
        errorLogger.info(`User authenticated: ${currentUser.value.email}`)
        return true
      }
      
      errorLogger.debug('No stored authentication found')
      return false
    } catch (error) {
      errorLogger.error('Error checking authentication', error)
      return false
    }
  }
  
  // Login with credentials
  const login = async ({ email, password }) => {
    errorLogger.debug(`Login attempt for: ${email}`)
    isAuthLoading.value = true
    
    try {
      // Verify loginData is available
      if (!loginData || !Array.isArray(loginData)) {
        errorLogger.error('Login data not available or invalid format', { 
          dataType: typeof loginData,
          isArray: Array.isArray(loginData)
        })
        return false
      }
      
      errorLogger.debug(`Available accounts: ${loginData.length}`)
      
      // Debug: Log all available accounts (remove in production)
      loginData.forEach(account => {
        errorLogger.debug(`Account: ${account.email}, Password: ${account.password}`)
      })
      
      // Compare credentials with all entries in the login data
      const matchedUser = loginData.find(user => 
        user && user.email && user.password &&
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
      )
      
      if (matchedUser) {
        errorLogger.debug(`Found matching user: ${matchedUser.email}`)
        
        // Create current user object without password
        const { password, ...userWithoutPassword } = matchedUser
        currentUser.value = userWithoutPassword
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        
        errorLogger.info(`Login successful for: ${email}`)
        return true
      } else {
        // Log additional debug information to help trace the issue
        const emailExists = loginData.some(u => u && u.email && u.email.toLowerCase() === email.toLowerCase())
        
        if (emailExists) {
          errorLogger.warn(`Login failed for ${email}: Invalid password`)
        } else {
          errorLogger.warn(`Login failed for ${email}: User not found`)
        }
        return false
      }
    } catch (error) {
      errorLogger.error(`Login error for ${email}`, error)
      throw new Error('Authentication failed. Please try again.')
    } finally {
      isAuthLoading.value = false
    }
  }
  
  // Logout user
  const logout = () => {
    errorLogger.debug('Logging out user')
    currentUser.value = null
    localStorage.removeItem('currentUser')
    errorLogger.info('User logged out successfully')
  }
  
  return {
    currentUser,
    isAuthenticated,
    isAuthLoading,
    checkAuth,
    login,
    logout
  }
})
