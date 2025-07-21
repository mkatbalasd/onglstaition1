import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/driver-cards',
    component: () => import('./pages/DriverCardsPage.vue')
  },
  {
    path: '/cards',
    component: () => import('./pages/CardsPage.vue')
  },
  {
    path: '/facilities',
    component: () => import('./pages/FacilitiesPage.vue')
  },
  {
    path: '/drivers',
    component: () => import('./pages/DriversPage.vue')
  },
  {
    path: '/vehicles',
    component: () => import('./pages/VehiclesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/nagl/app/'),
  routes
})

export default router
