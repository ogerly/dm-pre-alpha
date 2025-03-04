<template>
  <div class="container">
    <header>
      <h1>DreamMall Matching Prototyp</h1>
      <p>Finde Gleichgesinnte basierend auf Interessen und Fähigkeiten.</p>
    </header>
    
    <div class="app-actions" v-if="!selectedUser && !editingUser && !creatingUser">
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
      />
    </div>
    
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
</template>

<script>
import UserList from './components/UserList.vue';
import UserProfile from './components/UserProfile.vue';
import MatchingResults from './components/MatchingResults.vue';
import UserProfileForm from './components/UserProfileForm.vue';
import ChatContainer from './components/chat/ChatContainer.vue';
import { findTopMatches } from './services/MatchingService.js';
import { 
  initializeStorage, 
  getAllProfiles, 
  saveProfile as saveProfileToStorage,
  deleteProfile as deleteProfileFromStorage,
  exportProfiles,
  importProfiles
} from './services/StorageService.js';

export default {
  components: { 
    UserList,
    UserProfile,
    MatchingResults,
    UserProfileForm,
    ChatContainer
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
      isLoggedIn: true, // For demo purposes - in real app would check authentication
      currentUserId: 1, // For demo purposes - in real app would be the logged in user's ID
      showChat: false,
      chatWithUserId: null
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
      this.chatWithUserId = user.id;
      this.showChat = true;
    }
  }
};
</script>

<style>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  margin-top: 30px;
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

.chat-interface {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 320px;
  height: 400px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
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
</style>