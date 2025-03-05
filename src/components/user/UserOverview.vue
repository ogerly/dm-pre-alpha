<template>
  <div class="user-overview">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Mein Profil</h2>
        <button 
          @click="$emit('edit-profile', user)" 
          class="bg-primary text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors flex items-center gap-2"
        >
          <i class="fas fa-edit"></i> Bearbeiten
        </button>
      </div>
      
      <!-- Profile Summary Card -->
      <div class="profile-summary bg-gray-50 p-4 rounded-lg mb-6">
        <div class="flex items-center gap-4">
          <div class="profile-avatar bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl">
            {{ userInitials }}
          </div>
          <div>
            <h3 class="text-xl font-medium">{{ user.name }}</h3>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="mt-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded inline-block">Account aktiv</p>
          </div>
        </div>
      </div>
      
      <!-- Bio Section -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Über mich</h3>
        <p class="text-gray-600">{{ user.bio || 'Keine Biografie verfügbar.' }}</p>
      </div>
      
      <!-- Skills & Interests -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Fähigkeiten</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(skill, index) in user.skills" 
              :key="`skill-${index}`"
              class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {{ skill }}
            </span>
            <span v-if="!user.skills || user.skills.length === 0" class="text-gray-500 italic">
              Keine Fähigkeiten angegeben.
            </span>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Interessen</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(interest, index) in user.interests" 
              :key="`interest-${index}`"
              class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
            >
              {{ interest }}
            </span>
            <span v-if="!user.interests || user.interests.length === 0" class="text-gray-500 italic">
              Keine Interessen angegeben.
            </span>
          </div>
        </div>
      </div>
      
      <!-- Account Info -->
      <div class="border-t border-gray-200 pt-4 mt-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Account Informationen</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2">
          <div>
            <span class="text-gray-500">Benutzer-ID:</span>
            <span class="ml-2 font-medium">{{ user.id }}</span>
          </div>
          <div>
            <span class="text-gray-500">Account erstellt:</span>
            <span class="ml-2 font-medium">{{ formatDate(user.createdAt) }}</span>
          </div>
          <div>
            <span class="text-gray-500">Letzte Anmeldung:</span>
            <span class="ml-2 font-medium">{{ formatDate(user.lastLogin) }}</span>
          </div>
          <div>
            <span class="text-gray-500">Rolle:</span>
            <span class="ml-2 font-medium">{{ user.isAdmin ? 'Administrator' : 'Benutzer' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
        <button class="bg-indigo-50 text-indigo-700 py-2 px-4 rounded hover:bg-indigo-100 transition-colors">
          <i class="fas fa-file-export mr-2"></i> Daten exportieren
        </button>
        <button class="bg-red-50 text-red-700 py-2 px-4 rounded hover:bg-red-100 transition-colors">
          <i class="fas fa-trash-alt mr-2"></i> Account löschen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserOverview',
  
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  emits: ['edit-profile'],
  
  computed: {
    userInitials() {
      if (!this.user.name) return '?';
      return this.user.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    }
  },
  
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return 'Nicht verfügbar';
      
      // Format date (simple version for the prototype)
      const date = new Date(timestamp);
      return date.toLocaleDateString('de-DE');
    }
  }
}
</script>

<style scoped>
.user-overview {
  max-width: 800px;
  margin: 0 auto;
}
</style>
