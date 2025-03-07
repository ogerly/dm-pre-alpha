import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HomePage from '@/views/HomePage.vue'
import errorLogger from '@/services/errorLogger'
import { useAuthStore } from '@/stores/auth'

// Create routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/profiles',
    name: 'profiles',
    component: () => import('@/views/ProfilesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/matching',
    name: 'matching',
    component: () => import('@/views/MatchingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false, hideIfAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false, hideIfAuth: true }
  },
  // Catch all route for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false }
  }
]

// Create router with hash history for GitHub Pages compatibility
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Track page loads for analytics/debugging
  errorLogger.trackViewLoad(to.name || 'unknown')
  
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const hideIfAuth = to.matched.some(record => record.meta.hideIfAuth)
  
  // If route requires authentication and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    errorLogger.warn('Authentication required for route', { 
      path: to.path, 
      name: to.name 
    })
    next('/login')
    return
  }
  
  // If route should be hidden for authenticated users (e.g. login/register pages)
  if (hideIfAuth && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

// Error handler
router.onError((error) => {
  errorLogger.error('Router error', error)
})

export default router
