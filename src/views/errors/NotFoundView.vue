<template>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-4xl font-bold mb-4">
      404
    </h1>
    <p class="text-xl mb-4">
      Page not found
    </p>
    <router-link
      to="/"
      class="text-blue-500 hover:underline"
    >
      Return to Home
    </router-link>
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
