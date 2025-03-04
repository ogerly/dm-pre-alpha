<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <ChatList 
        :currentUserId="currentUserId" 
        :users="users"
        :activeConversationId="activeConversationId"
        @select-conversation="selectConversation" 
      />
    </div>
    <div class="chat-main">
      <div v-if="!selectedUser" class="no-chat-selected">
        <p>Wähle ein Gespräch aus oder starte ein neues mit einem deiner Matches.</p>
      </div>
      <ChatWindow 
        v-else
        :currentUserId="currentUserId"
        :otherUser="selectedUser"
        :conversationId="activeConversationId"
        @close="closeChat"
      />
    </div>
    
    <!-- Floating chat button for mobile -->
    <button class="floating-chat-btn" @click="showMobileChats = !showMobileChats" v-if="isMobile">
      <span class="icon">💬</span>
      <span class="badge" v-if="totalUnread > 0">{{ totalUnread }}</span>
    </button>
    
    <!-- Mobile chat overlay -->
    <div class="mobile-chat-overlay" v-if="isMobile && showMobileChats">
      <div class="mobile-chat-content">
        <div class="mobile-header">
          <h2>Chats</h2>
          <button @click="showMobileChats = false" class="close-btn">×</button>
        </div>
        <ChatList 
          :currentUserId="currentUserId" 
          :users="users"
          :activeConversationId="activeConversationId"
          @select-conversation="selectMobileConversation" 
        />
      </div>
    </div>
    
    <!-- Mobile active chat -->
    <div class="mobile-active-chat" v-if="isMobile && activeMobileChat">
      <ChatWindow 
        :currentUserId="currentUserId"
        :otherUser="selectedUser"
        :conversationId="activeConversationId"
        @close="closeMobileChat"
      />
    </div>
  </div>
</template>

<script>
import ChatList from './ChatList.vue';
import ChatWindow from './ChatWindow.vue';
import { getConversationId, getUserConversations } from '../../services/ChatService.js';

export default {
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
  destroyed() {
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
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
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
