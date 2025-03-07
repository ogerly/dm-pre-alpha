<template>
  <div class="map-loading-container">
    <div class="loading-spinner">
      <!-- Spinner animation -->
      <div class="spinner" />
    </div>
    <p class="loading-message">
      {{ message }}
    </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MapLoading',
  props: {
    // Fix: Add default value for message prop
    message: {
      type: String,
      default: 'Loading map...' // Default message when none is provided
    }
  }
})
</script>

<style scoped>
.map-loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loading-spinner {
  margin-bottom: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  font-size: 16px;
  color: #4b5563;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
