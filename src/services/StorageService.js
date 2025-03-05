/**
 * Service for managing profile data storage and persistence
 */

// Manually define users since importing from a JSON file might be causing issues
const STORAGE_KEY = 'dreammall_profiles';

// Only keep authentication data here for the Test User
// IMPORTANT: ID must match the ID in data.json
const authUsers = [
  {
    id: 2, // Updated to match data.json
    email: "test@example.com",
    password: "test123",
  }
];

// Path to data.json for fetching user data - try different paths
const DATA_JSON_PATHS = [
  '/data.json',
  './data.json',
  '/assets/data.json',
  '../assets/data.json',
  'data.json'
];

/**
 * Initialize the profile data in local storage
 * @param {boolean} forceReset - If true, reset storage with default users regardless of existing data
 * @returns {Promise<Array>} Promise that resolves to the loaded profiles
 */
export function initializeStorage(forceReset = false) {
  console.log('Initializing storage, force reset:', forceReset);
  
  // Force reset if requested
  if (forceReset) {
    console.log('Forcing reset to import from data.json');
    return loadAndMergeDataJson();
  }
  
  const existingProfiles = getAllProfiles();
  
  // Only initialize with imported data if no profiles exist yet
  if (!existingProfiles || existingProfiles.length === 0) {
    console.log('No existing profiles found, importing data from data.json');
    return loadAndMergeDataJson();
  }
  
  return Promise.resolve(existingProfiles);
}

/**
 * Load data.json and merge with auth users
 * Try multiple paths to find data.json
 * @returns {Promise<Array>} Promise that resolves to the loaded profiles
 */
async function loadAndMergeDataJson() {
  // Try each path in sequence until one works
  let userData = null;
  let lastError = null;
  
  for (const path of DATA_JSON_PATHS) {
    try {
      console.log(`Attempting to load data.json from: ${path}`);
      const response = await fetch(path);
      
      if (response.ok) {
        userData = await response.json();
        console.log(`Successfully loaded ${userData.length} profiles from ${path}`);
        break; // Exit the loop if successful
      } else {
        console.warn(`Failed to load from ${path}: ${response.status}`);
      }
    } catch (error) {
      lastError = error;
      console.warn(`Error loading from ${path}:`, error.message);
    }
  }
  
  // If we couldn't load from any path, use hardcoded data
  if (!userData) {
    console.error('Failed to load data.json from any path, using hardcoded data');
    userData = getHardcodedUserData();
  }
  
  // Merge with auth data
  try {
    const mergedProfiles = userData.map(user => {
      // Find matching auth user
      const authUser = authUsers.find(auth => auth.id === user.id);
      if (authUser) {
        // Merge password but prioritize user data
        return {
          ...user,
          password: authUser.password
        };
      }
      return user;
    });
    
    // Add auth users that aren't in the data.json
    authUsers.forEach(authUser => {
      if (!mergedProfiles.some(p => p.id === authUser.id)) {
        console.log(`Adding missing auth user with id ${authUser.id} to profiles`);
        mergedProfiles.push({
          id: authUser.id,
          name: authUser.email.split('@')[0],  // Generate a name from email
          email: authUser.email,
          password: authUser.password,
          bio: "Automatically created user",
          skills: [],
          interests: [],
          iconCategories: {}
        });
      }
    });
    
    console.log(`Final merged profiles count: ${mergedProfiles.length}`);
    
    // Save merged data to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProfiles));
    console.log(`Saved ${mergedProfiles.length} merged profiles to localStorage`);
    
    return mergedProfiles;
    
  } catch (error) {
    console.error('Error during profile merging:', error);
    return createFallbackProfiles();
  }
}

/**
 * Create fallback profiles if everything else fails
 * @returns {Array} Array of basic user profiles
 */
