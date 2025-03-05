<template>
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-primary mb-2">DreamMall Matching Prototyp</h1>
    <p class="text-medium-text mb-6">Finde Gleichgesinnte basierend auf Interessen und Fähigkeiten.</p>
    
    <!-- Navigation Tabs -->
    <TabGroup
      v-model="localActiveTab"
      :tabs="navigationTabs"
      custom-class="justify-center my-5"
      @update:modelValue="updateTab"
    />
    
    <!-- User actions in the header -->
    <div v-if="isLoggedIn" class="absolute top-5 right-5 flex gap-2">
      <button 
        @click="toggleChat" 
        class="bg-primary text-white py-2 px-4 rounded-full flex items-center gap-1.5"
      >
        <span class="text-lg">💬</span> Chat
      </button>
      
      <!-- User Menu Dropdown -->
      <div class="relative">
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen" 
          class="bg-gray-100 text-gray-800 py-2 px-4 rounded-full flex items-center gap-1.5"
        >
          <span class="text-lg">👤</span> {{ currentUser?.name || 'User' }}
          <i class="fas fa-chevron-down ml-1 text-xs"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="isUserMenuOpen" 
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
        >
          <!-- Profile Overview -->
          <button 
            @click="navigateTo('profile')" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i class="fas fa-user mr-2"></i> Mein Profil
          </button>
          
          <!-- Settings -->
          <button 
            @click="navigateTo('settings')" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i class="fas fa-cog mr-2"></i> Einstellungen
          </button>
          
          <!-- Admin Panel -->
          <button 
            v-if="isAdmin"
            @click="navigateTo('admin')" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i class="fas fa-shield-alt mr-2"></i> Admin Panel
          </button>
          
          <!-- Divider -->
          <hr class="my-1 border-gray-200">
          
          <!-- Logout -->
          <button 
            @click="logout" 
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <i class="fas fa-sign-out-alt mr-2"></i> Abmelden
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import TabGroup from '@/components/common/TabGroup.vue'

export default {
  name: 'AppHeader',
  
  components: {
    TabGroup
  },
  
  props: {
    activeTab: {
      type: String,
      required: true,
      validator: (value) => ['matching', 'map', 'profile', 'settings', 'admin'].includes(value)
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    showChat: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: () => ({})
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update-tab', 'toggle-chat', 'logout'],
  
  data() {
    return {
      isUserMenuOpen: false,
      localActiveTab: this.activeTab,
      navigationTabs: [
        { id: 'matching', name: 'Matching', icon: 'fas fa-users' },
        { id: 'map', name: 'Karte', icon: 'fas fa-map-marked-alt' }
      ]
    };
  },
  
  watch: {
    // Keep local state in sync with props
    activeTab(newVal) {
      this.localActiveTab = newVal;
    }
  },
  
  methods: {
    updateTab(tab) {
      this.$emit('update-tab', tab);
      this.isUserMenuOpen = false;
    },
    
    toggleChat() {
      this.$emit('toggle-chat');
    },
    
    logout() {
      this.$emit('logout');
      this.isUserMenuOpen = false;
    },
    
    navigateTo(tab) {
      this.updateTab(tab);
    },
    
    // Close menu when clicking outside
    handleClickOutside(event) {
      if (this.isUserMenuOpen && !this.$el.contains(event.target)) {
        this.isUserMenuOpen = false;
      }
    }
  },
  
  mounted() {
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>
