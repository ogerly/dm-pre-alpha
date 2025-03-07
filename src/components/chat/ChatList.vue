<template>
  <div class="chat-list-container">
    <h3>Deine Gespräche</h3>
    
    <div
      v-if="conversations.length === 0"
      class="no-chats"
    >
      <p>Du hast noch keine Gespräche.</p>
      <p>Starte ein Gespräch mit einem Match.</p>
    </div>
    
    <ul
      v-else
      class="conversations"
    >
      <li 
        v-for="conversation in conversations" 
        :key="conversation.id"
        class="conversation-item"
        :class="{ 'active': activeConversationId === conversation.id }"
        @click="selectConversation(conversation)"
      >
        <div class="user-info">
          <strong>{{ getUserName(conversation.otherUserId) }}</strong>
          <span class="last-message">{{ truncateText(conversation.lastMessage.text, 30) }}</span>
        </div>
        <div class="conversation-meta">
          <span class="time">{{ formatTime(conversation.lastMessage.timestamp) }}</span>
          <span
            v-if="conversation.unread > 0"
            class="unread-badge"
          >{{ conversation.unread }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserConversations } from '../../services/ChatService.js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatList',
  
  props: {
    currentUserId: {
      type: Number,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    activeConversationId: {
      type: String,
      default: null
    }
  },
  
  emits: ['select-conversation'],
  data() {
    return {
      conversations: []
    };
  },
  created() {
    this.loadConversations();
    // In a real app, you would set up a WebSocket or polling here
    setInterval(this.loadConversations, 5000);
  },
  methods: {
    loadConversations() {
      this.conversations = getUserConversations(this.currentUserId);
    },
    selectConversation(conversation) {
      this.$emit('select-conversation', conversation);
    },
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? user.name : 'Unbekannter Nutzer';
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Gestern';
      } else {
        return date.toLocaleDateString();
      }
    }
  }
});
</script>

<style scoped>
.chat-list-container {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  height: 100%;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #374151;
}

.no-chats {
  color: #6b7280;
  text-align: center;
  padding: 20px 0;
}

.conversations {
  list-style: none;
  padding: 0;
  margin: 0;
}

.conversation-item {
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  transition: background-color 0.2s;
  background-color: white;
}

.conversation-item:hover {
  background-color: #f3f4f6;
}

.conversation-item.active {
  background-color: #e0f2fe;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.last-message {
  color: #6b7280;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.unread-badge {
  background-color: #4f46e5;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-top: 4px;
}
</style>
