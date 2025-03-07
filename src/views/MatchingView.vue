<template>
  <div class="matching-page">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6">
        Matching System
      </h1>
      
      <!-- Matching Type Tabs -->
      <div class="mb-6 flex border-b">
        <button 
          :class="[
            'py-2 px-4 font-medium text-sm focus:outline-none',
            matchingType === 'users' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]" 
          @click="matchingType = 'users'"
        >
          User Matching
        </button>
        <button 
          :class="[
            'py-2 px-4 font-medium text-sm focus:outline-none',
            matchingType === 'projects' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="matchingType = 'projects'"
        >
          Project Matching
        </button>
      </div>
      
      <!-- User Matching Section -->
      <div v-if="matchingType === 'users'">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-3">
              Find Your Match
            </h2>
            <p class="text-gray-600 mb-4">
              Discover potential partners and collaborators based on shared interests and complementary skills.
            </p>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Criteria</label>
              <div class="flex flex-wrap gap-2 mb-4">
                <button 
                  v-for="(filter, index) in filterOptions" 
                  :key="index"
                  :class="[
                    'px-3 py-1 rounded-full text-sm',
                    activeFilters.includes(filter.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                  @click="toggleFilter(filter.value)"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            
            <!-- User to match against selector -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select User to Match Against</label>
              <div class="flex items-center mb-2">
                <select 
                  v-model="selectedUserId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  @change="generateMatches"
                >
                  <option value="">
                    Select a user
                  </option>
                  <option value="current">
                    Use My Profile
                  </option>
                  <option 
                    v-for="user in userStore.users" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.name || user.email }}
                  </option>
                </select>
                <button 
                  class="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  @click="generateMatches"
                >
                  Find Matches
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- User Matching Results Component -->
        <MatchingResults 
          :matches="matches" 
          @view-profile="viewProfile"
        />
        
        <!-- User Grid Display -->
        <div
          v-if="!matches.length"
          class="mt-6"
        >
          <h2 class="text-xl font-semibold mb-3">
            All Users
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="user in matchedUsers"
              :key="user.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-blue-300"
            >
              <div class="font-medium">
                {{ user.name }}
              </div>
              <p class="text-sm text-gray-500">
                {{ user.email }}
              </p>
              
              <div
                v-if="user.skills && user.skills.length"
                class="mt-2"
              >
                <div class="text-xs font-medium text-gray-500 mb-1">
                  Skills
                </div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="skill in user.skills.slice(0, 3)" 
                    :key="skill"
                    class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {{ skill }}
                  </span>
                  <span
                    v-if="user.skills.length > 3"
                    class="inline-block text-xs text-gray-500"
                  >+{{ user.skills.length - 3 }}</span>
                </div>
              </div>
              
              <div class="mt-3">
                <button 
                  class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2" 
                  @click="generateMatchesFor(user.id)"
                >
                  Match Me
                </button>
                <button 
                  class="text-sm text-blue-600 hover:text-blue-800" 
                  @click="viewProfile(user)"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Project Matching Section -->
      <div v-else>
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-3">
              Find Matching Projects
            </h2>
            <p class="text-gray-600 mb-4">
              Discover projects that match your skills and interests or find projects for specific users.
            </p>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Project Matching Criteria</label>
              <div class="flex flex-wrap gap-2 mb-4">
                <button 
                  v-for="(filter, index) in projectFilterOptions" 
                  :key="index"
                  :class="[
                    'px-3 py-1 rounded-full text-sm',
                    activeProjectFilters.includes(filter.value)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                  @click="toggleProjectFilter(filter.value)"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            
            <!-- User selection for project matching -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Find Projects For:</label>
              <div class="flex items-center mb-2">
                <select 
                  v-model="selectedUserForProjects"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="current">
                    My Profile
                  </option>
                  <option 
                    v-for="user in userStore.users" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.name || user.email }}
                  </option>
                </select>
                <button 
                  class="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  @click="findMatchingProjects"
                >
                  Find Projects
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Project Matching Results -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">
            {{ matchingProjects.length ? 'Matching Projects' : 'Available Projects' }}
          </h2>
          
          <div
            v-if="matchingProjects.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div 
              v-for="project in matchingProjects" 
              :key="project.id || project.name"
              class="border border-gray-200 rounded-lg p-4 hover:border-green-300"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">
                  {{ project.name }}
                </h3>
                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {{ project.matchScore }}% Match
                </span>
              </div>
              
              <p class="text-gray-600 text-sm mb-3">
                {{ project.description }}
              </p>
              
              <div class="mb-3">
                <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Required Skills
                </div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="(skill, i) in project.requiredSkills" 
                    :key="i"
                    :class="[
                      'inline-block text-xs px-2 py-1 rounded',
                      userHasSkill(skill) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-center mt-3">
                <span class="text-sm text-gray-500">
                  {{ project.owner || 'Community Project' }} · {{ project.year || 'Ongoing' }}
                </span>
                <button 
                  class="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                  @click="viewProject(project)"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          <div
            v-else
            class="text-center py-8 text-gray-500"
          >
            <p>No matching projects found. Try adjusting your filter criteria or expanding your skills profile.</p>
          </div>
        </div>
      </div>
    </main>
    
    <AppActions />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useErrorTracking } from '@/composables/useErrorTracking'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'
