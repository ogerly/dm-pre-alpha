<template>
  <div class="profile-form-container">
    <h2>{{ editMode ? 'Profil bearbeiten' : 'Neues Profil erstellen' }}</h2>
    
    <form
      class="profile-form"
      @submit.prevent="saveProfile"
    >
      <!-- Basisdaten -->
      <div class="form-section">
        <h3>Basisdaten</h3>
        
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="bio">Beschreibung / Bio</label>
          <textarea
            id="bio"
            v-model="formData.bio"
            rows="3"
          />
        </div>
      </div>
      
      <!-- Icon Categories -->
      <div class="form-section">
        <h3>Standorte & Aktivitäten</h3>
        
        <!-- Home -->
        <div class="category-section">
          <h4><i class="bi bi-house-door" /> Wohnort</h4>
          <div class="form-group">
            <label>Adresse / Ort</label>
            <input
              type="text" 
              :value="getIconCategoryValue('home', 'address')" 
              @input="setIconCategoryValue('home', 'address', $event.target.value)"
            >
          </div>
          <div class="form-group">
            <label>Beschreibung</label>
            <input
              type="text" 
              :value="getIconCategoryValue('home', 'description')" 
              @input="setIconCategoryValue('home', 'description', $event.target.value)"
            >
          </div>
        </div>
        
        <!-- Firma -->
        <div class="category-section">
          <h4><i class="bi bi-building" /> Firma</h4>
          <div class="form-group">
            <label>Name der Firma</label>
            <input
              type="text" 
              :value="getIconCategoryValue('firma', 'name')" 
              @input="setIconCategoryValue('firma', 'name', $event.target.value)"
            >
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Rolle</label>
              <input
                type="text" 
                :value="getIconCategoryValue('firma', 'role')" 
                @input="setIconCategoryValue('firma', 'role', $event.target.value)"
              >
            </div>
            <div class="form-group">
              <label>Jahr</label>
              <input
                type="text" 
                :value="getIconCategoryValue('firma', 'year')" 
                @input="setIconCategoryValue('firma', 'year', $event.target.value)"
              >
            </div>
          </div>
          <div class="form-group">
            <label>Beschreibung</label>
            <textarea 
              :value="getIconCategoryValue('firma', 'description')" 
              rows="2" 
              @input="setIconCategoryValue('firma', 'description', $event.target.value)"
            />
          </div>
        </div>
        
        <!-- Wirkungsbereich -->
        <div class="category-section">
          <h4><i class="bi bi-compass" /> Wirkungsbereich</h4>
          <div class="tag-input">
            <input 
              v-model="newLocation" 
              type="text" 
              placeholder="Ort eingeben und Enter drücken"
              @keyup.enter="addLocation"
            >
            <div class="tags-container">
              <span 
                v-for="(location, index) in getIconCategoryArray('wirkungsbereich')" 
                :key="index" 
                class="tag location-tag"
              >
                {{ location }}
                <button
                  type="button"
                  class="remove-tag"
                  @click="removeLocation(index)"
                >&times;</button>
              </span>
            </div>
          </div>
        </div>
        
        <!-- Unternehmen -->
        <div class="category-section">
          <h4><i class="bi bi-briefcase" /> Unternehmen</h4>
          <div
            v-for="(company, index) in getIconCategoryArray('unternehmen')"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Name</label>
              <input
                v-model="company.name"
                type="text"
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Rolle</label>
                <input
                  v-model="company.role"
                  type="text"
                >
              </div>
              <div class="form-group">
                <label>Jahr/Zeitraum</label>
                <input
                  type="text" 
                  :value="getCompanyPeriod(company)" 
                  @input="updateCompanyPeriod(company, $event.target.value)"
                >
              </div>
            </div>
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="company.description"
                rows="2"
              />
            </div>
            <button
              type="button"
              class="remove-btn"
              @click="removeUnternehmen(index)"
            >
              Entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addUnternehmen"
          >
            Unternehmen hinzufügen
          </button>
        </div>
        
        <!-- Projekt -->
        <div class="category-section">
          <h4><i class="bi bi-folder" /> Projekte</h4>
          <div
            v-for="(project, index) in getIconCategoryArray('projekt')"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Projektname</label>
              <input
                v-model="project.name"
                type="text"
              >
            </div>
            <div class="form-group">
              <label>Rolle (optional)</label>
              <input
                v-model="project.role"
                type="text"
              >
            </div>
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="project.description"
                rows="2"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Jahr</label>
                <input
                  v-model="project.year"
                  type="text"
                >
              </div>
              <div class="form-group">
                <label>Anmerkung</label>
                <input
                  v-model="project.note"
                  type="text"
                >
              </div>
            </div>
            <button
              type="button"
              class="remove-btn"
              @click="removeProjekt(index)"
            >
              Entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addProjekt"
          >
            Projekt hinzufügen
          </button>
        </div>
        
        <!-- Tisch -->
        <div class="category-section">
          <h4><i class="bi bi-table" /> Meetups & Veranstaltungen</h4>
          <div
            v-for="(table, index) in getIconCategoryArray('tisch')"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Name</label>
              <input
                v-model="table.name"
                type="text"
              >
            </div>
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="table.description"
                rows="2"
              />
            </div>
            <div class="form-group">
              <label>Ort</label>
              <input
                v-model="table.location"
                type="text"
              >
            </div>
            <button
              type="button"
              class="remove-btn"
              @click="removeTisch(index)"
            >
              Entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addTisch"
          >
            Meetup/Veranstaltung hinzufügen
          </button>
        </div>
      </div>
      
      <!-- Interessen und Fähigkeiten -->
      <div class="form-section">
        <h3>Interessen & Fähigkeiten</h3>
        
        <div class="form-group">
          <label>Interessen</label>
          <div class="tag-input">
            <input 
              v-model="newInterest" 
              type="text" 
              placeholder="Interesse eingeben und Enter drücken"
              @keyup.enter="addInterest"
            >
            <div class="tags-container">
              <span
                v-for="(interest, index) in formData.interests"
                :key="index"
                class="tag interest-tag"
              >
                {{ interest }}
                <button
                  type="button"
                  class="remove-tag"
                  @click="removeInterest(index)"
                >&times;</button>
              </span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Fähigkeiten</label>
          <div class="tag-input">
            <input 
              v-model="newSkill" 
              type="text" 
              placeholder="Fähigkeit eingeben und Enter drücken"
              @keyup.enter="addSkill"
            >
            <div class="tags-container">
              <span
                v-for="(skill, index) in formData.skills"
                :key="index"
                class="tag skill-tag"
              >
                {{ skill }}
                <button
                  type="button"
                  class="remove-tag"
                  @click="removeSkill(index)"
                >&times;</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bildung und Erfahrung -->
      <div class="form-section">
        <h3>Bildung & Erfahrung</h3>
        
        <div class="repeater-section">
          <h4>Ausbildung</h4>
          <div
            v-for="(education, index) in formData.education"
            :key="index"
            class="repeater-item"
          >
            <div class="form-row">
              <div class="form-group">
                <label>Zeitraum</label>
                <input
                  v-model="education.period"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Titel/Abschluss</label>
                <input
                  v-model="education.title"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Institution</label>
                <input
                  v-model="education.institution"
                  type="text"
                >
              </div>
              
              <button
                type="button"
                class="remove-btn"
                @click="removeEducation(index)"
              >
                Entfernen
              </button>
            </div>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addEducation"
          >
            Ausbildung hinzufügen
          </button>
        </div>
        
        <div class="repeater-section">
          <h4>Berufserfahrung</h4>
          <div
            v-for="(experience, index) in formData.experience"
            :key="index"
            class="repeater-item"
          >
            <div class="form-row">
              <div class="form-group">
                <label>Zeitraum</label>
                <input
                  v-model="experience.period"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Position</label>
                <input
                  v-model="experience.role"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Unternehmen</label>
                <input
                  v-model="experience.company"
                  type="text"
                >
              </div>
              
              <button
                type="button"
                class="remove-btn"
                @click="removeExperience(index)"
              >
                Entfernen
              </button>
            </div>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addExperience"
          >
            Erfahrung hinzufügen
          </button>
        </div>
      </div>
      
      <!-- Projekte -->
      <div class="form-section">
        <h3>Projekte</h3>
        
        <div class="repeater-section">
          <h4>Eigene Projekte</h4>
          <div
            v-for="(project, index) in formData.ownProjects"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Projektname</label>
              <input
                v-model="project.name"
                type="text"
              >
            </div>
            
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="project.description"
                rows="2"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Jahr</label>
                <input
                  v-model="project.year"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Anmerkung</label>
                <input
                  v-model="project.note"
                  type="text"
                >
              </div>
            </div>
            
            <button
              type="button"
              class="remove-btn"
              @click="removeOwnProject(index)"
            >
              Projekt entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addOwnProject"
          >
            Eigenes Projekt hinzufügen
          </button>
        </div>
        
        <div class="repeater-section">
          <h4>Projektbeteiligungen</h4>
          <div
            v-for="(project, index) in formData.contributedProjects"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Projektname</label>
              <input
                v-model="project.name"
                type="text"
              >
            </div>
            
            <div class="form-group">
              <label>Rolle</label>
              <input
                v-model="project.role"
                type="text"
              >
            </div>
            
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="project.description"
                rows="2"
              />
            </div>
            
            <div class="form-group">
              <label>Jahr</label>
              <input
                v-model="project.year"
                type="text"
              >
            </div>
            
            <button
              type="button"
              class="remove-btn"
              @click="removeContributedProject(index)"
            >
              Projekt entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addContributedProject"
          >
            Projektbeteiligung hinzufügen
          </button>
        </div>
      </div>
      
      <!-- Unternehmen -->
      <div class="form-section">
        <h3>Unternehmen & Services</h3>
        
        <div class="repeater-section">
          <h4>Unternehmen</h4>
          <div
            v-for="(company, index) in formData.companies"
            :key="index"
            class="repeater-item"
          >
            <div class="form-group">
              <label>Unternehmensname</label>
              <input
                v-model="company.name"
                type="text"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Rolle</label>
                <input
                  v-model="company.role"
                  type="text"
                >
              </div>
              
              <div class="form-group">
                <label>Jahr</label>
                <input
                  v-model="company.year"
                  type="text"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea
                v-model="company.description"
                rows="2"
              />
            </div>
            
            <button
              type="button"
              class="remove-btn"
              @click="removeCompany(index)"
            >
              Unternehmen entfernen
            </button>
          </div>
          <button
            type="button"
            class="add-btn"
            @click="addCompany"
          >
            Unternehmen hinzufügen
          </button>
        </div>
        
        <div class="repeater-section">
          <h4>Dienstleistungen</h4>
          <div class="tag-input">
            <input 
              v-model="newService" 
              type="text" 
              placeholder="Dienstleistung eingeben und Enter drücken"
              @keyup.enter="addService"
            >
            <div class="tags-container">
              <span
                v-for="(service, index) in formData.services"
                :key="index"
                class="tag service-tag"
              >
                {{ service }}
                <button
                  type="button"
                  class="remove-tag"
                  @click="removeService(index)"
                >&times;</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Ziele und Präferenzen -->
      <div class="form-section">
        <h3>Ziele & Präferenzen</h3>
        
        <div class="form-group">
          <label for="goals">Allgemeine Ziele</label>
          <textarea
            id="goals"
            v-model="formData.goals"
            rows="2"
          />
        </div>
        
        <div class="form-group">
          <label for="dreamGoals">Was möchtest du bei DreamMall erreichen?</label>
          <textarea
            id="dreamGoals"
            v-model="formData.dreammallGoals"
            rows="2"
          />
        </div>
        
        <div class="form-group">
          <label for="collab">Wie möchtest du mit anderen zusammenarbeiten?</label>
          <textarea
            id="collab"
            v-model="formData.collaborationPreferences"
            rows="2"
          />
        </div>
        
        <div class="form-group">
          <label for="leadership">Was würdest du als Chef anders machen?</label>
          <textarea
            id="leadership"
            v-model="formData.leadershipPhilosophy"
            rows="2"
          />
        </div>
        
        <div class="form-group">
          <label for="education">Wie stehst du zum aktuellen Schulsystem?</label>
          <textarea
            id="education"
            v-model="formData.educationOpinion"
            rows="2"
          />
        </div>
        
        <div class="form-group">
          <label for="values">Was ist für dich wichtiger (Zeugnisse oder Prototypen)?</label>
          <textarea
            id="values"
            v-model="formData.valueOrientation"
            rows="2"
          />
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
        >
          {{ editMode ? 'Speichern' : 'Profil erstellen' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfileForm',
  
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  
  // Add missing emits declarations
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        bio: '',
        skills: [],
        interests: [],
        goals: '',
        iconCategories: {
          home: {
            address: '',
            description: ''
          },
          firma: {
            name: '',
            role: '',
            year: '',
            description: ''
          },
          wirkungsbereich: [],
          unternehmen: [],
          projekt: [],
          tisch: []
        },
        education: [],
        experience: [],
        ownProjects: [],
        contributedProjects: [],
        companies: [],
        services: [],
        dreammallGoals: '',
        collaborationPreferences: '',
        leadershipPhilosophy: '',
        educationOpinion: '',
        valueOrientation: ''
      },
      newInterest: '',
      newSkill: '',
      newService: '',
      newLocation: ''
    }
  },
  created() {
    if (this.user) {
      // Deep copy the user object to avoid mutating props
      this.formData = JSON.parse(JSON.stringify(this.user));
      
      // Initialize arrays if they don't exist
      if (!this.formData.skills) this.formData.skills = [];
      if (!this.formData.interests) this.formData.interests = [];
      if (!this.formData.education) this.formData.education = [];
      if (!this.formData.experience) this.formData.experience = [];
      if (!this.formData.ownProjects) this.formData.ownProjects = [];
      if (!this.formData.contributedProjects) this.formData.contributedProjects = [];
      if (!this.formData.companies) this.formData.companies = [];
      if (!this.formData.services) this.formData.services = [];
      
      // Initialize icon categories if they don't exist
      if (!this.formData.iconCategories) this.formData.iconCategories = {};
      if (!this.formData.iconCategories.home) this.formData.iconCategories.home = { address: '', description: '' };
      if (!this.formData.iconCategories.firma) this.formData.iconCategories.firma = { name: '', role: '', year: '', description: '' };
      if (!this.formData.iconCategories.wirkungsbereich) this.formData.iconCategories.wirkungsbereich = [];
      if (!this.formData.iconCategories.unternehmen) this.formData.iconCategories.unternehmen = [];
      if (!this.formData.iconCategories.projekt) this.formData.iconCategories.projekt = [];
      if (!this.formData.iconCategories.tisch) this.formData.iconCategories.tisch = [];
    }
  },
  methods: {
    saveProfile() {
      const profileData = { ...this.formData };
      if (!this.editMode) {
        // Generate a new ID for new profiles
        profileData.id = Date.now();
      }
      this.$emit('save', profileData);
    },
    
    // Icon category methods
    getIconCategoryValue(category, property) {
      if (!this.formData.iconCategories[category]) {
        this.$set(this.formData.iconCategories, category, {});
      }
      return this.formData.iconCategories[category][property] || '';
    },
    
    setIconCategoryValue(category, property, value) {
      if (!this.formData.iconCategories[category]) {
        this.$set(this.formData.iconCategories, category, {});
      }
      this.$set(this.formData.iconCategories[category], property, value);
    },
    
    getIconCategoryArray(category) {
      if (!this.formData.iconCategories[category]) {
        this.$set(this.formData.iconCategories, category, []);
      }
      return this.formData.iconCategories[category];
    },
    
    // Wirkungsbereich methods
    addLocation() {
      if (this.newLocation.trim() && !this.getIconCategoryArray('wirkungsbereich').includes(this.newLocation.trim())) {
        this.getIconCategoryArray('wirkungsbereich').push(this.newLocation.trim());
        this.newLocation = '';
      }
    },
    
    removeLocation(index) {
      this.getIconCategoryArray('wirkungsbereich').splice(index, 1);
    },
    
    // Unternehmen methods
    addUnternehmen() {
      this.getIconCategoryArray('unternehmen').push({
        name: '',
        role: '',
        year: '',
        description: ''
      });
    },
    
    removeUnternehmen(index) {
      this.getIconCategoryArray('unternehmen').splice(index, 1);
    },
    
    // Interests methods
    addInterest() {
      if (this.newInterest.trim() && !this.formData.interests.includes(this.newInterest.trim())) {
        this.formData.interests.push(this.newInterest.trim());
        this.newInterest = '';
      }
    },
    removeInterest(index) {
      this.formData.interests.splice(index, 1);
    },
    
    // Skills methods
    addSkill() {
      if (this.newSkill.trim() && !this.formData.skills.includes(this.newSkill.trim())) {
        this.formData.skills.push(this.newSkill.trim());
        this.newSkill = '';
      }
    },
    removeSkill(index) {
      this.formData.skills.splice(index, 1);
    },
    
    // Education methods
    addEducation() {
      this.formData.education.push({
        period: '',
        title: '',
        institution: ''
      });
    },
    removeEducation(index) {
      this.formData.education.splice(index, 1);
    },
    
    // Experience methods
    addExperience() {
      this.formData.experience.push({
        period: '',
        role: '',
        company: ''
      });
    },
    removeExperience(index) {
      this.formData.experience.splice(index, 1);
    },
    
    // Own projects methods
    addOwnProject() {
      this.formData.ownProjects.push({
        name: '',
        description: '',
        year: '',
        note: ''
      });
    },
    removeOwnProject(index) {
      this.formData.ownProjects.splice(index, 1);
    },
    
    // Contributed projects methods
    addContributedProject() {
      this.formData.contributedProjects.push({
        name: '',
        role: '',
        description: '',
        year: ''
      });
    },
    removeContributedProject(index) {
      this.formData.contributedProjects.splice(index, 1);
    },
    
    // Company methods
    addCompany() {
      this.formData.companies.push({
        name: '',
        role: '',
        year: '',
        description: ''
      });
    },
    removeCompany(index) {
      this.formData.companies.splice(index, 1);
    },
    
    // Services methods
    addService() {
      if (this.newService.trim() && !this.formData.services.includes(this.newService.trim())) {
        this.formData.services.push(this.newService.trim());
        this.newService = '';
      }
    },
    removeService(index) {
      this.formData.services.splice(index, 1);
    },
    
    // Projekt methods
    addProjekt() {
      this.getIconCategoryArray('projekt').push({
        name: '',
        description: '',
        year: '',
        note: '',
        role: ''
      });
    },
    
    removeProjekt(index) {
      this.getIconCategoryArray('projekt').splice(index, 1);
    },
    
    // Tisch methods
    addTisch() {
      this.getIconCategoryArray('tisch').push({
        name: '',
        description: '',
        location: ''
      });
    },
    
    removeTisch(index) {
      this.getIconCategoryArray('tisch').splice(index, 1);
    },
    
    // New helper methods for company period/year
    getCompanyPeriod(company) {
      return company.period || company.year || '';
    },
    
    updateCompanyPeriod(company, value) {
      // If the company already has a period property, update that
      if (Object.prototype.hasOwnProperty.call(company, 'period')) {
        company.period = value;
      } else {
        // Otherwise update or create the year property
        company.year = value;
      }
    }
  }
})
</script>

<style scoped>

.profile-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
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

.skill-tag {
  background-color: #e0f2fe;
  color: #0369a1;
}

.interest-tag {
  background-color: #dcfce7;
  color: #166534;
}

.service-tag {
  background-color: #ede9fe;
  color: #5b21b6;
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

.repeater-section {
  margin-bottom: 20px;
}

.repeater-section h4 {
  margin-bottom: 10px;
  color: #4b5563;
}

.repeater-item {
  border: 1px solid #e5e7eb;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  background-color: #fff;
}

.add-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 10px;
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
