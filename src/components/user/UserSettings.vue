<template>
  <div class="user-settings">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        Einstellungen
      </h2>
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { 'active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i
            :class="tab.icon"
            class="mr-2"
          /> {{ tab.name }}
        </button>
      </div>
      
      <!-- Account Settings -->
      <div
        v-if="activeTab === 'account'"
        class="tab-content"
      >
        <h3 class="text-lg font-medium mb-4">
          Account-Einstellungen
        </h3>
        
        <form
          class="space-y-4"
          @submit.prevent="saveAccountSettings"
        >
          <div class="form-group">
            <label
              for="name"
              class="block text-gray-700 mb-1"
            >Name</label>
            <input
              id="name"
              v-model="accountSettings.name"
              type="text" 
              class="w-full p-2 border border-gray-300 rounded"
            >
          </div>
          
          <div class="form-group">
            <label
              for="email"
              class="block text-gray-700 mb-1"
            >E-Mail-Adresse</label>
            <input
              id="email"
              v-model="accountSettings.email"
              type="email" 
              class="w-full p-2 border border-gray-300 rounded"
            >
          </div>
          
          <div class="form-group">
            <label class="flex items-center">
              <input
                v-model="accountSettings.receiveNotifications"
                type="checkbox"
                class="mr-2"
              >
              <span>E-Mail-Benachrichtigungen erhalten</span>
            </label>
          </div>
          
          <button
            type="submit"
            class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
          >
            Änderungen speichern
          </button>
        </form>
      </div>
      
      <!-- Privacy Settings -->
      <div
        v-if="activeTab === 'privacy'"
        class="tab-content"
      >
        <h3 class="text-lg font-medium mb-4">
          Datenschutz-Einstellungen
        </h3>
        
        <form
          class="space-y-4"
          @submit.prevent="savePrivacySettings"
        >
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Profileinstellungen</label>
            
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="privacySettings.profileVisible"
                  type="checkbox"
                  class="mr-2"
                >
                <span>Profil für andere Nutzer sichtbar</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="privacySettings.showEmail"
                  type="checkbox"
                  class="mr-2"
                >
                <span>E-Mail-Adresse anzeigen</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="privacySettings.showLocation"
                  type="checkbox"
                  class="mr-2"
                >
                <span>Standort auf Karte anzeigen</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Datenverwendung</label>
            
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="privacySettings.allowDataAnalysis"
                  type="checkbox"
                  class="mr-2"
                >
                <span>Anonyme Nutzungsdaten für Verbesserungen verwenden</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="privacySettings.allowPersonalizedRecommendations"
                  type="checkbox"
                  class="mr-2"
                >
                <span>Personalisierte Empfehlungen erhalten</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
          >
            Einstellungen speichern
          </button>
        </form>
      </div>
      
      <!-- Password Settings -->
      <div
        v-if="activeTab === 'password'"
        class="tab-content"
      >
        <h3 class="text-lg font-medium mb-4">
          Passwort ändern
        </h3>
        
        <form
          class="space-y-4"
          @submit.prevent="changePassword"
        >
          <div class="form-group">
            <label
              for="current-password"
              class="block text-gray-700 mb-1"
            >Aktuelles Passwort</label>
            <input
              id="current-password"
              v-model="passwordChange.currentPassword"
              type="password" 
              class="w-full p-2 border border-gray-300 rounded"
            >
          </div>
          
          <div class="form-group">
            <label
              for="new-password"
              class="block text-gray-700 mb-1"
            >Neues Passwort</label>
            <input
              id="new-password"
              v-model="passwordChange.newPassword"
              type="password" 
              class="w-full p-2 border border-gray-300 rounded"
            >
          </div>
          
          <div class="form-group">
            <label
              for="confirm-password"
              class="block text-gray-700 mb-1"
            >Passwort bestätigen</label>
            <input
              id="confirm-password"
              v-model="passwordChange.confirmPassword"
              type="password" 
              class="w-full p-2 border border-gray-300 rounded"
            >
          </div>
          
          <div
            v-if="passwordError"
            class="text-red-600 text-sm"
          >
            {{ passwordError }}
          </div>
          
          <button
            type="submit"
            class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
          >
            Passwort ändern
          </button>
        </form>
      </div>
      
      <!-- Appearance Settings -->
      <div
        v-if="activeTab === 'appearance'"
        class="tab-content"
      >
        <h3 class="text-lg font-medium mb-4">
          Erscheinungsbild
        </h3>
        
        <form
          class="space-y-4"
          @submit.prevent="saveAppearanceSettings"
        >
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Theme</label>
            <div class="flex gap-4">
              <label class="theme-option">
                <input
                  v-model="appearanceSettings.theme"
                  type="radio"
                  value="light"
                  class="sr-only"
                >
                <div class="theme-preview light-theme" />
                <span>Hell</span>
              </label>
              
              <label class="theme-option">
                <input
                  v-model="appearanceSettings.theme"
                  type="radio"
                  value="dark"
                  class="sr-only"
                >
                <div class="theme-preview dark-theme" />
                <span>Dunkel</span>
              </label>
              
              <label class="theme-option">
                <input
                  v-model="appearanceSettings.theme"
                  type="radio"
                  value="auto"
                  class="sr-only"
                >
                <div class="theme-preview auto-theme" />
                <span>Systemeinstellung</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Schriftgröße</label>
            <select
              v-model="appearanceSettings.fontSize"
              class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="small">
                Klein
              </option>
              <option value="medium">
                Mittel
              </option>
              <option value="large">
                Groß
              </option>
            </select>
          </div>
          
          <button
            type="submit"
            class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
          >
            Einstellungen speichern
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
// Removed the unused 'computed' import

export default defineComponent({
  name: 'UserSettings',
  
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  emits: ['update-user'],
  
  setup(props, { emit }) {
    const activeTab = ref('account');
    const tabs = ref([
      { id: 'account', name: 'Account', icon: 'fas fa-user' },
      { id: 'privacy', name: 'Datenschutz', icon: 'fas fa-shield-alt' },
      { id: 'password', name: 'Passwort', icon: 'fas fa-lock' },
      { id: 'appearance', name: 'Erscheinungsbild', icon: 'fas fa-palette' }
    ]);
    const accountSettings = ref({
      name: props.user.name || '',
      email: props.user.email || '',
      receiveNotifications: true
    });
    const privacySettings = ref({
      profileVisible: true,
      showEmail: false,
      showLocation: true,
      allowDataAnalysis: true,
      allowPersonalizedRecommendations: true
    });
    const passwordChange = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const passwordError = ref('');
    const appearanceSettings = ref({
      theme: 'light',
      fontSize: 'medium'
    });

    const saveAccountSettings = () => {
      alert('Account settings saved!');
      emit('update-user', {
        ...props.user,
        name: accountSettings.value.name,
        email: accountSettings.value.email
      });
    };

    const savePrivacySettings = () => {
      alert('Privacy settings saved!');
    };

    const changePassword = () => {
      passwordError.value = '';
      
      if (!passwordChange.value.currentPassword) {
        passwordError.value = 'Bitte geben Sie Ihr aktuelles Passwort ein';
        return;
      }
      
      if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
        passwordError.value = 'Die Passwörter stimmen nicht überein';
        return;
      }
      
      if (passwordChange.value.newPassword.length < 8) {
        passwordError.value = 'Das Passwort muss mindestens 8 Zeichen lang sein';
        return;
      }
      
      alert('Password changed successfully!');
      
      passwordChange.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    };

    const saveAppearanceSettings = () => {
      alert('Appearance settings saved!');
    };

    return {
      activeTab,
      tabs,
      accountSettings,
      privacySettings,
      passwordChange,
      passwordError,
      appearanceSettings,
      saveAccountSettings,
      savePrivacySettings,
      changePassword,
      saveAppearanceSettings
    };
  }
});
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
