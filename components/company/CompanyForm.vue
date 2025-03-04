<template>
  <div class="company-form-container">
    <h2>{{ editMode ? 'Unternehmen bearbeiten' : 'Neues Unternehmen erstellen' }}</h2>
    
    <form @submit.prevent="saveCompany" class="company-form">
      <!-- Basisdaten -->
      <div class="form-section">
        <h3>Unternehmensdaten</h3>
        
        <div class="form-group">
          <label for="company-name">Unternehmensname</label>
          <input type="text" id="company-name" v-model="formData.name" required>
        </div>
        
        <div class="form-group">
          <label for="description">Beschreibung</label>
          <textarea id="description" v-model="formData.description" rows="4"></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="founded-year">Gründungsjahr</label>
            <input type="text" id="founded-year" v-model="formData.foundedYear">
          </div>
          
          <div class="form-group">
            <label for="employees">Anzahl der Mitarbeiter</label>
            <input type="text" id="employees" v-model="formData.employees">
          </div>
          
          <div class="form-group">
            <label for="industry">Branche</label>
            <input type="text" id="industry" v-model="formData.industry">
          </div>
        </div>
      </div>
      
      <!-- Dienstleistungen -->
      <div class="form-section">
        <h3>Produkte & Dienstleistungen</h3>
        
        <div class="tag-input">
          <input 
            type="text" 
            v-model="newService" 
            @keyup.enter="addService"
            placeholder="Produkt/Dienstleistung eingeben und Enter drücken"
          >
          <div class="tags-container">
            <span v-for="(service, index) in formData.services" :key="index" class="tag service-tag">
              {{ service }}
              <button type="button" @click="removeService(index)" class="remove-tag">&times;</button>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Standort -->
      <div class="form-section">
        <h3>Standort & Wirkungsbereich</h3>
        
        <div class="form-group">
          <label for="address">Adresse</label>
          <input type="text" id="address" v-model="formData.location.address">
          <small class="form-hint">Die genaue Adresse wird benutzt, um den Standort auf der Karte anzuzeigen</small>
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
          <small class="form-hint">Der Radius wird als Kreis um den Standort auf der Karte dargestellt</small>
        </div>
      </div>
      
      <!-- Kontaktdaten -->
      <div class="form-section">
        <h3>Kontaktdaten</h3>
        
        <div class="form-group">
          <label for="email">E-Mail-Adresse</label>
          <input type="email" id="email" v-model="formData.contactInfo.email">
        </div>
        
        <div class="form-group">
          <label for="phone">Telefonnummer</label>
          <input type="tel" id="phone" v-model="formData.contactInfo.phone">
        </div>
        
        <div class="form-group">
          <label for="website">Webseite</label>
          <input type="url" id="website" v-model="formData.contactInfo.website">
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
    companyData: {
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
        foundedYear: '',
        employees: '',
        industry: '',
        services: [],
        location: {
          address: '',
          coordinates: null // Would be populated after geocoding
        },
        radius: {
          distance: 0,
          center: null // Would be set to match location coordinates
        },
        contactInfo: {
          email: '',
          phone: '',
          website: ''
        },
        team: []
      },
      newService: ''
    }
  },
  created() {
    if (this.companyData) {
      // Deep copy to avoid mutating props
      this.formData = JSON.parse(JSON.stringify(this.companyData));
      
      // Ensure all nested objects exist
      if (!this.formData.location) this.formData.location = { address: '', coordinates: null };
      if (!this.formData.radius) this.formData.radius = { distance: 0, center: null };
      if (!this.formData.contactInfo) this.formData.contactInfo = { email: '', phone: '', website: '' };
      if (!this.formData.services) this.formData.services = [];
      if (!this.formData.team) this.formData.team = [];
    }
  },
  methods: {
    saveCompany() {
      // Clone the form data to avoid reference issues
      const companyData = JSON.parse(JSON.stringify(this.formData));
      
      // Generate ID if new company
      if (!this.editMode) {
        companyData.id = Date.now();
      }
      
      this.$emit('save', companyData);
    },
    
    // Service methods
    addService() {
      if (this.newService.trim() && !this.formData.services.includes(this.newService.trim())) {
        this.formData.services.push(this.newService.trim());
        this.newService = '';
      }
    },
    
    removeService(index) {
      this.formData.services.splice(index, 1);
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

.company-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.company-form {
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
input[type="email"],
input[type="tel"],
input[type="url"],
input[type="number"],
textarea {
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

.service-tag {
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

.team-member-input {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
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
