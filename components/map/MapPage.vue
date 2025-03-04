<template>
  <div class="map-page">
    <h2>Karte</h2>
    <p class="subtitle">
      Entdecke Profile, Unternehmen, Projekte und Meetups auf der Karte
    </p>
    
    <div class="map-wrapper">
      <MapView 
        :users="users"
        :companies="companies"
        :projects="projects"
        :tables="tables"
        @view-profile="selectUser"
      />
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
import UserProfile from '../UserProfile.vue';

export default {
  components: {
    MapView,
    UserProfile
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
      userProfile: null
    };
  },
  methods: {
    selectUser(user) {
      this.userProfile = user;
    }
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
</style>