import MatchingResults from '@/components/matching/MatchingResults.vue'

export default defineComponent({
  name: 'MatchingView',
  
  components: {
    AppHeader,
    AppActions,
    MatchingResults
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('MatchingView')
    
    // User matching state
    const activeFilters = ref([])
    const selectedUserId = ref('')
    const matches = ref([])
    const matchingType = ref('users') // 'users' or 'projects'
    
    // Project matching state
    const activeProjectFilters = ref(['skills', 'interests'])
    const selectedUserForProjects = ref('current')
    const matchingProjects = ref([])
    
    // All available filter options
    const filterOptions = [
      { label: 'Skills Match', value: 'skills' },
      { label: 'Interests Match', value: 'interests' },
      { label: 'Location', value: 'location' },
      { label: 'Projects', value: 'projects' },
      { label: 'Available for Collaboration', value: 'available' }
    ]
    
    // Project filter options
    const projectFilterOptions = [
      { label: 'Skills Match', value: 'skills' },
      { label: 'Interests Match', value: 'interests' },
      { label: 'Location Based', value: 'location' },
      { label: 'Recently Added', value: 'recent' }
    ]
    
    // Sample projects data (in a real app, this would come from an API or store)
    const allProjects = [
      {
        id: 'p1',
        name: 'Sustainability Initiative',
        description: 'Working on sustainable solutions for urban environments',
        owner: 'Max Mustermann',
        year: '2023',
        requiredSkills: ['JavaScript', 'React', 'Sustainability', 'UI/UX Design'],
        relatedInterests: ['Sustainability', 'Urban Planning', 'Technology', 'Environment']
      },
      {
        id: 'p2',
        name: 'Tech Mentoring Program',
        description: 'Connecting experienced professionals with newcomers',
        owner: 'Julia Meier',
        year: '2023',
        requiredSkills: ['Communication', 'Leadership', 'JavaScript', 'Python'],
        relatedInterests: ['Education', 'Mentoring', 'Technology', 'Community Building']
      },
      {
        id: 'p3',
        name: 'Smart City Platform',
        description: 'IoT-based platform for improving city services',
        owner: 'Markus Weber',
        year: '2022',
        requiredSkills: ['IoT', 'Python', 'Data Analysis', 'Cloud Computing'],
        relatedInterests: ['Smart Cities', 'IoT', 'Urban Planning', 'Data Science']
      },
      {
        id: 'p4',
        name: 'Community Garden App',
        description: 'Mobile application to manage and connect urban gardeners',
        owner: 'Emma Schmidt',
        year: '2023',
        requiredSkills: ['Mobile Development', 'React Native', 'UI Design', 'Backend Development'],
        relatedInterests: ['Urban Gardening', 'Sustainability', 'Community Building', 'Food Production']
      },
      {
        id: 'p5',
        name: 'Digital Learning Platform',
        description: 'Platform for sharing educational resources and courses',
        owner: 'Thomas Müller',
        year: '2022',
        requiredSkills: ['Vue.js', 'Node.js', 'MongoDB', 'Education Technology'],
        relatedInterests: ['Education', 'Online Learning', 'Knowledge Sharing', 'Technology']
      }
    ]
    
    onMounted(async () => {
      await trackAsyncOperation('initialize matching view', async () => {
        try {
          // Check if user is authenticated
          if (!authStore.isAuthenticated) {
            router.replace('/login')
            return
          }
          
          // Load users if needed
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          errorLogger.info(`Matching view loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing matching view', error)
        }
      })
    })
    
    // User filtering and matching functions
    const toggleFilter = (filter) => {
      if (activeFilters.value.includes(filter)) {
        activeFilters.value = activeFilters.value.filter(f => f !== filter)
      } else {
        activeFilters.value.push(filter)
      }
      
      errorLogger.debug(`Filters updated: ${activeFilters.value.join(', ')}`)
    }
    
    const matchedUsers = computed(() => {
      // Exclude current user and apply filters
      return userStore.users.filter(user => 
        user.id !== authStore.currentUser?.id
      )
    })
    
    // Calculate match score between two users
    const calculateMatchScore = (user1, user2) => {
      // Default match details structure
      const matchDetails = {
        sharedInterests: [],
        complementarySkills: [],
        matchingAttributes: []
      }
      
      let totalScore = 0
      
      // Calculate shared interests
      if (user1.interests && user2.interests) {
        const sharedInterests = user1.interests.filter(interest => 
          user2.interests.includes(interest)
        )
        
        matchDetails.sharedInterests = sharedInterests
        totalScore += sharedInterests.length * 10
      }
      
      // Calculate complementary skills
      if (user1.skills && user2.skills) {
        const complementarySkills = user2.skills.filter(skill => 
          !user1.skills.includes(skill)
        )
        
        matchDetails.complementarySkills = complementarySkills
        totalScore += complementarySkills.length * 5
      }
      
      // Add matching attribute for location if available
      if (user1.iconCategories?.home?.coordinates && user2.iconCategories?.home?.coordinates) {
        matchDetails.matchingAttributes.push({
          category: 'Location',
          similarity: 'Similar region'
        })
        totalScore += 10
      }
      
      // Calculate percentage (max score is somewhat arbitrary)
      const _maxScore = 100
      const percentage = Math.min(Math.round((totalScore / _maxScore) * 100), 100)
      
      return {
        percentage,
        matchDetails
      }
    }
    
    // Generate matches for a specific user
    const generateMatchesFor = (userId) => {
      selectedUserId.value = userId
      generateMatches()
    }
    
    // Generate matches based on selected user
    const generateMatches = () => {
      errorLogger.debug(`Generating matches for user ID: ${selectedUserId.value}`)
      
      // Clear current matches
      matches.value = []
      
      try {
        // Get source user (either current user or selected)
        let sourceUser
        
        if (!selectedUserId.value || selectedUserId.value === 'current') {
          sourceUser = authStore.currentUser
        } else {
          sourceUser = userStore.users.find(u => u.id == selectedUserId.value)
        }
        
        if (!sourceUser) {
          errorLogger.warn('No source user selected for matching')
          return
        }
        
        // Generate matches against all other users
        const matchResults = userStore.users
          .filter(user => user.id !== sourceUser.id)
          .map(user => {
            const matchResult = calculateMatchScore(sourceUser, user)
            return {
              ...user,
              matchResult
            }
          })
          .filter(user => user.matchResult.percentage > 0)
          .sort((a, b) => b.matchResult.percentage - a.matchResult.percentage)
        
        matches.value = matchResults
        errorLogger.info(`Generated ${matches.value.length} matches`)
      } catch (error) {
        errorLogger.error('Error generating matches', error)
      }
    }
    
    // Project matching functions
    const toggleProjectFilter = (filter) => {
      if (activeProjectFilters.value.includes(filter)) {
        activeProjectFilters.value = activeProjectFilters.value.filter(f => f !== filter)
      } else {
        activeProjectFilters.value.push(filter)
      }
      
      errorLogger.debug(`Project filters updated: ${activeProjectFilters.value.join(', ')}`)
    }
    
    // Calculate match score between user and project
    const calculateProjectMatchScore = (user, project) => {
      if (!user || !project) return { percentage: 0, matchingSkills: [] }
      
      let score = 0
      const _maxScore = 100
      const matchingDetails = {}
      
      // Calculate matching skills
      const userSkills = user.skills || []
      const requiredSkills = project.requiredSkills || []
      const matchingSkills = userSkills.filter(skill => 
        requiredSkills.some(reqSkill => reqSkill.toLowerCase().includes(skill.toLowerCase()))
      )
      matchingDetails.matchingSkills = matchingSkills
      
      // Calculate score based on matching skills
      if (requiredSkills.length > 0) {
        const skillsScore = (matchingSkills.length / requiredSkills.length) * 50
        score += skillsScore
      }
      
      // Calculate matching interests
      const userInterests = user.interests || []
      const projectInterests = project.relatedInterests || []
      const matchingInterests = userInterests.filter(interest => 
        projectInterests.some(projInterest => projInterest.toLowerCase().includes(interest.toLowerCase()))
      )
      matchingDetails.matchingInterests = matchingInterests
      
      // Calculate score based on matching interests
      if (projectInterests.length > 0) {
        const interestsScore = (matchingInterests.length / projectInterests.length) * 30
        score += interestsScore
      }
      
      // Additional score for recent projects
      if (project.year === '2023') {
        score += 10
        matchingDetails.isRecent = true
      }
      
      // Calculate percentage
      const percentage = Math.min(Math.round(score), 100)
      
      return {
        percentage,
        matchingDetails
      }
    }
    
    const findMatchingProjects = () => {
      errorLogger.debug(`Finding matching projects for user: ${selectedUserForProjects.value}`)
      
      try {
        // Get user to match projects for
        let targetUser
        
        if (selectedUserForProjects.value === 'current') {
          targetUser = authStore.currentUser
        } else {
          targetUser = userStore.users.find(u => u.id == selectedUserForProjects.value)
        }
        
        if (!targetUser) {
          errorLogger.warn('No user selected for project matching')
          return
        }
        
        // Calculate match scores for all projects
        const projectMatches = allProjects.map(project => {
          const matchScore = calculateProjectMatchScore(targetUser, project)
          return {
            ...project,
            matchScore: matchScore.percentage,
            matchDetails: matchScore.matchingDetails
          }
        })
        
        // Filter and sort projects
        matchingProjects.value = projectMatches
          .filter(project => {
            // Filter based on active filters
            if (activeProjectFilters.value.includes('skills') && 
                (!project.matchDetails.matchingSkills || project.matchDetails.matchingSkills.length === 0)) {
              return false
            }
            if (activeProjectFilters.value.includes('interests') && 
                (!project.matchDetails.matchingInterests || project.matchDetails.matchingInterests.length === 0)) {
              return false
            }
            if (activeProjectFilters.value.includes('recent') && !project.matchDetails.isRecent) {
              return false
            }
            return project.matchScore > 0
          })
          .sort((a, b) => b.matchScore - a.matchScore)
        
        errorLogger.info(`Found ${matchingProjects.value.length} matching projects`)
      } catch (error) {
        errorLogger.error('Error finding matching projects', error)
      }
    }
    
    // Utility function to check if current user has a skill
    const userHasSkill = (skill) => {
      const currentUser = authStore.currentUser
      if (!currentUser || !currentUser.skills) return false
      
      return currentUser.skills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    }
    
    // View user profile
    const viewProfile = (user) => {
      errorLogger.debug(`Viewing profile for user: ${user.name || user.email}`)
      alert(`Profile details for ${user.name || user.email} would open here`)
    }
    
    // View project details
    const viewProject = (project) => {
      errorLogger.debug(`Viewing project: ${project.name}`)
      alert(`Details for project "${project.name}" would open here`)
    }
    
    return {
      // User matching props
      filterOptions,
      activeFilters,
      selectedUserId,
      matchedUsers,
      matches,
      toggleFilter,
      generateMatches,
      generateMatchesFor,
      viewProfile,
      
      // Project matching props
      matchingType,
      projectFilterOptions,
      activeProjectFilters,
      selectedUserForProjects,
      matchingProjects,
      toggleProjectFilter,
      findMatchingProjects,
      userHasSkill,
      viewProject,
      
      // Stores
      userStore
    }
  }
})
</script>
