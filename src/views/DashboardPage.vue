<template>
  <div class="dashboard-page">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <p class="text-gray-600" v-if="currentUser">
            Welcome back, <span class="font-medium">{{ currentUser.email }}</span>
            <span v-if="currentUser.role === 'admin'" class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
          </p>
        </div>
        
        <!-- Admin Access Button -->
        <div v-if="currentUser && currentUser.role === 'admin'">
          <router-link 
            to="/admin" 
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Panel
          </router-link>
        </div>
      </div>
      
      <!-- Best Matches Section -->
      <div class="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-3">Your Best Matches</h2>
        <p class="text-gray-600 mb-4">People who might be perfect collaborators for you</p>
        
        <div v-if="bestMatches.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="match in bestMatches" 
            :key="match.id" 
            class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-medium">{{ match.name }}</h3>
                <p class="text-sm text-gray-500">{{ match.email }}</p>
              </div>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ match.matchScore }}% Match
              </span>
            </div>
            
            <div class="mb-3">
              <h4 class="text-xs text-gray-500 uppercase tracking-wide mb-1">In common</h4>
              <div class="flex flex-wrap gap-1 mb-2">
                <span 
                  v-for="(interest, i) in match.sharedInterests.slice(0, 2)" 
                  :key="i"
                  class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >
                  {{ interest }}
                </span>
                <span v-if="match.sharedInterests.length > 2" class="text-xs text-gray-500">
                  +{{ match.sharedInterests.length - 2 }} more
                </span>
              </div>
              
              <h4 class="text-xs text-gray-500 uppercase tracking-wide mb-1">Complementary Skills</h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(skill, i) in match.complementarySkills.slice(0, 2)" 
                  :key="i"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {{ skill }}
                </span>
                <span v-if="match.complementarySkills.length > 2" class="text-xs text-gray-500">
                  +{{ match.complementarySkills.length - 2 }} more
                </span>
              </div>
            </div>
            
            <div class="flex justify-between">
              <button 
                @click="viewUserProfile(match.id)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Profile
              </button>
              
              <button 
                @click="connectWithUser(match.id)"
                class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">No matches found. Complete your profile to find better matches!</p>
          <button 
            @click="editProfile"
            class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
      
      <!-- Best Project Matches Section -->
      <div class="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-3">Projects For You</h2>
        <p class="text-gray-600 mb-4">Projects that match your skills and interests</p>
        
        <div v-if="bestProjectMatches.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="project in bestProjectMatches" 
            :key="project.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium">{{ project.name }}</h3>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ project.matchScore }}% Match
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
            
            <div class="mb-3">
              <h4 class="text-xs text-gray-500 uppercase tracking-wide mb-1">Required Skills</h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(skill, i) in project.requiredSkills" 
                  :key="i"
                  :class="[
                    'inline-block text-xs px-2 py-1 rounded',
                    userHasSkill(skill) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">{{ project.owner }} · {{ project.year }}</span>
              <button
                @click="viewProject(project.id)"
                class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">No matching projects found. Add more skills to your profile to find suitable projects!</p>
          <button 
            @click="editProfile"
            class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Update Skills
          </button>
        </div>
      </div>
      
      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- User Profiles Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">User Profiles</h2>
          <p class="mb-4">Browse and match with other users</p>
          
          <div class="mb-4">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search users..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div v-if="filteredUsers.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="border border-gray-200 p-3 rounded flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <span class="font-medium">{{ user.name }}</span>
                <p class="text-gray-500 text-sm">{{ user.email }}</p>
                <div v-if="user.skills && user.skills.length" class="mt-1">
                  <span 
                    v-for="skill in user.skills.slice(0, 3)" 
                    :key="skill"
                    class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                  >
                    {{ skill }}
                  </span>
                  <span v-if="user.skills.length > 3" class="text-xs text-gray-500">
                    +{{ user.skills.length - 3 }} more
                  </span>
                </div>
              </div>
              <div>
                <button 
                  @click="viewUserProfile(user.id)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
          <p v-else-if="userStore.isLoading" class="text-center py-4">Loading users...</p>
          <p v-else class="text-center py-4">No users found matching your search</p>
        </div>
        
        <!-- Projects/Matching Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">Projects</h2>
          <p class="mb-4">Explore projects and find collaboration opportunities</p>
          
          <div v-if="currentUser && currentUser.projects && currentUser.projects.length > 0" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-2">Your Projects</h3>
            <div class="space-y-2">
              <div v-for="project in currentUser.projects" :key="project.name" class="border border-gray-200 p-3 rounded">
                <div class="font-medium">{{ project.name }}</div>
                <p class="text-sm text-gray-600">{{ project.description }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Recommended Projects</h3>
            <p class="text-sm text-gray-500 italic mb-2">Based on your skills and interests</p>
            
            <div class="space-y-2">
              <!-- This would be populated with actual recommendations -->
              <div class="border border-gray-200 p-3 rounded bg-blue-50">
                <div class="font-medium">Sustainability Initiative</div>
                <p class="text-sm text-gray-600">Looking for developers with interest in sustainable solutions</p>
                <div class="mt-2 flex justify-end">
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Learn More</button>
                </div>
              </div>
              <div class="border border-gray-200 p-3 rounded">
                <div class="font-medium">Tech Mentoring Program</div>
                <p class="text-sm text-gray-600">Connect with junior developers as a mentor</p>
                <div class="mt-2 flex justify-end">
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- My Profile Card -->
      <div class="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-3">My Profile</h2>
        <p class="mb-4">Update your information to improve matching</p>
        
        <div v-if="currentUser" class="flex flex-col md:flex-row gap-6">
          <div class="md:w-1/3">
            <h3 class="font-medium mb-2">Personal Information</h3>
            <p><strong>Name:</strong> {{ currentUser.name || 'Not provided' }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Bio:</strong> {{ currentUser.bio || 'No bio provided' }}</p>
          </div>
          
          <div class="md:w-1/3">
            <h3 class="font-medium mb-2">Skills & Interests</h3>
            <div class="mb-2">
              <p class="text-sm font-medium mb-1">Skills:</p>
              <div v-if="currentUser.skills && currentUser.skills.length">
                <span 
                  v-for="skill in currentUser.skills" 
                  :key="skill"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                >
                  {{ skill }}
                </span>
              </div>
              <p v-else class="text-sm text-gray-500">No skills listed</p>
            </div>
            
            <div>
              <p class="text-sm font-medium mb-1">Interests:</p>
              <div v-if="currentUser.interests && currentUser.interests.length">
                <span 
                  v-for="interest in currentUser.interests" 
                  :key="interest"
                  class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                >
                  {{ interest }}
                </span>
              </div>
              <p v-else class="text-sm text-gray-500">No interests listed</p>
            </div>
          </div>
          
          <div class="md:w-1/3 flex justify-end items-start">
            <button 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              @click="editProfile"
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        <div v-else class="text-center py-4">
          Loading profile information...
        </div>
      </div>
    </main>
    
    <AppActions />
    <ChatOverlay v-if="uiStore.isChatOpen" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import { useErrorTracking } from '@/composables/useErrorTracking'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'
import ChatOverlay from '@/components/chat/ChatOverlay.vue'

export default defineComponent({
  name: 'DashboardPage',
  
  components: {
    AppHeader,
    AppActions,
    ChatOverlay
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const uiStore = useUIStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('DashboardPage')
    
    const searchTerm = ref('')
    
    // Initialize dashboard
    onMounted(async () => {
      await trackAsyncOperation('dashboard initialization', async () => {
        try {
          errorLogger.debug('Dashboard mounted, checking authentication')
          
          // Check if user is authenticated
          if (!authStore.isAuthenticated) {
            errorLogger.warn('Dashboard accessed without authentication, redirecting to login')
            router.replace('/login')
            return
          }
          
          // Load users if needed
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          errorLogger.info(`Dashboard loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing dashboard', error)
        }
      })
    })
    
    const currentUser = computed(() => {
      return authStore.currentUser
    })
    
    const filteredUsers = computed(() => {
      if (!searchTerm.value) {
        return userStore.users.filter(user => 
          user.id !== currentUser.value?.id
        )
      }
      
      const term = searchTerm.value.toLowerCase()
      return userStore.users.filter(user => 
        user.id !== currentUser.value?.id &&
        ((user.name && user.name.toLowerCase().includes(term)) || 
         (user.email && user.email.toLowerCase().includes(term)) ||
         (user.skills && user.skills.some(skill => skill.toLowerCase().includes(term))) ||
         (user.interests && user.interests.some(interest => interest.toLowerCase().includes(term))))
      )
    })
    
    // View a user's profile
    const viewUserProfile = (userId) => {
      errorLogger.debug(`Viewing profile for user ID: ${userId}`)
      // This would navigate to the user's profile page
      // For now we'll just show an alert
      alert(`Viewing profile for user ID: ${userId}`)
    }
    
    // Edit current user's profile
    const editProfile = () => {
      errorLogger.debug("Editing user profile")
      // This would open a profile editor or navigate to profile edit page
      // For now we'll just show an alert
      alert("Edit profile functionality would open here")
    }
    
    // Calculate best matches for current user
    const bestMatches = computed(() => {
      if (!authStore.currentUser || userStore.users.length === 0) {
        return [];
      }
      
      // Get current user
      const currentUser = authStore.currentUser;
      
      // Filter out current user and calculate match scores
      return userStore.users
        .filter(user => user.id !== currentUser.id)
        .map(user => {
          // Calculate shared interests
          const sharedInterests = currentUser.interests && user.interests ? 
            currentUser.interests.filter(interest => user.interests.includes(interest)) : [];
          
          // Calculate complementary skills
          const complementarySkills = currentUser.skills && user.skills ?
            user.skills.filter(skill => !currentUser.skills.includes(skill)) : [];
            
          // Calculate match score (simplified algorithm)
          let score = 0;
          
          // Add points for shared interests
          score += sharedInterests.length * 10;
          
          // Add points for complementary skills
          score += complementarySkills.length * 5;
          
          // Add points for having a bio
          if (user.bio) score += 5;
          
          // Calculate percentage (max possible score is somewhat arbitrary)
          const matchScore = Math.min(Math.round(score), 100);
          
          return {
            ...user,
            matchScore,
            sharedInterests,
            complementarySkills
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score, highest first
        .slice(0, 3); // Get top 3 matches
    });
    
    const connectWithUser = (userId) => {
      errorLogger.debug(`Connecting with user ID: ${userId}`);
      uiStore.toggleChat(); // Open the chat interface
      // In a real app, this would start a chat with the specific user
    };

    // Sample projects data (in a real app, this would come from a store or API)
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
        description: 'Connecting experienced developers with juniors for mentoring',
        owner: 'Jane Doe',
        year: '2023',
        requiredSkills: ['JavaScript', 'Vue.js', 'Mentoring', 'Communication'],
        relatedInterests: ['Mentoring', 'Education', 'Technology', 'Community']
      }
    ];

    // Calculate best project matches for current user
    const bestProjectMatches = computed(() => {
      if (!authStore.currentUser || allProjects.length === 0) {
        return [];
      }

      // Get current user
      const currentUser = authStore.currentUser;

      // Calculate match scores for projects
      return allProjects
        .map(project => {
          // Calculate matching skills
          const matchingSkills = currentUser.skills && project.requiredSkills ?
            project.requiredSkills.filter(skill => currentUser.skills.includes(skill)) : [];

          // Calculate related interests
          const relatedInterests = currentUser.interests && project.relatedInterests ?
            project.relatedInterests.filter(interest => currentUser.interests.includes(interest)) : [];

          // Calculate match score (simplified algorithm)
          let score = 0;

          // Add points for matching skills
          score += matchingSkills.length * 10;

          // Add points for related interests
          score += relatedInterests.length * 5;

          // Calculate percentage (max possible score is somewhat arbitrary)
          const matchScore = Math.min(Math.round(score), 100);

          return {
            ...project,
            matchScore,
            matchingSkills,
            relatedInterests
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score, highest first
        .slice(0, 3); // Get top 3 matches
    });

    const userHasSkill = (skill) => {
      return currentUser.value?.skills?.includes(skill) || false;
    };

    const viewProject = (projectId) => {
      errorLogger.debug(`Viewing project ID: ${projectId}`);
      // This would navigate to the project's detail page
      // For now we'll just show an alert
      alert(`Viewing project ID: ${projectId}`);
    };

    return {
      currentUser,
      userStore,
      uiStore,
      searchTerm,
      filteredUsers,
      viewUserProfile,
      editProfile,
      bestMatches,
      connectWithUser,
      bestProjectMatches,
      userHasSkill,
      viewProject
    }
  }
})
</script>
