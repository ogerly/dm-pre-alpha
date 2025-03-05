<template>
  <div class="user-settings">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Einstellungen</h2>
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab', { 'active': activeTab === tab.id }]"
        >
          <i :class="tab.icon" class="mr-2"></i> {{ tab.name }}
        </button>
      </div>
      
      <!-- Account Settings -->
      <div v-if="activeTab === 'account'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">Account-Einstellungen</h3>
        
        <form @submit.prevent="saveAccountSettings" class="space-y-4">
          <div class="form-group">
            <label for="name" class="block text-gray-700 mb-1">Name</label>
            <input type="text" id="name" v-model="accountSettings.name" 
                  class="w-full p-2 border border-gray-300 rounded">
          </div>
          
          <div class="form-group">
            <label for="email" class="block text-gray-700 mb-1">E-Mail-Adresse</label>
            <input type="email" id="email" v-model="accountSettings.email" 
                  class="w-full p-2 border border-gray-300 rounded">
          </div>
          
          <div class="form-group">
            <label class="flex items-center">
              <input type="checkbox" v-model="accountSettings.receiveNotifications" class="mr-2">
              <span>E-Mail-Benachrichtigungen erhalten</span>
            </label>
          </div>
          
          <button type="submit" class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
            Änderungen speichern
          </button>
        </form>
      </div>
      
      <!-- Privacy Settings -->
      <div v-if="activeTab === 'privacy'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">Datenschutz-Einstellungen</h3>
        
        <form @submit.prevent="savePrivacySettings" class="space-y-4">
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Profileinstellungen</label>
            
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" v-model="privacySettings.profileVisible" class="mr-2">
                <span>Profil für andere Nutzer sichtbar</span>
              </label>
              
              <label class="flex items-center">
                <input type="checkbox" v-model="privacySettings.showEmail" class="mr-2">
                <span>E-Mail-Adresse anzeigen</span>
              </label>
              
              <label class="flex items-center">
                <input type="checkbox" v-model="privacySettings.showLocation" class="mr-2">
                <span>Standort auf Karte anzeigen</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Datenverwendung</label>
            
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" v-model="privacySettings.allowDataAnalysis" class="mr-2">
                <span>Anonyme Nutzungsdaten für Verbesserungen verwenden</span>
              </label>
              
              <label class="flex items-center">
                <input type="checkbox" v-model="privacySettings.allowPersonalizedRecommendations" class="mr-2">
                <span>Personalisierte Empfehlungen erhalten</span>
              </label>
            </div>
          </div>
          
          <button type="submit" class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
            Einstellungen speichern
          </button>
        </form>
      </div>
      
      <!-- Password Settings -->
      <div v-if="activeTab === 'password'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">Passwort ändern</h3>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div class="form-group">
            <label for="current-password" class="block text-gray-700 mb-1">Aktuelles Passwort</label>
            <input type="password" id="current-password" v-model="passwordChange.currentPassword" 
                  class="w-full p-2 border border-gray-300 rounded">
          </div>
          
          <div class="form-group">
            <label for="new-password" class="block text-gray-700 mb-1">Neues Passwort</label>
            <input type="password" id="new-password" v-model="passwordChange.newPassword" 
                  class="w-full p-2 border border-gray-300 rounded">
          </div>
          
          <div class="form-group">
            <label for="confirm-password" class="block text-gray-700 mb-1">Passwort bestätigen</label>
            <input type="password" id="confirm-password" v-model="passwordChange.confirmPassword" 
                  class="w-full p-2 border border-gray-300 rounded">
          </div>
          
          <div v-if="passwordError" class="text-red-600 text-sm">
            {{ passwordError }}
          </div>
          
          <button type="submit" class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
            Passwort ändern
          </button>
        </form>
      </div>
      
      <!-- Appearance Settings -->
      <div v-if="activeTab === 'appearance'" class="tab-content">
        <h3 class="text-lg font-medium mb-4">Erscheinungsbild</h3>
        
        <form @submit.prevent="saveAppearanceSettings" class="space-y-4">
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Theme</label>
            <div class="flex gap-4">
              <label class="theme-option">
                <input type="radio" v-model="appearanceSettings.theme" value="light" class="sr-only">
                <div class="theme-preview light-theme"></div>
                <span>Hell</span>
              </label>
              
              <label class="theme-option">
                <input type="radio" v-model="appearanceSettings.theme" value="dark" class="sr-only">
                <div class="theme-preview dark-theme"></div>
                <span>Dunkel</span>
              </label>
              
              <label class="theme-option">
                <input type="radio" v-model="appearanceSettings.theme" value="auto" class="sr-only">
                <div class="theme-preview auto-theme"></div>
                <span>Systemeinstellung</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Schriftgröße</label>
            <select v-model="appearanceSettings.fontSize" class="w-full p-2 border border-gray-300 rounded">
              <option value="small">Klein</option>
              <option value="medium">Mittel</option>
              <option value="large">Groß</option>
            </select>
          </div>
          
          <button type="submit" class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
            Einstellungen speichern
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      activeTab: 'account',
      tabs: [
        { id: 'account', name: 'Account', icon: 'fas fa-user' },
        { id: 'privacy', name: 'Datenschutz', icon: 'fas fa-shield-alt' },
        { id: 'password', name: 'Passwort', icon: 'fas fa-lock' },
        { id: 'appearance', name: 'Erscheinungsbild', icon: 'fas fa-palette' }
      ],
      accountSettings: {
        name: this.user.name || '',
        email: this.user.email || '',
        receiveNotifications: true
      },
      privacySettings: {
        profileVisible: true,
        showEmail: false,
        showLocation: true,
        allowDataAnalysis: true,
        allowPersonalizedRecommendations: true
      },
      passwordChange: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordError: '',
      appearanceSettings: {
        theme: 'light',
        fontSize: 'medium'
      }
    };
  },
  
  methods: {
    saveAccountSettings() {
      // In a real app, this would send the updated settings to the backend
      alert('Account settings saved!');
      // Emit event to update the user in the parent component
      this.$emit('update-user', {
        ...this.user,
        name: this.accountSettings.name,
        email: this.accountSettings.email
      });
    },
    
    savePrivacySettings() {
      // In a real app, this would send the updated settings to the backend
      alert('Privacy settings saved!');
    },
    
    changePassword() {
      this.passwordError = '';
      
      // Simple validation
      if (!this.passwordChange.currentPassword) {
        this.passwordError = 'Bitte geben Sie Ihr aktuelles Passwort ein';
        return;
      }
      
      if (this.passwordChange.newPassword !== this.passwordChange.confirmPassword) {
        this.passwordError = 'Die Passwörter stimmen nicht überein';
        return;
      }
      
      if (this.passwordChange.newPassword.length < 8) {
        this.passwordError = 'Das Passwort muss mindestens 8 Zeichen lang sein';
        return;
      }
      
      // In a real app, this would send the password change request to the backend
      alert('Password changed successfully!');
      
      // Reset form
      this.passwordChange = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    
    saveAppearanceSettings() {
      // In a real app, this would apply the theme and save the settings
      alert('Appearance settings saved!');
    }
  }
}
</script>

<style scoped>
.user-settings {
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.tab {
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.tab.active {
  background-color: #4f46e5;
  color: white;
}

.tab-content {
  padding-top: 10px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

input:checked + .theme-preview {
  border-color: #4f46e5;
}

.light-theme {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-theme {
  background: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auto-theme {
  background: linear-gradient(to right, #ffffff 50%, #1f2937 50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
