<template>
  <ErrorConsoleUI
    v-if="logger.isVisible"
    :logger="logger"
    :current-filter="currentFilter"
    :socket-status="socketStatus"
    :socket-status-text="socketStatusText"
    :active-users="activeUsers"
    :log-counts="logCounts"
    :is-prod="isProd"
    :active-tab="activeTab"
    :lint-status="lintStatus"
    :lint-errors="lintErrors"
    :lint-warnings="lintWarnings"
    :lint-last-run="lintLastRun"
    @run-lint-check="runLintCheck"
    @set-filter="newFilter => currentFilter = newFilter"
    @set-active-tab="newTab => activeTab = newTab"
  />
</template>

<script>
import { defineComponent } from 'vue';
import ErrorConsoleUI from './ErrorConsoleUI.vue';
import { useErrorConsoleLogic } from './useErrorConsole';

export default defineComponent({
  name: 'ErrorConsole',
  components: {
    ErrorConsoleUI
  },
  setup() {
    // Import the main logic from the composition function
    const {
      logger,
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
    } = useErrorConsoleLogic();
    
    return {
      logger,
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
});
</script>
