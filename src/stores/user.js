import { defineStore } from 'pinia'
import { ref } from 'vue'
import errorLogger from '@/services/errorLogger'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const currentProfile = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Mock users data
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      skills: ['JavaScript', 'Vue.js', 'React'],
      bio: 'Frontend developer with 5 years of experience',
      location: 'Berlin, Germany'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      skills: ['Python', 'Django', 'Data Analysis'],
      bio: 'Backend developer and data scientist',
      location: 'Munich, Germany'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
      bio: 'UI/UX designer focused on creating delightful user experiences',
      location: 'Hamburg, Germany'
    }
  ]
  
  // Load users
  async function loadUsers() {
    try {
      isLoading.value = true
      error.value = null
      
      // In a real app, this would call an API
      // For this demo, we use mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Set users
      users.value = [...mockUsers]
      
      errorLogger.info('Users loaded successfully', { count: users.value.length })
      return true
    } catch (err) {
      errorLogger.error('Failed to load users', err)
      error.value = 'Failed to load users'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Get user by ID
  function getUserById(id) {
    return users.value.find(user => user.id === id)
  }
  
  // Add a new user
  function addUser(userData) {
    try {
      // Create a new user object
      const newUser = {
        id: Math.random().toString(36).slice(2),
        ...userData,
        role: userData.role || 'user'
      }
      
      // Add to users array
      users.value.push(newUser)
      
      errorLogger.info('User added successfully', { userId: newUser.id })
      return newUser
    } catch (err) {
      errorLogger.error('Failed to add user', err)
      throw err
    }
  }
  
  // Update a user
  function updateUser(id, userData) {
    try {
      // Find the user
      const index = users.value.findIndex(user => user.id === id)
      
      if (index === -1) {
        throw new Error('User not found')
      }
      
      // Update the user
      users.value[index] = {
        ...users.value[index],
        ...userData
      }
      
      errorLogger.info('User updated successfully', { userId: id })
      return users.value[index]
    } catch (err) {
      errorLogger.error('Failed to update user', err)
      throw err
    }
  }
  
  // Delete a user
  function deleteUser(id) {
    try {
      // Filter out the user
      const initialLength = users.value.length
      users.value = users.value.filter(user => user.id !== id)
      
      if (users.value.length === initialLength) {
        throw new Error('User not found')
      }
      
      errorLogger.info('User deleted successfully', { userId: id })
      return true
    } catch (err) {
      errorLogger.error('Failed to delete user', err)
      throw err
    }
  }
  
  // Import users from JSON
  function importUsers(usersData) {
    try {
      if (!Array.isArray(usersData)) {
        // If not an array, try to convert from object
        if (typeof usersData === 'object') {
          usersData = Object.values(usersData)
        } else {
          throw new Error('Invalid users data format')
        }
      }
      
      // Add users to existing array
      const newUsers = usersData.map(userData => ({
        id: userData.id || Math.random().toString(36).slice(2),
        ...userData,
        role: userData.role || 'user'
      }))
      
      users.value = [...users.value, ...newUsers]
      
      errorLogger.info('Users imported successfully', { count: newUsers.length })
      return users.value
    } catch (err) {
      errorLogger.error('Failed to import users', err)
      throw err
    }
  }
  
  return {
    // State
    users,
    currentProfile,
    isLoading,
    error,
    
    // Actions
    loadUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    importUsers
  }
})
