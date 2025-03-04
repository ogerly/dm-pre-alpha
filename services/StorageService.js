/**
 * Service for managing profile data storage and persistence
 */

import initialData from '../data.json';

const STORAGE_KEY = 'dreammall_profiles';

/**
 * Initialize the profile data in local storage
 */
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
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
