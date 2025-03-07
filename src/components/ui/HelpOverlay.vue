<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            Help & Documentation
          </h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="uiStore.toggleHelp"
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
        
        <div class="prose prose-sm max-w-none">
          <h3>Getting Started</h3>
          <p>
            Welcome to the DreamMall application! This tool helps you connect with people
            based on shared interests and complementary skills.
          </p>
          
          <h3>Features</h3>
          <ul>
            <li><strong>Profile Management:</strong> Create and edit your profile</li>
            <li><strong>Matching:</strong> Find people with complementary skills</li>
            <li><strong>Chat:</strong> Communicate with your matches</li>
          </ul>
          
          <h3>Keyboard Shortcuts</h3>
          <table class="min-w-full">
            <tbody>
              <tr>
                <td class="py-1 pr-4">
                  <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl+Shift+D</kbd>
                </td>
                <td>Toggle debug console (development only)</td>
              </tr>
              <tr>
                <td class="py-1 pr-4">
                  <kbd class="px-2 py-1 bg-gray-100 rounded">Escape</kbd>
                </td>
                <td>Close overlays</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Need more help?</h3>
          <p>
            Contact us at <a href="mailto:support@dreammall.example">support@dreammall.example</a>
            for assistance.
          </p>
        </div>
      </div>
      
      <div class="bg-gray-50 px-6 py-4 rounded-b-lg">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            App version: {{ version }}
          </div>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
            @click="uiStore.toggleHelp"
          >
            Close
          </button>
        </div>
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
    const version = import.meta.env.APP_VERSION || '0.0.0';
    
    // Close on escape key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        uiStore.closeHelp();
      }
    };
    
    // Add keyboard listener when component is mounted
    window.addEventListener('keydown', handleKeyDown);
    
    return {
      uiStore,
      version
    };
  }
});
</script>
