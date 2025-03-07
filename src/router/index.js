import { createRouter, createWebHistory } from 'vue-router'
import errorLogger from '@/services/errorLogger'
import { useAuthStore } from '@/stores/auth'

// Import views
import LoginPage from '@/components/auth/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import AdminboardPage from '@/views/AdminboardPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import MatchingView from '@/views/MatchingView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import TableView from '@/views/TableView.vue'
import MapView from '@/views/MapView.vue'
import VideoChatView from '@/views/VideoChatView.vue'
import ChatPage from '@/views/ChatPage.vue'

// Get base URL from the Vite configuration
const baseUrl = import.meta.env.BASE_URL || '/'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminboardPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/matching',
    name: 'Matching',
    component: MatchingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/table',
    name: 'Table',
    component: TableView,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
    meta: { requiresAuth: true }
  },
  {
    path: '/videochat',
    name: 'VideoChat',
    component: VideoChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true }
  },
  {
    path: '/docs',
    name: 'Docs',
    beforeEnter: () => {
      window.location.href = '/documentation/';
    },
    meta: { guest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
]

const router = createRouter({
  // Use the same base path as in Vite config
  history: createWebHistory(baseUrl),
  routes,
  // Add scroll behavior for better UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  errorLogger.debug(`Navigation requested: ${from.path} → ${to.path}`)
  
  try {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated
    const userRole = authStore.currentUser?.role
    
    errorLogger.debug(`Auth check for navigation: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}, Role: ${userRole || 'none'}`)
    
    // Route requires admin role
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!isAuthenticated) {
        errorLogger.warn(`Redirecting to login: ${to.path} requires authentication`)
        next('/login')
      } else if (userRole !== 'admin') {
        errorLogger.warn(`Access denied: ${to.path} requires admin role, current role: ${userRole}`)
        next('/')  // Redirect non-admins to dashboard
      } else {
        errorLogger.debug(`Authorized admin navigation to: ${to.path}`)
        next()
      }
    }
    // Route requires auth but not admin
    else if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        errorLogger.debug(`Redirecting to login: ${to.path} requires authentication`)
        next('/login')
      } else {
        errorLogger.debug(`Authorized navigation to: ${to.path}`)
        next()
      }
    } 
    // Guest routes (like login)
    else if (to.matched.some(record => record.meta.guest)) {
      if (isAuthenticated) {
        errorLogger.debug(`Redirecting to dashboard: user already authenticated`)
        next('/')
      } else {
        errorLogger.debug(`Guest navigation to: ${to.path}`)
        next()
      }
    } 
    // Public routes
    else {
      errorLogger.debug(`Public navigation to: ${to.path}`)
      next()
    }
  } catch (error) {
    errorLogger.error("Navigation guard error", error)
    next('/login') // Safe fallback
  }
})

// After each navigation
router.afterEach((to) => {
  errorLogger.info(`Navigation completed to: ${to.path}`, {
    route: to.name,
    params: to.params,
    query: to.query
  })
})

export default router
