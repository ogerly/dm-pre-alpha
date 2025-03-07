<template>
  <div
    v-if="logger.isVisible"
    class="error-console"
  >
    <!-- Existing template -->
    <!-- This file will be gradually migrated to the modular structure -->
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed, onMounted, onUnmounted } from 'vue'
import errorLogger from '@/services/errorLogger'
import chatService from '@/services/ChatService'
import lintService from '@/services/lintService'

export default defineComponent({
  name: 'ErrorConsole',
  
  setup() {
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
    
    return {
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
})
</script>

<style scoped>
/* Existing styles will remain here until we migrate fully to the modular component */
</style>
