<template>
  <div class="map-container">
    <div class="map-header">
      <h2>DreamMall Karte</h2>
      <div class="map-controls">
        <div class="filter-group">
          <label>
            <input type="checkbox" v-model="filters.home"> 
            <span class="filter home">Wohnorte</span>
          </label>
          <label>
            <input type="checkbox" v-model="filters.firma"> 
            <span class="filter firma">Firmen</span>
          </label>
          <label>
            <input type="checkbox" v-model="filters.projekt"> 
            <span class="filter projekt">Projekte</span>
          </label>
          <label>
            <input type="checkbox" v-model="filters.tisch"> 
            <span class="filter tisch">Meetups</span>
          </label>
        </div>
        <button @click="centerMap" class="center-btn">
          <i class="bi bi-geo"></i> Zentrieren
        </button>
      </div>
    </div>
    
    <div id="map" ref="mapContainer"></div>
    
    <div v-if="selectedPoint" class="map-info-panel">
      <div class="info-header">
        <h3>{{ selectedPoint.info.title }}</h3>
        <button @click="closeInfoPanel" class="close-btn">&times;</button>
      </div>
      <div class="info-content">
        <p v-if="selectedPoint.info.description">{{ selectedPoint.info.description }}</p>
        
        <div v-if="selectedPoint.associatedUser" class="associated-user">
          <p><strong>Verknüpft mit:</strong> {{ selectedPoint.associatedUser.name }}</p>
          <button @click="viewProfile(selectedPoint.associatedUser)" class="view-profile-btn">
            Profil anzeigen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      map: null,
      markers: {},
      selectedPoint: null,
      filters: {
        home: true,
        firma: true,
        projekt: true,
        tisch: true
      }
    };
  },
  computed: {
    mapPoints() {
      const points = [];
      
      // Add Home points from users
      if (this.filters.home) {
        this.users.forEach(user => {
          if (user.iconCategories?.home?.coordinates) {
            points.push({
              type: 'Home',
              coordinates: user.iconCategories.home.coordinates,
              icon: 'bi bi-house-door',
              info: {
                title: `Wohnort: ${user.name}`,
                description: user.iconCategories.home.description || ''
              },
              associatedUser: user
            });
          }
        });
      }
      
      // Add Firma points from users
      if (this.filters.firma) {
        this.users.forEach(user => {
          if (user.iconCategories?.firma?.coordinates) {
            points.push({
              type: 'Firma',
              coordinates: user.iconCategories.firma.coordinates,
              icon: 'bi bi-building',
              info: {
                title: user.iconCategories.firma.name || 'Firma',
                description: `${user.iconCategories.firma.role || ''} - ${user.iconCategories.firma.description || ''}`
              },
              associatedUser: user
            });
          }
          
          // Also add Unternehmen if available
          if (user.iconCategories?.unternehmen) {
            user.iconCategories.unternehmen.forEach(company => {
              if (company.coordinates) {
                points.push({
                  type: 'Firma',
                  coordinates: company.coordinates,
                  icon: 'bi bi-briefcase',
                  info: {
                    title: company.name || 'Unternehmen',
                    description: `${company.role || ''} - ${company.description || ''}`
                  },
                  associatedUser: user
                });
              }
            });
          }
        });
      }
      
      // Add Projekt points
      if (this.filters.projekt) {
        this.users.forEach(user => {
          if (user.iconCategories?.projekt) {
            user.iconCategories.projekt.forEach(project => {
              if (project.coordinates) {
                points.push({
                  type: 'Projekt',
                  coordinates: project.coordinates,
                  icon: 'bi bi-folder',
                  info: {
                    title: project.name || 'Projekt',
                    description: project.description || ''
                  },
                  associatedUser: user
                });
              }
            });
          }
        });
      }
      
      // Add Tisch (meetup) points
      if (this.filters.tisch) {
        this.users.forEach(user => {
          if (user.iconCategories?.tisch) {
            user.iconCategories.tisch.forEach(table => {
              if (table.coordinates) {
                points.push({
                  type: 'Tisch',
                  coordinates: table.coordinates,
                  icon: 'bi bi-table',
                  info: {
                    title: table.name || 'Meetup',
                    description: table.description || ''
                  },
                  associatedUser: user
                });
              }
            });
          }
        });
      }
      
      // Also add points from the props
      if (this.filters.firma) {
        this.companies.forEach(company => {
          if (company.location?.coordinates) {
            points.push({
              type: 'Firma',
              coordinates: company.location.coordinates,
              icon: 'bi bi-building',
              info: {
                title: company.name,
                description: company.description || ''
              }
            });
          }
        });
      }
      
      if (this.filters.projekt) {
        this.projects.forEach(project => {
          if (project.location?.coordinates) {
            points.push({
              type: 'Projekt',
              coordinates: project.location.coordinates,
              icon: 'bi bi-folder',
              info: {
                title: project.name,
                description: project.description || ''
              }
            });
          }
        });
      }
      
      if (this.filters.tisch) {
        this.tables.forEach(table => {
          if (table.location?.coordinates) {
            points.push({
              type: 'Tisch',
              coordinates: table.location.coordinates,
              icon: 'bi bi-table',
              info: {
                title: table.name,
                description: table.description || ''
              }
            });
          }
        });
      }
      
      return points;
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.updateMap();
      }
    },
    users: {
      deep: true,
      handler() {
        this.updateMap();
      }
    },
    companies: {
      deep: true,
      handler() {
        this.updateMap();
      }
    },
    projects: {
      deep: true,
      handler() {
        this.updateMap();
      }
    },
    tables: {
      deep: true,
      handler() {
        this.updateMap();
      }
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Check if window.L (Leaflet) exists - if not, load it
      if (!window.L) {
        // Load Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
        
        // Load Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        leafletScript.crossOrigin = '';
        document.head.appendChild(leafletScript);
        
        leafletScript.onload = () => {
          this.createMap();
        };
      } else {
        this.createMap();
      }
    },
    
    createMap() {
      const L = window.L;
      
      // Create the map centered on Germany
      this.map = L.map(this.$refs.mapContainer).setView([51.1657, 10.4515], 6);
      
      // Add the OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      
      // Update the map with points
      this.updateMap();
    },
    
    updateMap() {
      if (!this.map || !window.L) return;
      
      const L = window.L;
      
      // Clear existing markers
      Object.values(this.markers).forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = {};
      
      // Add new markers based on filtered points
      this.mapPoints.forEach((point, index) => {
        // Create a custom icon based on type
        let iconClass = 'home-icon';
        
        switch (point.type) {
          case 'Home':
            iconClass = 'home-icon';
            break;
          case 'Firma':
            iconClass = 'firma-icon';
            break;
          case 'Projekt':
            iconClass = 'projekt-icon';
            break;
          case 'Tisch':
            iconClass = 'tisch-icon';
            break;
        }
        
        const icon = L.divIcon({
          className: `custom-marker ${iconClass}`,
          html: `<i class="${point.icon}"></i>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        // Create the marker
        const marker = L.marker(point.coordinates, { icon });
        
        // Add click event for the marker
        marker.on('click', () => {
          this.selectedPoint = point;
        });
        
        // Add popup with basic info
        marker.bindTooltip(point.info.title);
        
        // Add the marker to the map and store in our markers object
        marker.addTo(this.map);
        this.markers[`point-${index}`] = marker;
      });
    },
    
    centerMap() {
      if (this.map && this.mapPoints.length > 0) {
        // If there's only one point, center on that with higher zoom
        if (this.mapPoints.length === 1) {
          this.map.setView(this.mapPoints[0].coordinates, 13);
          return;
        }
        
        // Otherwise fit bounds to all points
        const bounds = window.L.latLngBounds(this.mapPoints.map(p => p.coordinates));
        this.map.fitBounds(bounds, { padding: [50, 50] });
      } else if (this.map) {
        // Default center on Germany
        this.map.setView([51.1657, 10.4515], 6);
      }
    },
    
    closeInfoPanel() {
      this.selectedPoint = null;
    },
    
    viewProfile(user) {
      this.$emit('view-profile', user);
    }
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

.leaflet-right{
  display: none;
}

.map-container {
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #374151;
}

.map-controls {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.filter {
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.filter.home {
  background-color: #dcfce7;
  color: #166534;
}

.filter.firma {
  background-color: #e0f2fe;
  color: #0369a1;
}

.filter.projekt {
  background-color: #f3e8ff;
  color: #7e22ce;
}

.filter.tisch {
  background-color: #ede9fe;
  color: #6d28d9;
}

#map {
  flex-grow: 1;
  width: 100%;
  z-index: 5;
}

.center-btn {
  background-color: #fff;
  border: 1px solid #d1d5db;
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.map-info-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 15;
}

.info-header {
  padding: 10px 15px;
  background-color: #f9fafb;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.info-content {
  padding: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6b7280;
}

.associated-user {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.view-profile-btn {
  margin-top: 5px;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Global styles for Leaflet markers - these need to be scoped */
:global(.custom-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

:global(.home-icon) {
  background-color: #dcfce7;
  color: #166534;
}

:global(.firma-icon) {
  background-color: #e0f2fe;
  color: #0369a1;
}

:global(.projekt-icon) {
  background-color: #f3e8ff;
  color: #7e22ce;
}

:global(.tisch-icon) {
  background-color: #ede9fe;
  color: #6d28d9;
}

:global(.custom-marker i) {
  font-size: 1.2rem;
}
</style>
