<template>
  <div class="video-chat-view">
    <AppHeader />
    
    <main class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6">Video Chat</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Video Display Area -->
        <div class="md:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="mb-4 flex justify-between items-center">
              <h2 class="text-xl font-semibold">Video Session</h2>
              <div>
                <span :class="isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs">
                  {{ isConnected ? 'Connected' : 'Disconnected' }}
                </span>
              </div>
            </div>
            
            <div class="video-container bg-black rounded-lg overflow-hidden" style="height: 400px;">
              <div v-if="!isConnected" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <div class="text-6xl text-gray-600 mb-4">📹</div>
                  <p class="text-gray-400">Start a video chat by connecting with a user</p>
                </div>
              </div>
              <div v-else class="relative h-full">
                <!-- Remote video (full container) -->
                <div class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <p class="text-white">Remote video would appear here</p>
                </div>
                
                <!-- Local video (small overlay) -->
                <div class="absolute bottom-4 right-4 w-32 h-24 bg-gray-600 rounded overflow-hidden border-2 border-gray-900">
                  <div class="w-full h-full flex items-center justify-center">
                    <p class="text-white text-xs">Your video</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Video Controls -->
            <div class="mt-4 flex justify-center space-x-4">
              <button 
                @click="toggleMicrophone"
                :class="isMicrophoneEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'"
                class="p-3 rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="isMicrophoneEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              
              <button 
                @click="toggleVideo" 
                :class="isVideoEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'"
                class="p-3 rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="isVideoEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
              
              <button 
                @click="toggleScreenSharing"
                :class="isScreenSharingEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
                class="p-3 rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button 
                @click="endCall" 
                class="bg-red-500 hover:bg-red-600 p-3 rounded-full text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- User List and Chat -->
        <div>
          <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold mb-3">Available Users</h2>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div v-for="user in availableUsers" :key="user.id" class="border border-gray-200 p-2 rounded flex justify-between items-center">
                <div>
                  <span class="font-medium">{{ user.name }}</span>
                  <div class="flex items-center mt-1">
                    <div :class="user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'" class="h-2 w-2 rounded-full mr-2"></div>
                    <span class="text-xs text-gray-500">{{ user.status }}</span>
                  </div>
                </div>
                <button 
                  @click="startCall(user.id)" 
                  :disabled="user.status !== 'online'"
                  :class="user.status === 'online' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
                  class="px-3 py-1 rounded text-white text-sm"
                >
                  Call
                </button>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-3">Chat</h2>
            
            <div class="chat-messages bg-gray-50 p-3 rounded-md h-64 overflow-y-auto mb-3">
              <div v-if="chatMessages.length === 0" class="flex items-center justify-center h-full">
                <p class="text-gray-500">No messages yet</p>
              </div>
              
              <div v-for="(message, index) in chatMessages" :key="index" :class="[
                'mb-3 max-w-3/4 rounded-lg p-2',
                message.isFromMe ? 'ml-auto bg-blue-100' : 'bg-gray-100'
              ]">
                <p class="text-xs text-gray-600">{{ message.sender }}</p>
                <p>{{ message.text }}</p>
                <p class="text-xs text-gray-500 text-right">{{ message.time }}</p>
              </div>
            </div>
            
            <div class="flex">
              <input 
                type="text" 
                v-model="newMessage"
                placeholder="Type a message..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                @keyup.enter="sendMessage"
              />
              <button 
                @click="sendMessage" 
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
              >
                Send
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
  name: 'VideoChatView',
  
  components: {
    AppHeader,
    AppActions
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const { errorLogger, trackAsyncOperation } = useErrorTracking('VideoChatView')
    
    // Video chat state
    const isConnected = ref(false)
    const isMicrophoneEnabled = ref(true)
    const isVideoEnabled = ref(true)
    const isScreenSharingEnabled = ref(false)
    
    // Chat state
    const newMessage = ref('')
    const chatMessages = ref([])
    
    // Sample available users
    const availableUsers = ref([
      { id: 1, name: 'Max Mustermann', status: 'online' },
      { id: 2, name: 'Julia Meier', status: 'online' },
      { id: 3, name: 'Thomas Schmidt', status: 'offline' },
      { id: 4, name: 'Markus Weber', status: 'busy' }
    ])
    
    onMounted(async () => {
      await trackAsyncOperation('initialize video chat view', async () => {
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
          
          errorLogger.info(`Video chat view loaded for user: ${authStore.currentUser?.email}`)
        } catch (error) {
          errorLogger.error('Error initializing video chat view', error)
        }
      })
    })
    
    // Video call functions
    const startCall = (userId) => {
      errorLogger.debug(`Starting call with user ID: ${userId}`)
      isConnected.value = true
      // In a real app, this would initialize WebRTC connection
    }
    
    const endCall = () => {
      errorLogger.debug('Ending call')
      isConnected.value = false
      // In a real app, this would close WebRTC connection
    }
    
    const toggleMicrophone = () => {
      isMicrophoneEnabled.value = !isMicrophoneEnabled.value
      errorLogger.debug(`Microphone ${isMicrophoneEnabled.value ? 'enabled' : 'disabled'}`)
    }
    
    const toggleVideo = () => {
      isVideoEnabled.value = !isVideoEnabled.value
      errorLogger.debug(`Video ${isVideoEnabled.value ? 'enabled' : 'disabled'}`)
    }
    
    const toggleScreenSharing = () => {
      isScreenSharingEnabled.value = !isScreenSharingEnabled.value
      errorLogger.debug(`Screen sharing ${isScreenSharingEnabled.value ? 'enabled' : 'disabled'}`)
    }
    
    // Chat functions
    const sendMessage = () => {
      if (newMessage.value.trim() === '') return
      
      chatMessages.value.push({
        text: newMessage.value,
        sender: authStore.currentUser?.name || authStore.currentUser?.email,
        isFromMe: true,
        time: new Date().toLocaleTimeString()
      })
      
      newMessage.value = ''
      
      // Simulate receiving a response
      setTimeout(() => {
        chatMessages.value.push({
          text: 'Thanks for your message!',
          sender: 'Remote User',
          isFromMe: false,
          time: new Date().toLocaleTimeString()
        })
      }, 1000)
    }
    
    return {
      isConnected,
      isMicrophoneEnabled,
      isVideoEnabled,
      isScreenSharingEnabled,
      availableUsers,
      chatMessages,
      newMessage,
      startCall,
      endCall,
      toggleMicrophone,
      toggleVideo,
      toggleScreenSharing,
      sendMessage
    }
  }
})
</script>

<style scoped>
.video-container {
  background-color: #000;
  position: relative;
}

.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>