function createFallbackProfiles() {
  console.warn('Creating fallback profiles');
  
  const fallbackProfiles = authUsers.map(auth => ({
    id: auth.id,
    name: auth.email.split('@')[0],  // Generate a name from email
    email: auth.email,
    password: auth.password,
    bio: "Fallback user profile",
    skills: [],
    interests: [],
    iconCategories: {}
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProfiles));
  console.log(`Fallback: saved ${fallbackProfiles.length} minimal profiles`);
  return fallbackProfiles;
}

/**
 * Hardcoded user data as a last resort
 * @returns {Array} Array of user profiles
 */
function getHardcodedUserData() {
  console.warn('Using hardcoded user data');
  
  return [
    {
      "id": 2,
      "name": "Test User",
      "email": "test@example.com",
      "bio": "Ein erfahrener Software-Entwickler mit Schwerpunkt auf nachhaltigen Technologien.",
      "skills": ["Projektmanagement", "Agile Methoden", "Vue.js"],
      "interests": ["Digitalisierung", "Innovation", "Nachhaltigkeit"],
      "goals": "Teams bei der digitalen Transformation unterstützen.",
      "iconCategories": {
        "home": {
          "address": "München, Deutschland",
          "description": "Remote und lokale Arbeit möglich",
          "coordinates": [48.1351, 11.5820]
        }
      }
    },
    {
      "id": 3,
      "name": "Anna Schmidt",
      "email": "anna@example.com",
      "bio": "UX/UI Designerin mit Fokus auf benutzerfreundliche Interfaces.",
      "skills": ["UI Design", "UX Research", "Figma"],
      "interests": ["Design Thinking", "Nutzerzentriertes Design"],
      "goals": "Benutzerfreundliche Interfaces gestalten.",
      "iconCategories": {
        "home": {
          "address": "Hamburg, Deutschland",
          "description": "Remote",
          "coordinates": [53.5511, 9.9937]
        }
      }
    },
    {
      "id": 4,
      "name": "Jan Müller",
      "email": "jan@example.com",
      "bio": "Backend-Entwickler mit Erfahrung in Cloud-Infrastruktur.",
      "skills": ["Node.js", "Python", "AWS"],
      "interests": ["Cloud Computing", "DevOps"],
      "goals": "Skalierbare Systemarchitekturen entwickeln.",
      "iconCategories": {
        "home": {
          "address": "Frankfurt, Deutschland",
          "coordinates": [50.1109, 8.6821]
        }
      }
    }
  ];
}

/**
 * Get all profiles from storage
 * @returns {Array} Array of user profiles
 */
export function getAllProfiles() {
  try {
    const profilesJson = localStorage.getItem(STORAGE_KEY);
    const profiles = profilesJson ? JSON.parse(profilesJson) : [];
    console.log(`getAllProfiles: Found ${profiles.length} profiles in localStorage`);
    return profiles;
  } catch (error) {
    console.error('Error getting profiles from storage:', error);
    return [];
  }
}

/**
 * Reset to the initial data by loading from data.json
 * @returns {Promise<Array>} Promise that resolves to the loaded profiles
 */
export function resetToInitialData() {
  console.log('Resetting to initial data from data.json');
  // Clear localStorage first to ensure a clean slate
  localStorage.removeItem(STORAGE_KEY);
  return loadAndMergeDataJson();
}

/**
 * Save a profile (create or update)
 * @param {Object} profile - The profile to save
 */
export function saveProfile(profile) {
  try {
    const profiles = getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      // Update existing profile
      profiles[existingIndex] = profile;
    } else {
      // Add new profile with a unique ID
      profile.id = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
      profiles.push(profile);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

/**
 * Delete a profile by ID
 * @param {number} profileId - ID of the profile to delete
 */
export function deleteProfile(profileId) {
  try {
    const profiles = getAllProfiles();
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

/**
 * Export all profiles to a JSON file
 */
export function exportProfiles() {
  try {
    const profiles = getAllProfiles();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dreamMall_profiles.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error('Error exporting profiles:', error);
    alert('Fehler beim Exportieren der Profile.');
  }
}

/**
 * Import profiles from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise} Promise resolving to the imported profiles
 */
export function importProfiles(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profiles = JSON.parse(e.target.result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        resolve(profiles);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

/**
 * Update all profiles at once
 * @param {Array} profiles - Array of profiles to save
 * @returns {boolean} Success status
 */
export function updateAllProfiles(profiles) {
  try {
    if (!Array.isArray(profiles)) {
      throw new Error('Data is not an array');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error('Error updating all profiles:', error);
    return false;
  }
}
