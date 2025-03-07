<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      User Profiles
    </h1>
    
    <div class="mb-6">
      <div class="flex items-center mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search profiles..."
          class="px-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
        >
        <div class="ml-4">
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
            :disabled="userStore.isLoading"
            @click="loadUsers"
          >
            <template v-if="userStore.isLoading">
              Loading...
            </template>
            <template v-else>
              Refresh
            </template>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="userStore.isLoading"
      class="text-center py-8"
    >
      <div class="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <p class="mt-2 text-gray-600">
        Loading profiles...
      </p>
    </div>

    <div
      v-else-if="filteredProfiles.length === 0"
      class="bg-gray-100 p-8 text-center rounded-lg"
    >
      <p class="text-gray-600">
        No profiles found matching your search criteria.
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div 
        v-for="profile in filteredProfiles" 
        :key="profile.id" 
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-xl font-semibold">
              {{ profile.name }}
            </h3>
            <p class="text-gray-500">
              {{ profile.email }}
            </p>
          </div>
          <span 
            v-if="profile.role === 'admin'" 
            class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded"
          >
            Admin
          </span>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-700">
            {{ profile.bio || 'No bio provided' }}
          </p>
        </div>
        
        <div class="mb-3">
          <p class="text-sm text-gray-600 font-medium mb-1">
            Location:
          </p>
          <p>{{ profile.location || 'Not specified' }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-600 font-medium mb-1">
            Skills:
          </p>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="skill in profile.skills || []" 
              :key="skill"
              class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {{ skill }}
            </span>
            <span
              v-if="!profile.skills || profile.skills.length === 0"
              class="text-gray-500 text-sm"
            >
              No skills listed
            </span>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t flex justify-end">
          <button 
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            @click="viewProfileDetail(profile.id)"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'ProfilesView',
  
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const searchQuery = ref('')
    
    // Load users when component mounts
    onMounted(async () => {
      if (userStore.users.length === 0) {
        try {
          await userStore.loadUsers()
          errorLogger.info('Profiles loaded successfully', { count: userStore.users.length })
        } catch (error) {
          errorLogger.error('Failed to load profiles', error)
        }
      }
    })
    
    // Filter profiles based on search query
    const filteredProfiles = computed(() => {
      if (!searchQuery.value) {
        return userStore.users
      }
      
      const query = searchQuery.value.toLowerCase()
      return userStore.users.filter(profile => {
        // Search in name, email, bio, location and skills
        return (
          (profile.name && profile.name.toLowerCase().includes(query)) ||
          (profile.email && profile.email.toLowerCase().includes(query)) ||
          (profile.bio && profile.bio.toLowerCase().includes(query)) ||
          (profile.location && profile.location.toLowerCase().includes(query)) ||
          (profile.skills && profile.skills.some(skill => skill.toLowerCase().includes(query)))
        )
      })
    })
    
    // Load users method
    const loadUsers = async () => {
      try {
        await userStore.loadUsers()
        errorLogger.info('Profiles refreshed', { count: userStore.users.length })
      } catch (error) {
        errorLogger.error('Failed to refresh profiles', error)
      }
    }
    
    // View profile detail
    const viewProfileDetail = (id) => {
      // In a real app, you'd navigate to a detail page
      // For now, we'll just log it
      errorLogger.info('Viewing profile details', { profileId: id })
      alert(`Viewing profile ${id} - This would navigate to a detail page in a real app`)
    }
    
    return {
      userStore,
      searchQuery,
      filteredProfiles,
      loadUsers,
      viewProfileDetail
    }
  }
})
</script>
