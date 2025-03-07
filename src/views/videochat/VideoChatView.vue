<template>
  <div class="video-chat-view">
    <AppHeader />
    
    <div class="container mx-auto py-6 px-4">
      <h1 class="text-2xl font-bold mb-6 dark:text-white">
        Video Chat
      </h1>
      
      <VideoChat />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import VideoChat from '@/components/videochat/VideoChat.vue';

export default defineComponent({
  name: 'VideoChatView',
  
  components: {
    AppHeader,
    VideoChat
  }
});
</script>

<style>
.video-chat-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #333;
  color: white;
  padding: 15px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.footer {
  background-color: #333;
  color: white;
  padding: 15px;
  text-align: center;
  margin-top: auto;
}
</style>