<template>
  <div class="logs-container">
    <template v-if="logs.length">
      <div 
        v-for="log in logs" 
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
          <!-- Show lint-related indicator -->
          <span 
            v-if="isLintLog(log)" 
            class="log-category lint-category"
          >
            LINT
          </span>
        </div>
        <div class="log-message">
          {{ log.message }}
        </div>
        <div
          v-if="hasMetadata(log)"
          class="log-metadata"
        >
          <pre>{{ formatMetadata(log.metadata) }}</pre>
        </div>
        <div
          v-if="log.metadata && log.metadata.error"
          class="log-stack"
        >
          <div class="stack-title">
            Stack Trace:
          </div>
          <pre>{{ log.metadata.error.stack }}</pre>
        </div>
      </div>
    </template>
    <div
      v-else
      class="no-logs"
    >
      No logs to display
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LogsTab',
  props: {
    logs: { type: Array, required: true },
    socketStatus: { type: String, required: true }
  },
  setup() {
    // Check if this is a chat/socket related log
    const isChatLog = (log) => {
      if (!log.metadata) return false;
      
      return log.metadata.category === 'socket' || 
             log.metadata.category === 'chat-connection' ||
             log.metadata.category === 'chat-message' ||
             log.metadata.category === 'chat-error' ||
             log.message.toLowerCase().includes('socket');
    };
    
    // Check if this is a lint related log
    const isLintLog = (log) => {
      if (!log.metadata) return false;
      return log.metadata.category === 'lint';
    };

    // Check for metadata that should be displayed
    const hasMetadata = (log) => {
      if (!log.metadata) return false;
      if (Object.keys(log.metadata).length === 0) return false;
      
      // Check if 'error' is the only property
      if (Object.keys(log.metadata).length === 1 && 'error' in log.metadata) {
        return false;
      }
      
      return true;
    };
    
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
    };
    
    return {
      isChatLog,
      isLintLog,
      hasMetadata,
      formatMetadata
    };
  }
});
</script>
