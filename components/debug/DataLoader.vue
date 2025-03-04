<template>
  <div class="data-loader">
    <h3>Data Loader Debug</h3>
    
    <div class="status-panel">
      <div class="status-item">
        <h4>Data Status</h4>
        <div class="status-indicator">
          <span class="status-dot" :class="{ active: hasDataInStore }"></span>
          <span>{{ hasDataInStore ? 'Data in Store' : 'No Data in Store' }}</span>
        </div>
        
        <div class="status-indicator">
          <span class="status-dot" :class="{ active: hasCoordinatesInStore }"></span>
          <span>{{ hasCoordinatesInStore ? 'Coordinates in Store' : 'No Coordinates in Store' }}</span>
        </div>
        
        <div class="status-indicator">
          <span class="status-dot" :class="{ active: hasDataLoaded }"></span>
          <span>{{ hasDataLoaded ? 'Data JSON Loaded' : 'Data JSON Not Loaded' }}</span>
        </div>
      </div>
    </div>
    
    <div class="action-panel">
      <button @click="loadDataJson" class="action-btn primary">
        <i class="fas fa-download"></i> Load data.json directly
      </button>
      <button @click="applyDataToUsers" class="action-btn success" :disabled="!hasDataLoaded">
        <i class="fas fa-check"></i> Apply to Users
      </button>
      <button @click="addTestPoints" class="action-btn">
        <i class="fas fa-map-pin"></i> Add Test Points
      </button>
    </div>
    
    <div class="compare-panel" v-if="showComparison">
      <h4>Comparison of Data</h4>
      <div class="comparison-columns">
        <div class="column">
          <h5>Store Data (First User)</h5>
          <pre class="data-preview">{{ JSON.stringify(firstStoreUser, null, 2) }}</pre>
        </div>
        <div class="column">
          <h5>JSON Data (First User)</h5>
          <pre class="data-preview">{{ JSON.stringify(firstJsonUser, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <div class="load-status" v-if="loadStatus">
      <p>{{ loadStatus }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loadedData: null,
      hasDataLoaded: false,
      loadStatus: '',
      showComparison: false
    };
  },
  computed: {
    hasDataInStore() {
      return this.users && this.users.length > 0;
    },
    hasCoordinatesInStore() {
      if (!this.users || this.users.length === 0) return false;
      
      // Check if at least one user has coordinates
      return this.users.some(user => {
        if (!user.iconCategories) return false;
        
        // Check home coordinates
        if (user.iconCategories.home?.coordinates) return true;
        
        // Check firma coordinates
        if (user.iconCategories.firma?.coordinates) return true;
        
        // Check other coordinate types
        const categories = ['projekt', 'tisch', 'wirkungsbereich', 'unternehmen'];
        return categories.some(category => {
          const items = user.iconCategories[category];
          if (!items || !Array.isArray(items)) return false;
          return items.some(item => item && item.coordinates);
        });
      });
    },
    firstStoreUser() {
      return this.users && this.users.length > 0 ? this.users[0] : null;
    },
    firstJsonUser() {
      return this.loadedData && this.loadedData.length > 0 ? this.loadedData[0] : null;
    }
  },
  methods: {
    async loadDataJson() {
      this.loadStatus = 'Loading data.json...';
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.loadedData = await response.json();
        this.hasDataLoaded = true;
        this.showComparison = true;
        this.loadStatus = `Successfully loaded ${this.loadedData.length} users from data.json`;
        
        // Log for debugging
        console.log('Loaded data.json:', this.loadedData);
        if (this.loadedData.length > 0) {
          console.log('First user coordinates check:', {
            home: this.loadedData[0].iconCategories?.home?.coordinates,
            firma: this.loadedData[0].iconCategories?.firma?.coordinates,
            projekt: this.loadedData[0].iconCategories?.projekt?.map(p => p.coordinates)
          });
        }
        
      } catch (error) {
        this.loadStatus = `Error loading data.json: ${error.message}`;
        console.error('Error loading data.json:', error);
      }
    },
    
    applyDataToUsers() {
      if (!this.loadedData || this.loadedData.length === 0) {
        this.loadStatus = 'No data to apply!';
        return;
      }
      
      this.loadStatus = 'Applying data to users...';
      
      // Emit event to parent component to update users
      this.$emit('update-users', this.loadedData);
      
      this.loadStatus = 'Applied data to users!';
    },
    
    addTestPoints() {
      this.loadStatus = 'Adding test points...';
      
      // Create test users with coordinates
      const testUsers = [
        {
          id: 99,
          name: "Test User Germany",
          iconCategories: {
            home: { 
              coordinates: [51.1657, 10.4515],
              description: "Center of Germany" 
            },
            firma: {
              name: "Test Company", 
              coordinates: [52.5200, 13.4050],
              description: "Berlin Office"
            },
            projekt: [
              { 
                name: "Test Project 1", 
                coordinates: [48.1351, 11.5820],
                description: "Munich Project"
              }
            ],
            tisch: [
              {
                name: "Test Meetup",
                coordinates: [50.9375, 6.9603],
                description: "Cologne Meetup"
              }
            ]
          }
        }
      ];
      
      // Emit event to parent component to add test users
      this.$emit('add-test-users', testUsers);
      
      this.loadStatus = 'Added test points!';
    }
  }
}
</script>

<style scoped>
.data-loader {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 24px;
}

.status-panel {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 6px;
}

.status-item h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  background-color: #d1d5db;
  border-radius: 50%;
}

.status-dot.active {
  background-color: #10b981;
}

.action-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #e5e7eb;
  color: #1f2937;
  cursor: pointer;
  font-size: 14px;
}

.action-btn.primary {
  background-color: #3b82f6;
  color: white;
}

.action-btn.success {
  background-color: #10b981;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.compare-panel {
  margin-top: 16px;
}

.comparison-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .comparison-columns {
    grid-template-columns: 1fr;
  }
}

.column {
  background-color: #f8fafc;
  border-radius: 6px;
  padding: 12px;
}

.column h5 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 14px;
}

.data-preview {
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
  background-color: #f1f5f9;
  padding: 8px;
  border-radius: 4px;
}

.load-status {
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  font-size: 14px;
  color: #0369a1;
}
</style>
