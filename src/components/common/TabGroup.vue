<template>
  <div class="tabs-container">
    <div class="tabs" :class="customClass">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="selectTab(tab.id)"
        :class="['tab', { 'active': modelValue === tab.id }]"
      >
        <i v-if="tab.icon" :class="tab.icon" class="mr-2"></i>
        {{ tab.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabGroup',
  
  props: {
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue'],
  
  methods: {
    selectTab(tabId) {
      this.$emit('update:modelValue', tabId)
    }
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tab {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.tab.active {
  background-color: #4f46e5;
  color: white;
}
</style>
