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
    component: () => import('../pages/DriverCardsPage.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('../pages/CardsPage.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('../pages/FacilitiesPage.vue')
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../pages/DriversPage.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../pages/VehiclesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
