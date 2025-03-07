import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import errorLogger from '@/services/errorLogger';
import chatService from '@/services/ChatService';
import lintService from '@/services/lintService';

export function useErrorConsoleLogic() {
  // State variables
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
  
  // Count logs by type
  const logCounts = computed(() => {
    const counts = { debug: 0, info: 0, warn: 0, error: 0 };
    
    errorLogger.logs.forEach(log => {
      const level = log.levelName.toLowerCase();
      if (level in counts) {
        counts[level]++;
      }
    });
    
    return counts;
  });
  
  // Format the socket status text
  const socketStatusText = computed(() => {
    if (socketStatus.value === 'connected') {
      return `Connected (${activeUsers.value} online)`;
    } else if (socketStatus.value === 'connecting') {
      return 'Connecting...';
    } else {
      return 'Disconnected';
    }
  });
  
  // Socket event handlers
  const handleSocketConnected = (data) => {
    socketStatus.value = 'connected';
    lastPing.value = new Date();
    
    if (data && data.id) {
      errorLogger.debug('Socket connected', {
        category: 'socket',
        socketId: data.id
      });
    }
  };
  
  const handleSocketDisconnected = () => {
    socketStatus.value = 'disconnected';
    activeUsers.value = 0;
    errorLogger.warn('Socket disconnected', {
      category: 'socket',
      lastPing: lastPing.value
    });
  };
  
  const handleUserCount = (count) => {
    activeUsers.value = count;
  };
  
  // ESLint check function
  const runLintCheck = async () => {
    try {
      lintStatus.value = 'running';
      const result = await lintService.runLintCheck();
      if (!result.success) {
        errorLogger.error('Lint check failed', new Error(result.message));
      }
    } catch (error) {
      errorLogger.error('Error running lint check', error);
    }
  };
  
  // Handle lint status updates
  const handleLintUpdate = (data) => {
    lintStatus.value = data.status;
    lintErrors.value = data.errors || [];
    lintWarnings.value = data.warnings || [];
    lintLastRun.value = data.lastRunTime;
  };
  
  // Setup
  onMounted(() => {
    // Initial socket connection check
    if (chatService.isConnected()) {
      socketStatus.value = 'connected';
    } else {
      socketStatus.value = 'connecting';
      chatService.connect();
    }
    
    // Socket event listeners
    chatService.on('connected', handleSocketConnected);
    chatService.on('disconnected', handleSocketDisconnected);
    chatService.on('userCount', handleUserCount);
    
    // Lint service subscription
    const unsubscribe = lintService.subscribe(handleLintUpdate);
    
    // Vite HMR integration for ESLint
    if (!isProd.value && typeof window !== 'undefined' && import.meta.hot) {
      import.meta.hot.on('eslint-results', (data) => {
        lintService.setResults(data);
      });
    }
    
    // Connection health check timer
    const pingTimer = setInterval(() => {
      if (chatService.isConnected()) {
        lastPing.value = new Date();
      } else if (socketStatus.value === 'connected') {
        // Reconnect if we think we're connected but aren't
        socketStatus.value = 'connecting';
        chatService.disconnect();
        setTimeout(() => chatService.connect(), 1000);
      }
    }, 30000); // 30-second interval
    
    // Cleanup
    onUnmounted(() => {
      chatService.off('connected', handleSocketConnected);
      chatService.off('disconnected', handleSocketDisconnected);
      chatService.off('userCount', handleUserCount);
      unsubscribe();
      clearInterval(pingTimer);
    });
  });
  
  // Set filter in errorLogger when local filter changes
  watch(currentFilter, (newFilter) => {
    errorLogger.setFilter(newFilter);
  });
  
  return {
    logger: errorLogger,
    currentFilter,
    socketStatus,
    socketStatusText,
    activeUsers,
    logCounts,
    isProd,
    activeTab,
    lintStatus,
    lintErrors,
    lintWarnings,
    lintLastRun,
    runLintCheck
  };
}
