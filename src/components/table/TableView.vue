<template>
  <div class="table-container">
    <div class="table-header">
      <div class="table-title">
        <h2>{{ table.name }}</h2>
        <div
          class="table-status"
          :class="table.status || 'active'"
        >
          {{ table.status || 'Aktiv' }}
        </div>
      </div>
      <div class="table-meta">
        <div
          v-if="table.date"
          class="meta-item"
        >
          <i class="bi bi-calendar3" />
          Datum: {{ formatDate(table.date) }}
        </div>
        <div
          v-if="table.time"
          class="meta-item"
        >
          <i class="bi bi-clock" />
          Zeit: {{ table.time }}
        </div>
      </div>
    </div>
    
    <div class="table-content">
      <div class="table-info">
        <div class="info-section description">
          <h3>Beschreibung</h3>
          <p>{{ table.description }}</p>
        </div>
        
        <div
          v-if="table.topics && table.topics.length"
          class="info-section"
        >
          <h3>Themen</h3>
          <div class="tag-container">
            <span
              v-for="(topic, index) in table.topics"
              :key="index"
              class="tag topic-tag"
            >
              {{ topic }}
            </span>
          </div>
        </div>
        
        <div
          v-if="table.host"
          class="info-section"
        >
          <h3>Gastgeber</h3>
          <div class="host-info">
            <div class="host-name">
              {{ table.host.name }}
            </div>
            <div
              v-if="table.host.details"
              class="host-details"
            >
              {{ table.host.details }}
            </div>
          </div>
        </div>
        
        <div
          v-if="table.participants && table.participants.length"
          class="info-section"
        >
          <h3>Teilnehmer</h3>
          <div class="participants-list">
            <div
              v-for="(participant, index) in table.participants"
              :key="index"
              class="participant-item"
            >
              <div class="participant-name">
                {{ participant.name }}
              </div>
              <div
                v-if="participant.role"
                class="participant-role"
              >
                {{ participant.role }}
              </div>
            </div>
          </div>
        </div>
        
        <div
          v-if="table.maxParticipants"
          class="info-section"
        >
          <h3>Kapazität</h3>
          <div class="capacity-info">
            <div class="capacity-gauge">
              <div
                class="gauge-fill"
                :style="{ width: capacityPercentage + '%' }"
              />
            </div>
            <div class="capacity-numbers">
              {{ table.participants ? table.participants.length : 0 }} / {{ table.maxParticipants }} Plätze belegt
            </div>
          </div>
        </div>
      </div>
      
      <div class="table-map-section">
        <div class="map-header">
          <h3>Ort</h3>
          <div
            v-if="table.location"
            class="location-info"
          >
            <i class="bi bi-geo-alt" />
            {{ table.location.address }}
          </div>
        </div>
        
        <!-- Placeholder for Map - Would be replaced with actual map component -->
        <div class="map-container">
          <div
            v-if="table.location"
            class="map-overlay"
          >
            <div class="map-info">
              <p>
                <strong>Standort:</strong> {{ table.location.address }}
              </p>
              <p v-if="table.location.details">
                {{ table.location.details }}
              </p>
            </div>
          </div>
          <div class="map-placeholder">
            <i class="bi bi-map" />
            <p>Karte wird geladen...</p>
          </div>
        </div>
        
        <div
          v-if="table.hasVideoCall"
          class="video-call-section"
        >
          <h3>Video-Meeting</h3>
          <p class="video-info">
            Für diesen Tisch ist ein Video-Meeting mit BigBlueButton verfügbar.
          </p>
          <button
            class="join-video-btn"
            @click="joinVideoCall"
          >
            <i class="bi bi-camera-video" /> Video-Meeting beitreten
          </button>
        </div>
      </div>
    </div>
    
    <div class="table-actions">
      <button 
        v-if="canJoin" 
        class="join-btn" 
        @click="$emit('join', table.id)"
      >
        <i class="bi bi-person-plus" /> Teilnehmen
      </button>
      <button 
        v-if="isParticipant" 
        class="leave-btn" 
        @click="$emit('leave', table.id)"
      >
        <i class="bi bi-box-arrow-right" /> Verlassen
      </button>
      <button
        class="edit-btn"
        @click="$emit('edit', table)"
      >
        <i class="bi bi-pencil" /> Bearbeiten
      </button>
      <button
        class="back-btn"
        @click="$emit('back')"
      >
        <i class="bi bi-arrow-left" /> Zurück
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableView',
  
  props: {
    table: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: Number,
      default: null
    }
  },
  
  emits: ['edit', 'back', 'join', 'leave', 'join-video-call'],
  computed: {
    capacityPercentage() {
      if (!this.table.maxParticipants || this.table.maxParticipants === 0) return 0;
      const count = this.table.participants ? this.table.participants.length : 0;
      return Math.min(Math.round((count / this.table.maxParticipants) * 100), 100);
    },
    canJoin() {
      if (!this.currentUserId) return false;
      if (!this.table.participants) return true;
      if (this.table.maxParticipants && this.table.participants.length >= this.table.maxParticipants) return false;
      return !this.isParticipant;
    },
    isParticipant() {
      if (!this.currentUserId || !this.table.participants) return false;
      return this.table.participants.some(p => p.id === this.currentUserId);
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('de-DE').format(date);
    },
    joinTable() {
      this.$emit('join');
    },
    leaveTable() {
      this.$emit('leave');
    },
    joinVideoCall() {
      // Assuming the link is stored in the table object
      if (this.table.videoCallLink) {
        window.open(this.table.videoCallLink, '_blank');
      } else {
        // Fallback if no specific link is stored
        this.$emit('join-video-call');
      }
    }
  }
})
</script>

