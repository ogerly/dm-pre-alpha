<template>
  <div>
    <!-- Search Box -->
    <div class="mb-5">
      <input 
        type="text" 
        :value="modelValue"
        placeholder="Nach Namen, Fähigkeiten oder Interessen suchen..."
        class="w-full p-2.5 border border-border-color rounded-md text-base" 
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>
    
    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- User List Column -->
      <div class="col-span-1">
        <div class="bg-white rounded-lg shadow-custom p-4">
          <h2 class="text-xl font-bold mb-4 text-secondary">
            Nutzer
          </h2>
          <UserList 
            :users="filteredUsers" 
            :selected-user-id="userForMatching?.id"
            @select-user="$emit('select-user', $event)"
            @select-for-matching="$emit('select-for-matching', $event)"
            @edit-user="$emit('edit-user', $event)"
            @delete-user="$emit('delete-user', $event)"
          />
        </div>
      </div>
      
      <!-- Matching Results Column -->
      <div class="col-span-2">
        <div class="bg-white rounded-lg shadow-custom p-4">
          <!-- Selected User For Matching Header -->
          <div
            v-if="userForMatching"
            class="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-4"
          >
            <h3 class="font-medium">
              Matching für: {{ userForMatching.name }}
            </h3>
            <button 
              class="bg-red-100 text-red-700 px-3 py-1 rounded" 
              @click="$emit('clear-matching')"
            >
              Auswahl aufheben
            </button>
          </div>
          
          <h2
            v-else
            class="text-xl font-bold mb-4 text-secondary"
          >
            Matching-Ergebnisse
          </h2>
          
          <!-- Matching Instructions -->
          <p
            v-if="!userForMatching && !matchResults.length"
            class="text-gray-500 italic"
          >
            Wähle einen Nutzer für das Matching aus, um potenzielle Partner zu finden.
          </p>
          
          <!-- Matching Results -->
          <MatchingResults 
            :matches="matchResults" 
            @view-profile="$emit('select-user', $event)"
          />
          
          <!-- Chat Actions -->
          <div
            v-if="matchResults.length > 0"
            class="mt-4"
          >
            <button 
              v-for="match in matchResults" 
              :key="match.id"
              class="bg-primary text-white border-0 py-2 px-4 rounded-full inline-flex items-center gap-1.5 mr-3 mb-3"
              @click="$emit('start-chat', match)"
            >
              <span class="text-lg">💬</span> Mit {{ match.name }} chatten
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto p-4 mt-8">
      <h1 class="text-2xl font-bold mb-4">
        Matching System
      </h1>
      <p class="mb-4">
        Find potential matches based on shared interests and complementary skills.
      </p>
      
      <div class="bg-gray-100 p-4 rounded-lg">
        <p>Matching functionality will be implemented here.</p>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from '@/components/user/UserList.vue';
import MatchingResults from '@/components/matching/MatchingResults.vue';

export default {
  name: 'MatchingContainer',
  
  components: {
    UserList,
    MatchingResults
  },
  
  props: {
    users: {
      type: Array,
      required: true
    },
    filteredUsers: {
      type: Array,
      required: true
    },
    userForMatching: {
      type: Object,
      default: null
    },
    matchResults: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  
  emits: [
    'select-user',
    'select-for-matching',
    'edit-user',
    'delete-user',
    'clear-matching',
    'start-chat',
    'update:modelValue'
  ]
}
</script>
