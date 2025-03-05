<template>
  <div class="home-container">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-4">Welcome to DreamMall Matching</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">User Profiles</h2>
          <p class="mb-4">View and manage user profiles</p>
          
          <div class="mb-4">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search users..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div v-if="filteredUsers.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="border border-gray-200 p-3 rounded flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <span class="font-medium">{{ user.name }}</span>
                <p class="text-gray-500 text-sm">{{ user.email }}</p>
                <div v-if="user.skills && user.skills.length" class="mt-1">
                  <span 
                    v-for="skill in user.skills.slice(0, 3)" 
                    :key="skill"
                    class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                  >
                    {{ skill }}
                  </span>
                  <span v-if="user.skills.length > 3" class="text-xs text-gray-500">
                    +{{ user.skills.length - 3 }} more
                  </span>
                </div>
              </div>
              <div>
                <span 
                  v-if="user.role === 'admin'" 
                  class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                >
                  Admin
                </span>
              </div>
            </div>
          </div>
          <p v-else-if="userStore.isLoading" class="text-center py-4">Loading users...</p>
          <p v-else class="text-center py-4">No users available</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">Import Profiles</h2>
          <p class="mb-4">Upload a JSON file to import user profiles</p>
          <label class="block mb-4">
            <span class="sr-only">Choose file</span>
            <input type="file" accept=".json" 
                  class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                  @change="importProfilesFromFile"/>
          </label>
          
          <div class="border-t pt-4 mt-4">
            <h3 class="font-medium mb-2">Default Test User</h3>
            <p class="text-sm text-gray-600 mb-2">Email: test@example.com</p>
            <p class="text-sm text-gray-600">Password: test123</p>
          </div>
        </div>
      </div>
    </main>
    
    <AppActions />
    <ChatOverlay v-if="uiStore.isChatOpen" />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'
import ChatOverlay from '@/components/chat/ChatOverlay.vue'

export default defineComponent({
  name: 'HomePage',
  
  components: {
    AppHeader,
    AppActions,
    ChatOverlay
  },
  
  setup() {
    const userStore = useUserStore()
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const searchTerm = ref('')
    
    // Load users if needed
    if (userStore.users.length === 0) {
      userStore.loadUsers()
    }
    
    const filteredUsers = computed(() => {
      if (!searchTerm.value) return userStore.users
      
      const term = searchTerm.value.toLowerCase()
      return userStore.users.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) || 
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(term)))
      )
    })
    
    const importProfilesFromFile = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const profiles = JSON.parse(e.target?.result || '{}')
            userStore.importUsers(profiles)
          } catch (error) {
            console.error("Failed to parse JSON file", error)
            alert("Invalid JSON file")
          }
        }
        reader.readAsText(file)
      }
    }
    
    return {
      userStore,
      uiStore,
      authStore,
      searchTerm,
      filteredUsers,
      importProfilesFromFile
    }
  }
})
</script>
