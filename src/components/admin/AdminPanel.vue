<template>
  <div class="admin-panel">
    <div class="admin-sidebar">
      <div class="admin-logo">
        <h2>Admin Panel</h2>
      </div>
      
      <nav class="admin-nav">
        <ul>
          <li
            v-for="item in menuItems"
            :key="item.id"
          >
            <a 
              href="#" 
              :class="{ 'active': activeSection === item.id }"
              class="admin-nav-link"
              @click.prevent="activeSection = item.id"
            >
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    
    <div class="admin-content">
      <div class="admin-header">
        <div class="admin-breadcrumb">
          <span>Admin</span>
          <span> / </span>
          <span>{{ currentSectionLabel }}</span>
        </div>
        
        <div class="admin-user-menu">
          <span class="admin-username">{{ userData.name || 'Admin' }}</span>
          <button
            class="admin-logout"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
      
      <!-- Dashboard Section -->
      <div
        v-if="activeSection === 'dashboard'"
        class="admin-section"
      >
        <h1>Dashboard</h1>
        
        <div class="stats-grid">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
            :class="{ 'alert': stat.alert }"
          >
            <h3>{{ stat.label }}</h3>
            <p class="stat-number">
              {{ stat.value }}
            </p>
            <p
              v-if="stat.change"
              class="stat-change"
              :class="stat.changeType"
            >
              <i :class="stat.changeType === 'increase' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" />
              {{ stat.change }}%
            </p>
          </div>
        </div>
        
        <div class="charts-grid">
          <!-- Charts would be implemented with a charting library like Chart.js -->
          <div class="chart-container">
            <h3>User Activity</h3>
            <div class="chart-placeholder">
              Chart Placeholder
            </div>
          </div>
          
          <div class="chart-container">
            <h3>User Types</h3>
            <div class="chart-placeholder">
              Chart Placeholder
            </div>
          </div>
        </div>
        
        <div class="recent-activity">
          <h3>Recent Activity</h3>
          <table class="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(activity, index) in recentActivity"
                :key="index"
              >
                <td>{{ activity.user }}</td>
                <td>{{ activity.action }}</td>
                <td>{{ activity.time }}</td>
              </tr>
              <tr v-if="!recentActivity.length">
                <td
                  colspan="3"
                  class="no-data"
                >
                  No recent activity
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- User Management Section -->
      <div
        v-else-if="activeSection === 'users'"
        class="admin-section"
      >
        <h1>User Management</h1>
        
        <div class="user-controls">
          <form
            class="search-form"
            @submit.prevent="searchUsers"
          >
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search users..."
              class="search-input"
            >
            <button
              type="submit"
              class="search-btn"
            >
              Search
            </button>
          </form>
          
          <div class="filter-controls">
            <select
              v-model="userFilter"
              class="filter-select"
            >
              <option value="all">
                All Users
              </option>
              <option value="active">
                Active
              </option>
              <option value="suspended">
                Suspended
              </option>
              <option value="premium">
                Premium
              </option>
            </select>
          </div>
        </div>
        
        <div class="user-table-container">
          <table class="user-table">
            <thead>
              <tr>
                <th
                  class="sortable"
                  @click="sortUsers('id')"
                >
                  ID
                  <i
                    v-if="sortField === 'id'"
                    :class="getSortIconClass('id')"
                  />
                </th>
                <th
                  class="sortable"
                  @click="sortUsers('name')"
                >
                  Name
                  <i
                    v-if="sortField === 'name'"
                    :class="getSortIconClass('name')"
                  />
                </th>
                <th
                  class="sortable"
                  @click="sortUsers('email')"
                >
                  Email
                  <i
                    v-if="sortField === 'email'"
                    :class="getSortIconClass('email')"
                  />
                </th>
                <th
                  class="sortable"
                  @click="sortUsers('status')"
                >
                  Status
                  <i
                    v-if="sortField === 'status'"
                    :class="getSortIconClass('status')"
                  />
                </th>
                <th
                  class="sortable"
                  @click="sortUsers('type')"
                >
                  Type
                  <i
                    v-if="sortField === 'type'"
                    :class="getSortIconClass('type')"
                  />
                </th>
                <th
                  class="sortable"
                  @click="sortUsers('createdAt')"
                >
                  Joined
                  <i
                    v-if="sortField === 'createdAt'"
                    :class="getSortIconClass('createdAt')"
                  />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
              >
                <td>#{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="'status-badge ' + user.status">
                    {{ user.status }}
                  </span>
                </td>
                <td>{{ user.type }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <button
                    class="action-btn view-btn"
                    @click="viewUser(user)"
                  >
                    View
                  </button>
                  <button
                    class="action-btn edit-btn"
                    @click="editUser(user)"
                  >
                    Edit
                  </button>
                  <button
                    class="action-btn delete-btn"
                    @click="deleteUser(user)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredUsers.length">
                <td
                  colspan="7"
                  class="no-data"
                >
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Settings Section -->
      <div
        v-else-if="activeSection === 'settings'"
        class="admin-section"
      >
        <h1>Settings</h1>
        
        <form
          class="settings-form"
          @submit.prevent="saveSettings"
        >
          <div class="form-group">
            <label for="siteName">Site Name</label>
            <input
              id="siteName"
              v-model="settings.siteName"
              type="text"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="siteDescription">Site Description</label>
            <input
              id="siteDescription"
              v-model="settings.siteDescription"
              type="text"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="maintenanceMode">Maintenance Mode</label>
            <input
              id="maintenanceMode"
              v-model="settings.maintenanceMode"
              type="checkbox"
              class="form-checkbox"
            >
          </div>
          
          <div class="form-group">
            <label for="allowRegistration">Allow Registration</label>
            <input
              id="allowRegistration"
              v-model="settings.allowRegistration"
              type="checkbox"
              class="form-checkbox"
            >
          </div>
          
          <div class="form-group">
            <label for="approvalRequired">Approval Required</label>
            <input
              id="approvalRequired"
              v-model="settings.approvalRequired"
              type="checkbox"
              class="form-checkbox"
            >
          </div>
          
          <button
            type="submit"
            class="save-btn"
          >
            Save Settings
          </button>
        </form>
      </div>
      
      <!-- Analytics Section -->
      <div
        v-else-if="activeSection === 'analytics'"
        class="admin-section"
      >
        <h1>Analytics</h1>
        
        <div class="analytics-grid">
          <div class="analytics-card">
            <h3>New Users</h3>
            <p class="analytics-number">
              {{ analytics.newUsers }}
            </p>
          </div>
          
          <div class="analytics-card">
            <h3>Active Users</h3>
            <p class="analytics-number">
              {{ analytics.activeUsers }}
            </p>
          </div>
          
          <div class="analytics-card">
            <h3>Matches</h3>
            <p class="analytics-number">
              {{ analytics.matches }}
            </p>
          </div>
          
          <div class="analytics-card">
            <h3>Chats</h3>
            <p class="analytics-number">
              {{ analytics.chats }}
            </p>
          </div>
        </div>
        
        <div class="charts-grid">
          <!-- Charts would be implemented with a charting library like Chart.js -->
          <div class="chart-container">
            <h3>User Activity</h3>
            <div class="chart-placeholder">
              Chart Placeholder
            </div>
          </div>
          
          <div class="chart-container">
            <h3>Match Statistics</h3>
            <div class="chart-placeholder">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  
  data() {
    return {
      activeSection: 'dashboard',
      menuItems: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { id: 'users', label: 'Users', icon: 'fas fa-users' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cogs' },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' }
      ],
      userData: {
        name: 'Admin'
      },
      stats: [
        { label: 'Total Users', value: 1200, change: 5, changeType: 'increase' },
        { label: 'Active Users', value: 800, change: -2, changeType: 'decrease' },
        { label: 'New Users', value: 50, change: 10, changeType: 'increase' },
        { label: 'Suspended Users', value: 20, change: 0, changeType: 'neutral' }
      ],
      recentActivity: [
        { user: 'John Doe', action: 'Logged in', time: '2 minutes ago' },
        { user: 'Jane Smith', action: 'Updated profile', time: '10 minutes ago' },
        { user: 'Mike Johnson', action: 'Created a post', time: '30 minutes ago' }
      ],
      searchTerm: '',
      userFilter: 'all',
      sortField: 'id',
      sortOrder: 'asc',
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', type: 'regular', createdAt: '2021-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'suspended', type: 'premium', createdAt: '2021-02-01' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'active', type: 'regular', createdAt: '2021-03-01' }
      ],
      settings: {
        siteName: 'My Admin Panel',
        siteDescription: 'Admin panel for managing users and settings.',
        maintenanceMode: false,
        allowRegistration: true,
        approvalRequired: false
      },
      analytics: {
        newUsers: 50,
        activeUsers: 800,
        matches: 200,
        chats: 100
      }
    }
  },
  
  computed: {
    currentSectionLabel() {
      const currentItem = this.menuItems.find(item => item.id === this.activeSection)
      return currentItem ? currentItem.label : ''
    },
    
    filteredUsers() {
      let users = this.users
      
      if (this.searchTerm) {
        users = users.filter(user => 
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }
      
      if (this.userFilter !== 'all') {
        users = users.filter(user => user.status === this.userFilter)
      }
      
      return users.sort((a, b) => {
        const fieldA = a[this.sortField]
        const fieldB = b[this.sortField]
        
        if (this.sortOrder === 'asc') {
          return fieldA > fieldB ? 1 : -1
        } else {
          return fieldA < fieldB ? 1 : -1
        }
      })
    }
  },
  
  methods: {
    logout() {
      // Implement logout logic
      alert('Logged out')
    },
    
    searchUsers() {
      // Implement search logic
      alert('Search users')
    },
    
    sortUsers(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
    },
    
    getSortIconClass(field) {
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    },
    
    viewUser(user) {
      // Implement view user logic
      alert(`View user: ${user.name}`)
    },
    
    editUser(user) {
      // Implement edit user logic
      alert(`Edit user: ${user.name}`)
    },
    
    deleteUser(user) {
      // Implement delete user logic
      alert(`Delete user: ${user.name}`)
    },
    
    saveSettings() {
      // Implement save settings logic
      alert('Settings saved')
    }
  }
}
</script>

