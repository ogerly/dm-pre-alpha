<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-bold">
          Chat
        </h2>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="uiStore.toggleChat"
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
      
      <div
        ref="chatMessages"
        class="flex-1 p-4 overflow-y-auto"
      >
        <div
          v-if="messages.length === 0"
          class="text-center text-gray-500 py-6"
        >
          No messages yet. Start a conversation!
        </div>
        
        <template v-else>
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="[
              'mb-3 p-3 rounded-lg max-w-[80%]',
              message.isMe ? 
                'ml-auto bg-blue-100 text-blue-900' : 
                'mr-auto bg-gray-100 text-gray-900'
            ]"
          >
            <div class="text-xs text-gray-500 mb-1">
              {{ message.sender }} · {{ formatTime(message.timestamp) }}
            </div>
            <div>{{ message.text }}</div>
          </div>
        </template>
      </div>
      
      <div class="p-4 border-t">
        <form
          class="flex gap-2"
          @submit.prevent="sendMessage"
        >
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            :disabled="!isConnected"
          >
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            :disabled="!newMessage.trim() || !isConnected"
          >
            Send
          </button>
        </form>
        
        <div
          v-if="!isConnected"
          class="mt-2 text-sm text-red-500"
        >
          Not connected to the chat server. Trying to reconnect...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import errorLogger from '@/services/errorLogger';

export default defineComponent({
  name: 'ChatOverlay',
  
  setup() {
    const uiStore = useUIStore();
    const authStore = useAuthStore();
    const chatMessages = ref(null);
    const newMessage = ref('');
    const messages = ref([]);
    const isConnected = ref(false);
    
    // Format timestamp for display
    const formatTime = (timestamp) => {
      if (!(timestamp instanceof Date)) {
        timestamp = new Date(timestamp);
      }
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    // Handle sending a new message
    const sendMessage = () => {
      if (!newMessage.value.trim() || !isConnected.value) return;
      
      const message = {
        sender: authStore.user?.name || 'You',
        text: newMessage.value,
        timestamp: new Date(),
        isMe: true
      };
      
      messages.value.push(message);
      newMessage.value = '';
      
      // Simulate a response after a short delay
      setTimeout(() => {
        const responses = [
          "That's interesting, tell me more!",
          "I understand what you're saying.",
          "That's a great point.",
          "I've never thought about it that way.",
          "Let me think about that for a moment."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        messages.value.push({
          sender: 'Chat Bot',
          text: randomResponse,
          timestamp: new Date(),
          isMe: false
        });
        
        // Scroll to bottom after message is added
        scrollToBottom();
      }, 1000);
      
      // Log the message to the console
      errorLogger.debug('Chat message sent', {
        text: message.text,
        timestamp: message.timestamp
      });
      
      // Scroll to bottom after our message is added
      scrollToBottom();
    };
    
    // Scroll chat to the latest message
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessages.value) {
          chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
      });
    };
    
    // Close chat if escape key is pressed
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        uiStore.closeChat();
      }
    };
    
    // Simulate some example messages
    onMounted(() => {
      // Add some sample messages for demo purposes
      messages.value = [
        {
          sender: 'System',
          text: 'Welcome to the chat! This is a demo version.',
          timestamp: new Date(Date.now() - 3600000),
          isMe: false
        },
        {
          sender: authStore.user?.name || 'You',
          text: 'Hello! I am looking for a web developer.',
          timestamp: new Date(Date.now() - 1800000),
          isMe: true
        },
        {
          sender: 'John Doe',
          text: 'Hi there! I am a web developer with 5 years of experience.',
          timestamp: new Date(Date.now() - 900000),
          isMe: false
        }
      ];
      
      isConnected.value = true;
      
      // Simulate connection status
      setTimeout(() => {
        errorLogger.info('Chat connected to server');
      }, 1000);
      
      // Add event listener for Escape key
      window.addEventListener('keydown', handleKeyDown);
      
      // Scroll to bottom when component is mounted
      scrollToBottom();
    });
    
    // Remove event listener when component is unmounted
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
    
    // Watch for UI store chat open state to scroll to bottom
    watch(() => uiStore.isChatOpen, (isOpen) => {
      if (isOpen) {
        scrollToBottom();
      }
    });
    
    return {
      uiStore,
      messages,
      newMessage,
      isConnected,
      chatMessages,
      sendMessage,
      formatTime
    };
  }
});
</script>
