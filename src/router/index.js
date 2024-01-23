import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/scheduled',
    name: 'Scheduled',
    component: () => import('../views/homePageTileViews/ScheduledView.vue')
  },
  {
    path: '/completed',
    name: 'Completed',
    component: () => import('../views/homePageTileViews/CompletedView.vue')
  },
  {
    path: '/knowledge-base',
    name: 'Knowledge-Base',
    component: () => import('../views/homePageTileViews/KnowledgeBaseView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/homePageTileViews/SettingsView.vue')
  },
  {
    path: '/user-info',
    name: 'User-Info',
    component: () => import('../views/topToolbarViews/UserInfo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
