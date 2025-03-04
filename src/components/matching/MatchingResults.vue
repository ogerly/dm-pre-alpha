<template>
  <div class="matching-container">
    <h2>Deine Top Matches</h2>
    
    <div v-if="matches.length === 0" class="no-matches">
      <p>Wähle einen Nutzer aus, um passende Profile zu finden.</p>
    </div>
    
    <div v-else class="results-container">
      <div v-for="match in matches" :key="match.id" class="match-card">
        <div class="match-header">
          <h3>{{ match.name }}</h3>
          <div class="match-percentage">{{ match.matchResult.percentage }}%</div>
        </div>
        
        <p class="match-bio">{{ match.bio }}</p>
        
        <div class="match-details">
          <!-- Gemeinsame Interessen -->
          <div class="match-section" v-if="match.matchResult.matchDetails.sharedInterests.length > 0">
            <h4>Gemeinsame Interessen</h4>
            <div class="tags">
              <span class="tag interest-tag" 
                    v-for="(interest, i) in match.matchResult.matchDetails.sharedInterests" 
                    :key="i">
                {{ interest }}
              </span>
            </div>
          </div>
          
          <!-- Ergänzende Fähigkeiten -->
          <div class="match-section" v-if="match.matchResult.matchDetails.complementarySkills.length > 0">
            <h4>Ergänzende Fähigkeiten</h4>
            <div class="tags">
              <span class="tag skill-tag" 
                    v-for="(skill, i) in match.matchResult.matchDetails.complementarySkills" 
                    :key="i">
                {{ skill }}
              </span>
            </div>
          </div>
          
          <!-- Weitere Matching-Attribute -->
          <div class="match-section" v-if="match.matchResult.matchDetails.matchingAttributes && match.matchResult.matchDetails.matchingAttributes.length > 0">
            <h4>Weitere Übereinstimmungen</h4>
            <div class="matching-attributes">
              <div class="attribute-item" 
                   v-for="(attr, i) in match.matchResult.matchDetails.matchingAttributes" 
                   :key="i">
                <span class="attribute-name">{{ attr.category }}:</span>
                <span class="attribute-value">{{ attr.similarity || attr.value }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button class="view-profile-btn" @click="$emit('view-profile', match)">
          Profil ansehen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    matches: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.matching-container {
  margin-top: 30px;
}

.no-matches {
  background-color: #f9fafb;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  color: #6b7280;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.match-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.match-percentage {
  background-color: #047857;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
}

.match-bio {
  color: #4b5563;
  font-size: 0.95rem;
  margin-bottom: 15px;
}

.match-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.match-section h4 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.interest-tag {
  background-color: #dcfce7;
  color: #166534;
}

.skill-tag {
  background-color: #e0f2fe;
  color: #0369a1;
}

.matching-attributes {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.attribute-item {
  font-size: 0.85rem;
}

.attribute-name {
  font-weight: 500;
  margin-right: 5px;
}

.attribute-value {
  color: #4b5563;
}

.view-profile-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  width: 100%;
}

.view-profile-btn:hover {
  background-color: #4338ca;
}
</style>
