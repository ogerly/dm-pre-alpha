<template>
  <div v-if="logger.isVisible" class="error-console">
    <div class="error-console-header">
      <div class="header-left">
        <h3>Error Console</h3>
        
        <!-- WebSocket Status Indicator -->
        <div class="connection-status">
          <div 
            :class="[
              'status-indicator', 
              socketStatus === 'connected' ? 'status-connected' :
              socketStatus === 'connecting' ? 'status-connecting' :
              'status-disconnected'
            ]"
          ></div>
          <span class="status-text">
            {{ socketStatusText }}
          </span>
        </div>
      </div>
      
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
    
    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-label">Debug:</span>
        <span class="stat-value stat-debug">{{ logCounts.debug }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Info:</span>
        <span class="stat-value stat-info">{{ logCounts.info }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Warnings:</span>
        <span class="stat-value stat-warning">{{ logCounts.warn }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Errors:</span>
        <span class="stat-value stat-error">{{ logCounts.error }}</span>
      </div>
      
      <!-- WebSocket Stats -->
      <div class="stat-group websocket-stats">
        <div class="stat">
          <span class="stat-label">Socket:</span>
          <span :class="[
            'stat-value', 
            socketStatus === 'connected' ? 'stat-success' : 
            socketStatus === 'connecting' ? 'stat-warning' : 
            'stat-error'
          ]">
            {{ socketStatus }}
          </span>
        </div>
        <div class="stat" v-if="socketStatus === 'connected'">
          <span class="stat-label">Online Users:</span>
          <span class="stat-value stat-success">{{ activeUsers }}</span>
        </div>
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
            <!-- Show socket-related indicator for chat logs -->
            <span 
              v-if="isChatLog(log)" 
              class="log-category"
              :class="{'chat-connected': socketStatus === 'connected'}"
            >
              SOCKET
            </span>
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
import { defineComponent, ref, watch, computed, onMounted, onUnmounted } from 'vue'
import errorLogger from '@/services/errorLogger'
import chatService from '@/services/ChatService'

export default defineComponent({
  name: 'ErrorConsole',
  
  setup() {
    const currentFilter = ref('all')
    const socketStatus = ref('disconnected')
    const activeUsers = ref(0)
    const lastPing = ref(null)
    
    // Count logs by type
    const logCounts = computed(() => {
      const counts = { debug: 0, info: 0, warn: 0, error: 0 }
      
      errorLogger.logs.forEach(log => {
        if (counts.hasOwnProperty(log.levelName.toLowerCase())) {
          counts[log.levelName.toLowerCase()]++
        }
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
      socketStatus.value = 'connected'
      lastPing.value = new Date()
      
      if (data && data.id) {
        errorLogger.debug('Socket connected', {
          category: 'socket',
          socketId: data.id
        })
      }
    }
    
    const handleSocketDisconnected = () => {
      socketStatus.value = 'disconnected'
      activeUsers.value = 0
      errorLogger.warn('Socket disconnected', {
        category: 'socket',
        lastPing: lastPing.value
      })
    }
    
    const handleUserCount = (count) => {
      activeUsers.value = count
    }
    
    // Check if this is a chat/socket related log
    const isChatLog = (log) => {
      if (!log.metadata) return false
      
      return log.metadata.category === 'socket' || 
             log.metadata.category === 'chat-connection' ||
             log.metadata.category === 'chat-message' ||
             log.metadata.category === 'chat-error' ||
             log.message.toLowerCase().includes('socket')
    }
    
    // Set up socket monitoring when component is mounted
    onMounted(() => {
      // Check initial connection state
      if (chatService.isConnected()) {
        socketStatus.value = 'connected'
      } else {
        // If not connected, try to connect
        socketStatus.value = 'connecting'
        chatService.connect()
      }
      
      // Set up event listeners
      chatService.on('connected', handleSocketConnected)
      chatService.on('disconnected', handleSocketDisconnected)
      chatService.on('userCount', handleUserCount)
      
      // Set up a ping mechanism to check connection health
      const pingTimer = setInterval(() => {
        if (chatService.isConnected()) {
          lastPing.value = new Date()
        } else if (socketStatus.value === 'connected') {
          // If we think we're connected but haven't received a ping, reconnect
          socketStatus.value = 'connecting'
          chatService.disconnect()
          setTimeout(() => chatService.connect(), 1000)
        }
      }, 30000) // Check every 30 seconds
      
      // Clean up on unmount
      onUnmounted(() => {
        chatService.off('connected', handleSocketConnected)
        chatService.off('disconnected', handleSocketDisconnected)
        chatService.off('userCount', handleUserCount)
        clearInterval(pingTimer)
      })
    })
    
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
      socketStatus,
      socketStatusText,
      activeUsers,
      logCounts,
      hasMetadata,
      formatMetadata,
      isChatLog
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

.header-left {
  display: flex;
  align-items: center;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  margin-right: 12px;
}

.connection-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-connected {
  background-color: #4CAF50;
  box-shadow: 0 0 4px #4CAF50;
}

.status-connecting {
  background-color: #FFC107;
  animation: pulse 1.5s infinite;
}

.status-disconnected {
  background-color: #F44336;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
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

.stats-bar {
  display: flex;
  background: #222;
  padding: 4px 12px;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  font-size: 11px;
  flex-wrap: wrap;
}

.stat {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.stat-label {
  margin-right: 4px;
  opacity: 0.7;
}

.stat-value {
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.stat-debug {
  background-color: #696969;
  color: white;
}

.stat-info {
  background-color: #2196F3;
  color: white;
}

.stat-warning,
.stat-connect {
  background-color: #FF9800;
  color: white;
}

.stat-error {
  background-color: #F44336;
  color: white;
}

.stat-success {
  background-color: #4CAF50;
  color: white;
}

.websocket-stats {
  margin-left: auto;
  display: flex;
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
  align-items: center;
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
  margin-right: 6px;
}

.log-category {
  font-size: 10px;
  background-color: #555;
  color: white;
  padding: 1px 6px;
  border-radius: 3px;
  margin-left: auto;
}

.chat-connected {
  background-color: #4CAF50;
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
