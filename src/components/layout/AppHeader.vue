<template>
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-primary mb-2">DreamMall Matching Prototyp</h1>
    <p class="text-medium-text mb-6">Finde Gleichgesinnte basierend auf Interessen und Fähigkeiten.</p>
    
    <div class="flex justify-center gap-2 my-5">
      <button 
        @click="updateTab('matching')" 
        :class="{ 'bg-primary text-white border-primary': activeTab === 'matching', 'bg-light-bg hover:bg-gray-100': activeTab !== 'matching' }"
        class="py-2 px-4 rounded border border-border-color transition-colors flex items-center gap-1.5"
      >
        <i class="fas fa-users"></i> Matching
      </button>
      <button 
        @click="updateTab('map')" 
        :class="{ 'bg-primary text-white border-primary': activeTab === 'map', 'bg-light-bg hover:bg-gray-100': activeTab !== 'map' }"
        class="py-2 px-4 rounded border border-border-color transition-colors flex items-center gap-1.5"
      >
        <i class="fas fa-map-marked-alt"></i> Karte
      </button>
    </div>
    
    <!-- Chat button in the header when user is logged in -->
    <div v-if="isLoggedIn" class="absolute top-5 right-5">
      <button 
        @click="toggleChat" 
        class="bg-primary text-white py-2 px-4 rounded-full flex items-center gap-1.5"
      >
        <span class="text-lg">💬</span> Chat
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  
  props: {
    activeTab: {
      type: String,
      required: true,
      validator: (value) => ['matching', 'map'].includes(value)
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    showChat: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    updateTab(tab) {
      this.$emit('update-tab', tab);
    },
    toggleChat() {
      this.$emit('toggle-chat');
    }
  }
}
</script>
