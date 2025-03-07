<template>
  <div class="projects-page">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6">
        Projects
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- My Projects -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">
            My Projects
          </h2>
          <p class="mb-4">
            Projects you have created or are contributing to
          </p>
          
          <div
            v-if="userProjects.length > 0"
            class="space-y-4"
          >
            <div 
              v-for="project in userProjects" 
              :key="project.name"
              class="border border-gray-200 p-4 rounded-lg hover:border-blue-300"
            >
              <h3 class="font-medium">
                {{ project.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-2">
                {{ project.description }}
              </p>
              
              <div class="flex justify-between items-center">
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {{ project.year }}
                </span>
                <button 
                  class="text-sm text-blue-600 hover:text-blue-800"
                  @click="editProject(project.name)"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-center py-8 text-gray-500"
          >
            <p>You haven't created any projects yet</p>
            <button 
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              @click="createProject"
            >
              Create New Project
            </button>
          </div>
        </div>
        
        <!-- Discover Projects -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-3">
            Discover Projects
          </h2>
          <p class="mb-4">
            Find projects that match your skills and interests
          </p>
          
          <div class="mb-4">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search projects..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(project, index) in discoveredProjects" 
              :key="index"
              class="border border-gray-200 p-4 rounded-lg hover:border-blue-300"
            >
              <h3 class="font-medium">
                {{ project.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-2">
                {{ project.description }}
              </p>
              
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {{ project.owner }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ project.year }}
                  </span>
                </div>
                
                <button 
                  class="text-sm text-blue-600 hover:text-blue-800"
                  @click="viewProject(project.name)"
                >
                  View Details
                </button>
              </div>
            </div>
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

export default defineComponent({
  name: 'ProjectsView',
  
  components: {
    AppHeader,
    AppActions
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('ProjectsView')
    
    const searchTerm = ref('')
    
    onMounted(async () => {
      await trackAsyncOperation('initialize projects view', async () => {
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
          
          errorLogger.info(`Projects view loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing projects view', error)
        }
      })
    })
    
    // Get projects from the current user
    const userProjects = computed(() => {
      const currentUser = authStore.currentUser
      if (!currentUser) return []
      
      // Collect projects from various user data structures
      let projects = []
      
      // Own projects
      if (currentUser.ownProjects && Array.isArray(currentUser.ownProjects)) {
        projects = projects.concat(currentUser.ownProjects)
      }
      
      // Icon category projects
      if (currentUser.iconCategories && currentUser.iconCategories.projekt) {
        projects = projects.concat(currentUser.iconCategories.projekt)
      }
      
      return projects
    })
    
    // Sample discovered projects
    const discoveredProjects = computed(() => {
      const term = searchTerm.value.toLowerCase()
      
      // Create a list of sample projects
      const projects = [
        {
          name: 'Sustainability Initiative',
          description: 'Working on sustainable solutions for urban environments',
          owner: 'Max Mustermann',
          year: '2023'
        },
        {
          name: 'Tech Mentoring Program',
          description: 'Connecting experienced professionals with newcomers',
          owner: 'Julia Meier',
          year: '2023'
        },
        {
          name: 'Smart City Platform',
          description: 'IoT-based platform for improving city services',
          owner: 'Markus Weber',
          year: '2022'
        }
      ]
      
      if (!term) return projects
      
      // Filter by search term
      return projects.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term)
      )
    })
    
    const editProject = (projectName) => {
      errorLogger.debug(`Editing project: ${projectName}`)
      alert(`Edit interface for project "${projectName}" would open here`)
    }
    
    const viewProject = (projectName) => {
      errorLogger.debug(`Viewing project: ${projectName}`)
      alert(`Details for project "${projectName}" would open here`)
    }
    
    const createProject = () => {
      errorLogger.debug('Creating new project')
      alert('New project creation form would open here')
    }
    
    return {
      searchTerm,
      userProjects,
      discoveredProjects,
      editProject,
      viewProject,
      createProject
    }
  }
})
</script>
