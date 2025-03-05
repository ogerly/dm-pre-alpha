<template>
  <div class="video-chat-container">
    <div v-if="!roomId" class="create-room">
      <h2>WebRTC Video Chat</h2>
      <p>Erstelle einen neuen Videochat-Raum oder tritt einem bestehenden bei.</p>
      <button @click="createRoom" class="create-button">Neuen Raum erstellen</button>
      
      <div class="join-room">
        <h3>Einem Raum beitreten</h3>
        <input 
          v-model="joinRoomId" 
          placeholder="Raum-ID eingeben" 
          class="room-input"
        />
        <button @click="joinRoom" class="join-button">Beitreten</button>
      </div>
    </div>

    <div v-else class="room-container">
      <div class="room-info">
        <h2>Raum: {{ roomId }}</h2>
        <div class="invite-link">
          <p>Einladungslink:</p>
          <div class="link-container">
            <input 
              ref="inviteLink" 
              :value="inviteUrl" 
              readonly 
              class="invite-input"
            />
            <button @click="copyInviteLink" class="copy-button">
              Kopieren
            </button>
          </div>
          <p v-if="copySuccess" class="copy-success">Link kopiert!</p>
        </div>
        <p>Teilnehmer: {{ participants.length }}/4</p>
        <button @click="leaveRoom" class="leave-button">Raum verlassen</button>
      </div>

      <div class="videos-container">
        <div class="local-video-container">
          <video 
            ref="localVideo" 
            autoplay 
            muted 
            playsinline 
            class="local-video"
          ></video>
          <div class="video-controls">