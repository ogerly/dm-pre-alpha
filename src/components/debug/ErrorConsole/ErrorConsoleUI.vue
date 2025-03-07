<template>
  <div class="error-console">
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
          />
          <span class="status-text">
            {{ socketStatusText }}
          </span>
        </div>
      </div>
      
      <div class="error-console-controls">
        <select
          :value="currentFilter"
          class="filter-select"
          @change="$emit('set-filter', $event.target.value)"
        >
          <option value="all">
            All
          </option>
          <option value="debug">
            Debug
          </option>
          <option value="info">
            Info
          </option>
          <option value="warn">
            Warning
          </option>
          <option value="error">
            Error
          </option>
          <option value="lint">
            Lint
          </option>
        </select>
        <button
          class="clear-btn"
          @click="logger.clear"
        >
          Clear
        </button>
        <button
          class="close-btn"
          @click="logger.toggleVisibility"
        >
          ×
        </button>
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
          <span
            :class="[
              'stat-value', 
              socketStatus === 'connected' ? 'stat-success' : 
              socketStatus === 'connecting' ? 'stat-warning' : 
              'stat-error'
            ]"
          >
            {{ socketStatus }}
          </span>
        </div>
        <div
          v-if="socketStatus === 'connected'"
          class="stat"
        >
          <span class="stat-label">Online:</span>
          <span class="stat-value stat-success">{{ activeUsers }}</span>
        </div>
      </div>
      
      <!-- Lint Status -->
      <div class="stat-group lint-stats">
        <div class="stat">
          <span class="stat-label">Lint:</span>
          <span
            :class="[
              'stat-value',
              lintStatus === 'pass' ? 'stat-success' :
              lintStatus === 'fail' ? 'stat-error' :
              lintStatus === 'running' ? 'stat-warning' : 
              'stat-debug'
            ]"
          >
            {{ lintStatus }}
          </span>
        </div>
        <button 
          v-if="!isProd" 
          :disabled="lintStatus === 'running'"
          class="lint-check-btn"
          @click="$emit('run-lint-check')"
        >
          Run Lint
        </button>
      </div>
    </div>
    
    <!-- Tab selection -->
    <div class="tab-bar">
      <button 
        :class="{ active: activeTab === 'logs' }" 
        class="tab-button"
        @click="$emit('set-active-tab', 'logs')"
      >
        Logs
      </button>
      <button 
        :class="{ active: activeTab === 'lint' }" 
        class="tab-button"
        @click="$emit('set-active-tab', 'lint')"
      >
        Lint Issues 
        <span
          v-if="lintErrors.length"
          class="badge error-badge"
        >{{ lintErrors.length }}</span>
        <span
          v-else-if="lintWarnings.length"
          class="badge warning-badge"
        >{{ lintWarnings.length }}</span>
      </button>
    </div>
    
    <!-- Content area -->
    <div class="error-console-content">
      <!-- Logs tab -->
      <LogsTab
        v-if="activeTab === 'logs'"
        :logs="logger.filteredLogs"
        :socket-status="socketStatus"
      />
      
      <!-- Lint tab -->
      <LintTab
        v-else-if="activeTab === 'lint'"
        :status="lintStatus"
        :errors="lintErrors"
        :warnings="lintWarnings"
        :last-run="lintLastRun"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import LogsTab from './tabs/LogsTab.vue';
import LintTab from './tabs/LintTab.vue';

export default defineComponent({
  name: 'ErrorConsoleUI',
  components: {
    LogsTab,
    LintTab
  },
  props: {
    logger: { type: Object, required: true },
    currentFilter: { type: String, required: true },
    socketStatus: { type: String, required: true },
    socketStatusText: { type: String, required: true },
    activeUsers: { type: Number, required: true },
    logCounts: { type: Object, required: true },
    isProd: { type: Boolean, required: true },
    activeTab: { type: String, required: true },
    lintStatus: { type: String, required: true },
    lintErrors: { type: Array, required: true },
    lintWarnings: { type: Array, required: true },
    lintLastRun: { type: Object, default: null }
  },
  emits: ['set-filter', 'set-active-tab', 'run-lint-check']
});
</script>

<style src="./styles.css" scoped></style>
