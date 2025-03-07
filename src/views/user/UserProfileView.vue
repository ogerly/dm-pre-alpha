<template>
  <div class="profile-view">
    <div
      v-if="loading"
      class="loading-indicator"
    >
      <p>Lade Benutzerprofil...</p>
    </div>
    
    <div
      v-else-if="error"
      class="error-message"
    >
      <p>{{ error }}</p>
      <button
        class="back-btn"
        @click="router.push('/matching')"
      >
        Zurück zur Übersicht
      </button>
    </div>
    
    <div v-else>
      <!-- If viewing own profile -->
      <UserOverview 
        v-if="isOwnProfile"
        :user="viewedUser"
        @edit-profile="navigateToEdit"
      />
      
      <!-- If viewing someone else's profile -->
      <UserProfile 
        v-else
        :user="viewedUser" 
        @close="router.push('/matching')"
      />
      
      <!-- Profile Form Modal -->
      <UserProfileForm
        v-if="editing"
        :user="viewedUser"
        :edit-mode="true"
        @save="saveProfile"
        @cancel="editing = false"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserProfile from '@/components/user/UserProfile.vue'
import UserOverview from '@/components/user/UserOverview.vue'
import UserProfileForm from '@/components/user/UserProfileForm.vue'
import { 
  getAllProfiles as _getAllProfiles,
  saveProfile as saveProfileToStorage,
  resetToInitialData 
} from '@/services/StorageService.js'

export default {
  name: 'UserProfileView',
  components: {
    UserProfile,
    UserOverview,
    UserProfileForm
  },
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  setup(props) {
    const _props = props;
    const router = useRouter()
    const route = useRoute()
    const users = ref([])
    const viewedUser = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const editing = ref(false)
    const showChat = ref(false)
    const chatWithUserId = ref(null)
    
    // Get current user from localStorage
    const currentUserData = localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser')) 
      : null
      
    const currentUser = ref(currentUserData)
    const currentUserId = ref(currentUserData?.id || null)
    const isAdmin = ref(currentUserData?.role === 'admin')
    
    // Determine if viewing own profile
    const isOwnProfile = computed(() => {
      if (!viewedUser.value || !currentUser.value) return false
      
      // Check if viewing by ID in route or self profile
      const profileId = route.params.id ? parseInt(route.params.id) : null
      
      return profileId 
        ? profileId === currentUser.value.id 
        : viewedUser.value.id === currentUser.value.id
    })
    
    // Initialize data
    onMounted(async () => {
      await initializeData()
    })
    
    const initializeData = async () => {
      try {
        loading.value = true
        error.value = null
        
        const profiles = await resetToInitialData()
        users.value = profiles
        
        // Get user from route param or current user
        const userId = route.params.id ? parseInt(route.params.id) : currentUser.value?.id
        
        if (userId) {
          viewedUser.value = users.value.find(user => user.id === userId)
          
          if (!viewedUser.value) {
            error.value = 'Benutzer nicht gefunden.'
          }
        } else {
          viewedUser.value = currentUser.value
        }
      } catch (err) {
        error.value = 'Fehler beim Laden des Benutzerprofils.'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    const handleLogout = () => {
      localStorage.removeItem('currentUser')
      router.push('/login')
    }
    
    const handleTabChange = (tab) => {
      router.push(`/${tab}`)
    }
    
    const closeChat = () => {
      showChat.value = false
      chatWithUserId.value = null
    }
    
    const navigateToEdit = () => {
      editing.value = true
    }
    
    const saveProfile = (profile) => {
      saveProfileToStorage(profile)
      editing.value = false
      // Refresh the data
      initializeData()
    }
    
    return {
      router,
      users,
      viewedUser,
      loading,
      error,
      editing,
      isOwnProfile,
      showChat,
      chatWithUserId,
      currentUser,
      currentUserId,
      isAdmin,
      handleLogout,
      handleTabChange,
      closeChat,
      navigateToEdit,
      saveProfile
    }
  }
}
</script>

<style scoped>
.loading-indicator, .error-message {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-message {
  color: #e53e3e;
}

.back-btn {
  margin-top: 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
