<template>
  <div class="table-form-container">
    <h2>{{ editMode ? 'Tisch bearbeiten' : 'Neuen Tisch erstellen' }}</h2>
    
    <form
      class="table-form"
      @submit.prevent="saveTable"
    >
      <!-- Basisdaten -->
      <div class="form-section">
        <h3>Allgemeine Informationen</h3>
        
        <div class="form-group">
          <label for="table-name">Name des Tisches</label>
          <input
            id="table-name"
            v-model="formData.name"
            type="text"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="description">Beschreibung</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select
              id="status"
              v-model="formData.status"
            >
              <option value="active">
                Aktiv
              </option>
              <option value="scheduled">
                Geplant
              </option>
              <option value="finished">
                Abgeschlossen
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="table-date">Datum</label>
            <input
              id="table-date"
              v-model="formData.date"
              type="date"
            >
          </div>
          
          <div class="form-group">
            <label for="table-time">Zeit</label>
            <input
              id="table-time"
              v-model="formData.time"
              type="time"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="max-participants">Maximale Teilnehmerzahl</label>
          <input
            id="max-participants"
            v-model.number="formData.maxParticipants"
            type="number"
            min="1"
            step="1"
          >
        </div>
      </div>
      
      <!-- Themen -->
      <div class="form-section">
        <h3>Themen</h3>
        
        <div class="tag-input">
          <input 
            v-model="newTopic" 
            type="text" 
            placeholder="Thema eingeben und Enter drücken"
            @keyup.enter="addTopic"
          >
          <div class="tags-container">
            <span
              v-for="(topic, index) in formData.topics"
              :key="index"
              class="tag topic-tag"
            >
              {{ topic }}
              <button
                type="button"
                class="remove-tag"
                @click="removeTopic(index)"
              >&times;</button>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Gastgeber -->
      <div class="form-section">
        <h3>Gastgeber</h3>
        
        <div class="form-group">
          <label for="host-name">Name des Gastgebers</label>
          <input
            id="host-name"
            v-model="formData.host.name"
            type="text"
          >
        </div>
        
        <div class="form-group">
          <label for="host-details">Weitere Informationen zum Gastgeber</label>
          <textarea
            id="host-details"
            v-model="formData.host.details"
            rows="2"
          />
        </div>
      </div>
      
      <!-- Ort -->
      <div class="form-section">
        <h3>Ort</h3>
        
        <div class="form-group">
          <label for="location-address">Adresse</label>
          <input
            id="location-address"
            v-model="formData.location.address"
            type="text"
            required
          >
          <small class="form-hint">Die genaue Adresse wird benutzt, um den Tisch auf der Karte anzuzeigen</small>
        </div>
        
        <div class="form-group">
          <label for="location-details">Zusätzliche Hinweise zum Ort</label>
          <textarea
            id="location-details"
            v-model="formData.location.details"
            rows="2"
          />
          <small class="form-hint">z.B. "Im Hinterhof", "2. Etage" oder "Eingang an der Südseite"</small>
        </div>
        
        <div class="map-preview">
          <!-- Placeholder for Map Preview -->
          <div class="map-placeholder">
            <i class="bi bi-map" />
            <p>Kartenvorschau (wird nach dem Speichern angezeigt)</p>
          </div>
        </div>
      </div>
      
      <!-- Video-Meeting -->
      <div class="form-section">
        <h3>Video-Meeting</h3>
        
        <div class="form-group">
          <div class="checkbox-group">
            <input
              id="has-video-call"
              v-model="formData.hasVideoCall"
              type="checkbox"
            >
            <label for="has-video-call">BigBlueButton Meeting für diesen Tisch aktivieren</label>
          </div>
          <small class="form-hint">Ein Video-Meeting-Link wird automatisch generiert und kann von Teilnehmern genutzt werden</small>
        </div>
        
        <div
          v-if="formData.hasVideoCall"
          class="form-group"
        >
          <label for="video-call-link">Meeting-Link</label>
          <div class="input-with-button">
            <input
              id="video-call-link"
              v-model="formData.videoCallLink"
              type="text"
              readonly
            >
            <button
              type="button"
              class="copy-btn"
              @click="copyVideoLink"
            >
              <i class="bi bi-clipboard" /> Kopieren
            </button>
          </div>
          <small class="form-hint">Sie können diesen Link mit den Teilnehmern teilen</small>
        </div>
      </div>
      
      <!-- Aktuelle Teilnehmer -->
      <div
        v-if="editMode && formData.participants && formData.participants.length > 0"
        class="form-section"
      >
        <h3>Aktuelle Teilnehmer</h3>
        
        <div class="participants-list">
          <div
            v-for="(participant, index) in formData.participants"
            :key="participant.id"
            class="participant-item"
          >
            <div class="participant-info">
              <span class="participant-name">{{ participant.name }}</span>
              <input
                v-model="participant.role"
                type="text"
                placeholder="Rolle (optional)"
              >
            </div>
            <button
              type="button"
              class="remove-btn"
              @click="removeParticipant(index)"
            >
              Entfernen
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button
          type="button"
          class="cancel-btn"
          @click="$emit('cancel')"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          class="save-btn"
          @click="saveTable"
        >
          {{ editMode ? 'Speichern' : 'Erstellen' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableForm',
  
  props: {
    tableData: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: null
    }
  },
  
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        description: '',
        status: 'active',
        date: '',
        time: '',
        maxParticipants: 10,
        topics: [],
        host: {
          name: '',
          details: ''
        },
        location: {
          address: '',
          details: '',
          coordinates: null // Would be populated after geocoding
        },
        hasVideoCall: false,
        videoCallLink: '',
        participants: []
      },
      newTopic: ''
    }
  },
  created() {
    // Set the host to the current user if available
    if (this.currentUser && !this.editMode) {
      this.formData.host.name = this.currentUser.name || '';
    }
    
    if (this.tableData) {
      // Deep copy to avoid mutating props
      this.formData = JSON.parse(JSON.stringify(this.tableData));
      
      // Ensure all nested objects exist
      if (!this.formData.topics) this.formData.topics = [];
      if (!this.formData.host) this.formData.host = { name: '', details: '' };
      if (!this.formData.location) this.formData.location = { address: '', details: '', coordinates: null };
      if (!this.formData.participants) this.formData.participants = [];
      
      // Generate video call link if it doesn't exist but should be enabled
      if (this.formData.hasVideoCall && !this.formData.videoCallLink) {
        this.formData.videoCallLink = this.generateVideoLink();
      }
    }
  },
  methods: {
    saveTable() {
      // Clone the form data to avoid reference issues
      const tableData = JSON.parse(JSON.stringify(this.formData));
      
      // Generate ID if new table
      if (!this.editMode) {
        tableData.id = Date.now();
      }
      
      // Generate video call link if needed
      if (tableData.hasVideoCall && !tableData.videoCallLink) {
        tableData.videoCallLink = this.generateVideoLink();
      }
      
      // Add the current user as host if not set
      if (!tableData.host.name && this.currentUser) {
        tableData.host.name = this.currentUser.name;
      }
      
      this.$emit('save', tableData);
    },
    
    // Topic methods
    addTopic() {
      if (this.newTopic.trim() && !this.formData.topics.includes(this.newTopic.trim())) {
        this.formData.topics.push(this.newTopic.trim());
        this.newTopic = '';
      }
    },
    
    removeTopic(index) {
      this.formData.topics.splice(index, 1);
    },
    
    // Participant methods
    removeParticipant(index) {
      this.formData.participants.splice(index, 1);
    },
    
    // Video call methods
    generateVideoLink() {
      // In a real application, this would call an API to create a BBB meeting
      // For this prototype, we'll just generate a fake link
      const baseUrl = 'https://bbb.dreammall.org/join/';
      const roomId = Math.random().toString(36).substring(2, 12);
      return `${baseUrl}${roomId}`;
    },
    
    copyVideoLink() {
      if (!this.formData.videoCallLink) return;
      
      navigator.clipboard.writeText(this.formData.videoCallLink)
        .then(() => {
          alert('Link in die Zwischenablage kopiert!');
        })
        .catch(err => {
          console.error('Konnte nicht in die Zwischenablage kopieren: ', err);
        });
    }
  }
})
</script>

<style scoped>

.table-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.table-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-section {
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
}

.form-section h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #4f46e5;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group input {
  width: auto;
}

.checkbox-group label {
  margin-bottom: 0;
  cursor: pointer;
}

input[type="text"],
input[type="date"],
input[type="time"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}

.input-with-button {
  display: flex;
}

.input-with-button input {
  flex-grow: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.copy-btn {
  padding: 8px 12px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4b5563;
}

.copy-btn:hover {
  background-color: #e5e7eb;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.tag-input {
  margin-bottom: 10px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.topic-tag {
  background-color: #ede9fe;
  color: #6d28d9;
}

.remove-tag {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 5px;
  padding: 0 3px;
}

.map-preview {
  margin: 15px 0;
  height: 200px;
  border-radius: 6px;
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
  font-size: 2rem;
  margin-bottom: 10px;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
}

.participant-name {
  font-weight: 500;
  margin-right: 15px;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
}

.cancel-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn:hover {
  background-color: #4338ca;
}
</style>
