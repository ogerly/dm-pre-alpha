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
    
    <!-- Path selection for data loading -->
    <div class="path-selection">
      <h4>Data Path</h4>
      <div class="radio-group">
        <div>
          <input type="radio" id="path1" value="/data.json" v-model="dataPath">
          <label for="path1">/data.json (root)</label>
        </div>
        <div>
          <input type="radio" id="path2" value="./data.json" v-model="dataPath">
          <label for="path2">./data.json (relative)</label>
        </div>
        <div>
          <input type="radio" id="path3" value="../data.json" v-model="dataPath">
          <label for="path3">../data.json (one level up)</label>
        </div>
        <div>
          <input type="radio" id="path4" v-model="dataPath" value="custom">
          <label for="path4">Custom:</label>
          <input 
            type="text" 
            v-model="customPath" 
            placeholder="Enter custom path" 
            :disabled="dataPath !== 'custom'"
            class="custom-path-input"
          >
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
    
    <!-- Manual data input option -->
    <div class="manual-data-entry">
      <h4>Manual Data Input</h4>
      <p>If data.json cannot be loaded, paste the JSON content here:</p>
      <textarea 
        v-model="manualJsonInput" 
        placeholder="Paste JSON data here..." 
        rows="5"
        class="json-textarea"
      ></textarea>
      <button @click="loadManualJson" class="action-btn">
        <i class="fas fa-file-import"></i> Parse Manual JSON
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
    
    <div class="load-status" :class="{ error: loadError, success: !loadError && loadStatus }">
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
      loadError: false,
      showComparison: false,
      dataPath: '/data.json',
      customPath: '',
      manualJsonInput: ''
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
    },
    effectiveDataPath() {
      return this.dataPath === 'custom' ? this.customPath : this.dataPath;
    }
  },
  methods: {
    async loadDataJson() {
      this.loadStatus = `Loading data from ${this.effectiveDataPath}...`;
      this.loadError = false;
      
      try {
        console.log(`Attempting to fetch data from: ${this.effectiveDataPath}`);
        const response = await fetch(this.effectiveDataPath);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.processLoadedData(data);
      } catch (error) {
        this.loadError = true;
        this.loadStatus = `Error loading data: ${error.message}. Try a different path or manual input.`;
        console.error('Error loading data.json:', error);
      }
    },
    
    loadManualJson() {
      this.loadError = false;
      this.loadStatus = 'Processing manual JSON input...';
      
      try {
        if (!this.manualJsonInput.trim()) {
          throw new Error('No JSON input provided');
        }
        
        const data = JSON.parse(this.manualJsonInput);
        this.processLoadedData(data);
      } catch (error) {
        this.loadError = true;
        this.loadStatus = `Error parsing manual JSON: ${error.message}`;
        console.error('Error parsing manual JSON:', error);
      }
    },
    
    processLoadedData(data) {
      // Validate data structure
      if (!Array.isArray(data)) {
        this.loadError = true;
        this.loadStatus = 'Error: Data is not an array';
        return;
      }
      
      if (data.length === 0) {
        this.loadError = true;
        this.loadStatus = 'Warning: Data array is empty';
        return;
      }
      
      // Check for required fields in the first item
      const firstItem = data[0];
      if (!firstItem.id || !firstItem.name) {
        this.loadError = true;
        this.loadStatus = 'Error: Data items missing required fields (id, name)';
        return;
      }
      
      // Success - store the data
      this.loadedData = data;
      this.hasDataLoaded = true;
      this.showComparison = true;
      this.loadStatus = `Successfully loaded ${data.length} users`;
      
      // Log for debugging
      console.log('Loaded data:', data);
      if (data.length > 0) {
        console.log('First user coordinates check:', {
          home: data[0].iconCategories?.home?.coordinates,
          firma: data[0].iconCategories?.firma?.coordinates,
          projekt: data[0].iconCategories?.projekt?.map(p => p.coordinates)
        });
      }
    },
    
    applyDataToUsers() {
      if (!this.loadedData || this.loadedData.length === 0) {
        this.loadError = true;
        this.loadStatus = 'No data to apply!';
        return;
      }
      
      this.loadStatus = 'Applying data to users...';
      this.loadError = false;
      
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

.path-selection {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.custom-path-input {
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 200px;
}

.manual-data-entry {
  margin: 16px 0;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
}

.json-textarea {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: monospace;
}

.load-status.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.load-status.success {
  background-color: #dcfce7;
  color: #166534;
}
</style>
