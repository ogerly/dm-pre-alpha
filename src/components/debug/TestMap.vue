<template>
  <div>
    <h2><i class="fas fa-map" /> Test Map</h2>
    <div
      ref="debugMap"
      class="debug-map"
    />
    <div class="debug-controls">
      <button @click="addTestMarker">
        <i class="fas fa-map-marker" /> Add Test Marker
      </button>
      <button @click="centerMap">
        <i class="fas fa-crosshairs" /> Center Map
      </button>
    </div>
    <div class="status">
      <p>Map loaded: {{ mapLoaded ? 'Yes' : 'No' }}</p>
      <p>Markers added: {{ markers.length }}</p>
      <p>Errors: {{ errors.length > 0 ? 'Yes' : 'No' }}</p>
    </div>
    <div
      v-if="errors.length > 0"
      class="errors"
    >
      <h3>Errors:</h3>
      <ul>
        <li
          v-for="(error, index) in errors"
          :key="index"
        >
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestMap',
  data() {
    return {
      map: null,
      markers: [],
      mapLoaded: false,
      errors: []
    };
  },
  mounted() {
    // Load Leaflet
    this.loadLeaflet();
  },
  methods: {
    loadLeaflet() {
      try {
        // Load CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
        
        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => this.initMap();
        // Fix: Change 'e' parameter to '_e' to follow the naming convention for unused variables
        script.onerror = (_e) => this.errors.push('Failed to load Leaflet script');
        document.head.appendChild(script);
      } catch (err) {
        this.errors.push(`Error loading resources: ${err.message}`);
      }
    },
    
    initMap() {
      try {
        if (!window.L) {
          this.errors.push('Leaflet not available in window object');
          return;
        }
        
        // Initialize map
        this.map = window.L.map(this.$refs.debugMap).setView([51.1657, 10.4515], 6);
        
        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.mapLoaded = true;
        this.addTestMarker();
      } catch (err) {
        this.errors.push(`Error initializing map: ${err.message}`);
      }
    },
    
    addTestMarker() {
      try {
        if (!this.map || !window.L) {
          this.errors.push('Map not initialized');
          return;
        }
        
        // Add a test marker in the center of Germany
        const marker = window.L.marker([51.1657, 10.4515]);
        marker.addTo(this.map);
        this.markers.push(marker);
        
        // Add another marker in Berlin
        const berlinMarker = window.L.marker([52.5200, 13.4050]);
        berlinMarker.bindPopup('Berlin');
        berlinMarker.addTo(this.map);
        this.markers.push(berlinMarker);
        
        // Add circle
        const circle = window.L.circle([52.5200, 13.4050], {
          radius: 50000, // 50km
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2
        }).addTo(this.map);
        this.markers.push(circle);
      } catch (err) {
        this.errors.push(`Error adding test marker: ${err.message}`);
      }
    },
    
    centerMap() {
      if (this.map) {
        this.map.setView([51.1657, 10.4515], 6);
      }
    }
  }
})
</script>

<style scoped>
.debug-map {
  height: 400px;
  margin-bottom: 15px;
}

.debug-controls {
  margin-bottom: 15px;
}

.debug-controls button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 15px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.status {
  background-color: #f0f9ff;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.errors {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 10px;
  border-radius: 4px;
}
</style>
