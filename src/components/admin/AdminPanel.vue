<template>
  <div class="admin-panel">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Admin-Bereich</span>
      </div>
      
      <!-- Dashboard overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <h3 class="text-blue-700 text-lg font-medium">Benutzer</h3>
          <p class="text-3xl font-bold">{{ users.length }}</p>
          <p class="text-sm text-blue-600">Registrierte Benutzer</p>
        </div>
        
        <div class="stat-card bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <h3 class="text-green-700 text-lg font-medium">Matches</h3>
          <p class="text-3xl font-bold">{{ totalMatches }}</p>
          <p class="text-sm text-green-600">Erfolgreiche Matches</p>
        </div>
        
        <div class="stat-card bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
          <h3 class="text-purple-700 text-lg font-medium">Aktivität</h3>
          <p class="text-3xl font-bold">{{ activeUsers }}</p>
          <p class="text-sm text-purple-600">Aktive Benutzer heute</p>
        </div>
      </div>
      
      <!-- Admin Tabs -->
      <TabGroup
        v-model="activeTab"
        :tabs="adminTabs"
        custom-class="border-b border-gray-200 pb-2"
      />
      
      <!-- Users Management Tab -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Benutzerverwaltung</h3>
          <div class="flex gap-2">
            <input 
              type="text" 
              v-model="userSearch" 
              placeholder="Suche nach Benutzern..." 
              class="p-2 border border-gray-300 rounded text-sm"
            >
            <button class="bg-primary text-white py-2 px-4 rounded text-sm">
              <i class="fas fa-plus mr-1"></i> Benutzer hinzufügen
            </button>
          </div>
        </div>
        
        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rolle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letzte Anmeldung</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Aktiv
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <select 
                      :value="user.role || 'user'"
                      @change="changeUserRole(user.id, $event)"
                      class="py-1 px-2 border border-gray-300 rounded"
                    >
                      <option value="user">Benutzer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.lastLogin) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              
              <!-- No results message -->
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Keine Benutzer gefunden
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- System Settings Tab -->
      <div v-if="activeTab === 'settings'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">System-Einstellungen</h3>
        
        <form @submit.prevent="saveSystemSettings" class="space-y-6">
          <div class="border border-gray-200 rounded-md p-4">
            <h4 class="font-medium mb-3">Allgemein</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="site-name" class="block text-sm font-medium text-gray-700 mb-1">Plattform-Name</label>
                <input type="text" id="site-name" v-model="systemSettings.siteName" class="w-full p-2 border border-gray-300 rounded">
              </div>
              
              <div class="form-group">
                <label for="site-description" class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <input type="text" id="site-description" v-model="systemSettings.siteDescription" class="w-full p-2 border border-gray-300 rounded">
              </div>
            </div>
            
            <div class="form-group mt-4">
              <label for="maintenance-mode" class="flex items-center">
                <input type="checkbox" id="maintenance-mode" v-model="systemSettings.maintenanceMode" class="mr-2">
                <span class="text-sm font-medium text-gray-700">Wartungsmodus aktivieren</span>
              </label>
              <p class="text-xs text-gray-500 mt-1">Im Wartungsmodus ist die Plattform nur für Admins zugänglich.</p>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-md p-4">
            <h4 class="font-medium mb-3">Benutzerverwaltung</h4>
            
            <div class="form-group">
              <label for="allow-registration" class="flex items-center">
                <input type="checkbox" id="allow-registration" v-model="systemSettings.allowRegistration" class="mr-2">
                <span class="text-sm font-medium text-gray-700">Neue Registrierungen erlauben</span>
              </label>
            </div>
            
            <div class="form-group mt-4">
              <label for="approval-required" class="flex items-center">
                <input type="checkbox" id="approval-required" v-model="systemSettings.approvalRequired" class="mr-2">
                <span class="text-sm font-medium text-gray-700">Bestätigung durch Admin erforderlich</span>
              </label>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-md p-4">
            <h4 class="font-medium mb-3">Backup & System</h4>
            
            <div class="space-y-3">
              <button type="button" @click="backupDatabase" class="bg-indigo-50 text-indigo-700 py-2 px-4 rounded hover:bg-indigo-100 transition-colors">
                <i class="fas fa-database mr-2"></i> Datenbank sichern
              </button>
              
              <button type="button" @click="showResetModal = true" class="bg-red-50 text-red-700 py-2 px-4 rounded hover:bg-red-100 transition-colors">
                <i class="fas fa-redo-alt mr-2"></i> Zurücksetzen
              </button>
            </div>
          </div>
          
          <div class="text-right">
            <button type="submit" class="bg-primary text-white py-2 px-6 rounded hover:bg-indigo-600 transition-colors">
              Einstellungen speichern
            </button>
          </div>
        </form>
      </div>
      
      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">Analytics & Statistiken</h3>
        
        <!-- Chart placeholder -->
        <div class="bg-gray-50 p-4 rounded-md mb-6">
          <h4 class="text-base font-medium mb-2">Benutzeraktivität</h4>
          <div class="h-48 flex items-center justify-center bg-gray-100 rounded">
            <p class="text-gray-500">Chart: Benutzeraktivität der letzten 30 Tage</p>
          </div>
        </div>
        
        <!-- Stats grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 p-3 rounded-md text-center">
            <p class="text-gray-500 text-sm">Neue Benutzer (Monat)</p>
            <p class="text-xl font-semibold">{{ stats.newUsers }}</p>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-md text-center">
            <p class="text-gray-500 text-sm">Erfolgreiche Matches</p>
            <p class="text-xl font-semibold">{{ stats.matches }}</p>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-md text-center">
            <p class="text-gray-500 text-sm">Durchschn. Sitzungsdauer</p>
            <p class="text-xl font-semibold">{{ stats.avgSessionTime }}</p>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-md text-center">
            <p class="text-gray-500 text-sm">Aktive Chats</p>
            <p class="text-xl font-semibold">{{ stats.activeChats }}</p>
          </div>
        </div>
        
        <!-- Most active users -->
        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="text-base font-medium mb-2">Aktivste Nutzer</h4>
          <div class="space-y-2">
            <div v-for="(user, index) in mostActiveUsers" :key="index" class="flex justify-between items-center p-2 bg-white rounded">
              <div>
                <span class="font-medium">{{ user.name }}</span>
                <span class="text-gray-500 text-sm ml-2">{{ user.email }}</span>
              </div>
              <div class="text-sm text-gray-500">
                {{ user.activityCount }} Aktivitäten
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reset Confirmation Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-red-600">System zurücksetzen</h3>
        <p class="mb-6 text-gray-600">
          Sind Sie sicher, dass Sie das System zurücksetzen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div class="flex justify-end gap-3">
          <button 
            @click="showResetModal = false" 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </button>
          <button 
            @click="resetSystem" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            System zurücksetzen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabGroup from '@/components/common/TabGroup.vue'

