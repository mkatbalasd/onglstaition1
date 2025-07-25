import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/drivers', component: () => import('../views/Drivers.vue') },
  { path: '/driver-cards', component: () => import('../views/DriverCards.vue') },
  { path: '/vehicles', component: () => import('../views/Vehicles.vue') },
  { path: '/facilities', component: () => import('../views/Facilities.vue') },
  { path: '/cards', component: () => import('../views/Cards.vue') },
  { path: '/settings', component: () => import('../views/Settings.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
