import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../views/Drivers.vue')
  },
  {
    path: '/driver-cards',
    name: 'DriverCards',
    component: () => import('../views/DriverCards.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('../views/Facilities.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('../views/Cards.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
