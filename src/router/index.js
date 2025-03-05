import { createRouter, createWebHistory } from 'vue-router'

// Auth
import LoginView from '@/views/auth/LoginView.vue'

// Main views
import MatchingView from '@/views/matching/MatchingView.vue'
import MapView from '@/views/map/MapView.vue'

// User views
import UserProfileView from '@/views/user/UserProfileView.vue'
import UserSettingsView from '@/views/user/UserSettingsView.vue'

// Admin views
import AdminView from '@/views/admin/AdminView.vue'

// Error views
import NotFoundView from '@/views/errors/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/matching'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/matching',
    name: 'matching',
    component: MatchingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'map',
    component: MapView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:id',
    name: 'userProfile',
    component: UserProfileView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/settings',
    name: 'settings',
    component: UserSettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Get authentication status from localStorage
  const currentUser = localStorage.getItem('currentUser')
  const isAuthenticated = currentUser ? JSON.parse(currentUser).isLoggedIn : false
  const userRole = currentUser ? JSON.parse(currentUser).role : null
  const isAdmin = userRole === 'admin'

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Check if route requires admin role
  else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'matching' }) // Redirect to matching if not admin
  }
  // Check if route requires guest (non-authenticated)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'matching' })
  } 
  else {
    next()
  }
})

export default router
