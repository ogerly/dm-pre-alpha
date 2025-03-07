<template>
  <div
    v-if="user"
    class="profile-container"
  >
    <div class="profile-header">
      <h2>{{ user.name }}</h2>
      <p class="bio">
        {{ user.bio }}
      </p>
    </div>
    
    <div class="profile-details">
      <!-- Icon Categories -->
      <div
        v-if="user.iconCategories"
        class="section icon-categories"
      >
        <h3>Standorte & Aktivitäten</h3>
        
        <!-- Home -->
        <div
          v-if="user.iconCategories.home"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-home" />
            <h4>Wohnort</h4>
          </div>
          <div class="icon-content">
            <p><strong>{{ user.iconCategories.home.address }}</strong></p>
            <p>{{ user.iconCategories.home.description }}</p>
          </div>
        </div>
        
        <!-- Firma -->
        <div
          v-if="user.iconCategories.firma"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-building" />
            <h4>Firma</h4>
          </div>
          <div class="icon-content">
            <p><strong>{{ user.iconCategories.firma.name }}</strong></p>
            <p>{{ user.iconCategories.firma.role }} ({{ user.iconCategories.firma.year }})</p>
            <p>{{ user.iconCategories.firma.description }}</p>
          </div>
        </div>
        
        <!-- Wirkungsbereich -->
        <div
          v-if="user.iconCategories.wirkungsbereich && user.iconCategories.wirkungsbereich.length"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-compass" />
            <h4>Wirkungsbereich</h4>
          </div>
          <div class="icon-content">
            <div class="tags">
              <span
                v-for="(location, index) in user.iconCategories.wirkungsbereich"
                :key="index"
                class="tag location-tag"
              >
                {{ location }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Unternehmen -->
        <div
          v-if="user.iconCategories.unternehmen && user.iconCategories.unternehmen.length"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-briefcase" />
            <h4>Unternehmen</h4>
          </div>
          <div class="icon-content">
            <div class="company-list">
              <div
                v-for="(company, index) in user.iconCategories.unternehmen"
                :key="index"
                class="company-item"
              >
                <h5>{{ company.name }}</h5>
                <p>{{ company.role }} <span v-if="company.period || company.year">({{ company.period || company.year }})</span></p>
                <p v-if="company.description">
                  {{ company.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Projekt -->
        <div
          v-if="user.iconCategories.projekt && user.iconCategories.projekt.length"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-folder" />
            <h4>Projekte</h4>
          </div>
          <div class="icon-content">
            <div class="project-list">
              <div
                v-for="(project, index) in user.iconCategories.projekt"
                :key="index"
                class="project-item"
              >
                <h5>{{ project.name }}</h5>
                <p v-if="project.role">
                  <em>{{ project.role }}</em>
                </p>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                  <span v-if="project.year">{{ project.year }}</span>
                  <span v-if="project.note">{{ project.note }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tisch -->
        <div
          v-if="user.iconCategories.tisch && user.iconCategories.tisch.length"
          class="icon-category"
        >
          <div class="icon-header">
            <i class="fas fa-table" />
            <h4>Meetups & Veranstaltungen</h4>
          </div>
          <div class="icon-content">
            <div class="table-list">
              <div
                v-for="(table, index) in user.iconCategories.tisch"
                :key="index"
                class="table-item"
              >
                <h5>{{ table.name }}</h5>
                <p>{{ table.description }}</p>
                <p v-if="table.location">
                  <i class="fas fa-map-marker-alt" /> {{ table.location }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interessen -->
      <div
        v-if="user.interests && user.interests.length"
        class="section"
      >
        <h3>Interessen</h3>
        <div class="tags">
          <span
            v-for="(interest, index) in user.interests"
            :key="index"
            class="tag interest-tag"
          >{{ interest }}</span>
        </div>
      </div>

      <!-- Fähigkeiten -->
      <div
        v-if="user.skills && user.skills.length"
        class="section"
      >
        <h3>Fähigkeiten</h3>
        <div class="tags">
          <span
            v-for="(skill, index) in user.skills"
            :key="index"
            class="tag skill-tag"
          >{{ skill }}</span>
        </div>
      </div>
      
      <!-- Ausbildung -->
      <div
        v-if="user.education && user.education.length"
        class="section"
      >
        <h3>Ausbildung</h3>
        <div class="timeline">
          <div
            v-for="(edu, index) in user.education"
            :key="index"
            class="timeline-item"
          >
            <span class="timeline-period">{{ edu.period }}</span>
            <div class="timeline-content">
              <span class="timeline-title">{{ edu.title }}</span>
              <span class="timeline-subtitle">{{ edu.institution }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Berufserfahrung -->
      <div
        v-if="user.experience && user.experience.length"
        class="section"
      >
        <h3>Berufserfahrung</h3>
        <div class="timeline">
          <div
            v-for="(exp, index) in user.experience"
            :key="index"
            class="timeline-item"
          >
            <span class="timeline-period">{{ exp.period }}</span>
            <div class="timeline-content">
              <span class="timeline-title">{{ exp.role }}</span>
              <span class="timeline-subtitle">{{ exp.company }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Eigene Projekte -->
      <div
        v-if="user.ownProjects && user.ownProjects.length"
        class="section"
      >
        <h3>Realisierte Projekte</h3>
        <div class="project-cards">
          <div
            v-for="(project, index) in user.ownProjects"
            :key="index"
            class="project-card"
          >
            <h4>{{ project.name }}</h4>
            <p>{{ project.description }}</p>
            <div class="project-meta">
              <span class="project-year">{{ project.year }}</span>
              <span
                v-if="project.note"
                class="project-note"
              >{{ project.note }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projekte mit Beteiligung -->
      <div
        v-if="user.contributedProjects && user.contributedProjects.length"
        class="section"
      >
        <h3>Projektbeteiligungen</h3>
        <div class="project-cards">
          <div
            v-for="(project, index) in user.contributedProjects"
            :key="index"
            class="project-card"
          >
            <h4>{{ project.name }}</h4>
            <span class="project-role">{{ project.role }}</span>
            <p>{{ project.description }}</p>
            <span class="project-year">{{ project.year }}</span>
          </div>
        </div>
      </div>
      
      <!-- Unternehmen -->
      <div
        v-if="user.companies && user.companies.length"
        class="section"
      >
        <h3>Unternehmen</h3>
        <div class="company-list">
          <div
            v-for="(company, index) in user.companies"
            :key="index"
            class="company-item"
          >
            <h4>{{ company.name }}</h4>
            <span class="company-role">{{ company.role }} ({{ company.year }})</span>
            <p>{{ company.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Dienstleistungen -->
      <div
        v-if="user.services && user.services.length"
        class="section"
      >
        <h3>Dienstleistungen</h3>
        <ul class="service-list">
          <li
            v-for="(service, index) in user.services"
            :key="index"
          >
            {{ service }}
          </li>
        </ul>
      </div>
      
      <div
        v-if="user.dreammallGoals"
        class="section goals-section"
      >
        <h3>Ziele bei DreamMall</h3>
        <div class="quote-container">
          <p class="quote">
            {{ user.dreammallGoals }}
          </p>
        </div>
      </div>
      
      <!-- Präferenzen -->
      <div
        v-if="user.collaborationPreferences || user.leadershipPhilosophy || user.educationOpinion || user.valueOrientation"
        class="preferences-section"
      >
        <h3>Präferenzen & Einstellungen</h3>
        
        <div
          v-if="user.collaborationPreferences"
          class="preference-item"
        >
          <h4>Zusammenarbeit</h4>
          <p>{{ user.collaborationPreferences }}</p>
        </div>
        
        <div
          v-if="user.leadershipPhilosophy"
          class="preference-item"
        >
          <h4>Führungsstil</h4>
          <p>{{ user.leadershipPhilosophy }}</p>
        </div>
        
        <div
          v-if="user.educationOpinion"
          class="preference-item"
        >
          <h4>Bildungssystem</h4>
          <p>{{ user.educationOpinion }}</p>
        </div>
        
        <div
          v-if="user.valueOrientation"
          class="preference-item"
        >
          <h4>Werte</h4>
          <p>{{ user.valueOrientation }}</p>
        </div>
      </div>
      
      <!-- Allgemeine Ziele -->
      <div
        v-if="user.goals"
        class="section"
      >
        <h3>Allgemeine Ziele</h3>
        <p>{{ user.goals }}</p>
      </div>
    </div>
    
    <button
      class="back-button"
      @click="$emit('close')"
    >
      Zurück zur Liste
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfile',
  
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  emits: ['close']
})
</script>

<style scoped>

.profile-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
}

.profile-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.bio {
  color: #666;
  font-style: italic;
}

.section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

h3 {
  color: #374151;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

h4 {
  color: #4b5563;
  font-size: 1rem;
  margin-bottom: 5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.skill-tag {
  background-color: #e0f2fe;
  color: #0369a1;
}

.interest-tag {
  background-color: #dcfce7;
  color: #166534;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-item {
  display: flex;
  gap: 15px;
}

.timeline-period {
  min-width: 80px;
  font-weight: bold;
  color: #4b5563;
}

.timeline-content {
  display: flex;
  flex-direction: column;
}

.timeline-title {
  font-weight: medium;
}

.timeline-subtitle {
  color: #6b7280;
  font-size: 0.9rem;
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.project-card {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 6px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.85rem;
}

.project-role {
  display: block;
  font-style: italic;
  color: #4b5563;
  margin-bottom: 5px;
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.company-item {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.company-role {
  display: block;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.service-list {
  list-style-type: disc;
  padding-left: 20px;
}

.service-list li {
  margin-bottom: 5px;
}

.goals-section {
  margin-top: 30px;
}

.quote-container {
  background-color: #f3f4f6;
  padding: 15px;
  border-left: 4px solid #4f46e5;
  border-radius: 0 4px 4px 0;
}

.quote {
  font-style: italic;
  color: #1f2937;
}

.preferences-section {
  margin-top: 20px;
}

.preference-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.back-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 0.95rem;
}

.back-button:hover {
  background-color: #4338ca;
}

.icon-categories {
  margin-bottom: 30px;
}

.icon-category {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.icon-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon-header i {
  font-size: 1.3rem;
  margin-right: 10px;
  color: #4f46e5;
}

.icon-header h4 {
  margin: 0;
  color: #374151;
}

.icon-content {
  padding-left: 30px;
}

.company-list, .project-list, .table-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.company-item, .project-item, .table-item {
  border-left: 3px solid #4f46e5;
  padding-left: 12px;
}

.company-item h5, .project-item h5, .table-item h5 {
  margin: 0 0 5px 0;
  color: #1f2937;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 5px;
}

.location-tag {
  background-color: #dbeafe;
  color: #2563eb;
}
</style>
