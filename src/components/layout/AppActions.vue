<template>
  <div class="flex gap-2 mb-5 justify-center flex-wrap">
    <button 
      @click="$emit('create-profile')" 
      class="btn btn-primary flex items-center gap-1.5"
    >
      <span class="text-lg">+</span> Neues Profil erstellen
    </button>
    
    <button 
      @click="$emit('export-profiles')" 
      class="btn btn-secondary"
    >
      Alle Profile exportieren
    </button>
    
    <label 
      for="import-file" 
      class="btn btn-secondary cursor-pointer"
    >
      Profile importieren
    </label>
    
    <input 
      id="import-file" 
      type="file" 
      @change="$emit('import-profiles', $event)" 
      accept="application/json"
      class="hidden"
    >
  </div>
</template>

<script>
export default {
  name: 'AppActions',
  
  emits: [
    'create-profile',
    'export-profiles',
    'import-profiles'
  ]
}
</script>
