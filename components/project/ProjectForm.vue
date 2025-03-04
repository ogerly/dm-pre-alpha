<template>
  <div class="project-form-container">
    <h2>{{ editMode ? 'Projekt bearbeiten' : 'Neues Projekt erstellen' }}</h2>
    
    <form @submit.prevent="saveProject" class="project-form">
      <!-- Basisdaten -->
      <div class="form-section">
        <h3>Projektdaten</h3>
        
        <div class="form-group">
          <label for="project-name">Projektname</label>
          <input type="text" id="project-name" v-model="formData.name" required>
        </div>
        
        <div class="form-group">
          <label for="description">Beschreibung</label>
          <textarea id="description" v-model="formData.description" rows="4" required></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status">
              <option value="Offen">Offen für Teilnehmer</option>
              <option value="Laufend">Laufend</option>
              <option value="Abgeschlossen">Abgeschlossen</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="start-date">Startdatum</label>
            <input type="date" id="start-date" v-model="formData.startDate">
          </div>
          
          <div class="form-group">
            <label for="end-date">Enddatum (optional)</label>
            <input type="date" id="end-date" v-model="formData.endDate">
          </div>
        </div>
      </div>
      
      <!-- Kategorien & Tags -->
      <div class="form-section">
        <h3>Kategorien & Tags</h3>
        
        <div class="form-group">
          <label>Kategorien</label>
          <div class="tag-input">
            <input 
              type="text" 
              v-model="newCategory" 
              @keyup.enter="addCategory"
              placeholder="Kategorie eingeben und Enter drücken"
            >
            <div class="tags-container">
              <span v-for="(category, index) in formData.categories" :key="index" class="tag category-tag">
                {{ category }}
                <button type="button" @click="removeCategory(index)" class="remove-tag">&times;</button>
              </span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Tags</label>
          <div class="tag-input">
            <input 
              type="text" 
              v-model="newTag" 
              @keyup.enter="addTag"
              placeholder="Tag eingeben und Enter drücken"
            >
            <div class="tags-container">
              <span v-for="(tag, index) in formData.tags" :key="index" class="tag tag-item">
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="remove-tag">&times;</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projektziele -->
      <div class="form-section">
        <h3>Projektziele</h3>
        
        <div v-for="(goal, index) in formData.goals" :key="index" class="goal-input">
          <div class="form-row">
            <div class="form-group goal-field">
              <input type="text" v-model="formData.goals[index]" placeholder="Ziel beschreiben...">
              <button type="button" @click="removeGoal(index)" class="remove-btn">Entfernen</button>
            </div>
          </div>
        </div>
        
        <button type="button" class="add-btn" @click="addGoal">
          <i class="bi bi-plus"></i> Projektziel hinzufügen
        </button>
      </div>
      
      <!-- Gesuchte Fähigkeiten -->
      <div class="form-section">
        <h3>Gesuchte Fähigkeiten</h3>
        
        <div class="form-group">
          <div class="tag-input">
            <input 
              type="text" 
              v-model="newSkill" 
              @keyup.enter="addSkill"
              placeholder="Fähigkeit eingeben und Enter drücken"
            >
            <div class="tags-container">
              <span v-for="(skill, index) in formData.requiredSkills" :key="index" class="tag skill-tag">
                {{ skill }}
                <button type="button" @click="removeSkill(index)" class="remove-tag">&times;</button>
              </span>
            </div>
          </div>
          <small class="form-hint">Welche Fähigkeiten werden für dieses Projekt benötigt?</small>
        </div>
      </div>
      
      <!-- Standort & Wirkungsbereich -->
      <div class="form-section">
        <h3>Standort & Wirkungsbereich</h3>
        
        <div class="form-group">
          <label for="location">Projektstandort</label>
          <input type="text" id="location" v-model="formData.location.address">
          <small class="form-hint">Die genaue Adresse wird benutzt, um den Standort auf der Karte anzuzeigen (optional)</small>
        </div>
        
        <div class="map-preview">
          <!-- Placeholder for Map Preview -->
          <div class="map-placeholder">
            <i class="bi bi-map"></i>
            <p>Kartenvorschau (wird nach dem Speichern angezeigt)</p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="radius-distance">Wirkungsbereich (in km)</label>
          <input type="number" id="radius-distance" v-model.number="formData.radius.distance" min="0" step="1">
          <small class="form-hint">Der Radius wird als Kreis um den Standort auf der Karte dargestellt (optional)</small>
        </div>
      </div>
      
      <!-- Zusammenarbeit -->
      <div class="form-section">
        <h3>Zusammenarbeit</h3>
        
        <div class="form-group">
          <label for="collab-type">Art der Zusammenarbeit</label>
          <select id="collab-type" v-model="formData.collaboration.type">
            <option value="Vor Ort">Vor Ort</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid (Remote & Vor Ort)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="collab-availability">Verfügbarkeit</label>
          <select id="collab-availability" v-model="formData.collaboration.availability">
            <option value="Vollzeit">Vollzeit</option>
            <option value="Teilzeit">Teilzeit</option>
            <option value="Flexibel">Flexibel</option>
            <option value="Nach Vereinbarung">Nach Vereinbarung</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="collab-notes">Hinweise zur Zusammenarbeit</label>
          <textarea id="collab-notes" v-model="formData.collaboration.notes" rows="2"></textarea>
        </div>
      </div>
      
      <!-- Team -->
      <div class="form-section">
        <h3>Team</h3>
        
        <div v-for="(member, index) in formData.team" :key="index" class="team-member-input">
          <div class="form-row">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="member.name">
            </div>
            
            <div class="form-group">
              <label>Rolle</label>
              <input type="text" v-model="member.role">
            </div>
            
            <button type="button" class="remove-btn" @click="removeMember(index)">Entfernen</button>
          </div>
        </div>
        
        <button type="button" class="add-btn" @click="addMember">
          <i class="bi bi-plus"></i> Teammitglied hinzufügen
        </button>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="cancel-btn">Abbrechen</button>
        <button type="submit" class="save-btn">{{ editMode ? 'Speichern' : 'Erstellen' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    projectData: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: '',
        status: 'Offen',
        startDate: '',
        endDate: '',
        categories: [],
        tags: [],
        goals: [],
        requiredSkills: [],
        location: {
          address: '',
          coordinates: null  // Would be populated after geocoding
        },
        radius: {
          distance: 0,
          center: null  // Would be set to match location coordinates
        },
        collaboration: {
          type: 'Hybrid',
          availability: 'Flexibel',
          notes: ''
        },
        team: []
      },
      newCategory: '',
      newTag: '',
      newSkill: ''
    }
  },
  created() {
    if (this.projectData) {
      // Deep copy to avoid mutating props
      this.formData = JSON.parse(JSON.stringify(this.projectData));
      
      // Ensure all nested objects exist
      if (!this.formData.categories) this.formData.categories = [];
      if (!this.formData.tags) this.formData.tags = [];
      if (!this.formData.goals) this.formData.goals = [];
      if (!this.formData.requiredSkills) this.formData.requiredSkills = [];
      if (!this.formData.location) this.formData.location = { address: '', coordinates: null };
      if (!this.formData.radius) this.formData.radius = { distance: 0, center: null };
      if (!this.formData.collaboration) {
        this.formData.collaboration = { type: 'Hybrid', availability: 'Flexibel', notes: '' };
      }
      if (!this.formData.team) this.formData.team = [];
    }
  },
  methods: {
    saveProject() {
      // Clone the form data to avoid reference issues
      const projectData = JSON.parse(JSON.stringify(this.formData));
      
      // Generate ID if new project
      if (!this.editMode) {
        projectData.id = Date.now();
      }
      
      this.$emit('save', projectData);
    },
    
    // Category methods
    addCategory() {
      if (this.newCategory.trim() && !this.formData.categories.includes(this.newCategory.trim())) {
        this.formData.categories.push(this.newCategory.trim());
        this.newCategory = '';
      }
    },
    
    removeCategory(index) {
      this.formData.categories.splice(index, 1);
    },
    
    // Tag methods
    addTag() {
      if (this.newTag.trim() && !this.formData.tags.includes(this.newTag.trim())) {
        this.formData.tags.push(this.newTag.trim());
        this.newTag = '';
      }
    },
    
    removeTag(index) {
      this.formData.tags.splice(index, 1);
    },
    
    // Goal methods
    addGoal() {
      this.formData.goals.push('');
    },
    
    removeGoal(index) {
      this.formData.goals.splice(index, 1);
    },
    
    // Skill methods
    addSkill() {
      if (this.newSkill.trim() && !this.formData.requiredSkills.includes(this.newSkill.trim())) {
        this.formData.requiredSkills.push(this.newSkill.trim());
        this.newSkill = '';
      }
    },
    
    removeSkill(index) {
      this.formData.requiredSkills.splice(index, 1);
    },
    
    // Team methods
    addMember() {
      this.formData.team.push({
        name: '',
        role: ''
      });
    },
    
    removeMember(index) {
      this.formData.team.splice(index, 1);
    }
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

.project-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.project-form {
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

input[type="text"],
input[type="date"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.team-member-input {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
}

.goal-field {
  display: flex;
  gap: 10px;
  align-items: center;
}

.goal-field input {
  flex-grow: 1;
}

.add-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.add-btn i {
  font-size: 1rem;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  white-space: nowrap;
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
