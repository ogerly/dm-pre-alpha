<template>
  <div class="profile-container" v-if="user">
    <div class="profile-header">
      <h2>{{ user.name }}</h2>
      <p class="bio">{{ user.bio }}</p>
    </div>
    
    <div class="profile-details">
      <!-- Icon Categories -->
      <div class="section icon-categories" v-if="user.iconCategories">
        <h3>Standorte & Aktivitäten</h3>
        
        <!-- Home -->
        <div class="icon-category" v-if="user.iconCategories.home">
          <div class="icon-header">
            <i class="fas fa-home"></i>
            <h4>Wohnort</h4>
          </div>
          <div class="icon-content">
            <p><strong>{{ user.iconCategories.home.address }}</strong></p>
            <p>{{ user.iconCategories.home.description }}</p>
          </div>
        </div>
        
        <!-- Firma -->
        <div class="icon-category" v-if="user.iconCategories.firma">
          <div class="icon-header">
            <i class="fas fa-building"></i>
            <h4>Firma</h4>
          </div>
          <div class="icon-content">
            <p><strong>{{ user.iconCategories.firma.name }}</strong></p>
            <p>{{ user.iconCategories.firma.role }} ({{ user.iconCategories.firma.year }})</p>
            <p>{{ user.iconCategories.firma.description }}</p>
          </div>
        </div>
        
        <!-- Wirkungsbereich -->
        <div class="icon-category" v-if="user.iconCategories.wirkungsbereich && user.iconCategories.wirkungsbereich.length">
          <div class="icon-header">
            <i class="fas fa-compass"></i>
            <h4>Wirkungsbereich</h4>
          </div>
          <div class="icon-content">
            <div class="tags">
              <span class="tag location-tag" v-for="(location, index) in user.iconCategories.wirkungsbereich" :key="index">
                {{ location }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Unternehmen -->
        <div class="icon-category" v-if="user.iconCategories.unternehmen && user.iconCategories.unternehmen.length">
          <div class="icon-header">
            <i class="fas fa-briefcase"></i>
            <h4>Unternehmen</h4>
          </div>
          <div class="icon-content">
            <div class="company-list">
              <div class="company-item" v-for="(company, index) in user.iconCategories.unternehmen" :key="index">
                <h5>{{ company.name }}</h5>
                <p>{{ company.role }} <span v-if="company.period || company.year">({{ company.period || company.year }})</span></p>
                <p v-if="company.description">{{ company.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Projekt -->
        <div class="icon-category" v-if="user.iconCategories.projekt && user.iconCategories.projekt.length">
          <div class="icon-header">
            <i class="fas fa-folder"></i>
            <h4>Projekte</h4>
          </div>
          <div class="icon-content">
            <div class="project-list">
              <div class="project-item" v-for="(project, index) in user.iconCategories.projekt" :key="index">
                <h5>{{ project.name }}</h5>
                <p v-if="project.role"><em>{{ project.role }}</em></p>
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
        <div class="icon-category" v-if="user.iconCategories.tisch && user.iconCategories.tisch.length">
          <div class="icon-header">
            <i class="fas fa-table"></i>
            <h4>Meetups & Veranstaltungen</h4>
          </div>
          <div class="icon-content">
            <div class="table-list">
              <div class="table-item" v-for="(table, index) in user.iconCategories.tisch" :key="index">
                <h5>{{ table.name }}</h5>
                <p>{{ table.description }}</p>
                <p v-if="table.location"><i class="fas fa-map-marker-alt"></i> {{ table.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interessen -->
      <div class="section" v-if="user.interests && user.interests.length">
        <h3>Interessen</h3>
        <div class="tags">
          <span class="tag interest-tag" v-for="(interest, index) in user.interests" :key="index">{{ interest }}</span>
        </div>
      </div>

      <!-- Fähigkeiten -->
      <div class="section" v-if="user.skills && user.skills.length">
        <h3>Fähigkeiten</h3>
        <div class="tags">
          <span class="tag skill-tag" v-for="(skill, index) in user.skills" :key="index">{{ skill }}</span>
        </div>
      </div>
      
      <!-- Ausbildung -->
      <div class="section" v-if="user.education && user.education.length">
        <h3>Ausbildung</h3>
        <div class="timeline">
          <div class="timeline-item" v-for="(edu, index) in user.education" :key="index">
            <span class="timeline-period">{{ edu.period }}</span>
            <div class="timeline-content">
              <span class="timeline-title">{{ edu.title }}</span>
              <span class="timeline-subtitle">{{ edu.institution }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Berufserfahrung -->
      <div class="section" v-if="user.experience && user.experience.length">
        <h3>Berufserfahrung</h3>
        <div class="timeline">
          <div class="timeline-item" v-for="(exp, index) in user.experience" :key="index">
            <span class="timeline-period">{{ exp.period }}</span>
            <div class="timeline-content">
              <span class="timeline-title">{{ exp.role }}</span>
              <span class="timeline-subtitle">{{ exp.company }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Eigene Projekte -->
      <div class="section" v-if="user.ownProjects && user.ownProjects.length">
        <h3>Realisierte Projekte</h3>
        <div class="project-cards">
          <div class="project-card" v-for="(project, index) in user.ownProjects" :key="index">
            <h4>{{ project.name }}</h4>
            <p>{{ project.description }}</p>
            <div class="project-meta">
              <span class="project-year">{{ project.year }}</span>
              <span class="project-note" v-if="project.note">{{ project.note }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projekte mit Beteiligung -->
      <div class="section" v-if="user.contributedProjects && user.contributedProjects.length">
        <h3>Projektbeteiligungen</h3>
        <div class="project-cards">
          <div class="project-card" v-for="(project, index) in user.contributedProjects" :key="index">
            <h4>{{ project.name }}</h4>
            <span class="project-role">{{ project.role }}</span>
            <p>{{ project.description }}</p>
            <span class="project-year">{{ project.year }}</span>
          </div>
        </div>
      </div>
      
      <!-- Unternehmen -->
      <div class="section" v-if="user.companies && user.companies.length">
        <h3>Unternehmen</h3>
        <div class="company-list">
          <div class="company-item" v-for="(company, index) in user.companies" :key="index">
            <h4>{{ company.name }}</h4>
            <span class="company-role">{{ company.role }} ({{ company.year }})</span>
            <p>{{ company.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Dienstleistungen -->
      <div class="section" v-if="user.services && user.services.length">
        <h3>Dienstleistungen</h3>
        <ul class="service-list">
          <li v-for="(service, index) in user.services" :key="index">{{ service }}</li>
        </ul>
      </div>
      
      <div class="section goals-section" v-if="user.dreammallGoals">
        <h3>Ziele bei DreamMall</h3>
        <div class="quote-container">
          <p class="quote">{{ user.dreammallGoals }}</p>
        </div>
      </div>
      
      <!-- Präferenzen -->
      <div class="preferences-section" v-if="user.collaborationPreferences || user.leadershipPhilosophy || user.educationOpinion || user.valueOrientation">
        <h3>Präferenzen & Einstellungen</h3>
        
        <div class="preference-item" v-if="user.collaborationPreferences">
          <h4>Zusammenarbeit</h4>
          <p>{{ user.collaborationPreferences }}</p>
        </div>
        
        <div class="preference-item" v-if="user.leadershipPhilosophy">
          <h4>Führungsstil</h4>
          <p>{{ user.leadershipPhilosophy }}</p>
        </div>
        
        <div class="preference-item" v-if="user.educationOpinion">
          <h4>Bildungssystem</h4>
          <p>{{ user.educationOpinion }}</p>
        </div>
        
        <div class="preference-item" v-if="user.valueOrientation">
          <h4>Werte</h4>
          <p>{{ user.valueOrientation }}</p>
        </div>
      </div>
      
      <!-- Allgemeine Ziele -->
      <div class="section" v-if="user.goals">
        <h3>Allgemeine Ziele</h3>
        <p>{{ user.goals }}</p>
      </div>
    </div>
    
    <button class="back-button" @click="$emit('close')">Zurück zur Liste</button>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
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
