import { defineStore } from 'pinia'
import { findTopMatches } from '@/services/MatchingService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    selectedUser: null,
    userForMatching: null,
    matchResults: [],
    searchTerm: '',
    isLoading: false,
    lastError: null,
    editingUser: null,
    creatingUser: false,
    
    // Storage keys and constants (migrated from StorageService)
    STORAGE_KEY: 'dreammall_profiles',
    DATA_JSON_PATHS: [
      '/data.json',
      './data.json',
      '/public/data.json',
      '../public/data.json',
      'data.json'
    ],
    // Auth users with valid credentials (matches data.json)
    AUTH_USERS: [
      {
        id: 2,
        email: "test@example.com",
        password: "test123",
      }
    ]
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
    // Load users - equivalent to initializeStorage and resetToInitialData
    async loadUsers(forceReset = false) {
      try {
        this.isLoading = true
        this.lastError = null
        
        if (forceReset) {
          console.log('Force reset requested, loading from data.json')
          await this.loadAndMergeDataJson()
          return this.users
        }
        
        const existingProfiles = this.getAllProfilesFromStorage()
        
        if (!existingProfiles || existingProfiles.length === 0) {
          console.log('No existing profiles found, importing from data.json')
          await this.loadAndMergeDataJson()
        } else {
          this.users = existingProfiles
        }
        
        return this.users
      } catch (error) {
        console.error('Error loading users:', error)
        this.lastError = error.message || 'Failed to load users'
        this.users = []
        return []
      } finally {
        this.isLoading = false
      }
    },
    
    // Get profiles from local storage
    getAllProfilesFromStorage() {
      try {
        const profilesJson = localStorage.getItem(this.STORAGE_KEY)
        const profiles = profilesJson ? JSON.parse(profilesJson) : []
        console.log(`Found ${profiles.length} profiles in localStorage`)
        return profiles
      } catch (error) {
        console.error('Error getting profiles from storage:', error)
        return []
      }
    },
    
    // Load and merge data from data.json
    async loadAndMergeDataJson() {
      let userData = null
      let lastError = null
      
      // Try each path in sequence until one works
      for (const path of this.DATA_JSON_PATHS) {
        try {
          console.log(`Attempting to load data.json from: ${path}`)
          const response = await fetch(path)
          
          if (response.ok) {
            userData = await response.json()
            console.log(`Successfully loaded ${userData.length} profiles from ${path}`)
            break // Exit the loop if successful
          } else {
            console.warn(`Failed to load from ${path}: ${response.status}`)
          }
        } catch (error) {
          lastError = error
          console.warn(`Error loading from ${path}:`, error.message)
        }
      }
      
      // If we couldn't load from any path, use hardcoded data
      if (!userData) {
        console.error('Failed to load data.json from any path, using hardcoded data')
        userData = this.getHardcodedUserData()
      }
      
      // Merge with auth data
      try {
        const mergedProfiles = userData.map(user => {
          // Find matching auth user
          const authUser = this.AUTH_USERS.find(auth => auth.id === user.id)
          if (authUser) {
            // For Test User (id=2), ALWAYS ensure admin role is set
            if (user.id === 2) {
              return {
                ...user,
                password: authUser.password,
                role: "admin" // Explicitly enforce admin role
              }
            }
            // For other users, just merge password
            return {
              ...user,
              password: authUser.password
            }
          }
          return user
        })
        
        // Add auth users that aren't in the data.json
        this.AUTH_USERS.forEach(authUser => {
          if (!mergedProfiles.some(p => p.id === authUser.id)) {
            console.log(`Adding missing auth user with id ${authUser.id} to profiles`)
            mergedProfiles.push({
              id: authUser.id,
              name: authUser.email.split('@')[0], // Generate a name from email
              email: authUser.email,
              password: authUser.password,
              role: authUser.id === 2 ? 'admin' : 'user',  // Make test@example.com an admin
              bio: "Automatically created user",
              skills: [],
              interests: [],
              iconCategories: {}
            })
          }
        })
        
        console.log(`Final merged profiles count: ${mergedProfiles.length}`)
        
        // Save merged data to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedProfiles))
        
        // Update our users state
        this.users = mergedProfiles
        
        return mergedProfiles
      } catch (error) {
        console.error('Error during profile merging:', error)
        const fallbackProfiles = this.createFallbackProfiles()
        this.users = fallbackProfiles
        return fallbackProfiles
      }
    },
    
    // Create fallback profiles if everything else fails
    createFallbackProfiles() {
      console.warn('Creating fallback profiles')
      
      const fallbackProfiles = this.AUTH_USERS.map(auth => ({
        id: auth.id,
        name: auth.email.split('@')[0], // Generate a name from email
        email: auth.email,
        password: auth.password,
        role: auth.id === 2 ? 'admin' : 'user',  // Make test@example.com an admin
        bio: "Fallback user profile",
        skills: [],
        interests: [],
        iconCategories: {}
      }))
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fallbackProfiles))
      console.log(`Fallback: saved ${fallbackProfiles.length} minimal profiles`)
      return fallbackProfiles
    },
    
    // Hardcoded user data as a last resort
    getHardcodedUserData() {
      console.warn('Using hardcoded user data')
      
      return [
        {
          "id": 2,
          "name": "Test User",
          "email": "test@example.com",
          "password": "test123",
          "role": "admin",  // Explicitly set role for test user
          "bio": "Ein erfahrener Software-Entwickler mit Schwerpunkt auf nachhaltigen Technologien.",
          "skills": ["Projektmanagement", "Agile Methoden", "Vue.js"],
          "interests": ["Digitalisierung", "Innovation", "Nachhaltigkeit"],
          "goals": "Teams bei der digitalen Transformation unterstützen.",
          "iconCategories": {
            "home": {
              "address": "München, Deutschland",
              "description": "Remote und lokale Arbeit möglich",
              "coordinates": [48.1351, 11.5820]
            }
          }
        },
        {
          "id": 3,
          "name": "Anna Schmidt",
          "email": "anna@example.com",
          "role": "user",  // Regular user
          "bio": "UX/UI Designerin mit Fokus auf benutzerfreundliche Interfaces.",
          "skills": ["UI Design", "UX Research", "Figma"],
          "interests": ["Design Thinking", "Nutzerzentriertes Design"],
          "goals": "Benutzerfreundliche Interfaces gestalten.",
          "iconCategories": {
            "home": {
              "address": "Hamburg, Deutschland",
              "description": "Remote",
              "coordinates": [53.5511, 9.9937]
            }
          }
        },
        {
          "id": 4,
          "name": "Jan Müller",
          "email": "jan@example.com",
          "role": "user",  // Regular user
          "bio": "Backend-Entwickler mit Erfahrung in Cloud-Infrastruktur.",
          "skills": ["Node.js", "Python", "AWS"],
          "interests": ["Cloud Computing", "DevOps"],
          "goals": "Skalierbare Systemarchitekturen entwickeln.",
          "iconCategories": {
            "home": {
              "address": "Frankfurt, Deutschland",
              "coordinates": [50.1109, 8.6821]
            }
          }
        }
      ]
    },
    
    // Reset the system to initial data
    async resetToInitialData() {
      // Clear localStorage first to ensure a clean slate
      localStorage.removeItem(this.STORAGE_KEY)
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
        console.error('Error saving user:', error)
        this.lastError = error.message || 'Failed to save user'
        throw error
      } finally {
        this.isLoading = false
      }
    },

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
        console.error('Error deleting user:', error)
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
        console.error('Error exporting users:', error)
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
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(jsonData))
        
        // Update our state
        this.users = jsonData
        
        return true
      } catch (error) {
        console.error('Error importing users:', error)
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
        console.error('Error updating all users:', error)
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
      // ... existing code for extracting projects ...
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
      // ... existing code for extracting tables ...
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
        console.error('Error updating user role:', error)
        this.lastError = error.message || 'Failed to update user role'
        return false
      } finally {
        this.isLoading = false
      }
    },

    // Add debugging method to check roles
    logUserRoles() {
      console.log("Current users and their roles:")
      this.users.forEach(user => {
        console.log(`User: ${user.name}, ID: ${user.id}, Email: ${user.email}, Role: ${user.role || 'undefined'}`)
      })
      
      // Check localStorage
      try {
        const storageData = localStorage.getItem(this.STORAGE_KEY)
        if (storageData) {
          const profiles = JSON.parse(storageData)
          console.log("\nUsers in localStorage:")
          profiles.forEach(user => {
            console.log(`User: ${user.name}, ID: ${user.id}, Role: ${user.role || 'undefined'}`)
          })
        }
      } catch (e) {
        console.error("Error reading localStorage:", e)
      }
    }
  }
})