<style scoped>
.admin-panel {
  display: flex;
}

.admin-sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
}

.admin-logo {
  text-align: center;
  margin-bottom: 20px;
}

.admin-nav {
  list-style: none;
  padding: 0;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s;
}

.admin-nav-link:hover,
.admin-nav-link.active {
  background-color: #34495e;
}

.admin-nav-link i {
  margin-right: 10px;
}

.admin-content {
  flex: 1;
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-breadcrumb {
  font-size: 14px;
  color: #7f8c8d;
}

.admin-user-menu {
  display: flex;
  align-items: center;
}

.admin-username {
  margin-right: 10px;
}

.admin-logout {
  background-color: #e74c3c;
  color: #ecf0f1;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-logout:hover {
  background-color: #c0392b;
}

.admin-section {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card.alert {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.stat-change {
  font-size: 14px;
}

.stat-change.increase {
  color: #2ecc71;
}

.stat-change.decrease {
  color: #e74c3c;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf0f1;
  border-radius: 5px;
  color: #7f8c8d;
}

.recent-activity {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th,
.activity-table td {
  padding: 10px;
  border-bottom: 1px solid #ecf0f1;
}

.activity-table th {
  text-align: left;
  background-color: #ecf0f1;
}

.no-data {
  text-align: center;
  color: #7f8c8d;
}

.user-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 5px 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  margin-right: 10px;
}

.search-btn {
  background-color: #3498db;
  color: #ecf0f1;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #2980b9;
}

.filter-controls {
  display: flex;
  align-items: center;
}

.filter-select {
  padding: 5px 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
}

.user-table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 10px;
  border-bottom: 1px solid #ecf0f1;
}

.user-table th {
  text-align: left;
  background-color: #ecf0f1;
  cursor: pointer;
}

.sortable {
  display: flex;
  align-items: center;
}

.sortable i {
  margin-left: 5px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  color: #ecf0f1;
}

.status-badge.active {
  background-color: #2ecc71;
}

.status-badge.suspended {
  background-color: #e74c3c;
}

.action-btn {
  background-color: #3498db;
  color: #ecf0f1;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px;
}

.action-btn.view-btn {
  background-color: #2ecc71;
}

.action-btn.edit-btn {
  background-color: #f39c12;
}

.action-btn.delete-btn {
  background-color: #e74c3c;
}

.action-btn:hover {
  opacity: 0.8;
}

.settings-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
}

.form-checkbox {
  margin-right: 10px;
}

.save-btn {
  background-color: #3498db;
  color: #ecf0f1;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #2980b9;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.analytics-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.analytics-number {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}
</style>