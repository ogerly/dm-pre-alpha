<template>
  <div class="settings-view">
    <!-- Add header component to use it -->
    <AppHeader />
    
    <div class="container mx-auto py-6 px-4">
      <div
        v-if="userStore.isLoading"
        class="loading-indicator"
      >
        <p>Lade Einstellungen...</p>
      </div>
      
      <!-- Settings component -->
      <UserSettings 
        v-else
        :user="authStore.currentUser" 
        @update-user="updateUserSettings"
      />
    </div>
    
    <!-- Add actions component to use it -->
    <AppActions />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useErrorTracking } from '@/composables/useErrorTracking'
import UserSettings from '@/components/user/UserSettings.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'

export default defineComponent({
  name: 'UserSettingsView',
  
  components: {
    UserSettings,
    AppHeader,
    AppActions
  },
  
  setup() {
    // Fix: Rename unused variables to use underscore prefix
    const _router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const { errorLogger: _errorLogger } = useErrorTracking('UserSettingsView')
    
    // Update user settings
    const updateUserSettings = async (updatedUser) => {
      try {
        // Save the updated user
        await userStore.saveUser(updatedUser)
        
        // Update auth store with new user details
        authStore.updateCurrentUser(updatedUser)
        
        // Success notification
        alert('Benutzereinstellungen wurden erfolgreich gespeichert.')
      } catch (error) {
        console.error('Failed to update user settings:', error)
        alert('Fehler beim Speichern der Einstellungen.')
      }
    }
    
    return {
      authStore,
      userStore,
      updateUserSettings
    }
  }
})
</script>

<style scoped>
.loading-indicator {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>