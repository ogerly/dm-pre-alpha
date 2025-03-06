<template>
  <div class="chat-interface bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800">
    <!-- Connection status header -->
    <div class="px-4 py-3 bg-gray-100 border-b dark:bg-gray-700 dark:border-gray-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div 
            :class="[
              'w-3 h-3 rounded-full mr-2', 
              isConnected ? 'bg-green-500' : 'bg-red-500'
            ]"
          ></div>
          <span class="font-medium text-sm dark:text-white">
            {{ connectionStatus }}
          </span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-300">
          {{ userCount > 0 ? `${userCount} online` : '' }}
        </div>
      </div>
    </div>

    <!-- Messages container -->
    <div 
      ref="messagesContainer" 
      class="messages-container h-80 overflow-y-auto p-4 dark:bg-gray-800"
    >
      <div 
        v-if="messages.length === 0" 
        class="text-center text-gray-400 dark:text-gray-500 py-8"
      >
        No messages yet
      </div>
      
      <div 
        v-for="(msg, index) in messages" 
        :key="index" 
        :class="[
          'mb-3 max-w-3/4 p-3 rounded-lg',
          msg.isOwn 
            ? 'ml-auto bg-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
        ]"
      >
        <div class="flex items-center mb-1">
          <span 
            class="font-semibold text-xs"
            :class="{ 'text-white': msg.isOwn }"
          >
            {{ msg.isOwn ? 'You' : (msg.sender || 'Anonymous') }}
          </span>
          <span 
            class="ml-2 text-xs opacity-75"
            :class="{ 'text-white': msg.isOwn }"
          >
            {{ formatTime(msg.timestamp) }}
          </span>
        </div>
        <p :class="{ 'text-white': msg.isOwn }">{{ msg.text }}</p>
      </div>
    </div>

    <!-- Message input -->
    <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700">
      <form @submit.prevent="sendMessage" class="flex">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Type a message..." 
          class="flex-grow bg-white dark:bg-gray-800 dark:text-white px-3 py-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="!isConnected"
        />
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition"
          :disabled="!isConnected || !newMessage.trim()"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import chatService from '@/services/ChatService';
import { useErrorTracking } from '@/composables/useErrorTracking';

export default defineComponent({
  name: 'ChatInterface',
  
  setup() {
    const isConnected = ref(false);
    const socketId = ref(null);
    const userCount = ref(0);
    const messages = ref([]);
    const newMessage = ref('');
    const messagesContainer = ref(null);
    
    // Use enhanced error tracking for chat
    const { 
      trackChatConnection, 
      trackChatMessage,
      trackChatError,
      trackUserStatus,
      errorLogger
    } = useErrorTracking('ChatInterface');
    
    // Connection status text
    const connectionStatus = computed(() => {
      return isConnected.value 
        ? `Connected (ID: ${socketId.value?.substring(0, 6)}...)` 
        : 'Disconnected';
    });
    
    // Connect to chat service when component mounts
    onMounted(() => {
      setupChatService();
      chatService.connect();
      errorLogger.info('Chat interface initialized');
    });
    
    // Clean up when component unmounts
    onUnmounted(() => {
      cleanupChatService();
      chatService.disconnect();
      errorLogger.info('Chat interface destroyed');
    });
    
    // Set up event listeners
    const setupChatService = () => {
      chatService.on('connected', handleConnected);
      chatService.on('disconnected', handleDisconnected);
      chatService.on('chatMessage', handleChatMessage);
      chatService.on('userCount', handleUserCount);
    };
    
    // Remove event listeners
    const cleanupChatService = () => {
      chatService.off('connected', handleConnected);
      chatService.off('disconnected', handleDisconnected);
      chatService.off('chatMessage', handleChatMessage);
      chatService.off('userCount', handleUserCount);
    };
    
    // Event handlers
    const handleConnected = (data) => {
      isConnected.value = true;
      socketId.value = data.id;
      
      // Track connection with enhanced logging
      trackChatConnection('connected', data.id, {
        timestamp: new Date().toISOString(),
        serverInfo: data.message || 'Connected to chat server'
      });
      
      // Add system message
      addSystemMessage('Connected to chat server');
    };
    
    const handleDisconnected = () => {
      isConnected.value = false;
      
      // Track disconnection with enhanced logging
      trackChatConnection('disconnected', socketId.value, {
        reason: 'Socket server disconnected',
        timestamp: new Date().toISOString()
      });
      
      // Add system message
      addSystemMessage('Disconnected from chat server');
    };
    
    const handleChatMessage = (data) => {
      const isOwnMessage = data.id === socketId.value;
      
      // Track received message
      trackChatMessage('received', {
        id: data.id,
        from: data.id,
        timestamp: data.timestamp,
        content: data.message
      });
      
      // Add the message to our list
      messages.value.push({
        text: data.message,
        timestamp: new Date(data.timestamp || Date.now()),
        isOwn: isOwnMessage,
        sender: isOwnMessage ? 'You' : `User ${data.id.substring(0, 6)}...`
      });
      
      // Scroll to bottom after message arrives
      scrollToBottom();
    };
    
    const handleUserCount = (count) => {
      userCount.value = count;
      trackUserStatus('all', `${count} users online`);
    };
    
    // Send a new message
    const sendMessage = () => {
      if (!isConnected.value || !newMessage.value.trim()) return;
      
      try {
        const messageContent = newMessage.value;
        const success = chatService.sendMessage(messageContent);
        
        if (success) {
          // Track sent message
          trackChatMessage('sent', {
            content: messageContent,
            timestamp: new Date().toISOString(),
            from: socketId.value,
            to: 'all'
          }, true);
          
          newMessage.value = ''; // Clear input field
        } else {
          trackChatError('sending-message', new Error('Failed to send message'), {
            messageContent,
            socketId: socketId.value
          });
        }
      } catch (error) {
        trackChatError('sending-message', error, {
          messageContent: newMessage.value
        });
      }
    };
    
    // Add a system message
    const addSystemMessage = (text) => {
      messages.value.push({
        text,
        timestamp: new Date(),
        isSystem: true,
        sender: 'System'
      });
      
      scrollToBottom();
    };
    
    // Format timestamp for display
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    // Scroll messages container to bottom
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };
    
    return {
      isConnected,
      socketId,
      userCount,
      connectionStatus,
      messages,
      newMessage,
      messagesContainer,
      sendMessage,
      formatTime
    };
  }
});
</script>

<style scoped>
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5);
  border-radius: 3px;
}
</style>
