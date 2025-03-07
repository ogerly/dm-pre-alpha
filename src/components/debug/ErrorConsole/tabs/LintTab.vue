<template>
  <div class="lint-container">
    <div
      v-if="status === 'running'"
      class="lint-loading"
    >
      Running ESLint checks...
    </div>
    <template v-else>
      <div
        v-if="errors.length === 0 && warnings.length === 0"
        class="no-lint-issues"
      >
        <div class="success-icon">
          ✓
        </div>
        <p>No lint issues found!</p>
        <p
          v-if="lastRun"
          class="lint-timestamp"
        >
          Last checked: {{ formatLintTime(lastRun) }}
        </p>
      </div>
      
      <template v-else>
        <div class="lint-summary">
          <p>
            ESLint found 
            <span class="lint-error-count">{{ errors.length }} errors</span> 
            and 
            <span class="lint-warning-count">{{ warnings.length }} warnings</span>
          </p>
          <p
            v-if="lastRun"
            class="lint-timestamp"
          >
            Last checked: {{ formatLintTime(lastRun) }}
          </p>
        </div>
        
        <div v-if="errors.length > 0">
          <h4 class="lint-section-title">
            Errors
          </h4>
          <div 
            v-for="(error, index) in errors" 
            :key="'error-' + index"
            class="lint-issue lint-error"
          >
            <div class="lint-location">
              {{ error.filePath }}:{{ error.line }}:{{ error.column }}
            </div>
            <div class="lint-message">
              {{ error.message }}
            </div>
            <div
              v-if="error.ruleId"
              class="lint-rule"
            >
              Rule: {{ error.ruleId }}
            </div>
          </div>
        </div>
        
        <div v-if="warnings.length > 0">
          <h4 class="lint-section-title">
            Warnings
          </h4>
          <div 
            v-for="(warning, index) in warnings" 
            :key="'warning-' + index"
            class="lint-issue lint-warning"
          >
            <div class="lint-location">
              {{ warning.filePath }}:{{ warning.line }}:{{ warning.column }}
            </div>
            <div class="lint-message">
              {{ warning.message }}
            </div>
            <div
              v-if="warning.ruleId"
              class="lint-rule"
            >
              Rule: {{ warning.ruleId }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LintTab',
  props: {
    status: { type: String, required: true },
    errors: { type: Array, required: true },
    warnings: { type: Array, required: true },
    lastRun: { type: [Object, Date], default: null }
  },
  setup() {
    // Format lint timestamp
    const formatLintTime = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleTimeString();
    };
    
    return {
      formatLintTime
    };
  }
});
</script>
