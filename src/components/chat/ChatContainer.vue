<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>Chats</h3>
      <button
        class="close-btn"
        @click="$emit('close')"
      >
        &times;
      </button>
    </div>
    
    <div class="chat-content">
      <div class="chat-sidebar">
        <ChatList 
          :current-user-id="currentUserId" 
          :users="users"
          :active-conversation-id="activeConversationId"
          @select-conversation="selectConversation" 
        />
      </div>
      <div class="chat-main">
        <div
          v-if="!selectedUser"
          class="no-chat-selected"
        >
          <p>Wähle ein Gespräch aus oder starte ein neues mit einem deiner Matches.</p>
        </div>
        <ChatWindow 
          v-else
          :current-user-id="currentUserId"
          :other-user="selectedUser"
          :conversation-id="activeConversationId"
          @close="closeChat"
        />
      </div>
    </div>
    
    <!-- Floating chat button for mobile -->
    <button
      v-if="isMobile"
      class="floating-chat-btn"
      @click="showMobileChats = !showMobileChats"
    >
      <span class="icon">💬</span>
      <span
        v-if="totalUnread > 0"
        class="badge"
      >{{ totalUnread }}</span>
    </button>
    
    <!-- Mobile chat overlay -->
    <div
      v-if="isMobile && showMobileChats"
      class="mobile-chat-overlay"
    >
      <div class="mobile-chat-content">
        <div class="mobile-header">
          <h2>Chats</h2>
          <button
            class="close-btn"
            @click="showMobileChats = false"
          >
            ×
          </button>
        </div>
        <ChatList 
          :current-user-id="currentUserId" 
          :users="users"
          :active-conversation-id="activeConversationId"
          @select-conversation="selectMobileConversation" 
        />
      </div>
    </div>
    
    <!-- Mobile active chat -->
    <div
      v-if="isMobile && activeMobileChat"
      class="mobile-active-chat"
    >
      <ChatWindow 
        :current-user-id="currentUserId"
        :other-user="selectedUser"
        :conversation-id="activeConversationId"
        @close="closeMobileChat"
      />
    </div>
  </div>
</template>

<script>
import ChatList from './ChatList.vue';
import ChatWindow from './ChatWindow.vue';
import { getConversationId, getUserConversations } from '../../services/ChatService.js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatContainer',
  
  components: {
    ChatList,
    ChatWindow
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
  
  // Add emits declaration
  emits: ['close'],
  data() {
    return {
      selectedUser: null,
      activeConversationId: null,
      isMobile: false,
      showMobileChats: false,
      activeMobileChat: false
    };
  },
  computed: {
    totalUnread() {
      const conversations = getUserConversations(this.currentUserId);
      return conversations.reduce((total, conv) => total + conv.unread, 0);
    }
  },
  watch: {
    // Watch for initialOtherUserId changes to open chats automatically
    initialOtherUserId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.openChatWithUser(newVal);
        }
      }
    }
  },
  created() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // If initialOtherUserId is provided, open that chat
    if (this.initialOtherUserId) {
      const otherUser = this.users.find(u => u.id === this.initialOtherUserId);
      if (otherUser) {
        this.selectUser(otherUser);
      }
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    selectConversation(conversation) {
      const otherUser = this.users.find(u => u.id === conversation.otherUserId);
      if (otherUser) {
        this.selectedUser = otherUser;
        this.activeConversationId = conversation.id;
      }
    },
    selectUser(user) {
      this.selectedUser = user;
      this.activeConversationId = getConversationId(this.currentUserId, user.id);
    },
    closeChat() {
      this.selectedUser = null;
      this.activeConversationId = null;
    },
    selectMobileConversation(conversation) {
      this.selectConversation(conversation);
      this.showMobileChats = false;
      this.activeMobileChat = true;
    },
    closeMobileChat() {
      this.closeChat();
      this.activeMobileChat = false;
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
    // Enhanced method to find and open chat with a specific user
    openChatWithUser(userId) {
      const otherUser = this.users.find(u => u.id === userId);
      if (otherUser) {
        this.selectedUser = otherUser;
        this.activeConversationId = getConversationId(this.currentUserId, userId);
        if (this.isMobile) {
          this.showMobileChats = false;
          this.activeMobileChat = true;
        }
      }
    }
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 10px 15px;
  background-color: #4f46e5;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-content {
  display: flex;
  height: calc(100% - 42px); /* Subtract header height */
}

.chat-sidebar {
  width: 300px;
  border-right: 1px solid #e5e7eb;
}

.chat-main {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-chat-selected {
  color: #6b7280;
  text-align: center;
  padding: 20px;
}

.floating-chat-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #4f46e5;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
}

.mobile-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-chat-content {
  width: 90%;
  height: 80%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  padding: 15px;
  background-color: #4f46e5;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.mobile-active-chat {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  background-color: white;
}

@media (max-width: 767px) {
  .chat-sidebar, .chat-main {
    display: none;
  }
}
</style>
