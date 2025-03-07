<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    
    <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-6 h-full">
        <h1 class="text-2xl font-bold mb-6 dark:text-white">
          Chat
        </h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
          <!-- Contacts/Conversations List -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:col-span-1 overflow-hidden flex flex-col">
            <h2 class="font-bold text-lg mb-4 dark:text-white">
              Conversations
            </h2>
            
            <div class="relative">
              <input
                type="text"
                placeholder="Search..."
                class="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
              <svg
                class="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <!-- Conversations List -->
            <div class="flex-1 overflow-y-auto">
              <div
                v-for="i in 10"
                :key="i"
                :class="[
                  'p-3 rounded-md mb-1 cursor-pointer flex items-center',
                  i === 1 ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  {{ i }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate dark:text-white">
                    User {{ i }}
                  </p>
                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    Latest message here...
                  </p>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ i % 3 === 0 ? 'Yesterday' : '10:24' }}</span>
                  <div
                    v-if="i % 4 === 0"
                    class="w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center mt-1 ml-auto"
                  >
                    2
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chat Area -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-0 lg:col-span-3 flex flex-col overflow-hidden">
            <!-- Chat Header -->
            <div class="border-b px-4 py-3 flex items-center dark:border-gray-700">
              <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                1
              </div>
              <div>
                <h3 class="font-medium dark:text-white">
                  User 1
                </h3>
                <p class="text-xs text-green-500">
                  Online
                </p>
              </div>
              <div class="ml-auto">
                <button class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Messages -->
            <div class="flex-1 p-4 overflow-y-auto">
              <!-- Add a ChatInterface component here -->
              <ChatInterface />
            </div>
            
            <!-- Message Input -->
            <div class="border-t p-4 dark:border-gray-700">
              <div class="flex items-end">
                <textarea 
                  rows="1" 
                  placeholder="Type a message..." 
                  class="flex-1 p-2 border rounded-l-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import ChatInterface from '@/components/chat/ChatInterface.vue';

export default defineComponent({
  name: 'ChatPage',
  components: {
    AppHeader,
    ChatInterface
  }
});
</script>
