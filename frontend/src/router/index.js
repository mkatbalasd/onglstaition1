import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/driver-cards',
    name: 'DriverCards',
    component: () => import('../views/DriverCards.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('../views/OperatingCards.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('../views/Facilities.vue')
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../views/Drivers.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
