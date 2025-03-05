<template>
  <div class="admin-page">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Admin Dashboard</h1>
          <p class="text-gray-600" v-if="currentUser">
            Logged in as <span class="font-medium">{{ currentUser.email }}</span>
            <span class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
          </p>
        </div>
        
        <router-link 
          to="/" 
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Dashboard
        </router-link>
      </div>
      
      <!-- Admin Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- User Management -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">User Management</h2>
          <p class="mb-4">Administer user accounts and permissions</p>
          
          <div class="mb-4">
            <input
              type="text"
              v-model="userSearchTerm"
              placeholder="Search users by name, email or role..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div v-if="filteredAdminUsers.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="user in filteredAdminUsers" 
              :key="user.id" 
              class="border border-gray-200 p-3 rounded flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <span class="font-medium">{{ user.name }}</span>
                <p class="text-gray-500 text-sm">{{ user.email }}</p>
                <div class="flex items-center mt-1">
                  <span 
                    :class="{
                      'bg-red-100 text-red-800': user.role === 'admin',
                      'bg-blue-100 text-blue-800': user.role === 'user'
                    }"
                    class="inline-block text-xs px-2 py-1 rounded mr-2"
                  >
                    {{ user.role }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="editUser(user.id)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <p v-else-if="userStore.isLoading" class="text-center py-4">Loading users...</p>
          <p v-else class="text-center py-4">No users found matching your search</p>
          
          <div class="mt-4 flex justify-end">
            <button
              @click="createNewUser"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Add New User
            </button>
          </div>
        </div>
        
        <!-- System Settings -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">System Settings</h2>
          <p class="mb-4">Configure application parameters and settings</p>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium mb-2">Debug Mode</h3>
              <p class="text-sm text-gray-600 mb-2">Enable or disable application debugging features</p>
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="debug-mode" 
                  class="mr-2 h-5 w-5 text-blue-600"
                  v-model="debugModeEnabled"
                  @change="toggleDebugMode"
                />
                <label for="debug-mode">Enable Debug Mode</label>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium mb-2">Data Management</h3>
              <p class="text-sm text-gray-600 mb-2">Import or export application data</p>
              <div class="flex space-x-2">
                <label class="block w-full">
                  <span class="sr-only">Choose file</span>
                  <input type="file" accept=".json" 
                        class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                        @change="importData"/>
                </label>
                <button
                  @click="exportData"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Export
                </button>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium mb-2">System Logs</h3>
              <p class="text-sm text-gray-600 mb-2">View and manage system logs</p>
              <button
                @click="viewSystemLogs"
                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Statistics & Metrics -->
      <div class="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-3">System Statistics</h2>
        <p class="mb-4">Overview of system usage and performance metrics</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <h3 class="text-lg font-medium mb-1">Total Users</h3>
            <p class="text-3xl font-bold">{{ userStore.users.length }}</p>
            <p class="text-sm text-gray-600">Active accounts in the system</p>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4 bg-green-50">
            <h3 class="text-lg font-medium mb-1">Active Projects</h3>
            <p class="text-3xl font-bold">{{ getTotalProjects() }}</p>
            <p class="text-sm text-gray-600">Projects currently in progress</p>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4 bg-purple-50">
            <h3 class="text-lg font-medium mb-1">System Status</h3>
            <p class="text-xl font-bold text-green-600">Online</p>
            <p class="text-sm text-gray-600">All services operational</p>
          </div>
        </div>
      </div>
    </main>
    
    <AppActions />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import { useErrorTracking } from '@/composables/useErrorTracking'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'

export default defineComponent({
  name: 'AdminboardPage',
  
  components: {
    AppHeader,
    AppActions
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('AdminboardPage')
    
    const userSearchTerm = ref('')
    const debugModeEnabled = ref(import.meta.env.VITE_DEBUG === 'true')
    
    // Initialize dashboard
    onMounted(async () => {
      await trackAsyncOperation('admin dashboard initialization', async () => {
        try {
          errorLogger.debug('Admin dashboard mounted, checking authentication and privileges')
          
          // Check if user is authenticated
          if (!authStore.isAuthenticated) {
            errorLogger.warn('Admin dashboard accessed without authentication, redirecting to login')
            router.replace('/login')
            return
          }
          
          // Check if user is admin
          if (authStore.currentUser?.role !== 'admin') {
            errorLogger.warn(`Unauthorized access attempt to admin page by user with role: ${authStore.currentUser?.role}`)
            router.replace('/')
            return
          }
          
          // Load users if needed
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          errorLogger.info(`Admin dashboard loaded for admin: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing admin dashboard', error)
        }
      })
    })
    
    const currentUser = computed(() => {
      return authStore.currentUser
    })
    
    const filteredAdminUsers = computed(() => {
      if (!userSearchTerm.value) {
        return userStore.users
      }
      
      const term = userSearchTerm.value.toLowerCase()
      return userStore.users.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) || 
        (user.email && user.email.toLowerCase().includes(term)) || 
        (user.role && user.role.toLowerCase().includes(term))
      )
    })
    
    // User management functions
    const editUser = (userId) => {
      errorLogger.debug(`Editing user with ID: ${userId}`)
      const user = userStore.users.find(u => u.id === userId)
      if (user) {
        // In a real app, this would open a modal or navigate to a user edit form
        alert(`Edit user: ${user.name} (${user.email})`)
      } else {
        errorLogger.error(`User with ID ${userId} not found`)
      }
    }
    
    const deleteUser = (userId) => {
      errorLogger.debug(`Attempting to delete user with ID: ${userId}`)
      const user = userStore.users.find(u => u.id === userId)
      if (user) {
        if (confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) {
          // In a real app, this would call an API to delete the user
          errorLogger.info(`User deleted: ${user.email}`)
          alert(`User ${user.name} has been deleted`)
        }
      } else {
        errorLogger.error(`User with ID ${userId} not found`)
      }
    }
    
    const createNewUser = () => {
      errorLogger.debug('Creating new user')
      // In a real app, this would open a modal or navigate to a user creation form
      alert('Create new user form would open here')
    }
    
    // System settings functions
    const toggleDebugMode = () => {
      errorLogger.debug(`Debug mode toggled to: ${debugModeEnabled.value}`)
      // In a real app, this would update an environment variable or a setting in the database
      
      // Toggle error console visibility based on debug mode
      if (debugModeEnabled.value) {
        errorLogger.debug('Enabling error console')
      } else {
        errorLogger.debug('Disabling error console')
      }
    }
    
    const importData = (event) => {
      const file = event.target.files[0]
      if (file) {
        errorLogger.debug(`Importing data from file: ${file.name}`)
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result || '{}')
            // In a real app, this would process and validate the imported data
            errorLogger.info(`Successfully imported data from ${file.name}`)
            alert(`Data imported from ${file.name}`)
          } catch (error) {
            errorLogger.error("Failed to parse JSON file", error)
            alert("Invalid JSON file format")
          }
        }
        reader.readAsText(file)
      }
    }
    
    const exportData = () => {
      errorLogger.debug('Exporting system data')
      try {
        // In a real app, this would collect all necessary data
        const exportData = {
          users: userStore.users,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
        
        // Create and download a JSON file
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `dreammall-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        errorLogger.info('System data exported successfully')
      } catch (error) {
        errorLogger.error('Failed to export data', error)
        alert('Failed to export data')
      }
    }
    
    const viewSystemLogs = () => {
      errorLogger.debug('Viewing system logs')
      // In a real app, this might show a modal with logs or navigate to a log page
      alert('System logs would be displayed here')
    }
    
    // Helper functions
    const getTotalProjects = () => {
      // Count all projects across users
      let projectCount = 0
      
      userStore.users.forEach(user => {
        if (user.ownProjects && Array.isArray(user.ownProjects)) {
          projectCount += user.ownProjects.length
        }
        
        if (user.contributedProjects && Array.isArray(user.contributedProjects)) {
          projectCount += user.contributedProjects.length
        }
        
        if (user.iconCategories && user.iconCategories.projekt && Array.isArray(user.iconCategories.projekt)) {
          projectCount += user.iconCategories.projekt.length
        }
      })
      
      return projectCount
    }
    
    return {
      currentUser,
      userStore,
      userSearchTerm,
      filteredAdminUsers,
      debugModeEnabled,
      editUser,
      deleteUser,
      createNewUser,
      toggleDebugMode,
      importData,
      exportData,
      viewSystemLogs,
      getTotalProjects
    }
  }
})
</script>