export default {
  name: 'AdminPanel',
  
  components: {
    TabGroup
  },
  
  props: {
    users: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['view-user', 'edit-user', 'delete-user', 'system-reset', 'update-user-role'],
  
  data() {
    return {
      activeTab: 'users',
      adminTabs: [
        { id: 'users', name: 'Benutzer', icon: 'fas fa-users' },
        { id: 'settings', name: 'Einstellungen', icon: 'fas fa-cogs' },
        { id: 'analytics', name: 'Analytics', icon: 'fas fa-chart-line' }
      ],
      userSearch: '',
      showResetModal: false,
      systemSettings: {
        siteName: 'DreamMall Matching Platform',
        siteDescription: 'Finde Gleichgesinnte basierend auf Interessen und Fähigkeiten.',
        maintenanceMode: false,
        allowRegistration: true,
        approvalRequired: false
      },
      stats: {
        newUsers: 25,
        matches: 152,
        avgSessionTime: '18:32',
        activeChats: 8
      },
      mostActiveUsers: [
        { name: 'Max Mustermann', email: 'max@example.com', activityCount: 47 },
        { name: 'Anna Schmidt', email: 'anna@example.com', activityCount: 36 },
        { name: 'Jan Müller', email: 'jan@example.com', activityCount: 29 },
        { name: 'Laura Weber', email: 'laura@example.com', activityCount: 24 }
      ]
    }
  },
  
  computed: {
    // Calculate total matches - simplified for demo
    totalMatches() {
      return this.users.length * 3
    },
    
    // Calculate active users - simplified for demo
    activeUsers() {
      return Math.floor(this.users.length * 0.7)
    },
    
    // Filter users based on search term
    filteredUsers() {
      if (!this.userSearch) return this.users
      
      const term = this.userSearch.toLowerCase()
      return this.users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      )
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return 'Nie'
      
      const date = new Date(timestamp || Date.now())
      return date.toLocaleDateString('de-DE', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    viewUser(user) {
      this.$emit('view-user', user)
    },
    
    editUser(user) {
      this.$emit('edit-user', user)
    },
    
    deleteUser(user) {
      if (confirm(`Möchten Sie den Benutzer ${user.name} wirklich löschen?`)) {
        this.$emit('delete-user', user.id)
      }
    },
    
    saveSystemSettings() {
      // In a real app, this would send the settings to the backend
      alert('Einstellungen wurden gespeichert.')
    },
    
    backupDatabase() {
      // In a real app, this would trigger a database backup
      alert('Datenbank-Backup wurde erstellt.')
    },
    
    resetSystem() {
      // In a real app, this would reset the system to default settings
      alert('System wurde zurückgesetzt.')
      this.showResetModal = false
      
      // Emit event to parent component
      this.$emit('system-reset')
    },
    
    changeUserRole(userId, event) {
      const newRole = event.target.value
      this.$emit('update-user-role', userId, newRole)
    }
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-content {
  padding-top: 15px;
}
</style>