<style scoped>

.table-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.table-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.table-title h2 {
  margin: 0;
  color: #111827;
}

.table-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.table-status.active {
  background-color: #dcfce7;
  color: #166534;
}

.table-status.scheduled {
  background-color: #dbeafe;
  color: #1e40af;
}

.table-status.finished {
  background-color: #f3f4f6;
  color: #4b5563;
}

.table-meta {
  display: flex;
  gap: 20px;
  color: #6b7280;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.table-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .table-content {
    grid-template-columns: 1fr;
  }
}

.table-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f4f6;
}

.info-section h3 {
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 1.1rem;
}

.info-section.description p {
  line-height: 1.6;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.topic-tag {
  background-color: #ede9fe;
  color: #6d28d9;
}

.host-info {
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.host-name {
  font-weight: 500;
  color: #111827;
}

.host-details {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 4px;
}

.participants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.participant-item {
  padding: 6px 10px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 0.9rem;
}

.participant-name {
  color: #111827;
}

.participant-role {
  font-size: 0.85rem;
  color: #6b7280;
}

.capacity-info {
  margin-top: 5px;
}

.capacity-gauge {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.gauge-fill {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 3px;
}

.capacity-numbers {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: right;
}

.table-map-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.map-header {
  display: flex;
  flex-direction: column;
}

.map-header h3 {
  margin: 0 0 5px 0;
  color: #374151;
  font-size: 1.1rem;
}

.location-info {
  color: #6b7280;
  font-size: 0.95rem;
}

.map-container {
  position: relative;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
}

.map-placeholder {
  height: 100%;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.map-placeholder i {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.map-overlay {
  position: absolute;
  z-index: 10;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 6px;
  max-width: 80%;
}

.map-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.video-call-section {
  margin-top: 15px;
  background-color: #f0f9ff;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.video-call-section h3 {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 1.1rem;
}

.video-info {
  color: #6b7280;
  margin-bottom: 12px;
}

.join-video-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.join-video-btn:hover {
  background-color: #2563eb;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 12px;
}

.join-btn, .leave-btn, .edit-btn, .back-btn {
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.join-btn {
  background-color: #10b981;
  color: white;
  border: none;
  margin-right: auto;
}

.join-btn:hover {
  background-color: #059669;
}

.leave-btn {
  background-color: #f97316;
  color: white;
  border: none;
  margin-right: auto;
}

.leave-btn:hover {
  background-color: #ea580c;
}

.edit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #4338ca;
}

.back-btn {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.back-btn:hover {
  background-color: #e5e7eb;
}
</style>
