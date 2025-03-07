<template>
  <div class="video-chat-container p-4">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-xl font-bold mb-4 dark:text-white">
        Video Chat Room
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Video chat connections (left panel) -->
        <div class="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-3 dark:text-white">
            Video
          </h3>
          
          <div class="space-y-4">
            <div class="bg-black aspect-video rounded-lg flex items-center justify-center text-white">
              <span>Your video will appear here</span>
            </div>
            
            <!-- Video controls -->
            <div class="flex justify-center space-x-4">
              <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                <span>Start Camera</span>
              </button>
              <button
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                disabled
              >
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Chat panel (right panel) -->
        <div class="col-span-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ChatInterface from '@/components/chat/ChatInterface.vue';

export default defineComponent({
  name: 'VideoChat',
  
  components: {
    ChatInterface
  },
  
  setup() {
    return {};
  }
});
</script>