<template>
  <div class="max-w-7xl mx-auto p-5 text-center">
    <!-- Header mit Navigation -->
    <AppHeader 
      :activeTab="activeTab" 
      @update-tab="activeTab = $event"
      :isLoggedIn="isLoggedIn"
      :showChat="showChat"
      @toggle-chat="showChat = !showChat"
    />
    
    <!-- App-Aktionen für das Matching -->
    <AppActions 
      v-if="shouldShowAppActions"
      @create-profile="creatingUser = true"
      @export-profiles="exportAllProfiles"
      @import-profiles="importProfilesFromFile"
    />
    
    <!-- Chat-Interface -->
    <ChatOverlay 
      v-if="isLoggedIn && showChat" 
      :currentUserId="currentUserId"
      :users="users"
      :initialOtherUserId="chatWithUserId"
      @close="closeChat"
    />
    
    <!-- Map View -->
    <MapPage 
      v-if="activeTab === 'map'" 
      :users="users" 
      :companies="extractCompanies()"
      :projects="extractProjects()"
      :tables="extractTables()"
      @update-users="updateUsers"
    />
    
    <!-- Matching View mit verschiedenen Zuständen -->
    <div v-else>
      <!-- Profilansicht -->
      <UserProfileView 
        v-if="selectedUser" 
        :user="selectedUser" 
        @close="closeProfile"
        @edit="startEditing(selectedUser)"
      />
      
      <!-- Profil-Formular (Bearbeiten/Erstellen) -->
      <UserProfileForm
        v-else-if="editingUser || creatingUser"
        :user="editingUser"
        :editMode="!!editingUser"
        @save="saveProfile"
        @cancel="cancelEditing"
      />
      
      <!-- Benutzer-Liste und Matching-Ergebnisse -->
      <MatchingContainer 
        v-else
        :users="users"
        :filteredUsers="filteredUsers"
        :userForMatching="userForMatching"
        :matchResults="matchResults"
        @select-user="selectUser"
        @select-for-matching="selectForMatching"
        @edit-user="startEditing"
        @delete-user="deleteUser"
        @clear-matching="userForMatching = null"
        @start-chat="startChatWith"
        v-model="searchTerm"
      />
    </div>
  </div>
</template>

<script>
// Import der Komponenten
import AppHeader from '@/components/layout/AppHeader.vue';
import AppActions from '@/components/layout/AppActions.vue';
import UserProfileView from '@/components/user/UserProfile.vue';
import UserProfileForm from '@/components/user/UserProfileForm.vue';
import MatchingContainer from '@/components/matching/MatchingContainer.vue';
import ChatOverlay from '@/components/chat/ChatOverlay.vue';
import MapPage from '@/components/map/MapPage.vue';

// Import der Services
import { findTopMatches } from '@/services/MatchingService.js';
import { 
  initializeStorage, 
  getAllProfiles, 
  saveProfile as saveProfileToStorage,
  deleteProfile as deleteProfileFromStorage,
  exportProfiles,
  importProfiles,
  updateAllProfiles
} from '@/services/StorageService.js';

