import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    currentUser: null,
    isAdmin: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userId: (state) => (state.currentUser ? state.currentUser.id : null),
  },

  actions: {
    async login(email, password) {
      const userStore = useUserStore()
      
      // Make sure users are loaded
      if (userStore.users.length === 0) {
        await userStore.loadUsers()
      }
      
      // Find matching user by email and password
      const user = userStore.users.find(profile => profile.email === email && profile.password === password)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Special case for test@example.com - always make admin
      const isTestUser = user.email === "test@example.com"
      const adminRole = isTestUser ? "admin" : user.role
      
      // Set current user and authentication state
      this.currentUser = {
        ...user,
        role: adminRole
      }
      this.isAuthenticated = true
      this.isAdmin = isTestUser || user.role === 'admin'
      
      // Save login state in localStorage with enforced admin role for test user
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isLoggedIn: true,
        role: adminRole
      }))
      
      // Log the state for debugging
      console.log('Login successful for:', user.name)
      console.log('Admin status:', this.isAdmin)
      console.log('User role:', adminRole)
      
      return user
    },
    
    logout() {
      this.currentUser = null
      this.isAuthenticated = false
      this.isAdmin = false
      
      // Remove from localStorage
      localStorage.removeItem('currentUser')
    },
    
    async checkAuth() {
      // Check localStorage for existing authentication
      const savedUser = localStorage.getItem('currentUser')
      
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        
        if (userData.isLoggedIn) {
          // Special case for test@example.com - always make admin
          const isTestUser = userData.email === "test@example.com"
          const adminRole = isTestUser ? "admin" : userData.role
          
          this.currentUser = {
            ...userData,
            role: adminRole
          }
          this.isAuthenticated = true
          this.isAdmin = isTestUser || adminRole === 'admin'
          
          // Also get the full user data
          const userStore = useUserStore()
          
          // Make sure users are loaded
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          const fullUserData = userStore.getUserById(userData.id)
          if (fullUserData) {
            this.currentUser = {...this.currentUser, ...fullUserData}
          }
          
          return true
        }
      }
      
      return false
    },
    
    updateCurrentUser(userData) {
      this.currentUser = {...this.currentUser, ...userData}
      
      // Update localStorage as well
      localStorage.setItem('currentUser', JSON.stringify({
        id: this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        isLoggedIn: true,
        role: this.currentUser.role || null
      }))
    }
  }
})
