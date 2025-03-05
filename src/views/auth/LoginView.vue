<template>
  <LoginPage @login-success="handleLoginSuccess" />
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginPage from '@/components/auth/LoginPage.vue'

export default defineComponent({
  name: 'LoginView',
  
  components: {
    LoginPage
  },
  
  setup() {
    const router = useRouter()
    const route = useRoute()

    const handleLoginSuccess = (user) => {
      // Redirect to the requested page or default to matching
      const redirectPath = route.query.redirect || '/matching'
      router.push(redirectPath)
    }

    return {
      handleLoginSuccess
    }
  }
})
</script>
