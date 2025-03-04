<template>
  <div class="map-page">
    <h2>Karte</h2>
    <p class="subtitle">
      Entdecke Profile, Unternehmen, Projekte und Meetups auf der Karte
    </p>
    
    <!-- Debug checkbox -->
    <div class="debug-toggle">
      <label>
        <input type="checkbox" v-model="showDebug">
        Debug-Modus aktivieren
      </label>
    </div>
    
    <!-- Debug section with expanded tools -->
    <div v-if="showDebug" class="debug-section">
      <div class="debug-tabs">
        <button 
          @click="activeDebugTab = 'data-loader'"
          :class="{ active: activeDebugTab === 'data-loader' }"
          class="debug-tab"
        >
          Data Loader
        </button>
        <button 
          @click="activeDebugTab = 'asset-test'"
          :class="{ active: activeDebugTab === 'asset-test' }"
          class="debug-tab"
        >
          Asset Test
        </button>
        <button 
          @click="activeDebugTab = 'test-map'"
          :class="{ active: activeDebugTab === 'test-map' }"
          class="debug-tab"
        >
          Test Map
        </button>
      </div>
      
      <!-- DataLoader -->
      <div v-if="activeDebugTab === 'data-loader'" class="debug-tab-content">
        <DataLoader 
          :users="users" 
          @update-users="updateUsers" 
          @add-test-users="addTestUsers"
        />
      </div>
      
      <!-- Asset Test -->
      <div v-if="activeDebugTab === 'asset-test'" class="debug-tab-content">
        <AssetTest />
      </div>
      
      <!-- Test Map -->
      <div v-if="activeDebugTab === 'test-map'" class="debug-tab-content">
        <TestMap />
      </div>
    </div>
    
    <!-- Regular map -->
    <div class="map-wrapper">
      <MapView 
        :users="localUsers || users"
        :companies="companies"
        :projects="projects"
        :tables="tables"
        @view-profile="selectUser"
      />
    </div>
    
    <!-- Debug data display -->
    <div v-if="showDebug" class="debug-data">
      <h3>Debug Data</h3>
      <div class="data-counts">
        <p>Users: {{ users.length }}</p>
        <p>Local Users: {{ localUsers ? localUsers.length : 'None' }}</p>
        <p>Companies: {{ companies.length }}</p>
        <p>Projects: {{ projects.length }}</p>
        <p>Tables: {{ tables.length }}</p>
      </div>
      <div class="user-sample" v-if="(localUsers || users).length > 0">
        <h4>First User Sample</h4>
        <pre>{{ JSON.stringify((localUsers || users)[0], null, 2) }}</pre>
      </div>
    </div>
    
    <div v-if="userProfile" class="profile-overlay">
      <div class="profile-container">
        <button class="close-btn" @click="userProfile = null">&times;</button>
        <UserProfile :user="userProfile" />
      </div>
    </div>
  </div>
</template>

<script>
import MapView from './MapView.vue';
import UserProfile from '@/components/user/UserProfile.vue';
import TestMap from '@/components/debug/TestMap.vue';
import DataLoader from '@/components/debug/DataLoader.vue';
import AssetTest from '@/components/debug/AssetTest.vue'; 
import { resetToInitialData } from '@/services/StorageService.js'; // Import the new function

export default {
  components: {
    MapView,
    UserProfile,
    TestMap,
    DataLoader,
    AssetTest // Register the new component
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    companies: {
      type: Array,
      default: () => []
    },
    projects: {
      type: Array,
      default: () => []
    },
    tables: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userProfile: null,
      showDebug: true, // Enable debug by default
      localUsers: null, // Local override for user data
      activeDebugTab: 'data-loader', // Add this new property for debugging tabs
      dataLoaded: false // Track if data was loaded
    };
  },
  watch: {
    // Watch users prop to detect if it contains coordinates
    users: {
      immediate: true,
      handler(newUsers) {
        if (this.dataLoaded) return; // Skip if we've already loaded data
        
        const hasCoordinates = this.checkForCoordinates(newUsers);
        if (!hasCoordinates && newUsers && newUsers.length > 0) {
          console.log('Users data does not contain coordinates. Auto-loading initial data.');
          this.autoLoadInitialData();
        } else if (hasCoordinates) {
          console.log('Users data contains coordinates. Using existing data.');
          this.dataLoaded = true;
        }
      }
    }
  },
  methods: {
    selectUser(user) {
      this.userProfile = user;
    },
    updateUsers(newUsers) {
      console.log('Updating users with new data:', newUsers.length);
      this.localUsers = newUsers;
      this.$emit('update-users', newUsers); // Also emit to parent in case they want to update
    },
    addTestUsers(testUsers) {
      console.log('Adding test users:', testUsers);
      if (!this.localUsers) {
        this.localUsers = [...this.users];
      }
      this.localUsers = [...this.localUsers, ...testUsers];
    },
    // Check if users data has coordinates
    checkForCoordinates(users) {
      if (!users || users.length === 0) return false;
      
      // Check if at least one user has coordinates in any field
      return users.some(user => {
        // Check home coordinates
        if (user.iconCategories?.home?.coordinates) return true;
        
        // Check firma coordinates
        if (user.iconCategories?.firma?.coordinates) return true;
        
        // Check projekt coordinates
        if (user.iconCategories?.projekt && Array.isArray(user.iconCategories.projekt)) {
          if (user.iconCategories.projekt.some(p => p.coordinates)) return true;
        }
        
        // Check other coordinates
        if (user.ownProjects && user.ownProjects.some(p => p.coordinates)) return true;
        if (user.contributedProjects && user.contributedProjects.some(p => p.coordinates)) return true;
        
        return false;
      });
    },
    
    // Auto-load initial data from data.json
    autoLoadInitialData() {
      console.log('Auto-loading initial data from data.json');
      const initialData = resetToInitialData();
      this.localUsers = initialData;
      this.$emit('update-users', initialData);
      this.dataLoaded = true;
    }
  },
  mounted() {
    console.log('MapPage mounted');
    console.log('User data sample:', this.users.slice(0, 1));
  }
}
</script>

<style scoped>
.map-page {
  padding: 20px;
  position: relative;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 20px;
}

.map-wrapper {
  width: 100%;
}

/* Data loader container */
.data-loader-container {
  margin-bottom: 20px;
}

.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.profile-container {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #f3f4f6;
  color: #374151;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
}

.debug-toggle {
  margin-bottom: 15px;
}

.test-map-container {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
}

.debug-data {
  margin-top: 30px;
  padding: 15px;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
}

.data-counts {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.user-sample {
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 4px;
  overflow-x: auto;
}

.user-sample pre {
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}

/* Add these new styles for the debug tabs */
.debug-section {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
}

.debug-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.debug-tab {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.debug-tab.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.debug-tab-content {
  padding-top: 10px;
}
</style>
