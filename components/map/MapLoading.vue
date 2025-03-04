<template>
  <div class="map-loading">
    <div class="spinner">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div class="loading-text">
      <p>{{ message || 'Loading map data...' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>

<style scoped>
.map-loading {
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
  z-index: 500;
}

.spinner {
  font-size: 2rem;
  color: #4f46e5;
  margin-bottom: 15px;
}

.loading-text {
  text-align: center;
  color: #374151;
  font-size: 1rem;
}
</style>
