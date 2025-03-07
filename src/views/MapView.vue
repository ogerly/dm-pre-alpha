<template>
  <div class="map-view">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6">
        Interactive Map
      </h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold">
              User Locations
            </h2>
            <p class="text-gray-600">
              Visualize user locations and projects on the map
            </p>
          </div>
          
          <div class="flex space-x-2">
            <select
              v-model="mapView"
              class="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="users">
                Show Users
              </option>
              <option value="projects">
                Show Projects
              </option>
              <option value="all">
                Show All
              </option>
            </select>
          </div>
        </div>
        
        <!-- Map Placeholder -->
        <div
          class="map-container bg-gray-100 rounded-lg overflow-hidden"
          style="height: 500px;"
        >
          <!-- Interactive map would be rendered here with a mapping library like Leaflet or Google Maps -->
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="text-6xl text-gray-300 mb-4">
                🗺️
              </div>
              <h3 class="text-lg font-medium text-gray-500">
                Interactive Map
              </h3>
              <p class="text-gray-500">
                Users and projects would be displayed here on a real map
              </p>
            </div>
          </div>
        </div>
        
        <!-- Map Legend -->
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-blue-500 mr-2" />
            <span class="text-sm text-gray-600">Users</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-red-500 mr-2" />
            <span class="text-sm text-gray-600">Your Location</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-green-500 mr-2" />
            <span class="text-sm text-gray-600">Projects</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-purple-500 mr-2" />
            <span class="text-sm text-gray-600">Events</span>
          </div>
        </div>
      </div>
      
      <!-- Information Panel -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-medium mb-2">
            Near You
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Users and projects in your vicinity
          </p>
          
          <div class="space-y-3">
            <div
              v-for="(item, index) in nearbyItems"
              :key="index"
              class="flex items-center"
            >
              <div 
                :class="{
                  'bg-blue-500': item.type === 'user',
                  'bg-green-500': item.type === 'project'
                }"
                class="h-2 w-2 rounded-full mr-3"
              />
              <div>
                <div class="text-sm font-medium">
                  {{ item.name }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ item.distance }} away
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-medium mb-2">
            Active Projects
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Projects in selected area
          </p>
          
          <div class="space-y-3">
            <div
              v-for="(project, index) in areaProjects"
              :key="index"
              class="border-l-2 border-green-500 pl-3"
            >
              <div class="text-sm font-medium">
                {{ project.name }}
              </div>
              <div class="text-xs text-gray-500">
                {{ project.owner }}
              </div>
              <div class="text-xs mt-1">
                {{ project.description }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-medium mb-2">
            Your Locations
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Places you've marked
          </p>
          
          <div class="space-y-3">
            <div
              v-for="(location, index) in userLocations"
              :key="index"
              class="flex items-center justify-between"
            >
              <div>
                <div class="text-sm font-medium">
                  {{ location.name }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ location.type }}
                </div>
              </div>
              <button class="text-xs text-blue-600 hover:text-blue-800">
                Edit
              </button>
            </div>
            
            <div class="pt-2 mt-2 border-t border-gray-200">
              <button class="text-sm text-blue-600 hover:text-blue-800">
                Add New Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <AppActions />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useErrorTracking } from '@/composables/useErrorTracking'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppActions from '@/components/layout/AppActions.vue'

export default defineComponent({
  name: 'MapView',
  
  components: {
    AppHeader,
    AppActions
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('MapView')
    
    const mapView = ref('all')
    
    // Sample data for demo
    const nearbyItems = ref([
      { name: 'Max Mustermann', type: 'user', distance: '1.2 km' },
      { name: 'Sustainability Initiative', type: 'project', distance: '0.8 km' },
      { name: 'Julia Meier', type: 'user', distance: '2.5 km' },
      { name: 'Green Tech Hub', type: 'project', distance: '3.1 km' }
    ])
    
    const areaProjects = ref([
      { name: 'Urban Farming Network', owner: 'Community Project', description: 'Connecting urban gardens across the city' },
      { name: 'Smart City Sensors', owner: 'Tech Collective', description: 'Monitoring air quality with IoT devices' },
      { name: 'Tech Workshop Series', owner: 'Education Initiative', description: 'Regular workshops for skill sharing' }
    ])
    
    const userLocations = ref([
      { name: 'Home Office', type: 'Home' },
      { name: 'EcoTech Solutions', type: 'Business' },
      { name: 'Tech Meetup Space', type: 'Community' }
    ])
    
    onMounted(async () => {
      await trackAsyncOperation('initialize map view', async () => {
        try {
          // Check if user is authenticated
          if (!authStore.isAuthenticated) {
            router.replace('/login')
            return
          }
          
          // Load users if needed for the map
          if (userStore.users.length === 0) {
            await userStore.loadUsers()
          }
          
          // Initialize the map - this would normally involve setting up a mapping library
          errorLogger.debug('Map would be initialized here with a real mapping library')
          
          errorLogger.info(`Map view loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing map view', error)
        }
      })
    })
    
    return {
      mapView,
      nearbyItems,
      areaProjects,
      userLocations
    }
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  height: 500px;
  width: 100%;
}
</style>