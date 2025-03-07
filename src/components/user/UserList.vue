<template>
  <div class="user-list-container">
    <h2>Verfügbare Nutzer</h2>
    <ul class="user-list">
      <li 
        v-for="user in users" 
        :key="user.id" 
        class="user-item"
        :class="{ 'selected': selectedUserId === user.id }"
      >
        <div
          class="user-info"
          @click="$emit('select-user', user)"
        >
          <h3>{{ user.name }}</h3>
          <p class="user-bio">
            {{ user.bio }}
          </p>
          <div class="skill-tags">
            <span
              v-for="(skill, index) in user.skills"
              :key="index"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
        <button 
          class="match-button"
          :disabled="selectedUserId === user.id"
          @click="$emit('select-for-matching', user)"
        >
          Finde Matches
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserList',
  
  props: {
    users: {
      type: Array,
      required: true
    },
    selectedUserId: {
      type: Number,
      default: null
    }
  },
  
  // Add missing emits declarations
  emits: ['select-user', 'select-for-matching']
});
</script>

<style>
.user-list-container {
    background-color: #f9fafb;
    padding: 15px;
    border-radius: 8px;
}

.user-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.user-item {
    background-color: white;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
    cursor: pointer;
}

.user-item:hover {
    transform: translateY(-2px);
}

.user-item.selected {
    border: 2px solid #4f46e5;
    background-color: #f5f3ff;
}

.user-info {
    margin-bottom: 12px;
}

.user-info h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
}

.user-bio {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
}

.skill-tag {
    background-color: #e0f2fe;
    color: #0369a1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
}

.match-button {
    width: 100%;
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.match-button:hover {
    background-color: #4338ca;
}

.match-button:disabled {
    background-color: #a5a5a5;
    cursor: not-allowed;
}
</style>