<template>
  <div class="map-container">
    <h2>Find Profiles Near You</h2>
    
    <div
      v-if="loading"
      class="map-loading"
    >
      <MapLoading />
    </div>
    
    <div
      v-else-if="error"
      class="error-message"
    >
      {{ error }}
    </div>
    
    <div
      v-else
      ref="mapContainer"
      class="map-view"
    />
    
    <div
      v-if="selectedProfile"
      class="profile-popup"
    >
      <div class="profile-popup-header">
        <h3>{{ selectedProfile.name }}</h3>
        <button
          class="close-btn"
          @click="closeProfilePopup"
        >
          ×
        </button>
      </div>
      
      <div class="profile-popup-content">
        <img
          :src="selectedProfile.avatar"
          :alt="selectedProfile.name"
          class="popup-avatar"
        >
        <p class="profile-bio">
          {{ selectedProfile.shortBio }}
        </p>
        
        <div class="profile-actions">
          <router-link
            :to="`/profile/${selectedProfile.id}`"
            class="view-profile-btn"
          >
            View Profile
          </router-link>
          <button
            class="chat-btn"
            @click="startChat(selectedProfile.id)"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapLoading from './MapLoading.vue';

export default {
  name: 'MapView',
  components: {
    MapLoading
  },
  
  setup() {
    const router = useRouter();
    const mapContainer = ref(null);
    const mapInstance = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const profiles = ref([]);
    const selectedProfile = ref(null);
    const markers = ref([]);
    
    // Fix for marker icons in Leaflet
    const fixLeafletIcons = () => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    };
    
    // Create custom marker for profiles
    const createProfileMarker = (profile) => {
      const markerHtml = `
        <div class="custom-marker ${profile.premium ? 'premium' : ''}">
          <img src="${profile.avatar}" alt="${profile.name}" />
        </div>
      `;
      
      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'profile-marker-icon',
        iconSize: [40, 40]
      });
      
      return L.marker([profile.latitude, profile.longitude], { icon: customIcon });
    };
    
    onMounted(async () => {
      fixLeafletIcons();
      
      try {
        // Fetch profile locations from API
        const response = await axios.get('/api/profiles/locations');
        profiles.value = response.data;
        
        // Initialize map once data is loaded
        initMap();
        loading.value = false;
      } catch (err) {
        error.value = 'Failed to load profile locations';
        loading.value = false;
        console.error('Error loading map data:', err);
      }
    });
    
    onBeforeUnmount(() => {
      // Clean up map instance when component is unmounted
      if (mapInstance.value) {
        mapInstance.value.remove();
      }
    });
    
    const initMap = () => {
      if (!mapContainer.value) return;
      
      // Create map instance
      mapInstance.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);
      
      // Add tile layer (map background)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.value);
      
      // Try to get user location and center map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.value.setView([latitude, longitude], 13);
          },
          () => {
            // Default view if geolocation fails
            mapInstance.value.setView([51.505, -0.09], 13);
          }
        );
      }
      
      // Add profile markers to the map
      addProfileMarkers();
    };
    
    const addProfileMarkers = () => {
      if (!mapInstance.value) return;
      
      // Clear any existing markers
      markers.value.forEach(marker => {
        marker.remove();
      });
      markers.value = [];
      
      // Add markers for each profile
      profiles.value.forEach(profile => {
        const marker = createProfileMarker(profile);
        
        marker.on('click', () => {
          showProfileDetails(profile);
        });
        
        marker.addTo(mapInstance.value);
        markers.value.push(marker);
      });
    };
    
    const showProfileDetails = (profile) => {
      selectedProfile.value = profile;
    };
    
    const closeProfilePopup = () => {
      selectedProfile.value = null;
    };
    
    const startChat = (profileId) => {
      router.push(`/chat/${profileId}`);
    };
    
    return {
      mapContainer,
      loading,
      error,
      selectedProfile,
      closeProfilePopup,
      startChat
    };
  }
};
</script>

<style>
.map-container {
  position: relative;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-container h2 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 15px;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #eaeaea;
}

.map-view {
  height: 100%;
  width: 100%;
}

.map-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f8f9fa;
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #dc3545;
  background-color: #f8d7da;
}

/* Custom marker styles */
.custom-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.custom-marker img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-marker.premium {
  border-color: gold;
  transform: scale(1.1);
}

.custom-marker:hover {
  transform: scale(1.2);
  z-index: 1000;
}

/* Profile popup styles */
.profile-popup {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
}

.profile-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.profile-popup-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.profile-popup-content {
  padding: 15px;
  text-align: center;
}

.popup-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
  border: 3px solid #f8f9fa;
}

.profile-bio {
  margin-bottom: 15px;
  color: #6c757d;
}

.profile-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.view-profile-btn, .chat-btn {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.view-profile-btn {
  background-color: #007bff;
  color: white;
  border: none;
}

.chat-btn {
  background-color: #6c757d;
  color: white;
  border: none;
}

.view-profile-btn:hover {
  background-color: #0069d9;
}

.chat-btn:hover {
  background-color: #5a6268;
}

@import '../assets/styles/components/map/layout.css';
@import '../assets/styles/components/map/markers.css';
</style>
