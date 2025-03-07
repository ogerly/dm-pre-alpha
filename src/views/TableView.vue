<template>
  <div class="table-view">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6">
        Data Tables
      </h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold">
              Users Table
            </h2>
            <p class="text-gray-600">
              View and manage all system users
            </p>
          </div>
          
          <div class="flex space-x-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search users..."
              class="px-3 py-2 border border-gray-300 rounded-md"
            >
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="name">
                Sort by Name
              </option>
              <option value="email">
                Sort by Email
              </option>
              <option value="role">
                Sort by Role
              </option>
            </select>
          </div>
        </div>
        
        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'bg-red-100 text-red-800': user.role === 'admin',
                      'bg-blue-100 text-blue-800': user.role === 'user'
                    }"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div
                    v-if="user.skills && user.skills.length"
                    class="flex flex-wrap gap-1"
                  >
                    <span 
                      v-for="skill in user.skills.slice(0, 2)" 
                      :key="skill"
                      class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {{ skill }}
                    </span>
                    <span
                      v-if="user.skills.length > 2"
                      class="inline-block text-xs text-gray-500"
                    >
                      +{{ user.skills.length - 2 }}
                    </span>
                  </div>
                  <div
                    v-else
                    class="text-xs text-gray-500"
                  >
                    No skills listed
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    class="text-blue-600 hover:text-blue-900 mr-3" 
                    @click="viewUser(user.id)"
                  >
                    View
                  </button>
                  <button 
                    v-if="isAdmin"
                    class="text-indigo-600 hover:text-indigo-900" 
                    @click="editUser(user.id)"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div
          v-if="filteredUsers.length === 0"
          class="text-center py-4 text-gray-500"
        >
          No users match your search criteria
        </div>
        
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing {{ filteredUsers.length }} of {{ userStore.users.length }} users
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">
              Previous
            </button>
            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">
              Next
            </button>
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
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useErrorTracking } from '@/composables/useErrorTracking'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'

export default defineComponent({
  name: 'TableView',
  
  components: {
    AppHeader,
    AppActions
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('TableView')
    
    const searchTerm = ref('')
    const sortBy = ref('name')
    
    onMounted(async () => {
      await trackAsyncOperation('initialize table view', async () => {
        try {
          // Check if user is authenticated
          if (!authStore.isAuthenticated) {
            router.replace('/login')
            return
          }
          
          // Load users if needed
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          errorLogger.info(`Table view loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing table view', error)
        }
      })
    })
    
    const isAdmin = computed(() => {
      return authStore.currentUser?.role === 'admin'
    })
    
    const filteredUsers = computed(() => {
      let users = [...userStore.users]
      
      // Filter by search term
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        users = users.filter(user => 
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.role && user.role.toLowerCase().includes(term)) ||
          (user.skills && user.skills.some(skill => skill.toLowerCase().includes(term)))
        )
      }
      
      // Sort users
      users.sort((a, b) => {
        if (sortBy.value === 'name') {
          return (a.name || '').localeCompare(b.name || '')
        } else if (sortBy.value === 'email') {
          return (a.email || '').localeCompare(b.email || '')
        } else if (sortBy.value === 'role') {
          return (a.role || '').localeCompare(b.role || '')
        }
        return 0
      })
      
      return users
    })
    
    const viewUser = (userId) => {
      errorLogger.debug(`Viewing user: ${userId}`)
      alert(`User details for ID ${userId} would open here`)
    }
    
    const editUser = (userId) => {
      errorLogger.debug(`Editing user: ${userId}`)
      alert(`Edit interface for user ID ${userId} would open here`)
    }
    
    return {
      searchTerm,
      sortBy,
      filteredUsers,
      isAdmin,
      viewUser,
      editUser,
      userStore
    }
  }
})
</script>
