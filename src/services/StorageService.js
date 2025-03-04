/**
 * Service for managing profile data storage and persistence
 */

import initialData from '@/assets/data.json';

const STORAGE_KEY = 'dreammall_profiles';

/**
 * Initialize the profile data in local storage
 */
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    console.log('Initializing storage with data.json data');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  } else {
    // Check if existing data has coordinates
    const existingData = getAllProfiles();
    const hasCoordinates = existingData.some(user => 
      user.iconCategories?.home?.coordinates || 
      user.iconCategories?.firma?.coordinates ||
      (user.iconCategories?.projekt && user.iconCategories.projekt.some(p => p.coordinates))
    );
    
    if (!hasCoordinates) {
      console.warn('Existing data has no coordinates. Resetting to initial data.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }
}

/**
 * Get all profiles from storage
 * @returns {Array} Array of user profiles
 */
export function getAllProfiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Force refresh of data from data.json
 */
export function resetToInitialData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

/**
 * Save a profile (create or update)
 * @param {Object} profile - The profile to save
 */
export function saveProfile(profile) {
  const profiles = getAllProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  
  if (index >= 0) {
    // Update existing profile
    profiles[index] = profile;
  } else {
    // Add new profile
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

/**
 * Delete a profile by ID
 * @param {number} profileId - ID of the profile to delete
 */
export function deleteProfile(profileId) {
  const profiles = getAllProfiles();
  const filteredProfiles = profiles.filter(p => p.id !== profileId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProfiles));
}

/**
 * Export all profiles to a JSON file
 */
export function exportProfiles() {
  const profiles = getAllProfiles();
  const dataStr = JSON.stringify(profiles, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'dreammall_profiles.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    console.log(`Successfully updated ${profiles.length} profiles`);
    return true;
  } catch (error) {
    console.error('Error updating all profiles:', error);
    return false;
  }
}