export default {
  components: { 
    AppHeader,
    AppActions,
    UserProfileView,
    UserProfileForm,
    MatchingContainer,
    ChatOverlay,
    MapPage
  },
  
  data() {
    return {
      users: [],
      selectedUser: null,
      userForMatching: null,
      editingUser: null,
      creatingUser: false,
      searchTerm: '',
      matchResults: [],
      isLoggedIn: true, // Für Demo-Zwecke
      currentUserId: 1, // Für Demo-Zwecke
      showChat: false,
      chatWithUserId: null,
      activeTab: 'matching' // Standard-Tab
    };
  },
  
  computed: {
    // Getter für gefilterte Benutzer basierend auf dem Suchbegriff
    filteredUsers() {
      if (!this.searchTerm) return this.users;
      
      const term = this.searchTerm.toLowerCase();
      return this.users.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.skills?.some(skill => skill.toLowerCase().includes(term)) ||
        user.interests?.some(interest => interest.toLowerCase().includes(term)) ||
        user.bio?.toLowerCase().includes(term)
      );
    },
    
    // Bestimmt, ob die App-Aktionen angezeigt werden sollen
    shouldShowAppActions() {
      return this.activeTab === 'matching' && !this.selectedUser && !this.editingUser && !this.creatingUser;
    }
  },
  
  created() {
    initializeStorage();
    this.loadProfiles();
  },
  
  methods: {
    // Benutzerprofile-Methoden
    loadProfiles() {
      this.users = getAllProfiles();
    },
    
    selectUser(user) {
      this.selectedUser = user;
    },
    
    closeProfile() {
      this.selectedUser = null;
    },
    
    // Matching-Methoden
    selectForMatching(user) {
      this.userForMatching = user;
      this.matchResults = findTopMatches(user, this.users);
    },
    
    // Profil-Bearbeitung
    startEditing(user) {
      this.editingUser = user;
      this.selectedUser = null;
    },
    
    cancelEditing() {
      this.editingUser = null;
      this.creatingUser = false;
    },
    
    saveProfile(profile) {
      saveProfileToStorage(profile);
      this.loadProfiles();
      this.editingUser = null;
      this.creatingUser = false;
    },
    
    deleteUser(userId) {
      if (confirm('Sind Sie sicher, dass Sie dieses Profil löschen möchten?')) {
        deleteProfileFromStorage(userId);
        this.loadProfiles();
        if (this.userForMatching?.id === userId) {
          this.userForMatching = null;
          this.matchResults = [];
        }
      }
    },
    
    // Import/Export-Methoden
    exportAllProfiles() {
      exportProfiles();
    },
    
    importProfilesFromFile(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const profiles = JSON.parse(e.target.result);
          importProfiles(profiles);
          this.loadProfiles();
        };
        reader.readAsText(file);
      }
    },
    
    // Chat-Methoden
    startChatWith(user) {
      this.chatWithUserId = null;
      this.$nextTick(() => {
        this.chatWithUserId = user.id;
        this.showChat = true;
      });
    },
    
    closeChat() {
      this.showChat = false;
      this.chatWithUserId = null;
    },
    
    // Datenextraktionsmethoden für die Map-Anzeige
    extractCompanies() {
      const companies = [];
      
      this.users.forEach(user => {
        // Firmen aus iconCategories.firma extrahieren
        if (user.iconCategories?.firma) {
          const coordinates = user.iconCategories.firma.coordinates;
          if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            companies.push({
              id: `firma-${user.id}`,
              name: user.iconCategories.firma.name || 'Firma',
              description: user.iconCategories.firma.description || '',
              location: {
                address: user.iconCategories.firma.address || '',
                coordinates: coordinates
              },
              owner: user
            });
          }
        }
        
        // Auch aus dem user.companies-Array hinzufügen, falls vorhanden
        if (user.companies) {
          user.companies.forEach((company, idx) => {
            const coordinates = company.coordinates;
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              companies.push({
                id: `company-${user.id}-${idx}`,
                name: company.name || 'Unternehmen',
                description: company.description || '',
                location: {
                  address: company.address || '',
                  coordinates: coordinates
                },
                owner: user
              });
            }
          });
        }
      });
      
      return companies;
    },
    
    extractProjects() {
      const projects = [];
      
      this.users.forEach(user => {
        // Projekte aus iconCategories.projekt extrahieren
        if (user.iconCategories?.projekt && Array.isArray(user.iconCategories.projekt)) {
          user.iconCategories.projekt.forEach((project, idx) => {
            const coordinates = project.coordinates;
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              projects.push({
                id: `icon-project-${user.id}-${idx}`,
                name: project.name || 'Projekt',
                description: project.description || '',
                status: 'Aktiv',
                location: {
                  address: project.address || '',
                  coordinates: coordinates
                },
                owner: user
              });
            }
          });
        }
        
        // Aus ownProjects und contributedProjects extrahieren
        ['ownProjects', 'contributedProjects'].forEach(projectType => {
          if (user[projectType] && Array.isArray(user[projectType])) {
            user[projectType].forEach((project, idx) => {
              const coordinates = project.coordinates;
              if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
                projects.push({
                  id: `${projectType}-${user.id}-${idx}`,
                  name: project.name || 'Projekt',
                  description: project.description || '',
                  status: 'Aktiv',
                  location: {
                    address: project.address || '',
                    coordinates: coordinates
                  },
                  owner: user
                });
              }
            });
          }
        });
      });
      
      return projects;
    },
    
    extractTables() {
      const tables = [];
      
      this.users.forEach(user => {
        if (user.iconCategories?.tisch && Array.isArray(user.iconCategories.tisch)) {
          user.iconCategories.tisch.forEach((table, idx) => {
            const coordinates = table.coordinates;
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
              tables.push({
                id: `table-${user.id}-${idx}`,
                name: table.name || 'Meetup',
                description: table.description || '',
                location: {
                  address: table.location || '',
                  coordinates: coordinates
                },
                host: {
                  name: user.name,
                  details: ''
                },
                owner: user
              });
            }
          });
        }
      });
      
      return tables;
    },
    
    // Methode zum Aktualisieren der Benutzer aus der Map-Seite
    updateUsers(newUsers) {
      console.log('Updating all users from App:', newUsers.length);
      // Alle Profile im Speicher aktualisieren
      updateAllProfiles(newUsers);
      // Profile neu laden
      this.loadProfiles();
    },
  }
};
</script>

<!-- No custom <style> needed - using Tailwind CSS -->