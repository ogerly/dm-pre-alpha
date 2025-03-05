<template>
  <div class="matching-view">
    
    <!-- Matching Container -->
    <MatchingContainer 
      :users="userStore.users"
      :filteredUsers="userStore.filteredUsers"
      :userForMatching="userStore.userForMatching"
      :matchResults="userStore.matchResults"
      @select-user="selectUser"
      @select-for-matching="userStore.selectForMatching"
      @edit-user="userStore.startEditing"
      @delete-user="deleteUser"
      @clear-matching="userStore.clearMatching"
      @start-chat="startChatWith"
      v-model="searchTerm"
    />
    
    <!-- Profile Form Modal -->
    <UserProfileForm
      v-if="userStore.editingUser || userStore.creatingUser"
      :user="userStore.editingUser"
      :editMode="!!userStore.editingUser"
      @save="saveProfile"
      @cancel="userStore.cancelEditing"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

import MatchingContainer from '@/components/matching/MatchingContainer.vue'
import UserProfileForm from '@/components/user/UserProfileForm.vue'

export default {
  name: 'MatchingView',
  
  components: {
    MatchingContainer,
    UserProfileForm
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    
    const searchTerm = ref('')
    
    // Sync search term with store
    onMounted(() => {
      searchTerm.value = userStore.searchTerm
    })
    
    // Watch for search term changes
    const handleSearchChange = (val) => {
      userStore.setSearchTerm(val)
    }
    
    // Navigation and action handlers
    const selectUser = (user) => {
      router.push(`/profile/${user.id}`)
    }
    
    const deleteUser = (userId) => {
      if (confirm('Sind Sie sicher, dass Sie dieses Profil löschen möchten?')) {
        userStore.deleteUser(userId)
      }
    }
    
    const saveProfile = (profile) => {
      userStore.saveUser(profile)
    }
    
    const startChatWith = (user) => {
      uiStore.startChatWith(user.id)
    }
    
    return {
      authStore,
      userStore,
      uiStore,
      searchTerm,
      selectUser,
      deleteUser,
      saveProfile,
      startChatWith,
      handleSearchChange
    }
  },
  
  watch: {
    searchTerm(newVal) {
      this.handleSearchChange(newVal)
    }
  }
}
</script>
