#!/bin/bash

# This script will complete the migration from monolithic ErrorConsole.vue
# to the new modular structure

echo "Starting migration of ErrorConsole component..."

# Create a backup of the original file
cp /home/tulex/Entwicklung/Projekte/dreammall/matching-tamplate-profil/src/components/debug/ErrorConsole.vue \
   /home/tulex/Entwicklung/Projekte/dreammall/matching-tamplate-profil/src/components/debug/ErrorConsole.vue.bak

# Create the new re-export file
cat > /home/tulex/Entwicklung/Projekte/dreammall/matching-tamplate-profil/src/components/debug/ErrorConsole.vue << 'EOL'
<script>
// This file is a re-export of the new modular ErrorConsole component
// It maintains backward compatibility with existing imports
import ErrorConsoleComponent from './ErrorConsole/index.vue';
export default ErrorConsoleComponent;
</script>
EOL

echo "Migration completed. The original file has been backed up as ErrorConsole.vue.bak"
echo "The new ErrorConsole.vue now re-exports the modular component from the ErrorConsole/ directory."
echo ""
echo "You can now import ErrorConsole from either path:"
echo "  - import ErrorConsole from '@/components/debug/ErrorConsole.vue';"
echo "  - import ErrorConsole from '@/components/debug/ErrorConsole';"
echo ""
echo "If all tests pass, you can safely remove the backup file."
