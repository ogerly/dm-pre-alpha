<template>
  <div class="asset-test">
    <h3>Asset Loading Tests</h3>
    
    <div class="test-section">
      <h4>Available Asset Tests</h4>
      <button
        class="test-btn"
        @click="testDataJson"
      >
        <i class="fas fa-file-code" /> Test data.json
      </button>
      <button
        class="test-btn"
        @click="testFetchAssets"
      >
        <i class="fas fa-network-wired" /> Test All Asset Paths
      </button>
      <button
        class="test-btn"
        @click="testImageAssets"
      >
        <i class="fas fa-image" /> Test Image Loading
      </button>
    </div>
    
    <div
      v-if="testResults.length > 0"
      class="results-section"
    >
      <h4>Test Results</h4>
      <div 
        v-for="(result, index) in testResults" 
        :key="index" 
        class="result-item"
        :class="{ success: result.success, error: !result.success }"
      >
        <span class="result-path">{{ result.path }}</span>
        <span class="result-status">{{ result.message }}</span>
      </div>
    </div>
    
    <div
      v-if="testRunning"
      class="loading"
    >
      Testing in progress... <i class="fas fa-spinner fa-spin" />
    </div>
    
    <div class="console-output">
      <h4>Console Output</h4>
      <pre class="output-text">{{ consoleOutput }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testResults: [],
      testRunning: false,
      consoleOutput: '',
      testPaths: [
        '/data.json',
        './data.json',
        '../data.json',
        'data.json',
        '/assets/data.json',
        '/public/data.json',
        '/src/data.json'
      ]
    };
  },
  methods: {
    logToConsole(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.consoleOutput += `[${timestamp}] ${message}\n`;
    },
    
    async testDataJson() {
      this.testRunning = true;
      this.testResults = [];
      this.consoleOutput = '';
      this.logToConsole('Starting data.json test');
      
      try {
        const response = await fetch('/data.json');
        const status = response.status;
        
        if (response.ok) {
          const data = await response.json();
          this.testResults.push({
            path: '/data.json',
            success: true,
            message: `Success! Status: ${status}, Found ${data.length} users`
          });
          this.logToConsole(`Success: data.json loaded with ${data.length} users`);
          
          // Check for coordinates in the data
          if (data.length > 0 && data[0].iconCategories) {
            const firstUser = data[0];
            const hasCoordinates = firstUser.iconCategories.home?.coordinates ||
                                  firstUser.iconCategories.firma?.coordinates ||
                                  (firstUser.iconCategories.projekt && 
                                   firstUser.iconCategories.projekt.some(p => p.coordinates));
                                   
            if (hasCoordinates) {
              this.logToConsole('Coordinates found in data');
            } else {
              this.logToConsole('WARNING: No coordinates found in first user data');
            }
          }
        } else {
          this.testResults.push({
            path: '/data.json',
            success: false,
            message: `Failed: Status ${status}`
          });
          this.logToConsole(`Error: data.json fetch failed with status ${status}`);
        }
      } catch (error) {
        this.testResults.push({
          path: '/data.json',
          success: false,
          message: `Error: ${error.message}`
        });
        this.logToConsole(`Exception: ${error.message}`);
      }
      
      this.testRunning = false;
    },
    
    async testFetchAssets() {
      this.testRunning = true;
      this.testResults = [];
      this.consoleOutput = '';
      this.logToConsole(`Testing ${this.testPaths.length} different asset paths`);
      
      for (const path of this.testPaths) {
        try {
          this.logToConsole(`Testing path: ${path}`);
          const response = await fetch(path);
          
          if (response.ok) {
            this.testResults.push({
              path: path,
              success: true,
              message: `Success! Status: ${response.status}`
            });
            this.logToConsole(`✅ Path ${path} is accessible`);
          } else {
            this.testResults.push({
              path: path,
              success: false,
              message: `Failed: Status ${response.status}`
            });
            this.logToConsole(`❌ Path ${path} returned status ${response.status}`);
          }
        } catch (error) {
          this.testResults.push({
            path: path,
            success: false,
            message: `Error: ${error.message}`
          });
          this.logToConsole(`❌ Exception for path ${path}: ${error.message}`);
        }
      }
      
      this.testRunning = false;
    },
    
    async testImageAssets() {
      this.testRunning = true;
      this.testResults = [];
      this.consoleOutput = '';
      this.logToConsole('Testing image loading');
      
      // Test loading an image from a common CDN to verify network connectivity
      const testImage = new Image();
      testImage.onload = () => {
        this.testResults.push({
          path: 'External image resource',
          success: true,
          message: 'Successfully loaded external image'
        });
        this.logToConsole('✅ External image resource loaded successfully');
        this.testRunning = false;
      };
      
      testImage.onerror = () => {
        this.testResults.push({
          path: 'External image resource',
          success: false,
          message: 'Failed to load external image'
        });
        this.logToConsole('❌ External image resource failed to load');
        this.testRunning = false;
      };
      
      testImage.src = 'https://via.placeholder.com/150';
      this.logToConsole('Image loading test initiated');
    }
  }
};
</script>

<style scoped>
.asset-test {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 24px;
}

.test-section {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.test-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.results-section {
  margin-bottom: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
}

.result-item.success {
  background-color: #dcfce7;
}

.result-item.error {
  background-color: #fee2e2;
}

.loading {
  padding: 8px;
  margin: 8px 0;
  background-color: #f3f4f6;
  border-radius: 4px;
  text-align: center;
}

.console-output {
  margin-top: 16px;
  padding: 12px;
  background-color: #1f2937;
  border-radius: 6px;
}

.console-output h4 {
  color: white;
  margin-top: 0;
  margin-bottom: 8px;
}

.output-text {
  color: #10b981;
  background-color: transparent;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}
</style>
