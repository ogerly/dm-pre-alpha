<template>
  <div class="project-container">
    <div class="project-header">
      <div class="project-title">
        <h2>{{ project.name }}</h2>
        <div class="project-status" :class="project.status">{{ project.status }}</div>
      </div>
      <div class="project-meta">
        <div class="meta-item" v-if="project.startDate">
          <i class="bi bi-calendar3"></i>
          Start: {{ formatDate(project.startDate) }}
        </div>
        <div class="meta-item" v-if="project.endDate">
          <i class="bi bi-calendar3"></i>
          Ende: {{ formatDate(project.endDate) }}
        </div>
      </div>
    </div>
    
    <div class="project-content">
      <div class="project-info">
        <div class="info-section description">
          <h3>Projektbeschreibung</h3>
          <p>{{ project.description }}</p>
        </div>
        
        <div class="info-section" v-if="project.goals && project.goals.length">
          <h3>Projektziele</h3>
          <ul class="goals-list">
            <li v-for="(goal, index) in project.goals" :key="index">{{ goal }}</li>
          </ul>
        </div>
        
        <div class="info-section">
          <h3>Kategorien & Tags</h3>
          <div class="tag-container">
            <span v-for="(category, index) in project.categories" :key="'cat-'+index" class="tag category-tag">
              {{ category }}
            </span>
            <span v-for="(tag, index) in project.tags" :key="'tag-'+index" class="tag tag-item">
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="info-section" v-if="project.requiredSkills && project.requiredSkills.length">
          <h3>Gesuchte Fähigkeiten</h3>
          <div class="tag-container">
            <span v-for="(skill, index) in project.requiredSkills" :key="index" class="tag skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
        
        <div class="info-section" v-if="project.team && project.team.length">
          <h3>Projektteam</h3>
          <div class="team-list">
            <div v-for="(member, index) in project.team" :key="index" class="team-member">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-role">{{ member.role }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="project-map-section">
        <div class="map-header">
          <h3 v-if="project.location">Projektstandort</h3>
          <div class="location-info" v-if="project.location">
            <i class="bi bi-geo-alt"></i>
            {{ project.location.address }}
          </div>
        </div>
        
        <!-- Placeholder for Map - Would be replaced with actual map component -->
        <div class="map-container" v-if="project.location || (project.radius && project.radius.center)">
          <div class="map-overlay">
            <div class="map-info">
              <p v-if="project.location">
                <strong>Standort:</strong> {{ project.location.address }}
              </p>
              <p v-if="project.radius">
                <strong>Wirkungsbereich:</strong> {{ project.radius.distance }}km
              </p>
            </div>
          </div>
          <div class="map-placeholder">
            <i class="bi bi-map"></i>
            <p>Karte wird geladen...</p>
          </div>
        </div>
        
        <div class="radius-info" v-if="project.radius">
          <h4>Wirkungsbereich</h4>
          <p>Der Wirkungsbereich des Projekts erstreckt sich über {{ project.radius.distance }}km um den Standort.</p>
        </div>
        
        <div class="collaboration-info" v-if="project.collaboration">
          <h3>Zusammenarbeit</h3>
          <div class="collab-item">
            <div class="collab-label">Art:</div>
            <div class="collab-value">{{ project.collaboration.type }}</div>
          </div>
          <div class="collab-item">
            <div class="collab-label">Verfügbarkeit:</div>
            <div class="collab-value">{{ project.collaboration.availability }}</div>
          </div>
          <div class="collab-item" v-if="project.collaboration.notes">
            <div class="collab-label">Hinweise:</div>
            <div class="collab-value">{{ project.collaboration.notes }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="project-actions">
      <button v-if="project.status === 'Offen'" class="join-btn" @click="joinProject">
        <i class="bi bi-person-plus"></i> Mitarbeiten
      </button>
      <button class="edit-btn" @click="$emit('edit')">
        <i class="bi bi-pencil"></i> Bearbeiten
      </button>
      <button class="back-btn" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i> Zurück
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('de-DE').format(date);
    },
    joinProject() {
      this.$emit('join');
    }
  }
}
</script>

<style scoped>

.project-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.project-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.project-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-title h2 {
  margin: 0;
  color: #111827;
}

.project-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-status.Offen {
  background-color: #dcfce7;
  color: #166534;
}

.project-status.Laufend {
  background-color: #dbeafe;
  color: #1e40af;
}

.project-status.Abgeschlossen {
  background-color: #f3f4f6;
  color: #4b5563;
}

.project-meta {
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

.project-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .project-content {
    grid-template-columns: 1fr;
  }
}

.project-info {
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

.goals-list {
  padding-left: 20px;
  margin: 0;
}

.goals-list li {
  margin-bottom: 5px;
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

.category-tag {
  background-color: #f3e8ff;
  color: #7e22ce;
}

.tag-item {
  background-color: #f1f5f9;
  color: #475569;
}

.skill-tag {
  background-color: #e0f2fe;
  color: #0369a1;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-member {
  padding: 10px;
  border-left: 3px solid #4f46e5;
  background-color: #f9fafb;
}

.member-name {
  font-weight: 500;
  color: #111827;
}

.member-role {
  color: #6b7280;
  font-size: 0.9rem;
}

.project-map-section {
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
  height: 300px;
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

.radius-info {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 12px 15px;
}

.radius-info h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #374151;
}

.radius-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.collaboration-info {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 12px 15px;
}

.collaboration-info h3 {
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 1.1rem;
}

.collab-item {
  display: flex;
  margin-bottom: 5px;
}

.collab-label {
  font-weight: 500;
  min-width: 120px;
  color: #4b5563;
}

.collab-value {
  color: #6b7280;
}

.project-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.join-btn, .edit-btn, .back-btn {
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

.edit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  margin-left: auto;
  margin-right: 10px;
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