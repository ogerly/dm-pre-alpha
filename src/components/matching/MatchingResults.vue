<template>
  <div class="matching-results">
    <h2 class="text-xl font-semibold mb-4">
      {{ matches.length > 0 ? 'Matching Results' : '' }}
    </h2>
    
    <!-- Show matches if available -->
    <div 
      v-if="matches.length > 0"
      class="match-cards-container"
    >
      <div 
        v-for="match in matches" 
        :key="match.id"
        class="match-card"
      >
        <div class="match-score">
          <div class="percent">
            {{ match.matchResult.percentage }}%
          </div>
          <div class="label">
            Match
          </div>
        </div>
        
        <div class="match-info">
          <h3 class="user-name">
            {{ match.name || 'Unnamed User' }}
          </h3>
          
          <!-- Skills section -->
          <div
            v-if="match.skills && match.skills.length"
            class="skills-section"
          >
            <h4>Skills</h4>
            <div class="tags">
              <span 
                v-for="(skill, idx) in match.skills.slice(0, 3)" 
                :key="idx"
                class="tag skill-tag"
              >
                {{ skill }}
              </span>
              <span
                v-if="match.skills.length > 3"
                class="more-tags"
              >+{{ match.skills.length - 3 }}</span>
            </div>
          </div>
          
          <!-- Interests section -->
          <div
            v-if="match.interests && match.interests.length"
            class="interests-section"
          >
            <h4>Interests</h4>
            <div class="tags">
              <span 
                v-for="(interest, idx) in match.interests.slice(0, 3)" 
                :key="idx"
                class="tag interest-tag"
              >
                {{ interest }}
              </span>
              <span
                v-if="match.interests.length > 3"
                class="more-tags"
              >+{{ match.interests.length - 3 }}</span>
            </div>
          </div>
          
          <!-- Match details section -->
          <div class="match-details">
            <template v-if="match.matchResult.matchDetails.sharedInterests.length">
              <div class="detail-item">
                <span class="detail-label">Shared Interests:</span>
                <span class="detail-value">{{ match.matchResult.matchDetails.sharedInterests.length }}</span>
              </div>
            </template>
            
            <template v-if="match.matchResult.matchDetails.complementarySkills.length">
              <div class="detail-item">
                <span class="detail-label">Complementary Skills:</span>
                <span class="detail-value">{{ match.matchResult.matchDetails.complementarySkills.length }}</span>
              </div>
            </template>
            
            <template
              v-for="(attr, idx) in match.matchResult.matchDetails.matchingAttributes"
              :key="idx"
            >
              <div class="detail-item">
                <span class="detail-label">{{ attr.category }}:</span>
                <span class="detail-value">{{ attr.similarity }}</span>
              </div>
            </template>
          </div>
        </div>
        
        <div class="match-actions">
          <button 
            class="profile-btn"
            @click="$emit('view-profile', match)"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
    
    <!-- No matches message -->
    <div 
      v-else-if="showEmpty"
      class="no-matches"
    >
      No matches found. Try adjusting your matching criteria or selecting a different user.
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MatchingResults',
  
  props: {
    matches: {
      type: Array,
      required: true
    },
    showEmpty: {
      type: Boolean,
      default: true
    }
  },
  
  // Fix: Add missing emits declaration
  emits: ['view-profile']
})
</script>

<style scoped>
.matching-results {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.match-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.match-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.match-score {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: 0.75rem;
  text-align: center;
}

.match-score .percent {
  font-size: 1.5rem;
  font-weight: 700;
}

.match-score .label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.match-info {
  padding: 1rem;
  flex-grow: 1;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.skills-section,
.interests-section {
  margin-bottom: 0.75rem;
}

.skills-section h4,
.interests-section h4 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.skill-tag {
  background-color: #e0f2fe;
  color: #0284c7;
}

.interest-tag {
  background-color: #f0fdf4;
  color: #16a34a;
}

.more-tags {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.25rem 0;
}

.match-details {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.detail-label {
  color: #6b7280;
}

.detail-value {
  font-weight: 500;
}

.match-actions {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  text-align: center;
}

.profile-btn {
  background-color: #4f46e5;
  color: white;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.profile-btn:hover {
  background-color: #4338ca;
}

.no-matches {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
</style>
