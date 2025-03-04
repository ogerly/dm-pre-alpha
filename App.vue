<template>
  <div class="container">
    <header>
      <h1>DreamMall Matching Prototyp</h1>
      <p>Finde Gleichgesinnte basierend auf Interessen und Fähigkeiten.</p>
      
      <div class="nav-tabs">
        <button 
          @click="activeTab = 'matching'" 
          :class="{ active: activeTab === 'matching' }"
          class="tab-btn"
        >
          <i class="fas fa-users"></i> Matching
        </button>
        <button 
          @click="activeTab = 'map'" 
          :class="{ active: activeTab === 'map' }"
          class="tab-btn"
        >
          <i class="fas fa-map-marked-alt"></i> Karte
        </button>
      </div>
    </header>
    
    <!-- App actions -->
    <div class="app-actions" v-if="activeTab === 'matching' && !selectedUser && !editingUser && !creatingUser">
      <button @click="creatingUser = true" class="primary-btn">
        <span class="icon">+</span> Neues Profil erstellen
      </button>
      <button @click="exportAllProfiles" class="secondary-btn">
        Alle Profile exportieren
      </button>
      <label for="import-file" class="secondary-btn">
        Profile importieren
      </label>
      <input 
        id="import-file" 
        type="file" 
        @change="importProfilesFromFile" 
        accept="application/json"
        style="display: none"
      >
    </div>
    
    <!-- Add chat button in the header when a user is logged in -->
    <div v-if="isLoggedIn && !selectedUser && !editingUser && !creatingUser" class="header-actions">
      <button @click="showChat = !showChat" class="chat-btn">
        <span class="icon">💬</span> Chat
      </button>
    </div>
    
    <!-- Chat interface -->
    <div v-if="isLoggedIn && showChat" class="chat-interface">
      <ChatContainer 
        :currentUserId="currentUserId"
        :users="users"
        :initialOtherUserId="chatWithUserId"
        @close="closeChat"
      />
    </div>
    
    <!-- Map View with actual data -->
    <div v-if="activeTab === 'map'" class="main-content">
      <MapPage 
        :users="users" 
        :companies="extractCompanies()"
        :projects="extractProjects()"
        :tables="extractTables()"
        @update-users="updateUsers"
      />
    </div>
    
    <!-- Matching View -->
    <div v-else>
      <div v-if="selectedUser" class="main-content">
        <UserProfile 
          :user="selectedUser" 
          @close="closeProfile"
        />
        <div class="profile-actions">
          <button @click="startEditing(selectedUser)" class="edit-btn">
            <span class="icon">✏️</span> Profil bearbeiten
          </button>
        </div>
      </div>
      
      <div v-else-if="editingUser || creatingUser" class="main-content">
        <UserProfileForm
          :user="editingUser"
          :editMode="!!editingUser"
          @save="saveProfile"
          @cancel="cancelEditing"
        />
      </div>
      
      <div v-else class="main-content">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Nach Namen, Fähigkeiten oder Interessen suchen..." 
            class="search-input"
          />
        </div>
        
        <div class="columns">
          <div class="user-list-column">
            <UserList 
              :users="filteredUsers" 
              :selectedUserId="userForMatching?.id"
              @select-user="selectUser"
              @select-for-matching="selectForMatching"
              @edit-user="startEditing"
              @delete-user="deleteUser"
            />
          </div>
          
          <div class="matching-column">
            <div v-if="userForMatching" class="selected-for-matching">
              <h3>Matching für: {{ userForMatching.name }}</h3>
              <button @click="userForMatching = null" class="clear-btn">Auswahl aufheben</button>
            </div>
            
            <MatchingResults 
              :matches="matchResults" 
              @view-profile="selectUser"
            />
            
            <!-- Add chat button to match results -->
            <div v-if="matchResults.length > 0" class="match-actions">
              <button 
                v-for="match in matchResults" 
                :key="match.id"
                @click="startChatWith(match)"
                class="start-chat-btn"
              >
                <span class="icon">💬</span> Mit {{ match.name }} chatten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from './components/UserList.vue';
import UserProfile from './components/UserProfile.vue';
import MatchingResults from './components/MatchingResults.vue';
import UserProfileForm from './components/UserProfileForm.vue';
import ChatContainer from './components/chat/ChatContainer.vue';
import MapPage from './components/map/MapPage.vue';
import { findTopMatches } from './services/MatchingService.js';
import { 
  initializeStorage, 
  getAllProfiles, 
  saveProfile as saveProfileToStorage,
  deleteProfile as deleteProfileFromStorage,
  exportProfiles,
  importProfiles,
  updateAllProfiles  // Add this function to your StorageService if it doesn't exist
} from './services/StorageService.js';

export default {
  components: { 
    UserList,
    UserProfile,
    MatchingResults,
    UserProfileForm,
    ChatContainer,
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
      isLoggedIn: true, // For demo purposes
      currentUserId: 1, // For demo purposes
      showChat: false,
      chatWithUserId: null,
      activeTab: 'matching' // Default tab
    };
  },
  created() {
    initializeStorage();
    this.loadProfiles();
  },
  computed: {
    filteredUsers() {
      if (!this.searchTerm) return this.users;
      
      const term = this.searchTerm.toLowerCase();
      return this.users.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.skills?.some(skill => skill.toLowerCase().includes(term)) ||
        user.interests?.some(interest => interest.toLowerCase().includes(term)) ||
        user.bio?.toLowerCase().includes(term)
      );
    }
  },
  methods: {
    loadProfiles() {
      this.users = getAllProfiles();
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    closeProfile() {
      this.selectedUser = null;
    },
    selectForMatching(user) {
      this.userForMatching = user;
      this.matchResults = findTopMatches(user, this.users);
    },
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
    // Helper methods to extract objects from user data for map display
    extractCompanies() {
      const companies = [];
      
      // Extract companies from iconCategories.firma
      this.users.forEach(user => {
        if (user.iconCategories?.firma) {
          // Check if coordinates exist directly in firma
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
        
        // Also add from user companies array if present
        if (user.companies) {
          user.companies.forEach((company, idx) => {
            // Check if coordinates exist directly in company
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
        // Extract from iconCategories.projekt
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
        
        // Extract from ownProjects and contributedProjects
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
    // Add this method to handle user updates from map page
    updateUsers(newUsers) {
      console.log('Updating all users from App:', newUsers.length);
      // Update all profiles in storage
      updateAllProfiles(newUsers);
      // Reload profiles
      this.loadProfiles();
    },
  }
};
</script>

<style>
/* Bootstrap Icons import removed - now in global.css */

.container {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  margin-top: 20px;
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.tab-btn {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  background-color: #f3f4f6;
}

.tab-btn.active {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.columns {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(400px, 2fr);
  gap: 30px;
}

.selected-for-matching {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f4f6;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.clear-btn {
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .columns {
    grid-template-columns: 1fr;
  }
}

/* Chat interface positioning and size */
.chat-interface {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 680px; /* Wide enough to show both chat list and active chat */
  height: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.header-actions {
  position: absolute;
  top: 20px;
  right: 20px;
}

.chat-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.match-actions {
  margin-top: 15px;
}

.start-chat-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.icon {
  font-size: 1.2em;
}

.app-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.primary-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.secondary-btn {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.edit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 20px auto;
}

.profile-actions {
  display: flex;
  justify-content: center;
}
</style>