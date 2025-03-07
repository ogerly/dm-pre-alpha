<template>
  <div class="debug-container">
    <h2>Data Debugger</h2>
    
    <div class="debug-controls">
      <button
        class="debug-button"
        @click="showRawData = !showRawData"
      >
        {{ showRawData ? 'Hide' : 'Show' }} Raw Data
      </button>
      
      <select
        v-model="selectedUser"
        class="user-select"
      >
        <option :value="null">
          Select a user...
        </option>
        <option
          v-for="user in users"
          :key="user.id"
          :value="user"
        >
          {{ user.name }}
        </option>
      </select>
    </div>
    
    <div
      v-if="selectedUser"
      class="debug-info"
    >
      <h3>{{ selectedUser.name }}</h3>
      
      <div class="data-section">
        <h4>Home</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.home, null, 2) }}</pre>
      </div>
      
      <div class="data-section">
        <h4>Firma</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.firma, null, 2) }}</pre>
      </div>
      
      <div class="data-section">
        <h4>Wirkungsbereich</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.wirkungsbereich, null, 2) }}</pre>
      </div>
      
      <div class="data-section">
        <h4>Unternehmen</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.unternehmen, null, 2) }}</pre>
      </div>
      
      <div class="data-section">
        <h4>Projekt</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.projekt, null, 2) }}</pre>
      </div>
      
      <div class="data-section">
        <h4>Tisch</h4>
        <pre>{{ JSON.stringify(selectedUser?.iconCategories?.tisch, null, 2) }}</pre>
      </div>
    </div>
    
    <div
      v-if="showRawData"
      class="raw-data"
    >
      <h3>Raw User Data</h3>
      <pre>{{ JSON.stringify(users, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedUser: null,
      showRawData: false
    };
  }
};
</script>

<style scoped>
.debug-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.debug-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.debug-button, .user-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #f9fafb;
}

.debug-button {
  cursor: pointer;
}

.debug-info {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
}

.data-section {
  margin-bottom: 20px;
}

.data-section h4 {
  margin: 0 0 8px 0;
  color: #4b5563;
}

pre {
  background-color: #f9fafb;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 300px;
}

.raw-data {
  margin-top: 30px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.raw-data pre {
  max-height: 500px;
}
</style>
