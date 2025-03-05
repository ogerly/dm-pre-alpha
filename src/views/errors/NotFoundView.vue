<template>
  <div class="not-found">
    <div class="max-w-lg mx-auto my-12 p-8 bg-white rounded-lg shadow-md text-center">
      <div class="error-code text-9xl font-bold text-primary mb-6">404</div>
      
      <h1 class="text-3xl font-bold mb-4">Seite nicht gefunden</h1>
      
      <p class="text-gray-600 mb-8">
        Die von Ihnen angeforderte Seite konnte nicht gefunden werden. 
        Möglicherweise wurde sie verschoben, umbenannt oder existiert nicht mehr.
      </p>
      
      <div class="flex justify-center space-x-4">
        <button 
          @click="goBack" 
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i> Zurück
        </button>
        
        <button 
          @click="goHome" 
          class="px-6 py-2 bg-primary text-white hover:bg-indigo-700 rounded transition-colors"
        >
          <i class="fas fa-home mr-2"></i> Startseite
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NotFoundView',
  
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.back()
    }
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goBack,
      goHome
    }
  }
})
</script>

<style scoped>
.not-found {
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.error-code {
  color: #4f46e5;
  text-shadow: 2px 2px 8px rgba(79, 70, 229, 0.2);
  letter-spacing: -5px;
}
</style>
