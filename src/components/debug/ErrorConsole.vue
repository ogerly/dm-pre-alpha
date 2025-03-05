<template>
  <div v-if="logger.isVisible" class="error-console">
    <div class="error-console-header">
      <h3>Error Console</h3>
      <div class="error-console-controls">
        <select v-model="currentFilter" class="filter-select">
          <option value="all">All</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>
        <button @click="logger.clear" class="clear-btn">Clear</button>
        <button @click="logger.toggleVisibility" class="close-btn">×</button>
      </div>
    </div>
    
    <div class="error-console-content">
      <template v-if="logger.filteredLogs.length">
        <div 
          v-for="log in logger.filteredLogs" 
          :key="log.id"
          :class="['log-entry', `log-level-${log.levelName.toLowerCase()}`]"
        >
          <div class="log-header">
            <span class="log-time">{{ log.formattedTime }}</span>
            <span class="log-level">{{ log.levelName }}</span>
          </div>
          <div class="log-message">{{ log.message }}</div>
          <div v-if="hasMetadata(log)" class="log-metadata">
            <pre>{{ formatMetadata(log.metadata) }}</pre>
          </div>
          <div v-if="log.metadata.error" class="log-stack">
            <div class="stack-title">Stack Trace:</div>
            <pre>{{ log.metadata.error.stack }}</pre>
          </div>
        </div>
      </template>
      <div v-else class="no-logs">No logs to display</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'ErrorConsole',
  
  setup() {
    const currentFilter = ref('all')
    
    watch(currentFilter, (newFilter) => {
      errorLogger.setFilter(newFilter)
    })
    
    const hasMetadata = (log) => {
      return log.metadata && 
             Object.keys(log.metadata).length > 0 && 
             !log.metadata.error
    }
    
    const formatMetadata = (metadata) => {
      // Filter out error property which is shown separately
      const { error, ...rest } = metadata
      return Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ''
    }
    
    return {
      logger: errorLogger,
      currentFilter,
      hasMetadata,
      formatMetadata
    }
  }
})
</script>

<style scoped>
.error-console {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 500px;
  max-width: 100%;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #f0f0f0;
  border-top-left-radius: 6px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.3);
  font-family: monospace;
}

.error-console-header {
  padding: 8px 12px;
  background-color: #222;
  border-top-left-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-console-header h3 {
  margin: 0;
  font-size: 16px;
}

.error-console-controls {
  display: flex;
  align-items: center;
}

.error-console-controls button {
  background: #444;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 3px 8px;
  margin-left: 6px;
  cursor: pointer;
}

.error-console-controls button:hover {
  background: #555;
}

.close-btn {
  font-size: 18px;
  font-weight: bold;
}

.filter-select {
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 2px;
}

.error-console-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.log-entry {
  padding: 6px 12px;
  border-bottom: 1px solid #333;
  font-size: 12px;
}

.log-header {
  display: flex;
  margin-bottom: 4px;
}

.log-time {
  opacity: 0.7;
  margin-right: 10px;
}

.log-level {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.log-message {
  word-break: break-word;
}

.log-metadata, .log-stack {
  margin-top: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  font-size: 11px;
}

.log-metadata pre, .log-stack pre {
  margin: 0;
  white-space: pre-wrap;
}

.stack-title {
  font-weight: bold;
  margin-bottom: 3px;
}

.log-level-debug .log-level {
  background-color: #696969;
  color: white;
}

.log-level-info .log-level {
  background-color: #2196F3;
  color: white;
}

.log-level-warn .log-level {
  background-color: #FF9800;
  color: white;
}

.log-level-error .log-level {
  background-color: #F44336;
  color: white;
}

.log-level-error {
  background-color: rgba(244, 67, 54, 0.1);
}

.no-logs {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
