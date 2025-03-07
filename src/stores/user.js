import { defineStore } from 'pinia'
import { findTopMatches } from '@/services/MatchingService'
import errorLogger from '../services/errorLogger';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    authUsers: [],
    selectedUser: null,
    userForMatching: null,
    matchResults: [],
    searchTerm: '',
    isLoading: false,
    lastError: null,
    editingUser: null,
    creatingUser: false,
    
    // Storage keys and constants
    STORAGE_KEY: 'dreammall_profiles',
    DATA_JSON_PATHS: [
      '/src/assets/store-test-user-data.json',
      '/assets/store-test-user-data.json',
      './src/assets/store-test-user-data.json',
      '../src/assets/store-test-user-data.json',
      './assets/store-test-user-data.json',
      '../assets/store-test-user-data.json',
      'store-test-user-data.json',
      'data.json'
    ],
    AUTH_JSON_PATHS: [
      '/src/assets/store-test-login-data.json',
      '/assets/store-test-login-data.json',
      './src/assets/store-test-login-data.json',
      '../src/assets/store-test-login-data.json',
      './assets/store-test-login-data.json',
      '../assets/store-test-login-data.json',
      'store-test-login-data.json'
    ],
    isCreating: false
  }),

  getters: {
    allUsers: (state) => state.users,
    
    filteredUsers: (state) => {
      if (!state.searchTerm) return state.users
      
      const term = state.searchTerm.toLowerCase()
      return state.users.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) || 
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(term))) ||
        (user.interests && user.interests.some(interest => interest.toLowerCase().includes(term)))
      )
    },
    
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === Number(id)) || null
    },

    getMatchingResults: (state) => state.matchResults
  },

  actions: {
    // Load authentication users data from JSON
    async loadAuthUsers() {
      try {
        for (const path of this.AUTH_JSON_PATHS) {
          try {
            errorLogger.debug(`Attempting to load auth data from: ${path}`)
            const response = await fetch(path)
            
            if (response.ok) {
              this.authUsers = await response.json()
              errorLogger.info(`Successfully loaded ${this.authUsers.length} auth users from ${path}`)
              return this.authUsers
            }
          } catch (error) {
            errorLogger.warn(`Error loading auth data from ${path}:`, error.message)
          }
        }
        
        errorLogger.error('Failed to load auth data from any path')
        this.authUsers = []
        return []
      } catch (error) {
        errorLogger.error('Error in loadAuthUsers:', error)
        this.authUsers = []
        return []
      }
    },
    
    // Load users - main entry point for loading user data
    async loadUsers(forceReset = false) {
      try {
        this.isLoading = true
        this.lastError = null
        
        // First ensure we have auth users loaded
        await this.loadAuthUsers()
        
        if (forceReset) {
          errorLogger.debug('Force reset requested, loading from JSON files')
          await this.loadAndMergeDataJson()
          return this.users
        }
        
        const existingProfiles = this.getAllProfilesFromStorage()
        
        if (!existingProfiles || existingProfiles.length === 0) {
          errorLogger.debug('No existing profiles found, importing from JSON files')
          await this.loadAndMergeDataJson()
        } else {
          this.users = existingProfiles
        }
        
        return this.users
      } catch (error) {
        errorLogger.error('Error loading users:', error)
        this.lastError = error.message || 'Failed to load users'
        
        // Create minimal fallback data
        this.users = this.createFallbackProfiles()
        return this.users
      } finally {
        this.isLoading = false
      }
    },
    
    // Get profiles from local storage
    getAllProfilesFromStorage() {
      try {
        const profilesJson = localStorage.getItem(this.STORAGE_KEY)
        const profiles = profilesJson ? JSON.parse(profilesJson) : []
        errorLogger.debug(`Found ${profiles.length} profiles in localStorage`)
        return profiles
      } catch (error) {
        errorLogger.error('Error getting profiles from storage:', error)
        return []
      }
    },
    
    // Load and merge data from JSON files
    async loadAndMergeDataJson() {
      let userData = null
      
      // Try each path for user data in sequence until one works
      for (const path of this.DATA_JSON_PATHS) {
        try {
          errorLogger.debug(`Attempting to load user data from: ${path}`)
          const response = await fetch(path)
          
          if (response.ok) {
            userData = await response.json()
            errorLogger.info(`Successfully loaded ${userData.length} profiles from ${path}`)
            break
          } else {
            errorLogger.warn(`Failed to load from ${path}: ${response.status}`)
          }
        } catch (error) {
          errorLogger.warn(`Error loading from ${path}:`, error.message)
        }
      }
      
      // If we couldn't load user data from any path
      if (!userData) {
        errorLogger.error('Failed to load user data from any path')
        if (this.authUsers.length > 0) {
          // Create minimal profiles from auth users
          userData = this.authUsers.map(auth => ({
            id: auth.id,
            name: auth.email.split('@')[0], // Generate a name from email
            email: auth.email,
            role: auth.role || 'user',
            bio: "Minimal user profile",
            skills: [],
            interests: []
          }))
        } else {
          // No data at all - create a single test user
          userData = [{
            id: 999,
            name: "Emergency User",
            email: "emergency@example.com",
            role: "admin",
            bio: "Emergency fallback user",
            skills: ["Emergency", "Recovery"],
            interests: ["System Restoration"]
          }]
        }
      }
      
      // Merge with auth data
      try {
        const mergedProfiles = userData.map(user => {
          // Find matching auth user
          const authUser = this.authUsers.find(auth => auth.id === user.id)
          if (authUser) {
            // For id=2, always ensure admin role
            if (user.id === 2) {
              return {
                ...user,
                email: authUser.email || user.email,
                password: authUser.password,
                role: "admin" // Explicitly enforce admin role
              }
            }
            // For other users, merge auth data
            return {
              ...user,
              email: authUser.email || user.email,
              password: authUser.password,
              role: authUser.role || user.role || 'user'
            }
          }
          return user
        })
        
        // Add auth users that aren't in the profile data
        this.authUsers.forEach(authUser => {
          if (!mergedProfiles.some(p => p.id === authUser.id)) {
            errorLogger.debug(`Adding missing auth user with id ${authUser.id} to profiles`)
            mergedProfiles.push({
              id: authUser.id,
              name: authUser.email.split('@')[0], // Generate a name from email
              email: authUser.email,
              password: authUser.password,
              role: authUser.role || 'user',
              bio: "Automatically created user",
              skills: [],
              interests: [],
              iconCategories: {}
            })
          }
        })
        
        errorLogger.info(`Final merged profiles count: ${mergedProfiles.length}`)
        
        // Save merged data to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedProfiles))
        
        // Update our users state
        this.users = mergedProfiles
        
        return mergedProfiles
      } catch (error) {
        errorLogger.error('Error during profile merging:', error)
        const fallbackProfiles = this.createFallbackProfiles()
        this.users = fallbackProfiles
        return fallbackProfiles
      }
    },
    
    // Create fallback profiles if everything else fails
    createFallbackProfiles() {
      errorLogger.warn('Creating fallback profiles')
      
      // Start with auth users if available
      let fallbackProfiles = []
      
      if (this.authUsers.length > 0) {
        fallbackProfiles = this.authUsers.map(auth => ({
          id: auth.id,
          name: auth.email.split('@')[0], // Generate a name from email
          email: auth.email,
          password: auth.password,
          role: auth.id === 2 ? 'admin' : (auth.role || 'user'),
          bio: "Fallback user profile",
          skills: [],
          interests: [],
          iconCategories: {}
        }))
      } else {
        // If no auth users, create a single test user
        fallbackProfiles = [{
          id: 2,
          name: "Test User",
          email: "test@example.com",
          password: "test123",
          role: "admin",
          bio: "Fallback admin user",
          skills: [],
          interests: [],
          iconCategories: {}
        }]
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fallbackProfiles))
      errorLogger.info(`Fallback: saved ${fallbackProfiles.length} minimal profiles`)
      return fallbackProfiles
    },
    
    // Reset the system to initial data
    async resetToInitialData() {
      // Clear localStorage first to ensure a clean slate
      localStorage.removeItem(this.STORAGE_KEY)
      // Reload auth users to ensure we have the latest
      await this.loadAuthUsers()
      // Then load and merge the data
      return this.loadAndMergeDataJson()
    },
    
    // User management actions
    selectUser(user) {
      this.selectedUser = user
    },
    
    clearSelectedUser() {
      this.selectedUser = null
    },
    
    selectForMatching(user) {
      this.userForMatching = user
      // Run matching algorithm
      this.matchResults = findTopMatches(user, this.users)
    },
    
    clearMatching() {
      this.userForMatching = null
      this.matchResults = []
    },
    
    setSearchTerm(term) {
      this.searchTerm = term
    },
    
    startEditing(user) {
      this.editingUser = user
    },
    
    startCreating() {
      this.creatingUser = true
      this.isCreating = true
    },
    
    cancelEditing() {
      this.editingUser = null
      this.creatingUser = false
    },

    // Save a user profile (create or update)
    async saveUser(userData) {
      try {
        this.isLoading = true
        this.lastError = null
        
        // Get existing profiles
        const profiles = this.getAllProfilesFromStorage()
        const existingIndex = profiles.findIndex(p => p.id === userData.id)
        
        if (existingIndex >= 0) {
          // Update existing profile
          profiles[existingIndex] = userData
        } else {
          // Add new profile with a unique ID
          userData.id = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1
          profiles.push(userData)
        }
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles))
        
        // Update our state
        this.users = profiles
        this.editingUser = null
        this.creatingUser = false
        
        return userData
      } catch (error) {
        errorLogger.error('Error saving user:', error)
        this.lastError = error.message || 'Failed to save user'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete user
    async deleteUser(userId) {
      try {
        this.isLoading = true
        this.lastError = null
        
        // Get existing profiles
        const profiles = this.getAllProfilesFromStorage()
        const updatedProfiles = profiles.filter(p => p.id !== userId)
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProfiles))
        
        // Update our state
        this.users = updatedProfiles
        
        // Clear matching if the deleted user was being matched
        if (this.userForMatching && this.userForMatching.id === userId) {
          this.clearMatching()
        }
        
        // Clear selected user if needed
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.clearSelectedUser()
        }
        
        return true
      } catch (error) {
        errorLogger.error('Error deleting user:', error)
        this.lastError = error.message || 'Failed to delete user'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    // Export all profiles to a JSON file
    exportAllUsers() {
      try {
        const profiles = this.getAllProfilesFromStorage()
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "dreamMall_profiles.json")
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
        return true
      } catch (error) {
        errorLogger.error('Error exporting users:', error)
        this.lastError = error.message || 'Failed to export users'
        alert('Fehler beim Exportieren der Profile.')
        return false
      }
    },
    
    // Import profiles from data
    async importUsers(jsonData) {
      try {
        this.isLoading = true
        this.lastError = null
        
        // Load auth users first to ensure we have them
        await this.loadAuthUsers()
        
        // Merge imported data with auth data to ensure passwords and roles are preserved
        const mergedProfiles = jsonData.map(user => {
          const authUser = this.authUsers.find(auth => auth.id === user.id)
          if (authUser) {
            return {
              ...user,
              email: authUser.email || user.email,
              password: authUser.password,
              role: user.id === 2 ? 'admin' : (authUser.role || user.role || 'user')
            }
          }
          return user
        })
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedProfiles))
        
        // Update our state
        this.users = mergedProfiles
        
        return true
      } catch (error) {
        errorLogger.error('Error importing users:', error)
        this.lastError = error.message || 'Failed to import users'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    // Update all profiles at once
    updateAllUsers(profiles) {
      try {
        if (!Array.isArray(profiles)) {
          throw new Error('Data is not an array')
        }
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles))
        
        // Update our state
        this.users = profiles
        
        return true
      } catch (error) {
        errorLogger.error('Error updating all users:', error)
        this.lastError = error.message || 'Failed to update all users'
        return false
      }
    },
    
    // Mapping data methods for map view
    extractCompanies() {
      const companies = []
      
      this.users.forEach(user => {
        // From iconCategories.firma
        if (user.iconCategories?.firma) {
          const coordinates = user.iconCategories.firma.coordinates
          if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            companies.push({
              id: `firma-${user.id}`,
              name: user.iconCategories.firma.name || 'Firma',
              description: user.iconCategories.firma.description || '',
              location: {
                address: user.iconCategories.firma.address || '',
                coordinates: coordinates
              },
              owner: user
            })
          }
        }
        
        // From companies array
        if (user.companies) {
          user.companies.forEach((company, idx) => {
            const coordinates = company.coordinates
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              companies.push({
                id: `company-${user.id}-${idx}`,
                name: company.name || 'Unternehmen',
                description: company.description || '',
                location: {
                  address: company.address || '',
                  coordinates: coordinates
                },
                owner: user
              })
            }
          })
        }
      })
      
      return companies
    },
    
    extractProjects() {
      const projects = []
      
      this.users.forEach(user => {
        // From iconCategories.projekt
        if (user.iconCategories?.projekt && Array.isArray(user.iconCategories.projekt)) {
          user.iconCategories.projekt.forEach((project, idx) => {
            const coordinates = project.coordinates
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              projects.push({
                id: `icon-project-${user.id}-${idx}`,
                name: project.name || 'Projekt',
                description: project.description || '',
                status: 'Aktiv',
                location: {
                  address: project.address || '',
                  coordinates: coordinates
                },
                owner: user
              })
            }
          })
        }
        
        // From ownProjects and contributedProjects
        ['ownProjects', 'contributedProjects'].forEach(projectType => {
          if (user[projectType] && Array.isArray(user[projectType])) {
            user[projectType].forEach((project, idx) => {
              const coordinates = project.coordinates
              if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
                projects.push({
                  id: `${projectType}-${user.id}-${idx}`,
                  name: project.name || 'Projekt',
                  description: project.description || '',
                  status: 'Aktiv',
                  location: {
                    address: project.address || '',
                    coordinates: coordinates
                  },
                  owner: user
                })
              }
            })
          }
        })
      })
      
      return projects
    },
    
    extractTables() {
      const tables = []
      
      this.users.forEach(user => {
        if (user.iconCategories?.tisch && Array.isArray(user.iconCategories.tisch)) {
          user.iconCategories.tisch.forEach((table, idx) => {
            const coordinates = table.coordinates
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              tables.push({
                id: `table-${user.id}-${idx}`,
                name: table.name || 'Meetup',
                description: table.description || '',
                location: {
                  address: table.location || '',
                  coordinates: coordinates
                },
                host: {
                  name: user.name,
                  details: ''
                },
                owner: user
              })
            }
          })
        }
      })
      
      return tables
    },

    // Add a method to change user role
    async updateUserRole(userId, newRole) {
      try {
        this.isLoading = true
        this.lastError = null
        
        if (newRole !== 'admin' && newRole !== 'user') {
          throw new Error('Invalid role. Must be "admin" or "user"')
        }
        
        const profiles = this.getAllProfilesFromStorage()
        const userIndex = profiles.findIndex(user => user.id === userId)
        
        if (userIndex === -1) {
          throw new Error(`User with ID ${userId} not found`)
        }
        
        // Update the role
        profiles[userIndex].role = newRole
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles))
        
        // Update our state
        this.users = profiles
        
        return true
      } catch (error) {
        errorLogger.error('Error updating user role:', error)
        this.lastError = error.message || 'Failed to update user role'
        return false
      } finally {
        this.isLoading = false
      }
    },

    // Add debugging method to check roles
    logUserRoles() {
      errorLogger.debug("Current users and their roles:")
      this.users.forEach(user => {
        errorLogger.debug(`User: ${user.name}, ID: ${user.id}, Email: ${user.email}, Role: ${user.role || 'undefined'}`)
      })
      
      errorLogger.debug("\nAuth users:")
      this.authUsers.forEach(user => {
        errorLogger.debug(`Auth User: ID: ${user.id}, Email: ${user.email}, Role: ${user.role || 'undefined'}`)
      })
      
      // Check localStorage
      try {
        const storageData = localStorage.getItem(this.STORAGE_KEY)
        if (storageData) {
          const profiles = JSON.parse(storageData)
          errorLogger.debug("\nUsers in localStorage:")
          profiles.forEach(user => {
            errorLogger.debug(`User: ${user.name}, ID: ${user.id}, Role: ${user.role || 'undefined'}`)
          })
        }
      } catch (e) {
        errorLogger.error("Error reading localStorage:", e)
      }
    }
  }
})
