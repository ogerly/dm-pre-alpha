<template>
  <!-- Show login page if not authenticated - DON'T use LoginPage component directly -->
  <div v-if="!authStore.isLoggedIn" class="login-container">
    <router-view />
  </div>
  
  <!-- Show main app if authenticated -->
  <div v-else class="max-w-7xl mx-auto p-5 text-center">
    <!-- Header mit Navigation -->
    <AppHeader 
      :activeTab="uiStore.activeTab" 
      @update-tab="handleTabChange"
      :isLoggedIn="authStore.isLoggedIn"
      :showChat="uiStore.showChat"
      :currentUser="authStore.currentUser"
      :isAdmin="authStore.isAdmin"
      @toggle-chat="uiStore.toggleChat()"
      @logout="handleLogout"
    />
    
    <!-- App-Aktionen für das Matching -->
    <AppActions 
      v-if="uiStore.activeTab === 'matching'"
      @create-profile="userStore.startCreating()"
      @export-profiles="userStore.exportAllUsers()"
      @import-profiles="importProfilesFromFile"
    />
    
    <!-- Chat-Interface -->
    <ChatOverlay 
      v-if="authStore.isLoggedIn && uiStore.showChat" 
      :currentUserId="authStore.userId"
      :users="userStore.allUsers"
      :initialOtherUserId="uiStore.chatWithUserId"
      @close="uiStore.closeChat()"
    />
    
    <!-- Router View for main content -->
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

// Import components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'
import ChatOverlay from '@/components/chat/ChatOverlay.vue'

export default defineComponent({
  name: 'App',
  
  components: { 
    AppHeader,
    AppActions,
    ChatOverlay
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    
    // Load users when app starts
    userStore.loadUsers()
    
    // Handle logout
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }
    
    // Handle tab changes
    const handleTabChange = (tab) => {
      uiStore.setActiveTab(tab)
      router.push(`/${tab}`)
    }
    
    // Import profiles from file
    const importProfilesFromFile = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const profiles = JSON.parse(e.target.result)
          userStore.importUsers(profiles)
        }
        reader.readAsText(file)
      }
    }
    
    return {
      authStore,
      userStore,
      uiStore,
      handleLogout,
      handleTabChange,
      importProfilesFromFile
    }
  }
})
</script>

<style>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>