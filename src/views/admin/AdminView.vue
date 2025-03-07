<template>
  <div class="admin-view">
    <!-- Loading State -->
    <div
      v-if="userStore.isLoading"
      class="loading-indicator"
    >
      <p>Lade Admin-Daten...</p>
    </div>
    
    <!-- Error State -->
    <div
      v-else-if="userStore.lastError"
      class="error-message"
    >
      <p>{{ userStore.lastError }}</p>
      <button
        class="retry-btn"
        @click="userStore.loadUsers(true)"
      >
        Erneut versuchen
      </button>
    </div>
    
    <!-- Main Admin Panel -->
    <AdminPanel 
      v-else
      :users="userStore.users"
      @view-user="viewUser"
      @edit-user="editUser"
      @delete-user="deleteUser"
      @system-reset="resetSystem"
      @update-user-role="updateUserRole"
    />

    <!-- User Profile Form Modal -->
    <UserProfileForm
      v-if="userStore.editingUser"
      :user="userStore.editingUser"
      :edit-mode="true"
      @save="saveProfile"
      @cancel="cancelEditing"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'

import AdminPanel from '@/components/admin/AdminPanel.vue'
import UserProfileForm from '@/components/user/UserProfileForm.vue'

export default defineComponent({
  name: 'AdminView',
  
  components: {
    AdminPanel,
    UserProfileForm
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    
    // Make sure users are loaded
    if (userStore.users.length === 0) {
      userStore.loadUsers()
    }
    
    // User management actions
    const viewUser = (user) => {
      router.push(`/profile/${user.id}`)
    }
    
    const editUser = (user) => {
      userStore.startEditing(user)
    }
    
    const cancelEditing = () => {
      userStore.cancelEditing()
    }
    
    const saveProfile = (profile) => {
      userStore.saveUser(profile)
    }
    
    const deleteUser = (userId) => {
      if (confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
        userStore.deleteUser(userId)
      }
    }
    
    // System actions
    const resetSystem = async () => {
      if (confirm('Sind Sie sicher, dass Sie das System zurücksetzen möchten? Alle Änderungen werden gelöscht.')) {
        await userStore.resetToInitialData()
      }
    }
    
    // New method to update user role
    const updateUserRole = async (userId, newRole) => {
      try {
        await userStore.updateUserRole(userId, newRole)
        
        // If the role was changed for the current user, update auth store
        if (userId === authStore.userId) {
          authStore.updateCurrentUser({ role: newRole })
        }
        
        alert(`Benutzerrolle wurde auf "${newRole}" geändert.`)
      } catch (error) {
        console.error('Error updating user role:', error)
        alert('Fehler beim Ändern der Benutzerrolle.')
      }
    }
    
    return {
      authStore,
      userStore,
      uiStore,
      viewUser,
      editUser,
      cancelEditing,
      saveProfile,
      deleteUser,
      resetSystem,
      updateUserRole
    }
  }
})
</script>

<style scoped>
.loading-indicator, .error-message {
  max-width: 1200px;
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

.retry-btn {
  margin-top: 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #4338ca;
}
</style>
