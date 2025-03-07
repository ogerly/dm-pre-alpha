<template>
  <div
    v-if="visible"
    class="error-console"
  >
    <div class="error-console-header">
      <h3>Debug Console</h3>
      <div class="error-console-controls">
        <input
          v-model="filterText"
          type="text"
          placeholder="Filter logs..."
          class="filter-input"
        >
        <select
          v-model="logLevel"
          class="level-select"
        >
          <option value="DEBUG">
            Debug
          </option>
          <option value="INFO">
            Info
          </option>
          <option value="WARN">
            Warnings
          </option>
          <option value="ERROR">
            Errors
          </option>
        </select>
        <button
          class="clear-button"
          @click="clearLogs"
        >
          Clear
        </button>
        <button
          class="close-button"
          @click="toggleConsole"
        >
          Close
        </button>
      </div>
    </div>
    
    <div class="error-console-body">
      <div
        v-if="logs.length === 0"
        class="no-logs"
      >
        No logs to display
      </div>
      <div
        v-else
        class="logs-container"
      >
        <div 
          v-for="log in logs" 
          :key="log.id" 
          :class="['log-entry', logLevelClass(log.level)]"
        >
          <div class="log-timestamp">
            {{ formatTimestamp(log.timestamp) }}
          </div>
          <div class="log-message">
            {{ log.message }}
          </div>
          <pre
            v-if="hasData(log)"
            class="log-data"
          >{{ formatData(log.data) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import errorLogger from '@/services/errorLogger';
import chatService from '@/services/ChatService';
import lintService from '@/services/lintService';

export default defineComponent({
  name: 'ErrorConsole',
  
  setup() {
    const visible = ref(false);
    const filterText = ref('');
    const logLevel = ref('INFO');
    const currentFilter = ref('all');
    const socketStatus = ref('disconnected');
    const activeUsers = ref(0);
    const lastPing = ref(null);
    const activeTab = ref('logs');
    
    // Lint status
    const lintStatus = ref('unknown');
    const lintErrors = ref([]);
    const lintWarnings = ref([]);
    const lintLastRun = ref(null);
    
    // Check if in production mode
    const isProd = computed(() => import.meta.env.PROD);
    
    // Count logs by type - Fix the hasOwnProperty error
    const logCounts = computed(() => {
      const counts = { debug: 0, info: 0, warn: 0, error: 0 }
      
      errorLogger.logs.forEach(log => {
        const level = log.levelName.toLowerCase();
        // Use Object.prototype.hasOwnProperty.call or in operator instead
        if (Object.prototype.hasOwnProperty.call(counts, level)) {
          counts[level]++;
        }
        // Alternative approach using 'in' operator:
        // if (level in counts) {
        //   counts[level]++;
        // }
      })
      
      return counts
    })
    
    // Format the socket status text
    const socketStatusText = computed(() => {
      if (socketStatus.value === 'connected') {
        return `Connected (${activeUsers.value} online)`
      } else if (socketStatus.value === 'connecting') {
        return 'Connecting...'
      } else {
        return 'Disconnected'
      }
    })
    
    // Handle socket connection events
    const handleSocketConnected = (data) => {
      socketStatus.value = 'connected';
      lastPing.value = new Date();
      
      if (data && data.id) {
        errorLogger.debug('Socket connected', {
          category: 'socket',
          socketId: data.id
        })
      }
    }
    
    const handleSocketDisconnected = () => {
      socketStatus.value = 'disconnected';
      activeUsers.value = 0;
      errorLogger.warn('Socket disconnected', {
        category: 'socket',
        lastPing: lastPing.value
      })
    }
    
    const handleUserCount = (count) => {
      activeUsers.value = count;
    }
    
    // Check if this is a chat/socket related log
    const isChatLog = (log) => {
      if (!log.metadata) return false;
      
      return log.metadata.category === 'socket' || 
             log.metadata.category === 'chat-connection' ||
             log.metadata.category === 'chat-message' ||
             log.metadata.category === 'chat-error' ||
             log.message.toLowerCase().includes('socket');
    }
    
    // Check if this is a lint related log
    const isLintLog = (log) => {
      if (!log.metadata) return false;
      return log.metadata.category === 'lint';
    }
    
    // Run ESLint check
    const runLintCheck = async () => {
      try {
        lintStatus.value = 'running';
        const result = await lintService.runLintCheck();
        if (result.success) {
          // Results will be processed by the lintService
        } else {
          errorLogger.error('Lint check failed', new Error(result.message));
        }
      } catch (error) {
        errorLogger.error('Error running lint check', error);
      }
    }
    
    // Handle lint status updates
    const handleLintUpdate = (data) => {
      lintStatus.value = data.status;
      lintErrors.value = data.errors || [];
      lintWarnings.value = data.warnings || [];
      lintLastRun.value = data.lastRunTime;
    }
    
    // Format lint timestamp
    const formatLintTime = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleTimeString();
    }
    
    // Set up socket monitoring when component is mounted
    onMounted(() => {
      // Check initial connection state
      if (chatService.isConnected()) {
        socketStatus.value = 'connected';
      } else {
        // If not connected, try to connect
        socketStatus.value = 'connecting';
        chatService.connect();
      }
      
      // Set up event listeners
      chatService.on('connected', handleSocketConnected);
      chatService.on('disconnected', handleSocketDisconnected);
      chatService.on('userCount', handleUserCount);
      
      // Set up lint service listener
      const unsubscribe = lintService.subscribe(handleLintUpdate);
      
      // Handle custom event from Vite dev server for ESLint
      if (!isProd.value && typeof window !== 'undefined') {
        if (import.meta.hot) {
          import.meta.hot.on('eslint-results', (data) => {
            lintService.setResults(data);
          });
        }
      }
      
      // Set up a ping mechanism to check connection health
      const pingTimer = setInterval(() => {
        if (chatService.isConnected()) {
          lastPing.value = new Date();
        } else if (socketStatus.value === 'connected') {
          // If we think we're connected but haven't received a ping, reconnect
          socketStatus.value = 'connecting';
          chatService.disconnect();
          setTimeout(() => chatService.connect(), 1000);
        }
      }, 30000); // Check every 30 seconds
      
      // Clean up on unmount
      onUnmounted(() => {
        chatService.off('connected', handleSocketConnected);
        chatService.off('disconnected', handleSocketDisconnected);
        chatService.off('userCount', handleUserCount);
        unsubscribe();
        clearInterval(pingTimer);
      });
    });
    
    watch(currentFilter, (newFilter) => {
      errorLogger.setFilter(newFilter);
    });
    
    // Fix the hasOwnProperty error - completely rewrite the function
    const hasMetadata = (log) => {
      if (!log.metadata) return false;
      if (Object.keys(log.metadata).length === 0) return false;
      
      // Check if 'error' is the only property
      if (Object.keys(log.metadata).length === 1 && 'error' in log.metadata) {
        return false;
      }
      
      return true;
    }
    
    const formatMetadata = (metadata) => {
      if (!metadata) return '';
      
      // Create a new object without the error property
      const result = {};
      for (const key in metadata) {
        if (key !== 'error') {
          result[key] = metadata[key];
        }
      }
      
      return Object.keys(result).length ? JSON.stringify(result, null, 2) : '';
    }
    
    // Watch for filter text changes and update the logger
    watch(filterText, (newValue) => {
      errorLogger.setFilter(newValue);
    });
    
    // Watch for log level changes and update the logger
    watch(logLevel, (newValue) => {
      errorLogger.setLevel(newValue);
    });
    
    // Get logs from error logger
    const logs = computed(() => {
      return errorLogger.filteredLogs;
    });
    
    // Format timestamp
    const formatTimestamp = (timestamp) => {
      if (!(timestamp instanceof Date)) {
        timestamp = new Date(timestamp);
      }
      
      return timestamp.toLocaleTimeString();
    };
    
    // Get CSS class based on log level
    const logLevelClass = (level) => {
      const levels = ['debug', 'info', 'warn', 'error'];
      return `level-${levels[level] || 'info'}`;
    };
    
    // Check if log has data
    const hasData = (log) => {
      return log.data && Object.keys(log.data).length > 0;
    };
    
    // Format data for display
    const formatData = (data) => {
      return JSON.stringify(data, null, 2);
    };
    
    // Clear all logs
    const clearLogs = () => {
      errorLogger.clear();
    };
    
    // Toggle console visibility
    const toggleConsole = () => {
      visible.value = !visible.value;
    };
    
    // Keyboard shortcut to toggle console
    const handleKeyDown = (event) => {
      // Toggle console with Ctrl+Shift+D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleConsole();
      }
    };
    
    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    return {
      visible,
      logs,
      filterText,
      logLevel,
      formatTimestamp,
      logLevelClass,
      hasData,
      formatData,
      clearLogs,
      toggleConsole,
      logger: errorLogger,
      currentFilter,
      socketStatus,
      socketStatusText,
      activeUsers,
      logCounts,
      hasMetadata,
      formatMetadata,
      isChatLog,
      isLintLog,
      activeTab,
      lintStatus,
      lintErrors,
      lintWarnings,
      lintLastRun,
      runLintCheck,
      formatLintTime,
      isProd
    }
  }
});
</script>

