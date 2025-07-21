import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/nagl/driver-cards',
    name: 'DriverCards',
    component: () => import('../pages/DriverCardsPage.vue')
  },
  {
    path: '/nagl/cards',
    name: 'Cards',
    component: () => import('../pages/CardsPage.vue')
  },
  {
    path: '/nagl/facilities',
    name: 'Facilities',
    component: () => import('../pages/FacilitiesPage.vue')
  },
  {
    path: '/nagl/drivers',
    name: 'Drivers',
    component: () => import('../pages/DriversPage.vue')
  },
  {
    path: '/nagl/vehicles',
    name: 'Vehicles',
    component: () => import('../pages/VehiclesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
