<template>
  <div class="map-container">
    <!-- Map Controls and Filters -->
    <div class="map-header">
      <h2>DreamMall Karte</h2>
      <div class="map-controls">
        <!-- Type Filter -->
        <div class="filter-select">
          <label for="type-filter">Filter:</label>
          <select id="type-filter" v-model="filterType" class="form-control">
            <option value="all">Alle Typen</option>
            <option value="Home">Wohnorte</option>
            <option value="Firma">Firmen</option>
            <option value="Projekt">Projekte</option>
            <option value="Tisch">Meetups</option>
          </select>
        </div>

        <!-- Search Input -->
        <div class="search-input">
          <input 
            type="text" 
            v-model="searchText" 
            placeholder="Suchen..." 
            @keyup.enter="updateMap"
          >
          <button @click="updateMap" class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <!-- Show Service Areas Checkbox -->
        <div class="service-area-toggle">
          <input type="checkbox" id="show-service-areas" v-model="showServiceAreas">
          <label for="show-service-areas">Service-Gebiete anzeigen</label>
        </div>

        <button @click="centerMap" class="center-btn">
          <i class="fas fa-map-marker-alt"></i> Zentrieren
        </button>
      </div>

      <!-- Type Legend -->
      <div class="type-legend">
        <span class="type-badge home">Wohnorte</span>
        <span class="type-badge firma">Firmen</span>
        <span class="type-badge projekt">Projekte</span>
        <span class="type-badge tisch">Meetups</span>
      </div>
      
      <!-- Debug Info - remove in production -->
      <div v-if="debugInfo" class="debug-info">
        <span>Points loaded: {{ mapPoints.length }}</span>
        <span>Markers on map: {{ Object.keys(markers).length }}</span>
        <button @click="debugInfo = !debugInfo">Hide Debug</button>
      </div>
    </div>
    
    <!-- Map Container with Loading Indicator -->
    <div id="map" ref="mapContainer">
      <MapLoading v-if="loading" :message="loadingMessage" />
    </div>
    
    <!-- Info Panel -->
    <div class="map-info-panel" :class="{ open: selectedPoint }">
      <div class="info-header">
        <h3 v-if="selectedPoint">{{ selectedPoint.info.title }}</h3>
        <button @click="closeInfoPanel" class="close-btn">&times;</button>
      </div>
      <div v-if="selectedPoint" class="info-content">
        <p v-if="selectedPoint.info.description">{{ selectedPoint.info.description }}</p>
        <span class="type-badge" :class="selectedPoint.type.toLowerCase()">{{ selectedPoint.type }}</span>
        
        <!-- Service Area Info -->
        <div v-if="showServiceForPoint && (selectedPoint.type === 'Firma' || selectedPoint.type === 'Unternehmen')" 
             class="service-area-info">
          <h4>Service-Gebiet</h4>
          <p>Radius: {{ selectedPoint.type === 'Firma' ? '5' : '3' }} km um {{ selectedPoint.info.title }}</p>
          <p>Dienstleistungen sind in diesem Bereich verfügbar.</p>
        </div>
        
        <div v-if="selectedPoint.associatedUser" class="associated-user">
          <p><strong>Verknüpft mit:</strong> {{ selectedPoint.associatedUser.name }}</p>
          <button @click="viewProfile(selectedPoint.associatedUser)" class="view-profile-btn">
            Profil anzeigen
          </button>
        </div>
        
        <div class="debug-coordinates">
          <p><small>Coordinates: [{{ selectedPoint.coordinates[0] }}, {{ selectedPoint.coordinates[1] }}]</small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapLoading from './MapLoading.vue';

