<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Header -->
      <div>
        <h2 class="text-center text-3xl font-bold text-primary">DreamMall</h2>
        <h3 class="mt-2 text-center text-xl text-gray-600">Matching Platform</h3>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLoginMode ? 'Anmelden, um deine Matches zu finden' : 'Registrieren und verbinde dich mit passenden Menschen' }}
        </p>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
      
      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Email input -->
          <div>
            <label for="email-address" class="sr-only">E-Mail-Adresse</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="form.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="E-Mail-Adresse"
            >
          </div>
          
          <!-- Password input -->
          <div>
            <label for="password" class="sr-only">Passwort</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="form.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="Passwort"
            >
          </div>
        </div>
        
        <!-- Registration fields -->
        <div v-if="!isLoginMode" class="space-y-4">
          <div>
            <label for="name" class="sr-only">Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              v-model="form.name"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="Name"
            >
          </div>
          
          <div>
            <label for="confirm-password" class="sr-only">Passwort wiederholen</label>
            <input 
              id="confirm-password" 
              name="confirmPassword" 
              type="password" 
              required 
              v-model="form.confirmPassword"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
              placeholder="Passwort wiederholen"
            >
          </div>
        </div>

        <!-- Remember me checkbox -->
        <div class="flex items-center justify-between" v-if="isLoginMode">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              v-model="form.rememberMe"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Angemeldet bleiben
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-indigo-500">
              Passwort vergessen?
            </a>
          </div>
        </div>

        <!-- Submit button -->
        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Loading spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoginMode ? 'Anmelden' : 'Registrieren' }}
          </button>
        </div>
        
        <!-- Toggle between login and registration -->
        <div class="text-center">
          <button 
            type="button" 
            @click="toggleMode" 
            class="font-medium text-primary hover:text-indigo-500"
          >
            {{ isLoginMode ? 'Neu hier? Registriere dich!' : 'Bereits registriert? Anmelden' }}
          </button>
        </div>
      </form>
      
      <!-- Demo mode notice -->
      <div class="text-center text-xs text-gray-500 mt-4">
        <p class="mb-1">Demo-Modus: Nutze diese Anmeldedaten zum Testen:</p>
        <p>E-Mail: <strong>test@example.com</strong> / Passwort: <strong>test123</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

export default {
  name: 'LoginPage',
  
  emits: ['login-success'],
  
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    
    const isLoginMode = ref(true);
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    const form = reactive({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      rememberMe: false
    });
    
    // Initialize user data on mount
    onMounted(async () => {
      console.log('LoginPage mounted, loading user data');
      try {
        await userStore.loadUsers();
      } catch (error) {
        console.error('Error initializing users:', error);
        errorMessage.value = 'Fehler beim Laden der Benutzerdaten. Bitte aktualisieren Sie die Seite.';
      }
    });
    
    // Toggle between login and registration mode
    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value;
      errorMessage.value = ''; // Clear any error messages
    };
    
    // Handle form submission
    const handleSubmit = async () => {
      errorMessage.value = '';
      isLoading.value = true;
      
      try {
        if (isLoginMode.value) {
          await login();
        } else {
          await register();
        }
      } catch (error) {
        errorMessage.value = error.message;
      } finally {
        isLoading.value = false;
      }
    };
    
    // Login logic
    const login = async () => {
      try {
        const user = await authStore.login(form.email, form.password);
        emit('login-success', user);
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Angaben.');
      }
    };
    
    // Registration logic
    const register = async () => {
      // Validate form
      if (form.password !== form.confirmPassword) {
        throw new Error('Die Passwörter stimmen nicht überein.');
      }
      
      try {
        // Create new user
        const newUser = {
          name: form.name,
          email: form.email,
          password: form.password,
          bio: '',
          skills: [],
          interests: [],
          iconCategories: {}
        };
        
        // Save the new user
        const savedUser = await userStore.saveUser(newUser);
        
        // Log in the new user
        await authStore.login(form.email, form.password);
        
        emit('login-success', savedUser);
      } catch (error) {
        console.error('Registration failed:', error);
        throw new Error('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    };
    
    return {
      isLoginMode,
      isLoading,
      errorMessage,
      form,
      toggleMode,
      handleSubmit
    };
  }
}
</script>
