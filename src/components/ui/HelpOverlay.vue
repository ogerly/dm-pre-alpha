<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Help
        </h3>
        <button 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="closeHelp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6 overflow-y-auto flex-1">
        <div class="prose dark:prose-invert max-w-none">
          <h2>Getting Started</h2>
          <p>Welcome to DreamMall! Here's how to get started with our platform.</p>
          
          <h3>Navigation</h3>
          <p>Use the navigation menu at the top to access different sections:</p>
          <ul>
            <li><strong>Dashboard</strong> - Overview of your account</li>
            <li><strong>Matching</strong> - Find potential collaborators</li>
            <li><strong>Projects</strong> - View and manage projects</li>
            <li><strong>Map</strong> - Explore locations and resources</li>
            <li><strong>Chat</strong> - Communicate with connections</li>
          </ul>
          
          <h3>Chat Features</h3>
          <p>You can start a chat with any connection in the system by:</p>
          <ol>
            <li>Clicking on their profile</li>
            <li>Using the chat button in the top navigation</li>
            <li>Using the floating chat button on any page</li>
          </ol>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          @click="closeHelp"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useUIStore } from '@/stores/ui';

export default defineComponent({
  name: 'HelpOverlay',
  
  setup() {
    const uiStore = useUIStore();
    
    const closeHelp = () => {
      uiStore.toggleHelp();
    };
    
    return {
      closeHelp
    };
  }
});
</script>
