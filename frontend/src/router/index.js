import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/driver-cards',
    name: 'DriverCards',
    component: () => import('../views/DriverCardsPage.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('../views/CardsPage.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('../views/FacilitiesPage.vue')
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../views/DriversPage.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/VehiclesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