<style scoped>
.error-console {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  z-index: 9999;
  font-family: monospace;
  display: flex;
  flex-direction: column;
}

.error-console-header {
  padding: 8px;
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-console-header h3 {
  margin: 0;
  font-size: 14px;
}

.error-console-controls {
  display: flex;
  gap: 8px;
}

.filter-input,
.level-select {
  padding: 4px 8px;
  background: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 3px;
  font-size: 12px;
}

.clear-button,
.close-button {
  padding: 4px 8px;
  background: #555;
  color: white;
  border: 1px solid #666;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.close-button:hover,
.clear-button:hover {
  background: #666;
}

.error-console-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.no-logs {
  text-align: center;
  padding: 20px;
  color: #888;
}

.logs-container {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
}

.log-entry {
  padding: 6px;
  border-radius: 2px;
  font-size: 12px;
}

.log-timestamp {
  font-size: 10px;
  color: #999;
  margin-bottom: 2px;
}

.log-message {
  font-weight: bold;
  margin-bottom: 2px;
}

.log-data {
  margin: 0;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  font-size: 11px;
  white-space: pre-wrap;
}

.level-debug {
  background-color: rgba(75, 75, 75, 0.5);
  border-left: 3px solid gray;
}

.level-info {
  background-color: rgba(0, 0, 128, 0.5);
  border-left: 3px solid blue;
}

.level-warn {
  background-color: rgba(128, 128, 0, 0.5);
  border-left: 3px solid yellow;
}

.level-error {
  background-color: rgba(128, 0, 0, 0.5);
  border-left: 3px solid red;
}
</style>
