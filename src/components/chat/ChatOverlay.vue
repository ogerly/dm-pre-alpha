<template>
  <div class="fixed bottom-5 right-5 w-[680px] h-[500px] bg-white rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
    <!-- Chat Header -->
    <div class="bg-primary text-white p-3 flex justify-between items-center">
      <div class="font-medium">Chat</div>
      <button 
        @click="$emit('close')" 
        class="text-white hover:text-red-200 transition-colors"
      >
        <span class="text-xl">×</span>
      </button>
    </div>
    
    <!-- Chat Container -->
    <div class="flex-grow overflow-hidden">
      <ChatContainer 
        :currentUserId="currentUserId"
        :users="users"
        :initialOtherUserId="initialOtherUserId"
        @close="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import ChatContainer from '@/components/chat/ChatContainer.vue';

export default {
  name: 'ChatOverlay',
  
  components: {
    ChatContainer
  },
  
  props: {
    currentUserId: {
      type: Number,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    initialOtherUserId: {
      type: Number,
      default: null
    }
  },
  
  emits: ['close']
}
</script>
