<template>
  <div class="map-view">
    
    <!-- Map Page Component -->
    <MapPage 
      :users="userStore.users" 
      :companies="userStore.extractCompanies()"
      :projects="userStore.extractProjects()"
      :tables="userStore.extractTables()"
      @update-users="updateUsers"
      @view-profile="viewProfile"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

import MapPage from '@/components/map/MapPage.vue'

export default defineComponent({
  name: 'MapView',
  
  components: {
    MapPage
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    
    // Navigation handlers
    const viewProfile = (user) => {
      router.push(`/profile/${user.id}`)
    }
    
    const updateUsers = (newUsers) => {
      userStore.updateAllUsers(newUsers)
    }
    
    return {
      authStore,
      userStore,
      uiStore,
      viewProfile,
      updateUsers
    }
  }
})
</script>