export default {
  components: {
    MapLoading
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
      map: null,
      markers: {},
      serviceAreas: {},
      selectedPoint: null,
      filterType: 'all',
      searchText: '',
      showServiceAreas: false,
      showServiceForPoint: false,
      debugInfo: true, // Enable debugging
      typeColors: {
        "Home": "#28a745",         // Grün
        "Firma": "#007bff",        // Blau
        "Wirkungsbereich": "#6610f2", // Lila
        "Unternehmen": "#fd7e14",  // Orange
        "Projekt": "#dc3545",      // Rot
        "Tisch": "#17a2b8"         // Türkis
      },
      typeIcons: {
        "Home": "fas fa-home",
        "Firma": "fas fa-building",
        "Wirkungsbereich": "fas fa-bullseye",
        "Unternehmen": "fas fa-briefcase", 
        "Projekt": "fas fa-folder",
        "Tisch": "fas fa-table"
      },
      loading: true,
      loadingMessage: 'Initializing map...'
    };
  },
  computed: {
    mapPoints() {
      console.group('🗺️ Computing Map Points');
      const points = [];
      const validationErrors = [];
      const processingErrors = [];
      
      try {
        // Debug info about input data
        console.log('Filter type:', this.filterType);
        console.log('Users data:', {
          count: this.users?.length || 0,
          hasHome: this.users.filter(u => u.iconCategories?.home).length,
          hasFirma: this.users.filter(u => u.iconCategories?.firma).length,
          hasProjekt: this.users.filter(u => u.iconCategories?.projekt).length,
          hasTisch: this.users.filter(u => u.iconCategories?.tisch).length
        });
        
        // Process users only if there are any
        if (!this.users || this.users.length === 0) {
          console.log('No users data available');
          console.groupEnd();
          return points;
        }
        
        // Process Home points
        if (this.filterType === 'all' || this.filterType === 'Home') {
          this.users.forEach(user => {
            try {
              if (user.iconCategories?.home?.coordinates) {
                const coords = user.iconCategories.home.coordinates;
                
                if (this.validateCoordinates(coords)) {
                  points.push({
                    type: 'Home',
                    coordinates: coords,
                    icon: this.typeIcons.Home,
                    info: {
                      title: `Wohnort: ${user.name}`,
                      description: user.iconCategories.home.description || ''
                    },
                    associatedUser: user
                  });
                } else {
                  validationErrors.push(`Invalid home coordinates for user ${user.name}: ${JSON.stringify(coords)}`);
                }
              }
            } catch (err) {
              processingErrors.push(`Error processing home for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process Firma points
        if (this.filterType === 'all' || this.filterType === 'Firma') {
          this.users.forEach(user => {
            try {
              if (user.iconCategories?.firma?.coordinates) {
                const coords = user.iconCategories.firma.coordinates;
                
                if (this.validateCoordinates(coords)) {
                  points.push({
                    type: 'Firma',
                    coordinates: coords,
                    icon: this.typeIcons.Firma,
                    serviceRadius: 5, // 5km radius for companies
                    info: {
                      title: user.iconCategories.firma.name || `Firma: ${user.name}`,
                      description: user.iconCategories.firma.description || ''
                    },
                    associatedUser: user
                  });
                } else {
                  validationErrors.push(`Invalid firma coordinates for user ${user.name}: ${JSON.stringify(coords)}`);
                }
              }
            } catch (err) {
              processingErrors.push(`Error processing firma for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process Wirkungsbereich points
        if (this.filterType === 'all' || this.filterType === 'Wirkungsbereich') {
          this.users.forEach(user => {
            try {
              if (user.iconCategories?.wirkungsbereich && Array.isArray(user.iconCategories.wirkungsbereich)) {
                user.iconCategories.wirkungsbereich.forEach((area, idx) => {
                  if (area && this.validateCoordinates(area.coordinates)) {
                    points.push({
                      type: 'Wirkungsbereich',
                      coordinates: area.coordinates,
                      icon: this.typeIcons.Wirkungsbereich,
                      info: {
                        title: `${area.name || 'Wirkungsbereich'}: ${user.name}`,
                        description: area.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
            } catch (err) {
              processingErrors.push(`Error processing wirkungsbereich for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process Unternehmen points
        if (this.filterType === 'all' || this.filterType === 'Firma') {
          this.users.forEach(user => {
            try {
              if (user.iconCategories?.unternehmen && Array.isArray(user.iconCategories.unternehmen)) {
                user.iconCategories.unternehmen.forEach((company, idx) => {
                  if (company && this.validateCoordinates(company.coordinates)) {
                    points.push({
                      type: 'Unternehmen',
                      coordinates: company.coordinates,
                      icon: this.typeIcons.Unternehmen,
                      serviceRadius: 3, // 3km radius for unternehmen
                      info: {
                        title: company.name || `Unternehmen: ${user.name}`,
                        description: company.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
            } catch (err) {
              processingErrors.push(`Error processing unternehmen for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process companies array (legacy format)
        if (this.filterType === 'all' || this.filterType === 'Firma') {
          this.users.forEach(user => {
            try {
              if (user.companies && Array.isArray(user.companies)) {
                user.companies.forEach((company, idx) => {
                  if (company && this.validateCoordinates(company.coordinates)) {
                    points.push({
                      type: 'Unternehmen',
                      coordinates: company.coordinates,
                      icon: this.typeIcons.Unternehmen,
                      serviceRadius: 3,
                      info: {
                        title: company.name || `Unternehmen: ${user.name}`,
                        description: company.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
            } catch (err) {
              processingErrors.push(`Error processing companies for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process Projekt points
        if (this.filterType === 'all' || this.filterType === 'Projekt') {
          this.users.forEach(user => {
            try {
              // Process from iconCategories.projekt
              if (user.iconCategories?.projekt && Array.isArray(user.iconCategories.projekt)) {
                user.iconCategories.projekt.forEach((project, idx) => {
                  if (project && this.validateCoordinates(project.coordinates)) {
                    points.push({
                      type: 'Projekt',
                      coordinates: project.coordinates,
                      icon: this.typeIcons.Projekt,
                      info: {
                        title: project.name || `Projekt: ${user.name}`,
                        description: project.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
              
              // Process own projects with coordinates
              if (user.ownProjects && Array.isArray(user.ownProjects)) {
                user.ownProjects.forEach((project, idx) => {
                  if (project && this.validateCoordinates(project.coordinates)) {
                    points.push({
                      type: 'Projekt',
                      coordinates: project.coordinates,
                      icon: this.typeIcons.Projekt,
                      info: {
                        title: project.name || `Eigenes Projekt: ${user.name}`,
                        description: project.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
              
              // Process contributed projects with coordinates
              if (user.contributedProjects && Array.isArray(user.contributedProjects)) {
                user.contributedProjects.forEach((project, idx) => {
                  if (project && this.validateCoordinates(project.coordinates)) {
                    points.push({
                      type: 'Projekt',
                      coordinates: project.coordinates,
                      icon: this.typeIcons.Projekt,
                      info: {
                        title: project.name || `Mitgewirktes Projekt: ${user.name}`,
                        description: project.description || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
            } catch (err) {
              processingErrors.push(`Error processing projects for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Process Tisch points (meetups)
        if (this.filterType === 'all' || this.filterType === 'Tisch') {
          this.users.forEach(user => {
            try {
              if (user.iconCategories?.tisch && Array.isArray(user.iconCategories.tisch)) {
                user.iconCategories.tisch.forEach((table, idx) => {
                  if (table && this.validateCoordinates(table.coordinates)) {
                    points.push({
                      type: 'Tisch',
                      coordinates: table.coordinates,
                      icon: this.typeIcons.Tisch,
                      info: {
                        title: table.name || `Meetup: ${user.name}`,
                        description: table.description || '',
                        location: table.location || ''
                      },
                      associatedUser: user
                    });
                  }
                });
              }
            } catch (err) {
              processingErrors.push(`Error processing meetups for user ${user.name}: ${err.message}`);
            }
          });
        }
        
        // Apply search text filter if present
        if (this.searchText) {
          const searchLower = this.searchText.toLowerCase();
          const filteredPoints = points.filter(point => 
            point.info.title.toLowerCase().includes(searchLower) || 
            point.info.description.toLowerCase().includes(searchLower) ||
            (point.associatedUser && point.associatedUser.name.toLowerCase().includes(searchLower))
          );
          console.log(`Filtered to ${filteredPoints.length} points matching search: "${this.searchText}"`);
          console.groupEnd();
          return filteredPoints;
        }
        
      } catch (err) {
        console.error('❌ Error generating map points:', err);
      }
      
      // Summary of processing
      console.log(`✅ Generated ${points.length} valid map points`);
      if (validationErrors.length > 0) {
        console.warn(`❌ ${validationErrors.length} validation errors`);
        console.warn(validationErrors.slice(0, 3));
      }
      if (processingErrors.length > 0) {
        console.error(`❌ ${processingErrors.length} processing errors`);
        console.error(processingErrors.slice(0, 3));
      }
      
      console.groupEnd();
      return points;
    }
  },
  watch: {
    filterType() {
      this.updateMap();
    },
    showServiceAreas() {
      this.updateServiceAreas();
    },
    users: {
      handler() {
        console.log('Users data changed, updating map');
        this.updateMap();
      },
      deep: true
    }
  },
  mounted() {
    console.group('🗺️ MapView Component Mounted');
    console.log('Props received:', {
      users: this.users?.length || 0,
      companies: this.companies?.length || 0,
      projects: this.projects?.length || 0,
      tables: this.tables?.length || 0
    });
    console.log('Users sample:', this.users.slice(0, 2));
    console.groupEnd();
    
    this.initMap();
  },
  methods: {
    // Helper method to validate coordinates
    validateCoordinates(coords) {
      return Array.isArray(coords) && 
             coords.length === 2 && 
             typeof coords[0] === 'number' && 
             typeof coords[1] === 'number' &&
             !isNaN(coords[0]) && 
             !isNaN(coords[1]);
    },
    
    initMap() {
      console.group('🗺️ Initializing Map');
      console.log('Starting map initialization');
      
      // Check for mapContainer ref
      if (!this.$refs.mapContainer) {
        console.error('Map container reference not found!');
        console.groupEnd();
        return;
      }
      console.log('Map container found:', this.$refs.mapContainer);
      
      // Include Leaflet CSS directly
      if (!document.getElementById('leaflet-css')) {
        console.log('Adding Leaflet CSS to document head');
        const leafletCSS = document.createElement('link');
        leafletCSS.id = 'leaflet-css';
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
      }
      
      // Include Font Awesome directly
      if (!document.getElementById('font-awesome-css')) {
        console.log('Adding Font Awesome CSS to document head');
        const fontAwesomeCSS = document.createElement('link');
        fontAwesomeCSS.id = 'font-awesome-css';
        fontAwesomeCSS.rel = 'stylesheet';
        fontAwesomeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesomeCSS);
      }
      
      // Wait for dependencies to load
      console.log('Waiting for resources to load before initializing map');
      setTimeout(() => {
        this.loadLeaflet();
      }, 1000); // Increased timeout to ensure resources load
      
      console.groupEnd();
    },
    
    loadLeaflet() {
      console.group('🗺️ Loading Leaflet');
      
      if (window.L) {
        console.log('Leaflet already loaded in window object');
        this.createMap();
        console.groupEnd();
        return;
      }
      
      console.log('Adding Leaflet script to document head');
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log('✅ Leaflet script loaded successfully');
        this.createMap();
        console.groupEnd();
      };
      script.onerror = (err) => {
        console.error('❌ Failed to load Leaflet:', err);
        console.groupEnd();
      };
      document.head.appendChild(script);
    },
    
    createMap() {
      console.group('🗺️ Creating Map');
      
      try {
        const L = window.L;
        
        if (!L) {
          console.error('❌ Leaflet library not loaded (window.L is undefined)');
          console.groupEnd();
          return;
        }
        
        console.log('✅ Leaflet library available:', typeof L);
        
        if (!this.$refs.mapContainer) {
          console.error('❌ Map container not found in refs');
          console.groupEnd();
          return;
        }
        
        console.log('Creating map on element:', this.$refs.mapContainer);
        
        // Add a test marker at Germany's center
        const centerCoords = [51.1657, 10.4515];
        
        // Create the map centered on Germany
        this.map = L.map(this.$refs.mapContainer).setView(centerCoords, 6);
        
        console.log('✅ Map object created:', !!this.map);
        
        // Add the OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        });
        
        tileLayer.addTo(this.map);
        console.log('✅ Tile layer added to map');
        
        this.loadingMessage = 'Loading map data...';
        
        // Update the map immediately 
        this.updateMap();
        
        // Hide loading state after map is ready
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        
      } catch (err) {
        console.error('❌ Error creating map:', err);
        this.loadingMessage = 'Error loading map. Please try again.';
      }
      
      console.groupEnd();
    },
    
    updateMap() {
      console.group('🗺️ Updating Map');
      
      try {
        if (!this.map || !window.L) {
          console.warn('❌ Map or Leaflet not initialized yet');
          console.groupEnd();
          return;
        }
        
        const L = window.L;
        
        // Clear existing markers
        console.log('Clearing existing markers:', Object.keys(this.markers).length);
        Object.values(this.markers).forEach(marker => {
          this.map.removeLayer(marker);
        });
        this.markers = {};
        
        // Clear service areas if not showing them
        if (!this.showServiceAreas) {
          this.clearServiceAreas();
        }
        
        // Get map points and validate them
        const allPoints = this.mapPoints;
        console.log(`Found ${allPoints.length} points to display on map`);
        
        // Show the first 3 points' details
        allPoints.slice(0, 3).forEach((point, i) => {
          console.log(`Sample point ${i}:`, {
            type: point.type, 
            title: point.info.title,
            coordinates: point.coordinates,
            validCoordinates: Array.isArray(point.coordinates) && 
                             point.coordinates.length === 2 &&
                             typeof point.coordinates[0] === 'number' && 
                             typeof point.coordinates[1] === 'number'
          });
        });
        
        // Add new markers based on filtered points
        allPoints.forEach((point, index) => {
          try {
            const coords = point.coordinates;
            if (!Array.isArray(coords) || coords.length !== 2) {
              console.warn(`❌ Invalid coordinates for point ${index}:`, coords);
              return;
            }
            
            if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
              console.warn(`❌ Coordinates are not numbers for point ${index}:`, coords);
              return;
            }
            
            console.log(`Creating marker for "${point.info.title}" at [${coords[0]}, ${coords[1]}]`);
            
            // Use a simple colored dot for clearer visibility
            const marker = L.marker(coords, {
              icon: L.divIcon({
                html: `<div style="
                  background-color: ${this.typeColors[point.type] || '#333'}; 
                  color: white; 
                  width: 24px; 
                  height: 24px; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  border: 2px solid white;
                  font-weight: bold;
                  font-size: 12px;
                ">${point.type.charAt(0)}</div>`,
                className: 'debug-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })
            });
            
            // Add click event for the marker
            marker.on('click', () => {
              console.log(`Marker clicked: ${point.info.title}`);
              this.selectedPoint = point;
              this.showServiceForPoint = true;
            });
            
            // Add tooltip with basic info
            marker.bindTooltip(point.info.title);
            
            // Add the marker to the map
            marker.addTo(this.map);
            console.log(`✅ Added marker for: ${point.info.title}`);
            
            // Store the marker for later
            this.markers[`point-${index}`] = marker;
            
          } catch (err) {
            console.error(`❌ Error creating marker for point ${index}:`, err);
          }
        });
        
        console.log(`✅ Added ${Object.keys(this.markers).length} markers to the map`);
        
        // Center the map if needed
        if (this.mapPoints.length > 0) {
          this.centerMap();
        }
        
      } catch (err) {
        console.error('❌ Error updating map:', err);
      }
      
      console.groupEnd();
    },
    
    createServiceArea(point, index) {
      if (!point.serviceRadius) return;
      
      const L = window.L;
      
      // Create a circle representing the service area
      const serviceArea = L.circle(point.coordinates, {
        radius: point.serviceRadius * 1000, // Convert km to meters
        color: this.typeColors[point.type],
        fillColor: this.typeColors[point.type],
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '5, 10'
      });
      
      serviceArea.addTo(this.map);
      this.serviceAreas[`area-${index}`] = serviceArea;
    },
    
    showServiceAreaForPoint(point, index) {
      // Clear existing service areas if not showing all
      if (!this.showServiceAreas) {
        this.clearServiceAreas();
      }
      
      // Create and show service area for this point
      if (point.serviceRadius) {
        this.createServiceArea(point, index);
        
        // Zoom the map to fit the service area
        const area = this.serviceAreas[`area-${index}`];
        if (area) {
          this.map.fitBounds(area.getBounds());
        }
      }
    },
    
    updateServiceAreas() {
      if (this.showServiceAreas) {
        // Add service areas for applicable points
        this.mapPoints.forEach((point, index) => {
          if ((point.type === 'Firma' || point.type === 'Unternehmen') && point.serviceRadius) {
            this.createServiceArea(point, index);
          }
        });
      } else {
        // Clear all service areas
        this.clearServiceAreas();
      }
    },
    
    clearServiceAreas() {
      Object.values(this.serviceAreas).forEach(area => {
        if (this.map.hasLayer(area)) {
          this.map.removeLayer(area);
        }
      });
      this.serviceAreas = {};
    },
    
    centerMap() {
      if (!this.map || this.mapPoints.length === 0) return;
      
      // If there's only one point, center on that
      if (this.mapPoints.length === 1) {
        this.map.setView(this.mapPoints[0].coordinates, 13);
        return;
      }
      
      // Otherwise fit bounds to all points
      const bounds = window.L.latLngBounds(this.mapPoints.map(p => p.coordinates));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    },
    
    closeInfoPanel() {
      this.selectedPoint = null;
      this.showServiceForPoint = false;
      
      // Clear service areas if not showing all
      if (!this.showServiceAreas) {
        this.clearServiceAreas();
      }
    },
    
    viewProfile(user) {
      this.$emit('view-profile', user);
    },
    
    initializeMap() {
      // ...existing initialization code...
      
      // Add error handling for the tooltip issue
      if (window.L) {
        // Fix for tooltip animation during zoom
        const originalAnimateZoom = window.L.Tooltip.prototype._animateZoom;
        window.L.Tooltip.prototype._animateZoom = function(e) {
          try {
            originalAnimateZoom.call(this, e);
          } catch (err) {
            console.warn('Tooltip animation error handled:', err.message);
            // If animation fails, try to update position without animation
            try {
              if (this._map && this._map._latLngToNewLayerPoint) {
                const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
                this._setPosition(pos);
              }
            } catch (innerErr) {
              console.warn('Could not update tooltip position:', innerErr.message);
            }
          }
        };
      }
      
      // Continue with the rest of your initialization
    },
    
    createMarkers() {
      // ...existing code...
      
      // Before creating new tooltips, ensure old ones are closed
      if (this.map && this.map.eachLayer) {
        this.map.eachLayer(function(layer) {
          if (layer.options && layer.options.pane === 'tooltipPane') {
            layer.remove();
          }
        });
      }
      
      // Continue with marker creation
    }
  }
}
</script>

<style scoped>
@import url("@/assets/styles/map-marker-scop.css");

.map-container {
  position: relative;
  width: 100%;
  height: 1200px; /* Explicit height needed for map to render */
}

#map {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Additional style to reduce console errors with tooltips */
.leaflet-tooltip {
  pointer-events: none !important;
}
</style>
