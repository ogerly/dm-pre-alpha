<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      Skill Matching
    </h1>
    
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">
        How Matching Works
      </h2>
      <p class="text-blue-700">
        Our matching algorithm finds people with complementary skills. Select your skills and interests below,
        and we'll show you potential matches that might be a good fit for collaboration.
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column: Your skills -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">
          Your Skills
        </h2>
        
        <div
          v-if="!authStore.isAuthenticated"
          class="text-center p-4 bg-gray-100 rounded-lg"
        >
          <p class="text-gray-600 mb-3">
            Please login to set your skills and see matches
          </p>
          <router-link 
            to="/login" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Login
          </router-link>
        </div>
        
        <div v-else>
          <div class="mb-4">
            <input
              v-model="newSkill"
              type="text"
              placeholder="Add a skill..."
              class="px-3 py-2 border border-gray-300 rounded-md w-full"
              @keyup.enter="addSkill"
            >
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <div 
              v-for="(skill, index) in userSkills" 
              :key="index" 
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
            >
              <span>{{ skill }}</span>
              <button 
                class="ml-2 text-blue-600 hover:text-blue-800" 
                @click="removeSkill(index)"
              >
                &times;
              </button>
            </div>
            
            <p
              v-if="userSkills.length === 0"
              class="text-gray-500 text-sm pt-2"
            >
              No skills added yet. Add some skills to see matches.
            </p>
          </div>
          
          <div>
            <button 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" 
              :disabled="isSaving"
              @click="saveSkills"
            >
              {{ isSaving ? 'Saving...' : 'Save Skills' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Middle column: Looking for -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">
          Skills You're Looking For
        </h2>
        
        <div
          v-if="!authStore.isAuthenticated"
          class="text-center p-4 bg-gray-100 rounded-lg"
        >
          <p class="text-gray-600">
            Please login to set preferences
          </p>
        </div>
        
        <div v-else>
          <div class="mb-4">
            <input
              v-model="newDesiredSkill"
              type="text"
              placeholder="Add a desired skill..."
              class="px-3 py-2 border border-gray-300 rounded-md w-full"
              @keyup.enter="addDesiredSkill"
            >
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <div 
              v-for="(skill, index) in desiredSkills" 
              :key="index" 
              class="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center"
            >
              <span>{{ skill }}</span>
              <button 
                class="ml-2 text-green-600 hover:text-green-800" 
                @click="removeDesiredSkill(index)"
              >
                &times;
              </button>
            </div>
            
            <p
              v-if="desiredSkills.length === 0"
              class="text-gray-500 text-sm pt-2"
            >
              Add skills that you're looking for in others.
            </p>
          </div>
          
          <div>
            <button 
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full" 
              :disabled="isLoading || desiredSkills.length === 0"
              @click="findMatches"
            >
              {{ isLoading ? 'Finding Matches...' : 'Find Matches' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right column: Matches -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">
          Potential Matches
        </h2>
        
        <div
          v-if="isLoading"
          class="text-center p-4"
        >
          <div class="inline-block animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full" />
          <p class="mt-2 text-gray-600">
            Finding matches...
          </p>
        </div>
        
        <div
          v-else-if="!authStore.isAuthenticated"
          class="text-center p-4 bg-gray-100 rounded-lg"
        >
          <p class="text-gray-600">
            Login to see your matches
          </p>
        </div>
        
        <div
          v-else-if="matches.length === 0"
          class="text-center p-4 bg-gray-100 rounded-lg"
        >
          <p class="text-gray-600">
            No matches found yet. Try adding more desired skills or click "Find Matches".
          </p>
        </div>
        
        <div
          v-else
          class="space-y-4"
        >
          <div 
            v-for="match in matches" 
            :key="match.id" 
            class="border border-gray-200 p-4 rounded-lg hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium">
                  {{ match.name }}
                </h3>
                <p class="text-gray-500 text-sm">
                  {{ match.email }}
                </p>
              </div>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {{ Math.round(match.matchScore * 100) }}% match
              </span>
            </div>
            
            <div class="mt-2">
              <p class="text-sm text-gray-600 font-medium mb-1">
                Matching skills:
              </p>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="skill in match.matchingSkills" 
                  :key="skill"
                  class="bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <div class="mt-3 flex justify-end">
              <button 
                class="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                @click="contactMatch(match)"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import errorLogger from '@/services/errorLogger'

export default defineComponent({
  name: 'MatchingView',
  
  setup() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    
    const userSkills = ref([])
    const newSkill = ref('')
    const desiredSkills = ref([])
    const newDesiredSkill = ref('')
    const matches = ref([])
    const isLoading = ref(false)
    const isSaving = ref(false)
    
    // Load current user's skills
    onMounted(async () => {
      if (authStore.isAuthenticated && authStore.user) {
        // Load user's current skills from profile if available
        userSkills.value = authStore.user.skills || []
        
        // Make sure we have user data
        if (!userStore.users.length) {
          try {
            await userStore.loadUsers()
          } catch (error) {
            errorLogger.error('Failed to load users for matching', error)
          }
        }
      }
    })
    
    // Add a skill to user's skills
    const addSkill = () => {
      if (!newSkill.value.trim()) return
      
      // Skip duplicates
      if (!userSkills.value.includes(newSkill.value.trim())) {
        userSkills.value.push(newSkill.value.trim())
      }
      
      newSkill.value = ''
    }
    
    // Remove a skill
    const removeSkill = (index) => {
      userSkills.value.splice(index, 1)
    }
    
    // Save user's skills
    const saveSkills = async () => {
      if (!authStore.isAuthenticated) return
      
      try {
        isSaving.value = true
        
        // In a real app, this would save to the backend
        // For demo, we'll just update the local store
        if (authStore.user) {
          // Update the user in userStore
          userStore.updateUser(authStore.user.id, {
            skills: [...userSkills.value]
          })
          
          // Update the auth store's user object
          authStore.user.skills = [...userSkills.value]
          
          errorLogger.info('User skills saved', { 
            userId: authStore.user.id,
            skillCount: userSkills.value.length
          })
        }
      } catch (error) {
        errorLogger.error('Failed to save skills', error)
      } finally {
        isSaving.value = false
      }
    }
    
    // Add a desired skill
    const addDesiredSkill = () => {
      if (!newDesiredSkill.value.trim()) return
      
      // Skip duplicates
      if (!desiredSkills.value.includes(newDesiredSkill.value.trim())) {
        desiredSkills.value.push(newDesiredSkill.value.trim())
      }
      
      newDesiredSkill.value = ''
    }
    
    // Remove a desired skill
    const removeDesiredSkill = (index) => {
      desiredSkills.value.splice(index, 1)
    }
    
    // Find matching users
    const findMatches = async () => {
      if (!authStore.isAuthenticated || desiredSkills.value.length === 0) return
      
      try {
        isLoading.value = true
        
        // In a real app, this would be an API call
        // For demo, we'll do it locally
        
        // Make sure we have users
        if (userStore.users.length === 0) {
          await userStore.loadUsers()
        }
        
        // Calculate matches
        const matchResults = userStore.users
          // Don't match with self
          .filter(user => user.id !== authStore.user?.id)
          // Calculate match score and matching skills
          .map(user => {
            // Calculate how many desired skills the user has
            const matchingSkills = (user.skills || []).filter(skill => 
              desiredSkills.value.includes(skill)
            )
            
            // Calculate match score (0-1)
            let matchScore = 0
            if (desiredSkills.value.length > 0) {
              matchScore = matchingSkills.length / desiredSkills.value.length
            }
            
            return {
              ...user,
              matchScore,
              matchingSkills
            }
          })
          // Filter to only users with at least one matching skill
          .filter(user => user.matchingSkills.length > 0)
          // Sort by match score (highest first)
          .sort((a, b) => b.matchScore - a.matchScore)
        
        // Set matches
        matches.value = matchResults
        
        errorLogger.info('Matching completed', { 
          searchedFor: desiredSkills.value.length,
          matchesFound: matches.value.length
        })
      } catch (error) {
        errorLogger.error('Error finding matches', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // Contact a match
    const contactMatch = (match) => {
      // In a real app, this would open a chat or contact form
      // For demo, we'll just open the chat overlay
      uiStore.toggleChat()
      
      errorLogger.info('User initiated contact', { 
        targetUserId: match.id,
        targetUserName: match.name
      })
    }
    
    return {
      userStore,
      authStore,
      uiStore,
      userSkills,
      newSkill,
      desiredSkills,
      newDesiredSkill,
      matches,
      isLoading,
      isSaving,
      addSkill,
      removeSkill,
      saveSkills,
      addDesiredSkill,
      removeDesiredSkill,
      findMatches,
      contactMatch
    }
  }
})
</script>
