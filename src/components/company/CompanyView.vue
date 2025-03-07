<template>
  <div class="company-container">
    <div class="company-header">
      <h2>{{ company.name }}</h2>
      <div class="company-meta">
        <span v-if="company.foundedYear">Gegründet: {{ company.foundedYear }}</span>
        <span v-if="company.employees">Mitarbeiter: {{ company.employees }}</span>
      </div>
    </div>
    
    <div class="company-content">
      <div class="company-info">
        <div class="info-section description">
          <h3>Über das Unternehmen</h3>
          <p>{{ company.description }}</p>
        </div>
        
        <div class="info-section">
          <h3>Produkte & Dienstleistungen</h3>
          <div class="tag-container">
            <span
              v-for="(service, index) in company.services"
              :key="index"
              class="tag service-tag"
            >
              {{ service }}
            </span>
          </div>
        </div>
        
        <div
          v-if="company.industry"
          class="info-section"
        >
          <h3>Branche</h3>
          <p>{{ company.industry }}</p>
        </div>
        
        <div
          v-if="company.contactInfo"
          class="info-section"
        >
          <h3>Kontakt</h3>
          <p v-if="company.contactInfo.email">
            <i class="bi bi-envelope" /> {{ company.contactInfo.email }}
          </p>
          <p v-if="company.contactInfo.phone">
            <i class="bi bi-telephone" /> {{ company.contactInfo.phone }}
          </p>
          <p v-if="company.contactInfo.website">
            <i class="bi bi-globe" /> 
            <a
              :href="company.contactInfo.website"
              target="_blank"
            >{{ company.contactInfo.website }}</a>
          </p>
        </div>
        
        <div
          v-if="company.team && company.team.length"
          class="info-section"
        >
          <h3>Team</h3>
          <div class="team-members">
            <div
              v-for="(member, index) in company.team"
              :key="index"
              class="team-member"
            >
              <h4>{{ member.name }}</h4>
              <p>{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="company-map-section">
        <div class="map-header">
          <h3 v-if="company.location">
            Standort
          </h3>
          <div
            v-if="company.location"
            class="location-info"
          >
            <i class="bi bi-geo-alt" />
            {{ company.location.address }}
          </div>
        </div>
        
        <!-- Placeholder for Map - Would be replaced with actual map component -->
        <div
          v-if="company.location || (company.radius && company.radius.center)"
          class="map-container"
        >
          <div class="map-overlay">
            <div class="map-info">
              <p v-if="company.location">
                <strong>Standort:</strong> {{ company.location.address }}
              </p>
              <p v-if="company.radius">
                <strong>Wirkungsbereich:</strong> {{ company.radius.distance }}km
              </p>
            </div>
          </div>
          <div class="map-placeholder">
            <i class="bi bi-map" />
            <p>Karte wird geladen...</p>
          </div>
        </div>
        
        <div
          v-if="company.radius"
          class="radius-info"
        >
          <h4>Wirkungsbereich</h4>
          <p>Der Wirkungsbereich erstreckt sich über {{ company.radius.distance }}km um den Standort.</p>
        </div>
      </div>
    </div>
    
    <div class="action-buttons">
      <button
        class="edit-btn"
        @click="$emit('edit', company)"
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
  name: 'CompanyView',
  
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  
  emits: ['edit', 'back']
})
</script>

<style scoped>

.company-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.company-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.company-header h2 {
  margin: 0 0 10px 0;
  color: #111827;
}

.company-meta {
  display: flex;
  gap: 20px;
  color: #6b7280;
  font-size: 0.9rem;
}

.company-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .company-content {
    grid-template-columns: 1fr;
  }
}

.company-info {
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

.service-tag {
  background-color: #ede9fe;
  color: #6d28d9;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.team-member {
  padding: 12px;
  border-radius: 6px;
  background-color: #f9fafb;
}

.team-member h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.team-member p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.company-map-section {
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

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.edit-btn, .back-btn {
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
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
